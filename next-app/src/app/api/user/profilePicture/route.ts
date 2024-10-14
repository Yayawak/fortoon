import { dbConnection } from "@/db/dbConnector";
import { verifyToken } from "@/lib/auth";
import { uploadImage } from "@/lib/image_uploading/image_upload.lib";
import { formDataToJsonObject } from "@/lib/parsers";
import { putUserProfilePic } from "@/schemes/user.profilePic.scheme";
import { IStandardResponse } from "@/types/IApiCommunication";
import { NextRequest, NextResponse } from "next/server";

// curl -X PUT localhost:3733/api/user/profilePicture -d "{}"
// only accept data as form-data

export async function PUT(req: NextRequest) {
    const verifiedRes = await verifyToken(req)
    if (verifiedRes.status != 200) {
        // console.log(verifiedRes)
        return NextResponse.json({
            msg: verifiedRes.msg
        }, { status: verifiedRes.status });
    }
    const userIdFromCookie = verifiedRes.data.uId

    let stdRes: IStandardResponse = {};
    let parsed = null;

    try {
        const formData = await req.formData();

        if (!formData) {
            stdRes = { msg: "need formData" };
            return NextResponse.json(stdRes, { status: 400 });
        }

        // Convert formData to a JSON object
        const jsonObject = formDataToJsonObject(formData);

        // Validate and parse the data using Zod schema
        parsed = putUserProfilePic.parse(jsonObject);

    } catch (error: any) {
        stdRes = {
            msg: "fail parse data",
            msg2: error.message || error,
        };
        return NextResponse.json(stdRes, { status: 500 });
    }

    // If parsing failed, don't proceed
    if (!parsed) {
        return NextResponse.json({ msg: "Invalid data provided." }, { status: 400 });
    }

    const curr = new Date();
    const filename = `user-${curr.toISOString()}-${parsed.profilePic?.name}`;

    if (!parsed.profilePic) {
        return NextResponse.json({ msg: "Requred profilePic To Edit." }, { status: 400 });
    }


    // Upload the image
    const uploadResponse = await uploadImage(parsed.profilePic, filename);
    if (uploadResponse.status !== 200) {
        return NextResponse.json(uploadResponse, { status: uploadResponse.status });
    }

    // const profilePicUrl = uploadResponse.data.secure_url; // Get the URL from the upload response

    try {
        await dbConnection.execute(`
            UPDATE User SET profilePicUrl = '${filename}' WHERE uId = ${userIdFromCookie}
        `);

        stdRes = { msg: "successfully edited profile picture." };
        return NextResponse.json(stdRes, { status: 200 });

    } catch (error) {
        console.error(error);
        stdRes = { msg: "unhandled SQL error", msg2: error };
        return NextResponse.json(stdRes, { status: 500 });
    }
}



export async function DELETE(req: Request) {

    let stdRes: IStandardResponse = {}
    try {
        const res = await req.json()

        const uId: string = res.uId

        if (!uId) {
            stdRes = {
                msg: "need 'uId'"
            }
            return NextResponse.json(stdRes, {
                status: 400
            })
        }


        try {
            dbConnection.execute(`update User set profilePicUrl = null where uId = ${uId}`)

            stdRes = {
                msg: "success deleted profile picture."
            }
            return NextResponse.json(stdRes, {
                status: 200
            })

        } catch (error) {
            console.error(error)

            stdRes = {
                msg: "unhandled sql error",
                msg2: error
            }
            return NextResponse.json(stdRes, {
                status: 500
            })

        }

    } catch (error) {
        stdRes = {
            msg: "error parsing json (need body) or something",
            msg2: error
        }
        return NextResponse.json(stdRes, {
            status: 500
        })

    }

}