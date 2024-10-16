import { dbConnection } from '@/db/dbConnector';
import { RowDataPacket } from 'mysql2';

export async function hasReadPermission(readerId: string, chapterId: string): Promise<boolean> {
    // First, check if the chapter is free
    const [chapterResult] = await dbConnection.query<RowDataPacket[]>(`
        SELECT price FROM Chapter 
        WHERE cId = ?
    `, [chapterId]);

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