import { dbConnection } from "@/db/dbConnector";
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
    const [results, fs] = await dbConnection.query<GenericRowDataPacket<IUser>[]>(`select * from Story`)


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
    } catch (error:any) {
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



    try {
        await dbConnection.execute(`
        insert into User (
        )
            values
        (
            '${parsed.authorId}',
        );
    `)
        stdRes = {
            msg: "successly created a user.",
        }
        return NextResponse.json(stdRes, {
            status: 200
        })

    } catch (error) {
        console.error(`${error}`.bgRed)
        stdRes = {
            msg: "error creating new User",
            msg2: error
        }
        return NextResponse.json(stdRes, {
            status: 500
        })

    }



}