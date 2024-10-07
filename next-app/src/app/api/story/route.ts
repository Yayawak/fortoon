import { dbConnection } from "@/db/dbConnector";
import { uploadFileToAmazonS3 } from "@/lib/amazon.lib";
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



export async function POST(req: Request) {

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
        parsed = postStoryScheme.parse(jsonObject)
        const coverImageFile = formData.get("coverImage") as File

        console.log("cover image")
        console.log(coverImageFile)

        let filename = coverImageFile.name
        
        await uploadFileToAmazonS3(coverImageFile, filename)

        try {
            await dbConnection.execute(`
                insert into Story (
                    authorId,
                    title,
                    introduction,
                    price,
                    coverImageUrl
                )
                    values
                (
                    '${parsed.authorId}',
                    '${parsed.title}',
                    '${parsed.introduction}',
                    ${parsed.price},
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