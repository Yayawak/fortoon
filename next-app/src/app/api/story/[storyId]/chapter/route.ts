import { dbConnection } from '@/db/dbConnector';
import { verifyToken } from '@/lib/auth';
import { IStandardResponse } from '@/types/IApiCommunication';
import { ResultSetHeader, RowDataPacket } from 'mysql2';
import { MissingSlotContext } from 'next/dist/shared/lib/app-router-context.shared-runtime';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: Request) {

    return NextResponse.json({
        test: "ABC"
    }, {
        status: 200,
    });
}


type TReqParams =  {
    params: {
        storyId: string
    }
}


// NOTE Create Whole Story by MANY CHAPTERS IMAGE
export async function POST(req: NextRequest, { params }: TReqParams ) {
    const { storyId } = params;

    const verifiedRes = await verifyToken(req)
    if (verifiedRes.status != 200) {
        // console.log(verifiedRes)
        return NextResponse.json({
            msg: verifiedRes.msg
        }, { status: verifiedRes.status });
    }
    const stdRes : IStandardResponse  = {}

    const userIdFromCookie = verifiedRes.data.uId
    



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
    const [rowCountExistedStory] = await dbConnection.query<RowDataPacket[]>(
        `SELECT count(*) as storyCount
        from Story
        where sId = ${storyId}
        `,
    );
    const storyCount : Number = rowCountExistedStory[0].storyCount
    // console.log()
    if (storyCount == 0) {
        stdRes.msg = `Unfound story so can not create chapters.`
        return NextResponse.json(stdRes, { status: 400 });
    }


    const [rowCheckPermissionToWriteStory] = await dbConnection.query<RowDataPacket[]>(
        `SELECT count(*) as ownedStoryCount
        from Story
        where authorId = ${userIdFromCookie}
        and sId = ${storyId}
        `,
    );
    const ownedStoryCount : Number = rowCheckPermissionToWriteStory[0].ownedStoryCount
    console.log(rowCheckPermissionToWriteStory)
    if (ownedStoryCount == 0) {
        stdRes.msg = `You are not Author of this Story, No Allowd Create Chapters`
        return NextResponse.json(stdRes, { status: 400 });
    }

    const chapterName = formData.get("chapterName")

    if (!chapterName) {
        stdRes.msg = "Require chapterName."
        return NextResponse.json(stdRes, { status: 400 });
    }


    const [rs] = await dbConnection.query<ResultSetHeader>(`
            INSERT INTO Chapter (
                name,
                storyId,
                chapterSequence,
                price
            )
            SELECT 
                "${chapterName}",
                "${storyId}",
                COALESCE(MAX(c.chapterSequence), 0) + 1,
                ${0}
            FROM Chapter c
            WHERE c.storyId = ${storyId}
        ` 
    )
    // rs.affectedRows > 0


    // stdRes.msg = `Welcome ${verifiedRes.data.username}, you will be create new chapter`
    stdRes.msg = `Create Chapter ${chapterName} in Story ${storyId}, number of chapterImages is ${images.length}`

    return NextResponse.json(stdRes, { status: 200 });

}