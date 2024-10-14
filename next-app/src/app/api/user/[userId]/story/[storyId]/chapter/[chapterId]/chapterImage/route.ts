import { dbConnection } from '@/db/dbConnector';
import { verifyToken } from '@/lib/auth';
import { IStandardResponse } from '@/types/IApiCommunication';
import { RowDataPacket } from 'mysql2';
import { NextRequest, NextResponse } from 'next/server';

type TReqParams =  {
    params: {
        userId: string
        storyId: string
        chapterId: string
    }
}



// NOTE Create Whole Story by MANY CHAPTERS IMAGE
export async function POST(req: NextRequest, { params }: TReqParams ) {
    const { storyId, chapterId, userId } = params;

    const verifiedRes = await verifyToken(req)
    if (verifiedRes.status != 200) {
        // console.log(verifiedRes)
        return NextResponse.json({
            msg: verifiedRes.msg
        }, { status: verifiedRes.status });
    }
    const stdRes : IStandardResponse  = {}

    



    let formData : FormData
    try {
        formData = await req.formData()
    } catch (error) {
        stdRes.msg = `Content-Type was not one of "multipart/form-data" or "application/x-www-form-urlencoded`
        console.error(stdRes.msg)
        return NextResponse.json(stdRes, { status: 400 });
    }
    const images = formData.getAll("imageChapterFiles")
    // images = images as File[]
    // console.log(images)
    for (let index = 0; index < images.length; index++) {
        const img = images[index];
        if (!(img as File)) {
            stdRes.msg = "A element in imageChapterFiles is not File type."
            return NextResponse.json(stdRes, { status: 400 });
        }
    }
    if (images.length == 0) {
        stdRes.msg = "Required imageChapterFiles (list of image chapter)."
        return NextResponse.json(stdRes, { status: 400 });
    }

    
    // console.log(verifiedRes)
    const [rowCountExistedChapter] = await dbConnection.execute<RowDataPacket[]>(
        `SELECT 
        count(*) as ownedStoryCount
        FROM User u
        join Story s
        on u.uId = s.authorId
        join Chapter c
        on c.storyId = s.sId
        WHERE uId = ?
        and sId = ?
        and c.cId = ?
        `, 
        [
            userId,
            storyId,
            chapterId
        ]
    );
    const ownedStoryCount : Number = rowCountExistedChapter[0].ownedStoryCount
    if (ownedStoryCount == 0) {
        stdRes.msg = `Unfound story so can not create chapters.`
        return NextResponse.json(stdRes, { status: 400 });
    }


    const [rows] = await dbConnection.execute(`insert into `)


    stdRes.msg = `Welcome ${verifiedRes.data.username}`

    return NextResponse.json(stdRes, { status: 200 });

}
