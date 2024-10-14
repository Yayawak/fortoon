import { dbConnection } from "@/db/dbConnector";
import { uploadImage } from "@/lib/image_uploading/image_upload.lib";
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


export async function POST(req: Request) {
    let stdRes: IStandardResponse = {};
    let parsed = null;

    // Try to parse the formData and JSON object
    try {
        const formData = await req.formData();

        if (!formData) {
            stdRes = { msg: "need formData" };
            return NextResponse.json(stdRes, { status: 400 });
        }

        // Convert formData to a JSON object
        const jsonObject = formDataToJsonObject(formData);

        // Validate and parse the data using Zod schema
        parsed = postUserScheme.parse(jsonObject);
        // parsed.profilePic = profilePic; // Use the correct Blob instance
    } catch (error: any) {
        stdRes = {
            msg2: "fail parse data",
            msg: error.message || error,  // Log error message
        };
        return NextResponse.json(stdRes, { status: 500 });
    }

    // If parsing failed, don't proceed
    if (!parsed) {
        return;
    }

    let filename = null
    if (parsed.profilePic) {
        // const file: File = parsed.profilePic as unknown as File;
        const curr = new Date()
        filename = `user-${curr.toString()}-${parsed.profilePic.name}`
        // uploadImage(, filename)
        uploadImage(parsed.profilePic, filename)
    }



    try {
        await dbConnection.execute(`
            INSERT INTO User (
                username,
                password,
                displayName,
                sex,
                email,
                age,
                profilePicUrl
            )
            VALUES (
                '${parsed.username}',
                '${parsed.password}',
                '${parsed.displayName}',
                '${parsed.sex}',
                '${parsed.email}',
                '${parsed.age}',
                ${filename ? `'${filename}'` : null}
            );
        `);
    
        stdRes = {
            msg: "successfully created a user.",
        };
        return NextResponse.json(stdRes, { status: 200 });
    
    } catch (error: any) {
        if (error.code === 'ER_DUP_ENTRY') {
            // Handle duplicate entry error (code 1062 or 'ER_DUP_ENTRY')
            stdRes = {
                msg: "Duplicate entry error: A user with this field already exists.",
                msg2: error.message,  // Detailed error message
            };
            return NextResponse.json(stdRes, { status: 409 });  // HTTP 409 Conflict
        }

        console.log(error)
    
        // Handle other SQL errors
        stdRes = {
            msg: "Error creating new User",
            // msg2: error.message || error,  // Log SQL error message
        };
        return NextResponse.json(stdRes, { status: 500 });
    }
}