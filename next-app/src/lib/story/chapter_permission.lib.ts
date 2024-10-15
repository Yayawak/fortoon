import { dbConnection } from '@/db/dbConnector';
import { RowDataPacket } from 'mysql2';

async function hasReadPermission(readerId: string, chapterId: string): Promise<boolean> {
    const [result] = await dbConnection.query<RowDataPacket[]>(`
        SELECT * FROM StoryChapterPermission 
        WHERE chapterId = ? AND userId = ?
    `, [chapterId, readerId]);

    return result.length > 0; // If there's a record, the user has permission
}