import { dbConnection } from '@/db/dbConnector';
import { verifyToken } from '@/backend_lib/auth/auth.cookie';
import { hasReadPermission } from '@/backend_lib/story/chapter_permission.lib';
import { IStandardResponse } from '@/types/IApiCommunication';
import { RowDataPacket } from 'mysql2';
import { NextRequest, NextResponse } from 'next/server';
import { ErrorMessage, GetErrorMesage } from '@/constant/error_message';
import { updateStorySchema } from '@/schemes/story.scheme';
import { updateStoryDetails} from './story.id.helper';
import { uploadImage } from '@/backend_lib/image_uploading/image_upload.lib';
import { setStandardImageName } from '@/backend_lib/image_uploading/image_namer.lib';

export async function GET(req: NextRequest, { params }: { params: { storyId: string } }) {
    const { storyId } = params;

    const stdRes: IStandardResponse = {};

    // Verify the user's token
    const verifiedRes = await verifyToken(req);
    // console.log("ts")
    // console.log(verifiedRes)

    const isAnonymous : boolean= verifiedRes.status !== 200;
    const msg = isAnonymous ? "This Get story is for anonymous users" : "This Get story is for authenticated users"
    console.log(msg.bgYellow)

    if (verifiedRes.status !== 200) {
        // console.log("can no login")
        // stdRes.status = verifiedRes.status

        // return NextResponse.json(verifiedRes, {status: stdRes.status})
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

    // console.log(rs)

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

        // Allow anonymous users to access free chapters (price = 0)
        if (isAnonymous && chap.price === 0) {
            let [imageRs] = await dbConnection.query<RowDataPacket[]>(`
                SELECT imageSequenceNumber, url
                FROM ChapterImage ci
                WHERE ci.chapterId = ?  
            `, [chapterId]);
            images = imageRs;
        }
        // If the user is authenticated, check if they have read permission
        else if (userId) {
            const isReadable = await hasReadPermission(userId, chapterId);
            if (isReadable) {
                let [imageRs] = await dbConnection.query<RowDataPacket[]>(`
                    SELECT imageSequenceNumber, url
                    FROM ChapterImage ci
                    WHERE ci.chapterId = ?  
                `, [chapterId]);
                images = imageRs;
            }
        }

        return {
            ...chap,
            images
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




export async function PUT(req: NextRequest, { params }: { params: { storyId: string } }) {
    const { storyId } = params;
    const storyIdNumber = Number(storyId);
    
    const stdRes: IStandardResponse = {};

    // Verify the user's token
    const verifiedRes = await verifyToken(req);
    if (verifiedRes.status !== 200) {
        return NextResponse.json(verifiedRes, { status: verifiedRes.status });
    }

    const userId = verifiedRes.data.uId; // Get the authenticated user's ID

    try {
        // Parse formData from the request
        let formData;
        try {
            formData = await req.formData();
        } catch (error: any) {
            stdRes.msg = GetErrorMesage(ErrorMessage.EXPECTED_CONTENT_TYPE_IS_FORM_DATA);
            return NextResponse.json(stdRes, { status: 400 });
        }

        const title = formData.get('title') as string | null;
        const introduction = formData.get('introduction') as string | null;
        const coverImage = formData.get('coverImage') as File | null; // Expecting a File for coverImage

        // Validate the input using Zod, checking if coverImage is a file
        updateStorySchema.parse({
            title,
            introduction,
            coverImage, // Zod should validate this as a file (optional)
        });

        // Step 1: Check if the story exists and fetch the owner
        const [storyCheckRes] = await dbConnection.execute<RowDataPacket[]>(`
            SELECT * FROM Story WHERE sId = ?
        `, [storyIdNumber]);

        if (storyCheckRes.length === 0) {
            stdRes.msg = "Story not found.";
            return NextResponse.json(stdRes, { status: 404 });
        }

        // Step 2: Check if the user is the owner of the story
        const [ownershipCheckRes] = await dbConnection.execute<RowDataPacket[]>(`
            SELECT * FROM Story WHERE sId = ? AND authorId = ?
        `, [storyIdNumber, userId]);

        if (ownershipCheckRes.length === 0) {
            stdRes.msg = "You don't have permission to update this story.";
            return NextResponse.json(stdRes, { status: 403 });
        }

        // Step 3: Handle coverImage upload
        let filename = ""
        if (coverImage) {
            filename = setStandardImageName(coverImage.name, "storyCover")
            await uploadImage(coverImage, filename); // Upload image and get URL
        }

        // Step 4: Update story details (title, introduction, coverImageUrl)
        await updateStoryDetails(storyIdNumber, title, introduction, filename);

        // Step 5: Return success response
        stdRes.msg = "Story updated successfully";
        return NextResponse.json(stdRes, { status: 200 });

    } catch (error: any) {
        stdRes.msg = "Error updating story.";
        stdRes.msg2 = error.message;
        console.log(stdRes);
        return NextResponse.json(stdRes, { status: 500 });
    }
}