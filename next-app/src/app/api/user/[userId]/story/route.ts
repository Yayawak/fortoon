import { dbConnection } from "@/db/dbConnector";
import { verifyToken } from "@/backend_lib/auth/auth.cookie";
import { IStandardResponse } from "@/types/IApiCommunication";
import { GenericRowDataPacket } from "@/types/IRowDataPacket";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
    request: NextRequest,
    { params }: { params: { userId: string } }
) {
    const stdRes: IStandardResponse = {};

    try {
        // Get user ID from params
        const userId = parseInt(params.userId);
        
        // Verify token to check if the requester is the same user
        const verifiedRes = await verifyToken(request);
        const isOwnUser = verifiedRes.status === 200 && verifiedRes.data?.uId === userId;

        // Query to get stories with their genres
        const [stories] = await dbConnection.query<GenericRowDataPacket<any>[]>(`
            SELECT 
                s.*,
                GROUP_CONCAT(DISTINCT g.genreName) as genres,
                COUNT(DISTINCT c.cId) as chapterCount,
                COUNT(DISTINCT rs.rsId) as reviewCount
            FROM Story s
            LEFT JOIN StoryGenre sg ON s.sId = sg.storyId
            LEFT JOIN Genre g ON sg.genreId = g.gId
            LEFT JOIN Chapter c ON s.sId = c.storyId
            LEFT JOIN ReviewStory rs ON s.sId = rs.storyId
            WHERE s.authorId = ?
            GROUP BY s.sId
            ORDER BY s.postedDatetime DESC
        `, [userId]);

        if (!stories || stories.length === 0) {
            stdRes.msg = "No stories found for this user.";
            return NextResponse.json(stdRes, { status: 404 });
        }

        // Process the stories to format genres as array
        const processedStories = stories.map(story => ({
            ...story,
            genres: story.genres ? story.genres.split(',') : [],
            isOwner: isOwnUser
        }));

        stdRes.msg = "Stories retrieved successfully.";
        stdRes.data = { stories: processedStories };

        return NextResponse.json(stdRes, { status: 200 });

    } catch (error: any) {
        stdRes.msg = "Error retrieving stories.";
        stdRes.msg2 = error.message;
        console.error(stdRes);
        return NextResponse.json(stdRes, { status: 500 });
    }
}

