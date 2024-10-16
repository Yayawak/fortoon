import { dbConnection } from '@/db/dbConnector';
import { verifyToken } from '@/backend_lib/auth/auth.cookie';
import { hasReadPermission } from '@/backend_lib/story/chapter_permission.lib';
import { IStandardResponse } from '@/types/IApiCommunication';
import { RowDataPacket } from 'mysql2';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest, { params }: { params: { storyId: string } }) {
    const { storyId } = params;

    const stdRes: IStandardResponse = {};

    // Verify the user's token
    const verifiedRes = await verifyToken(req);
    if (verifiedRes.status != 200) {
        return NextResponse.json(stdRes, {status: stdRes.status})
    }
    const userId = verifiedRes.status === 200 ? verifiedRes.data.uId : null; // Get userId only if verified

    // Step 1: Fetch the story details
    const [rs] = await dbConnection.query<RowDataPacket[]>(`
        SELECT 
            s.*,
            u.displayName AS authorDisplayName
        FROM 
            User u 
        JOIN
            Story s ON u.uId = s.authorId
        WHERE 
            s.sId = ?
    `, [storyId]);

    if (rs.length === 0) {
        stdRes.msg = "Story not found";
        return NextResponse.json(stdRes, { status: 404 });
    }

    // Step 2: Fetch chapters for the current story
    let [chapterRs] = await dbConnection.query<RowDataPacket[]>(`
        SELECT * 
        FROM Chapter c
        WHERE c.storyId = ?  
    `, [storyId]);

    // Step 3: Fetch genres for the current story
    let [genreRs] = await dbConnection.query<RowDataPacket[]>(`
        SELECT g.gId, g.genreName 
        FROM Genre g
        JOIN StoryGenre sg ON g.gId = sg.genreId
        WHERE sg.storyId = ?
    `, [storyId]);

    // Step 4: Process chapters with images based on user permissions
    const chaptersWithImages = await Promise.all(chapterRs.map(async (chap) => {
        const chapterId = chap.cId;

        // Initialize images as an empty array
        let images: any[] = [];

        // If the user is authenticated, check if they have read permission
        if (userId) {
            const isReadable = await hasReadPermission(userId, chapterId);
            if (isReadable) {
                // Fetch images only if the user is authenticated and has permission
                let [imageRs] = await dbConnection.query<RowDataPacket[]>(`
                    SELECT imageSequenceNumber, url
                    FROM ChapterImage ci
                    WHERE ci.chapterId = ?  
                `, [chapterId]);
                images = imageRs; // Set images if user has permission
            }
        }

        // Return the chapter data with images (or an empty array if no access)
        return {
            ...chap,
            images // Will be an empty array if user doesn't have access
        };
    }));

    // Step 5: Combine story, chapters, and genres into the response
    const data = {
        ...rs[0],
        chapters: chaptersWithImages, // Include chapters with or without images
        genres: genreRs // Include genres associated with the story
    };

    return NextResponse.json(data, { status: 200 });
}