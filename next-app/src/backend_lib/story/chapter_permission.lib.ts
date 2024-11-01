import { dbConnection } from '@/db/dbConnector';
import { RowDataPacket } from 'mysql2';

export async function hasReadPermission(readerId: string, chapterId: string): Promise<boolean> {
    // First, check if the chapter is free
    // console.log(chapterId)
    const [chapterResult] = await dbConnection.query<RowDataPacket[]>(`
        SELECT price FROM Chapter 
        WHERE cId = ?
    `, [chapterId]);

    // console.log(chapterResult)
    // If chapter not found, return false
    if (chapterResult.length === 0) {
        return false; 
    }

    const chapterPrice = chapterResult[0].price;

    // If the chapter is free, grant permission
    if (chapterPrice === 0) {
        return true;
    }

    // Now check the permission from the StoryChapterPermission table
    const [permissionResult] = await dbConnection.query<RowDataPacket[]>(`
        SELECT * FROM StoryChapterPermission 
        WHERE chapterId = ? AND userId = ?
    `, [chapterId, readerId]);

    return permissionResult.length > 0; // If there's a record, the user has permission
}

// Helper function to check if the Chapter exists
export async function checkChapterExists(refId: number) {
    const [rows]: [RowDataPacket[], any] = await dbConnection.execute(`
        SELECT * FROM Chapter WHERE cId = ?
    `, [refId]);
    return rows.length > 0;
}