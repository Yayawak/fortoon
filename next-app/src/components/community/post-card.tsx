import { useState } from 'react';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Heart, MessageCircle, Share2 } from 'lucide-react';
import { UserAvatar } from './user-avatar';
import type { Post } from '@/types/community';

interface PostCardProps {
  post: Post;
  onLike: (postId: string) => void;
  onComment: (postId: string) => void;
}

export function PostCard({ post, onLike, onComment }: PostCardProps) {
  const [isLiked, setIsLiked] = useState(false);

  const handleLike = () => {
    setIsLiked(!isLiked);
    onLike(post.id);
  };

  return (
    <Card className="mb-4">
      <CardHeader className="flex flex-row items-center space-x-4">
        <UserAvatar user={post.author} />
        <div>
          <h3 className="font-semibold">{post.author.name}</h3>
          <p className="text-sm text-gray-500">{new Date(post.createdAt).toLocaleDateString()}</p>
        </div>
      </CardHeader>
      <CardContent>
        <h4 className="font-semibold mb-2">{post.title}</h4>
        <p className="text-gray-700">{post.content}</p>
        {post.image && (
          <img 
            src={post.image} 
            alt="Post content" 
            className="mt-4 rounded-lg w-full"
          />
        )}
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button
          variant="ghost"
          size="sm"
          onClick={handleLike}
          className={isLiked ? 'text-red-500' : ''}
        >
          <Heart className="mr-2 h-4 w-4" />
          {post.likes} Likes
        </Button>
        <Button variant="ghost" size="sm" onClick={() => onComment(post.id)}>
          <MessageCircle className="mr-2 h-4 w-4" />
          {post.comments.length} Comments
        </Button>
        <Button variant="ghost" size="sm">
          <Share2 className="mr-2 h-4 w-4" />
          Share
        </Button>
      </CardFooter>
    </Card>
  );
}
