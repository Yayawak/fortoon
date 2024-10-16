import { verifyToken } from '@/backend_lib/auth/auth.cookie';
import { uploadImage } from '@/backend_lib/image_uploading/image_upload.lib';
import { dbConnection } from '@/db/dbConnector';
import { createPostSchema } from '@/schemes/post.scheme';
import { IStandardResponse } from '@/types/IApiCommunication';
import { ResultSetHeader, RowDataPacket } from 'mysql2';
import { NextRequest, NextResponse } from 'next/server';


// Helper function to create a new post
async function createPost(title: string, content: string, parentPostId: number | null, posterId: number) {
    const [insertRes] = await dbConnection.execute<ResultSetHeader>(`
        INSERT INTO Post (title, content, parentPostId, posterId) VALUES (?, ?, ?, ?)
    `, [title, content, parentPostId, posterId]);

    return insertRes.insertId; // Return the ID of the newly created post
}

// Helper function to add images to a post
async function addImagesToPost(postId: number, imageUrls: string[]) {
    const imageInserts = imageUrls.map(async (url) => {
        await dbConnection.execute(`
            INSERT INTO PostImage (url, postId) VALUES (?, ?)
        `, [url, postId]);
    });
    await Promise.all(imageInserts); // Ensure all image inserts are completed
}

export async function POST(req: NextRequest) {
    const stdRes: IStandardResponse = {};

    try {
        // Parse formData from the request
        const formData = await req.formData();
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

        // Verify the user's token
        const verifiedRes = await verifyToken(req);
        if (verifiedRes.status !== 200) {
            throw new Error("Unauthorized"); // If token is not valid, throw error
        }
        const userId = verifiedRes.data.uId; // Get the authenticated user's ID

        // Step 1: Create the post
        const postId = await createPost(title, content, parentPostId, userId);

        // Step 2: Upload images to Cloudinary (or another image service) and save URLs
        const uploadedImageUrls = await Promise.all(files.map(async (file) => {

            const filename = `post-image-${new Date()}-${file.name}`
            await uploadImage(file, filename)
            return filename
            // return await uploadImageToCloudinary(file); // Assume this function uploads and returns the image URL
        }));

        // Step 3: Insert the uploaded image URLs into the PostImage table
        if (uploadedImageUrls.length > 0) {
            await addImagesToPost(postId, uploadedImageUrls);
        }

        // Step 4: Return success response with the created post ID
        stdRes.msg = "Post created successfully";
        stdRes.data = { postId };

        return NextResponse.json(stdRes, { status: 201 });

    } catch (error:any) {
        // Handle errors and return appropriate response
        // stdRes.msg = error instanceof z.ZodError ? "Invalid data" : error.message;
        stdRes.msg = "Erorr Createing Post."
        stdRes.msg2 = error
        return NextResponse.json(stdRes, { status: 400 });
    }
}