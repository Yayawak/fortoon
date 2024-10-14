import { dbConnection } from "@/db/dbConnector";
import { uploadFileToAmazonS3 } from "@/lib/image_uploading/amazon.lib";
import { verifyToken } from "@/lib/auth";
import { formDataToJsonObject } from "@/lib/parsers";
import { postStoryScheme } from "@/schemes/story.scheme";
import { postUserScheme } from "@/schemes/user.scheme";
import { IStandardResponse } from "@/types/IApiCommunication";
import { GenericRowDataPacket } from "@/types/IRowDataPacket";
import { IUser } from "@/types/IUser";
import { mkdirSync } from "fs";
import { RowDataPacket } from "mysql2";
import { NextApiRequest } from "next";
import { NextRequest, NextResponse } from "next/server";
import { uploadImage } from "@/lib/image_uploading/image_upload.lib";


export async function GET(req: NextRequest) {
    // const [results, fs] = await dbConnection.query<GenericRowDataPacket<IUser>[]>(`select * from Story`)
    const verifiedRes = await verifyToken(req)
    if (verifiedRes.status != 200) {
        // console.log(verifiedRes)
        return NextResponse.json({
            msg: verifiedRes.msg
        }, { status: verifiedRes.status });
    }

    let [storyRs,] = await dbConnection.query<GenericRowDataPacket<any>[]>(
        `
        select * 
        from Story s
        `
    )
    // Use Promise.all with map to handle asynchronous chapter fetching
    const ret = await Promise.all(storyRs.map(async (s) => {
        const authorId = s.authorId;

        // Fetch chapters for the current story
        let [chapterRs,] = await dbConnection.query<GenericRowDataPacket<any>[]>(
            `
                SELECT * 
                FROM Chapter c
                WHERE c.storyId = ${s.sId}  
                `
        );
        // TODO : hide chapters data for no-perm user (not buy yet)

        // Return the story object along with its chapters
        return {
            ...s,
            chapters: chapterRs
        };
    }));

    // const authorId = fs.


    const stdRes: IStandardResponse = {
        data: ret
    }
    return NextResponse.json(stdRes, {
        status: 200
    })
}



export async function POST(req: Request) {

    let stdRes: IStandardResponse = {
    }

    // const storyData = postStoryScheme.safeParse(req.body)

    let parsed = null
    let formData : FormData
    try {
        formData = await req.formData()
        if (formData === undefined) {
            stdRes = {
                msg: "need formData"
            }
            console.log(stdRes)
            return NextResponse.json(stdRes, {
                status: 400
            })
        }
        // console.log(typeof formData)
        // console.log(formData)
        // console.log(formData.get("age"))
        const jsonObject = formDataToJsonObject(formData)
        console.log(jsonObject)
        parsed = postStoryScheme.parse(jsonObject)
        // const coverImageFile = formData.get("coverImage") as File

        // console.log("cover image")
        // console.log(coverImageFile)

        // let filename = coverImageFile.name
           // const file: File = parsed.profilePic as unknown as File;
        const coverImage = formData.get("coverImage") as File
        const curr = new Date()
        const filename = `storyCover-${curr.toString()}-${coverImage.name}`

        await uploadImage(coverImage, filename)

        try {
            await dbConnection.execute(`
                insert into Story (
                    authorId,
                    title,
                    introduction,
                    coverImageUrl
                )
                    values
                (
                    '${parsed.authorId}',
                    '${parsed.title}',
                    '${parsed.introduction}',
                    '${filename}'
                );
            `)
            stdRes = {
                msg: "successly created a story.",
            }
            return NextResponse.json(stdRes, {
                status: 200
            })

        } catch (error) {
            console.error(`${error}`.bgRed)
            stdRes = {
                msg: "error creating new Story",
                msg2: error
            }
            return NextResponse.json(stdRes, {
                status: 500
            })

        }

    } catch (error: any) {
        // console.error(error)
        stdRes = {
            msg2: "fail parse data",
            msg: error
        }
        return NextResponse.json(stdRes, {
            status: 500
        })
    }
    if (!parsed) {
        return
    }





}