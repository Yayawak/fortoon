// Client-side token verification
'use server'
import { IStandardResponse } from '@/types/IApiCommunication';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.NEXT_PUBLIC_JWT_SECRET || ''; // Use NEXT_PUBLIC_ for client-side environment variables

export async function verifyTokenFromCookie(): Promise<IStandardResponse> {
  // Function to extract token from cookies
  const getTokenFromCookies = (): string | null => {
    console.log(document.cookie)
    const cookies = document.cookie.split('; ');
    const tokenCookie = cookies.find((row) => row.startsWith('token='));
    return tokenCookie ? tokenCookie.split('=')[1] : null;
  };

  const token = getTokenFromCookies();

  if (!token) {
    return {
      status: 401,
      msg: 'No token found in cookies',
    };
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    return {
      status: 200,
      msg: 'Token verified successfully',
      data: decoded,
    };
  } catch (error: any) {
    return {
      status: 403,
      msg: 'Invalid token',
      msg2: error.message,
    };
  }
}
