import { dbConnection } from "@/db/dbConnector";
import { verifyToken } from "@/backend_lib/auth/auth.cookie";
import { uploadImage } from "@/backend_lib/image_uploading/image_upload.lib";
import { formDataToJsonObject } from "@/backend_lib/parsers";
import { postStoryScheme } from "@/schemes/story.scheme";
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

