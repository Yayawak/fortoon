import { dbConnection } from '@/db/dbConnector';
import { verifyToken } from '@/backend_lib/auth/auth.cookie';
import { uploadImage } from '@/backend_lib/image_uploading/image_upload.lib';
import { IStandardResponse } from '@/types/IApiCommunication';
import { ResultSetHeader, RowDataPacket } from 'mysql2';
import { NextRequest, NextResponse } from 'next/server';
import { setStandardImageName } from '@/backend_lib/image_uploading/image_namer.lib';

export async function PUT(req: NextRequest, { params }: { params: { chapterId: string } }) {
    const { chapterId } = params;
    const stdRes: IStandardResponse = {};

    // Verify user token
    const verifiedRes = await verifyToken(req);
    if (verifiedRes.status !== 200) {
        return NextResponse.json({
            msg: verifiedRes.msg
        }, { status: verifiedRes.status });
    }
    const userIdFromCookie = verifiedRes.data.uId;

    // Parse form data
    let formData: FormData;
    try {
        formData = await req.formData();
    } catch (error) {
        stdRes.msg = `Content-Type was not one of "multipart/form-data" or "application/x-www-form-urlencoded`;
        stdRes.msg2 = error;
        console.error(stdRes);
        return NextResponse.json(stdRes, { status: 400 });
    }

    // Validate chapter ownership
    const [chapterOwnership] = await dbConnection.query<RowDataPacket[]>(`
        SELECT s.authorId 
        FROM Chapter c
        JOIN Story s ON c.storyId = s.sId
        WHERE c.cId = ?
    `, [chapterId]);

    if (chapterOwnership.length === 0) {
        stdRes.msg = "Chapter not found";
        return NextResponse.json(stdRes, { status: 404 });
    }

    if (chapterOwnership[0].authorId !== userIdFromCookie) {
        stdRes.msg = "You don't have permission to edit this chapter";
        return NextResponse.json(stdRes, { status: 403 });
    }

    // Get and validate form data
    const images = formData.getAll("imageChapterFiles");
    const chapterName = formData.get("chapterName");
    const price = formData.get("price")

    let priceNumber : Number | null = null;
    if (price) {
        try {
            priceNumber = Number(price);
        } catch (error) {
            priceNumber = 0
        }
    }

    if (!chapterName) {
        stdRes.msg = "Chapter name is required";
        return NextResponse.json(stdRes, { status: 400 });
    }

    // Validate images if provided
    if (images.length > 0) {
        for (let index = 0; index < images.length; index++) {
            const img = images[index];
            if (!(img instanceof File)) {
                stdRes.msg = "A element in imageChapterFiles is not File type.";
                return NextResponse.json(stdRes, { status: 400 });
            }
        }
    }

    try {
        // Start transaction
        await dbConnection.beginTransaction();

        // Update chapter name
        await dbConnection.query<ResultSetHeader>(`
            UPDATE Chapter 
            SET name = ?,
                price = ?
            WHERE cId = ?
        `, [chapterName, priceNumber, chapterId]);

        // Handle image updates if provided
        if (images.length > 0) {
            // Delete existing images
            await dbConnection.query(`
                DELETE FROM ChapterImage 
                WHERE chapterId = ?
            `, [chapterId]);

            // Upload and insert new images
            const chapterImageValues = await Promise.all(images.map(async (img, index) => {
                const file = img as File;
                const imageName = setStandardImageName(file.name, 'chapterImage');
                const uploadResult = await uploadImage(file, imageName);
                
                if (!uploadResult.data?.newFilename) {
                    throw new Error('Failed to upload image');
                }

                return uploadResult.data.newFilename
            }));

            // Insert new images
            if (chapterImageValues.length > 0) {
                const values = chapterImageValues.map((url, index) => 
                    `(${chapterId}, ${index}, ${dbConnection.escape(url)})`
                ).join(',');

                await dbConnection.query<ResultSetHeader>(`
                    INSERT INTO ChapterImage (chapterId, imageSequenceNumber, url)
                    VALUES ${values}
                `);
            }
        }

        // Commit transaction
        await dbConnection.commit();

        stdRes.msg = `Chapter updated successfully`;
        if (images.length > 0) {
            stdRes.msg += ` with ${images.length} new images`;
        }
        return NextResponse.json(stdRes, { status: 200 });

    } catch (error: any) {
        // Rollback transaction on error
        await dbConnection.rollback();
        
        console.error('Error updating chapter:', error);
        stdRes.msg = `Error updating chapter: ${error.message}`;
        stdRes.msg2 = error;
        console.error(stdRes);
        return NextResponse.json(stdRes, { status: 500 });
    }
} 