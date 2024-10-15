import { RowDataPacket } from 'mysql2';
import { IStandardResponse } from '../../types/IApiCommunication';
import { NextRequest } from 'next/server';
import jwt from 'jsonwebtoken';
import { dbConnection } from '@/db/dbConnector';

const JWT_SECRET = process.env.JWT_SECRET || '';

export async function verifyToken(req: NextRequest): Promise<IStandardResponse> {
    // Get the cookie from the request
    const cookie = req.cookies.get('token');
    // console.log(cookie);

    // Check if the cookie is present
    if (!cookie) {
        return {
            status: 401,
            msg: 'No cookie token provided',
        };
    }

    try {
        // Verify the token
        const decoded = jwt.verify(cookie.value, JWT_SECRET);
        return {
            status: 200,
            msg: 'Token verified successfully',
            data: decoded, // Pass the decoded token
        };
    } catch (error : any) {
        console.error('Token verification failed:', error);
        return {
            status: 403,
            msg: 'Invalid cookie token',
            msg2: error.message, // Optionally include error details
        };
    }
}



// const authenticate = async (req : NextRequest, ) => {
//     const [rowCountExistedStory] = await dbConnection.execute<RowDataPacket[]>(
//         `SELECT 
//         count(*) as ownedStoryCount
//         FROM User u
//         join Story s
//         on u.uId = s.authorId
//         WHERE uId = ?
//         and sId = ?
//         `, 
//         [
//             userId,
//             storyId,
//         ]
//     );
//     const ownedStoryCount : Number = rowCountExistedStory[0].ownedStoryCount
//     if (ownedStoryCount == 0) {
//         stdRes.msg = `Unfound story so can not create chapters.`
//         return NextResponse.json(stdRes, { status: 400 });
//     }
// }