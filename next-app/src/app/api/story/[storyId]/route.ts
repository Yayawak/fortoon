import { dbConnection } from '@/db/dbConnector';
import { IStandardResponse } from '@/types/IApiCommunication';
import { RowDataPacket } from 'mysql2';
import { MissingSlotContext } from 'next/dist/shared/lib/app-router-context.shared-runtime';
import { NextResponse } from 'next/server';

export async function GET(req: Request, { params }: { params: { storyId: string } }) {
    const { storyId } = params;

    const stdRes : IStandardResponse = {
    }

    const [rs, fs] = await dbConnection.query<RowDataPacket[]>(`
        select 
            s.*,
            u.displayName as authorDisplayName
        from 
        User u 
        join
        Story s
        on u.uId = s.authorId
        where s.sId = ${storyId}
    `)
    if (rs.length == 0) {
        stdRes.msg = "Story not found"

        return NextResponse.json(stdRes, {
            status: 404
        })
    }


    // Fetch chapters for the current story
    let [chapterRs,] = await dbConnection.query<RowDataPacket[]>(
        `
            SELECT * 
            FROM Chapter c
            WHERE c.storyId = ${storyId}  
            `
    );

    const chaptersWithImages = await Promise.all(chapterRs.map(async (chap) => {
        const chapterId = chap.cId
        let [images, ] = await dbConnection.query<RowDataPacket[]>(
            `
                SELECT imageSequenceNumber, url
                FROM ChapterImage ci
                WHERE ci.chapterId = ${chapterId}  
                `
        );
        return {
            ...chap,
            images
        }
    }))

    console.log(rs)
    // Simulate fetching author data

    const data = {
        ...rs[0],
        chapters: chaptersWithImages
    }
    // stdRes.data = 


    const authorData = {
        storyId,
        name: "Author Name",
        message: 'Author data fetched successfully'
    };

    return NextResponse.json(data, {
        status: 200,
    });
}
