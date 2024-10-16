import { verifyToken } from '@/backend_lib/auth/auth.cookie';
import { uploadImage } from '@/backend_lib/image_uploading/image_upload.lib';
import { ErrorMessage, GetErrorMesage } from '@/constant/error_message';
import { createPostSchema } from '@/schemes/post.scheme';
import { IStandardResponse } from '@/types/IApiCommunication';
import { NextRequest, NextResponse } from 'next/server';
import { addImagesToPost, createPost, deleteAllImagesForPost, } from './post.helper';


export async function POST(req: NextRequest) {
    const stdRes: IStandardResponse = {};

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

        const files = formData.getAll('images') as File[];
        const title = formData.get('title') as string;
        const content = formData.get('content') as string;
        const parentPostId = formData.get('parentPostId') ? parseInt(formData.get('parentPostId') as string) : null;

        // Validate incoming data using Zod
        createPostSchema.parse({
            title,
            content,
            parentPostId,
            images: files,
        });

        // Step 1: Create the post
        let postId: number;
        try {
            postId = await createPost(title, content, parentPostId, userId);
        } catch (error: any) {
            stdRes.msg = "Error creating post.";
            stdRes.msg2 = error.message;
            return NextResponse.json(stdRes, { status: 500 });
        }

        // Step 2: Upload images to Cloudinary and save URLs
        const uploadedImageUrls = await Promise.all(files.map(async (file) => {
            const filename = `post-image-${new Date().toISOString()}-${file.name}`;
            await uploadImage(file, filename);
            return filename;
        }));

        // Step 3: Insert the uploaded image URLs into the PostImage table
        if (uploadedImageUrls.length > 0) {
            await addImagesToPost(postId, uploadedImageUrls);
        } else {
            console.info("No images to upload in a Post.".bgCyan);
        }

        // Step 4: Return success response with the created post ID
        stdRes.msg = "Post created successfully";
        stdRes.data = { postId };

        return NextResponse.json(stdRes, { status: 201 });

    } catch (error: any) {
        stdRes.msg = "Error creating post.";
        stdRes.msg2 = error;
        console.log(stdRes);
        return NextResponse.json(stdRes, { status: 500 });
    }
}



