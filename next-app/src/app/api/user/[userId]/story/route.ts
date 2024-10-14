import { dbConnection } from "@/db/dbConnector";
import { verifyToken } from "@/lib/auth";
import { uploadImage } from "@/lib/image_uploading/image_upload.lib";
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


export async function GET(req: Request) {
    // const [results, fs] = await dbConnection.query<GenericRowDataPacket<IUser>[]>(`select * from Story`)
    const [results, fs] = await dbConnection.query<GenericRowDataPacket<any>[]>(
        `select * from Story`
    )


    const stdRes: IStandardResponse = {
        data: results
    }
    return NextResponse.json(stdRes, {
        status: 200
    })
}



export async function POST(req: NextRequest) {

    const verifiedRes = await verifyToken(req)
    if (verifiedRes.status != 200) {
        // console.log(verifiedRes)
        return NextResponse.json({
            msg: verifiedRes.msg
        }, { status: verifiedRes.status });
    }


    let stdRes: IStandardResponse = {
    }

    // const storyData = postStoryScheme.safeParse(req.body)

    let parsed = null
    try {
        const formData = await req.formData()


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
        // console.log(jsonObject.introduction)
        parsed = postStoryScheme.parse(jsonObject)
        const coverImageFile = formData.get("coverImage") as File

        console.log("cover image")
        console.log(coverImageFile)

        let filename = coverImageFile.name
        
        // await uploadFileToAmazonS3(coverImageFile, filename)
        await uploadImage(coverImageFile, coverImageFile.name)

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

        } catch (error:any) {
            console.error(`${error}`.bgRed)
            stdRes = {
                msg: "error creating new Story",
            }
            const sqlState = error.sqlState
            const sqlMessage = error.sqlMessage

            // stdRes.msg2 = sqlMessage

            switch (sqlState) {
                case '23000':
                    stdRes.msg2 = "Duplicated Key title, try to change the name of story."
                    break;
            
                default:
                    stdRes.msg2 = error.sqlMessage
                    break;
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


}