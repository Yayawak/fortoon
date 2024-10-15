import { dbConnection } from "@/db/dbConnector";
import { uploadImage } from "@/lib/image_uploading/image_upload.lib";
import { verifyToken } from "@/lib/auth";
import { formDataToJsonObject } from "@/lib/parsers";
import { postStoryScheme } from "@/schemes/story.scheme";
import { IStandardResponse } from "@/types/IApiCommunication";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    let stdRes: IStandardResponse = {};

    // Verify the user token
    const verifiedRes = await verifyToken(req);
    if (verifiedRes.status != 200) {
        return NextResponse.json({ msg: verifiedRes.msg }, { status: verifiedRes.status });
    }

    let formData: FormData;
    try {
        formData = await req.formData();
        if (!formData) {
            stdRes = { msg: "formData is required" };
            return NextResponse.json(stdRes, { status: 400 });
        }

        const jsonObject = formDataToJsonObject(formData);
        const parsed = postStoryScheme.parse(jsonObject);

        // Handle image upload if there's an image file in the form data
        const imageFile = formData.get("image") as File | null;
        let imageUrl = "";
        if (imageFile) {
            const curr = new Date();
            const filename = `postImage-${curr.toString()}-${imageFile.name}`;
            
            // Get the upload result, which includes the image URL
            const uploadResult = await uploadImage(imageFile, filename);

            // Check for successful upload and get the image URL
            if (uploadResult.status === 200) {
                imageUrl = uploadResult.url; // Assuming the `uploadImage` function returns the image URL in `url`
            } else {
                return NextResponse.json({ msg: "Image upload failed", error: uploadResult.msg }, { status: 500 });
            }
        }

        // Insert the new post into the database
        await dbConnection.execute(`
            INSERT INTO Post (
                title, 
                content, 
                posterId, 
                postedDatetime, 
                imageUrl
            )
            VALUES (
                '${parsed.title}', 
                '${parsed.content}', 
                '${parsed.posterId}', 
                NOW(), 
                '${imageUrl}'
            )
        `);

        stdRes = { msg: "Post successfully created!", imageUrl: imageUrl };
        return NextResponse.json(stdRes, { status: 200 });

    } catch (error) {
        stdRes = { msg: "Error creating post", error: error.message };
        return NextResponse.json(stdRes, { status: 500 });
    }
}