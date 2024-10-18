import { ResultSetHeader } from 'mysql2';
import { dbConnection } from "@/db/dbConnector";

// Helper function to update story details
export async function updateStoryDetails(
    storyId: number, 
    title: string | null, 
    introduction: string | null, 
    coverImageUrl: string | null
) {
    const updateFields: string[] = [];
    const updateValues: any[] = [];

    if (title) {
        updateFields.push("title = ?");
        updateValues.push(title);
    }

    if (introduction) {
        updateFields.push("introduction = ?");
        updateValues.push(introduction);
    }

    if (coverImageUrl) {
        updateFields.push("coverImageUrl = ?");
        updateValues.push(coverImageUrl);
    }

    if (updateFields.length > 0) {
        updateValues.push(storyId); // Add storyId as the last parameter for the WHERE clause
        const query = `UPDATE Story SET ${updateFields.join(", ")} WHERE sId = ?`;
        await dbConnection.execute<ResultSetHeader>(query, updateValues);
    }
}