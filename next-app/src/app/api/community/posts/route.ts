import { NextResponse } from 'next/server';

const MOCK_POSTS = [
  {
    id: '1',
    title: 'First Post',
    content: 'This is my first post in the community!',
    author: {
      id: '1',
      name: 'John Doe',
      avatar: '/avatars/john.jpg',
      role: 'member'
    },
    createdAt: new Date().toISOString(),
    likes: 5,
    comments: []
  },
  // Add more mock posts
];

export async function GET() {
  // In a real app, fetch from database
  return NextResponse.json(MOCK_POSTS);
}

export async function POST(request: Request) {
  const data = await request.json();
  // In a real app, save to database
  return NextResponse.json({ success: true });
}