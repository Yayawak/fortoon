import { ResultSetHeader } from 'mysql2';
import { dbConnection } from "@/db/dbConnector";

// Helper function to create a new post
export async function createPost(title: string, content: string, parentPostId: number | null, posterId: number) {
    const [insertRes] = await dbConnection.execute<ResultSetHeader>(`
        INSERT INTO Post (title, content, parentPostId, posterId) VALUES (?, ?, ?, ?)
    `, [title, content, parentPostId, posterId]);

    return insertRes.insertId; // Return the ID of the newly created post
}

// Helper function to add images to a post
export async function addImagesToPost(postId: number, imageUrls: string[]) {
    const imageInserts = imageUrls.map(async (url) => {
        await dbConnection.execute(`
            INSERT INTO PostImage (url, postId) VALUES (?, ?)
        `, [url, postId]);
    });
    await Promise.all(imageInserts); // Ensure all image inserts are completed
}

// Helper function to delete all images associated with a post
export async function deleteAllImagesForPost(postId: number) {
    await dbConnection.execute(`
        DELETE FROM PostImage WHERE postId = ?
    `, [postId]);
}