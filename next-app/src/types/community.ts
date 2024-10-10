export interface Post {
    id: string;
    title: string;
    content: string;
    author: User;
    createdAt: string;
    likes: number;
    comments: Comment[];
    image?: string;
}
  
export interface Comment {
    id: string;
    content: string;
    author: User;
    createdAt: string;
    likes: number;
}
  
export interface User {
    id: string;
    name: string;
    avatar: string;
    role: string;
}
  