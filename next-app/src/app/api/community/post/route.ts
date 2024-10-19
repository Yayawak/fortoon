import { verifyToken } from '@/backend_lib/auth/auth.cookie';
import { uploadImage } from '@/backend_lib/image_uploading/image_upload.lib';
import { ErrorMessage, GetErrorMesage } from '@/constant/error_message';
import { createPostSchema } from '@/schemes/post.scheme';
import { IStandardResponse } from '@/types/IApiCommunication';
import { NextRequest, NextResponse } from 'next/server';
import { addImagesToPost, createPost, deleteAllImagesForPost, getParentPostById, structurePosts, } from './post.helper';
import { getAllPosts } from './post.helper';
import { ConstructionIcon } from 'lucide-react';


export async function GET() {
    const stdRes: IStandardResponse = {};

    try {
        // Step 1: Retrieve all posts from the database
        const posts = await getAllPosts();

        if (!posts || posts.length === 0) {
            stdRes.msg = "No posts found.";
            return NextResponse.json(stdRes, { status: 404 });
        }

        // Step 2: Structure posts into a tree format using the helper function
        const structuredPosts = structurePosts(posts);

        // Step 3: Return the structured posts in the response
        stdRes.msg = "Posts retrieved successfully.";
        stdRes.data = { posts: structuredPosts };

        return NextResponse.json(stdRes, { status: 200 });
    } catch (error: any) {
        stdRes.msg = "Error retrieving posts.";
        stdRes.msg2 = error.message;
        console.error(stdRes);
        return NextResponse.json(stdRes, { status: 500 });
    }
}



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
            console.error(`${error}`);
            return NextResponse.json(stdRes, { status: 400 });
        }

        const files = formData.getAll('images') as File[];
        const title = formData.get('title') as string;
        const content = formData.get('content') as string;
        const parentPostId = formData.get('parentPostId') ? parseInt(formData.get('parentPostId') as string) : null;
        const postType = formData.get('postType') as string;
        const refId = formData.get('refId') ? parseInt(formData.get('refId') as string) : null;

        // Validate postType and refId
        if (postType === 'story' || postType === 'chapter') {
            if (!refId) {
                stdRes.msg = `refId is required when postType is '${postType}'.`;
                return NextResponse.json(stdRes, { status: 400 });
            }
        } else if (postType !== 'community') {
            stdRes.msg = "Invalid postType. Allowed values are 'story', 'chapter', or 'community'.";
            return NextResponse.json(stdRes, { status: 400 });
        }

        // Validate incoming data using Zod
        createPostSchema.parse({
            title,
            content,
            parentPostId,
            images: files,
            postType,
            refId,
        });

        // Verify that the parent post exists if a parentPostId is provided
        if (parentPostId !== null) {
            const parentPostExists = await getParentPostById(parentPostId);
            if (!parentPostExists) {
                stdRes.msg = "Parent post not found.";
                return NextResponse.json(stdRes, { status: 400 });
            }
        }

        // Step 1: Create the post
        let postId: number;
        try {
            postId = await createPost(title, content, parentPostId, userId, postType, refId);
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
            console.info("No images to upload in a Post.");
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