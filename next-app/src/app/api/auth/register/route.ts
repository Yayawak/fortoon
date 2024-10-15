import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { RowDataPacket } from "mysql2";
import { dbConnection } from "@/db/dbConnector";
import { IStandardResponse } from "@/types/IApiCommunication";
import { formDataToJsonObject } from "@/lib/parsers";
import { uploadImage } from "@/lib/image_uploading/image_upload.lib";
import { uploadFileToAmazonS3 } from "@/lib/image_uploading/amazon.lib";
import { CreateUserScheme } from "@/schemes/user.scheme";


export async function POST(req: NextRequest) {
    let stdRes: IStandardResponse = {};
    let parsed = null;

    // Try to parse the formData and JSON object
    let formData: FormData
    try {
        formData = await req.formData();

        if (!formData) {
            stdRes = { msg: "need formData" };
            return NextResponse.json(stdRes, { status: 400 });
        }

        // Convert formData to a JSON object
        const jsonObject = formDataToJsonObject(formData);

        // Validate and parse the data using Zod schema
        parsed = CreateUserScheme.parse(jsonObject);
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

    const profilePic = formData.get("profilePic") as File
    const curr = new Date()
    filename = `user-${curr.toString()}-${profilePic.name}`
    await uploadImage(profilePic, filename)



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