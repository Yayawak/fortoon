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
import { verifyToken } from "@/lib/auth";
import { z } from 'zod';
import { userSettingsSchema } from "@/schemes/user.scheme";


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

    const profilePic = formData.get("profilePic") as File
    const curr = new Date()
    filename = `user-${curr.toString()}-${profilePic.name}`
    uploadImage(profilePic, filename)



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



export async function PUT(req: NextRequest) {
    let stdRes: IStandardResponse = {};

    // Verify the user token
    const verifiedRes = await verifyToken(req);
    if (verifiedRes.status !== 200) {
        return NextResponse.json({ msg: verifiedRes.msg }, { status: verifiedRes.status });
    }

    try {
        const formData = await req.formData();
        if (!formData) {
            return NextResponse.json({ msg: "formData is required" }, { status: 400 });
        }

        // Convert formData to JSON object
        const jsonObject = Object.fromEntries(formData.entries());

        // Validate non-image data, only for fields that are provided
        const parsedData = userSettingsSchema.parse(jsonObject);

        // Image upload handling for profilePic and background
        const profilePicFile = formData.get("profilePic") as File | null;
        const backgroundFile = formData.get("background") as File | null;

        let profilePicName = "";
        let backgroundName = "";

        if (profilePicFile) {
            profilePicName = `profilePic-${parsedData.username || verifiedRes.data.username}-${profilePicFile.name}`;
            const uploadResult = await uploadImage(profilePicFile, profilePicName);
            if (uploadResult.status !== 200) {
                return NextResponse.json(uploadResult, { status: uploadResult.status });
            }
        }

        if (backgroundFile) {
            backgroundName = `background-${parsedData.username || verifiedRes.data.username}-${backgroundFile.name}`;
            const uploadResult = await uploadImage(backgroundFile, backgroundName);
            if (uploadResult.status !== 200) {
                return NextResponse.json(uploadResult, { status: uploadResult.status });
            }
        }

        // Build the dynamic update query based on the provided fields
        let updateFields = [];
        if (parsedData.displayName) {
            updateFields.push(`displayName = '${parsedData.displayName}'`);
        }
        if (parsedData.username) {
            updateFields.push(`username = '${parsedData.username}'`);
        }
        if (profilePicName) {
            updateFields.push(`profilePicUrl = '${profilePicName}'`);
        }
        if (backgroundName) {
            updateFields.push(`bgUrl = '${backgroundName}'`);
        }

        // If there are any fields to update, perform the update query
        if (updateFields.length > 0) {
            await dbConnection.execute(`
                UPDATE User
                SET ${updateFields.join(", ")}
                WHERE uId = ${verifiedRes.data.uId}
            `);
        }

        stdRes = { msg: "User settings updated successfully", status: 200 };
        return NextResponse.json(stdRes, { status: 200 });

    } catch (error: any) {
        if (error instanceof z.ZodError) {
            return NextResponse.json({ msg: "Validation failed", errors: error.errors }, { status: 400 });
        }
        return NextResponse.json({ msg: "Error updating user settings", error: error.message }, { status: 500 });
    }
}