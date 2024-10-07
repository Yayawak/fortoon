import { dbConnection } from "@/db/dbConnector";
import { formDataToJsonObject } from "@/lib/parsers";
import { postUserScheme } from "@/schemes/user.scheme";
import { IStandardResponse } from "@/types/IApiCommunication";
import { GenericRowDataPacket } from "@/types/IRowDataPacket";
import { IUser } from "@/types/IUser";
import { mkdirSync } from "fs";
import { RowDataPacket } from "mysql2";
import { NextApiRequest } from "next";
import { NextRequest, NextResponse } from "next/server";


export async function GET(req: Request) {
    const [results, fs] = await dbConnection.query<GenericRowDataPacket<IUser>[]>(`select * from User`)


    const stdRes: IStandardResponse = {
        data: results
    }
    return NextResponse.json(stdRes, {
        status: 200
    })
}



// const ReqPostUser : IUser = {
//     uId: 0,
//     username: 'username',
// }

// export async function POST(req: Request) {
export async function POST(req: Request) {

    let stdRes: IStandardResponse = {
    }

    let parsed = null
    try {
        // parsed = postUserScheme.safeParse(req.body)
        // const body = await req.json()
        // console.log(req.body)
        const formData = await req.formData()
        if (formData === undefined) {
            stdRes = {
                msg: "need formData"
            }
            console.log(stdRes)
            return NextResponse.json(stdRes, {
                status: 400
            })
        } else {
            // console.log("A")
            // return
        }
        // console.log(typeof formData)
        // console.log(formData)
        // console.log(formData.get("age"))
        const jsonObject = formDataToJsonObject(formData)
        // console.log(formData)
        parsed = postUserScheme.parse(jsonObject)
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
            username,
            password,
            displayName,
            sex,
            email
        )
            values
        (
            '${parsed.username}',
            '${parsed.password}',
            '${parsed.displayName}',
            '${parsed.sex}',
            '${parsed.email}'
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