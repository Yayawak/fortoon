import { verifyToken } from '@/backend_lib/auth/auth.cookie';
import { uploadImage } from '@/backend_lib/image_uploading/image_upload.lib';
import { ErrorMessage, GetErrorMesage } from '@/constant/error_message';
import { dbConnection } from '@/db/dbConnector';
import { createPostSchema } from '@/schemes/post.scheme';
import { IStandardResponse } from '@/types/IApiCommunication';
import { NextRequest, NextResponse } from 'next/server';
import { addImagesToPost, deleteAllImagesForPost } from '../post.helper';
import { ResultSetHeader, RowDataPacket } from 'mysql2';

export async function PUT(req: NextRequest, { params }: { params: { postId: string } }) {
    const { postId } = params;
    const postIdNumber = Number(postId)

    const stdRes: IStandardResponse  = {}

    // Verify the user's token
    const verifiedRes = await verifyToken(req);
    if (verifiedRes.status !== 200) {
        return NextResponse.json(verifiedRes, { status: verifiedRes.status });
    }

    const userId = verifiedRes.data.uId; // Get the authenticated user's ID

    try {
        // Parse formData from the request
        let formData;
        try {
            formData = await req.formData();
        } catch (error: any) {
            stdRes.msg = GetErrorMesage(ErrorMessage.EXPECTED_CONTENT_TYPE_IS_FORM_DATA);
            console.error(`${error}`.red);
            return NextResponse.json(stdRes, { status: 400 });
        }

        const title = formData.get('title') as string;
        const content = formData.get('content') as string;
        const files = formData.getAll('images') as File[];

        // Validate incoming data using Zod
        createPostSchema.parse({
            title,
            content,
            images: files,
        });

        // Step 1: Check if the post exists
        const [postCheckRes] = await dbConnection.execute<RowDataPacket[]>(`
            SELECT * FROM Post WHERE pId = ?
        `, [postIdNumber]);

        // console.log(postCheckRes)

        if (postCheckRes.length === 0) {
            stdRes.msg = "Post not found.";
            return NextResponse.json(stdRes, { status: 404 });
        }

        // Step 2: Check if the user is the owner of the post
        const [ownershipCheckRes] = await dbConnection.execute<RowDataPacket[]>(`
            SELECT * FROM Post WHERE pId = ? AND posterId = ?
        `, [postIdNumber, userId]);

        if (ownershipCheckRes.length === 0) {
            stdRes.msg = "You don't have permission to update this post.";
            return NextResponse.json(stdRes, { status: 403 });
        }

        // Step 3: Update the post content in the database
        const [updateRes] = await dbConnection.execute<ResultSetHeader>(`
            UPDATE Post SET title = ?, content = ? WHERE pId = ? AND posterId = ?
        `, [title, content, postIdNumber, userId]);

        // Step 4: Delete all old images for this post
        await deleteAllImagesForPost(postIdNumber);


        // Step 5: Upload new images to Cloudinary and save URLs
        const uploadedImageUrls = await Promise.all(files.map(async (file) => {
            const filename = `post-image-${new Date().toISOString()}-${file.name}`;
            await uploadImage(file, filename);
            return filename;
        }));

        // Step 6: Insert the uploaded image URLs into the PostImage table
        if (uploadedImageUrls.length > 0) {
            await addImagesToPost(postIdNumber, uploadedImageUrls);
        } else {
            console.info("No new images to upload in a Post.".bgCyan);
        }

        // Step 7: Return success response indicating the post was updated
        stdRes.msg = "Post updated successfully";
        return NextResponse.json(stdRes, { status: 200 });

    } catch (error: any) {
        stdRes.msg = "Error updating post.";
        stdRes.msg2 = error;
        console.log(stdRes);
        return NextResponse.json(stdRes, { status: 500 });
    }
}