import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || '';

export async function verifyToken(req: NextRequest) {
    // Get the cookie from the request
    const cookie = req.cookies.get('token');
    console.log(cookie)

    // Check if the cookie is present
    if (!cookie) {
        return {
            status: 401,
            response: NextResponse.json({ error: 'No token provided' }),
        };
    }

    try {
        // Verify the token
        const decoded = jwt.verify(cookie.value, JWT_SECRET);
        return {
            status: 200,
            response: decoded, // Return the decoded token data
        };
    } catch (error) {
        console.error('Token verification failed:', error);
        return {
            status: 403,
            response: NextResponse.json({ error: 'Invalid token' }),
        };
    }
}