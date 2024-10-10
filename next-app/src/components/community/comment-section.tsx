import { useState } from 'react';
import { UserAvatar } from './user-avatar';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { Heart, Reply } from 'lucide-react';
import type { Comment, User } from '@/types/community';

interface CommentSectionProps {
  comments: Comment[];
  postId: string;
  currentUser: User | null;
}

export function CommentSection({ comments, postId, currentUser }: CommentSectionProps) {
  const [newComment, setNewComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || !currentUser) return;

    setIsSubmitting(true);
    try {
      const response = await fetch(`/api/community/posts/${postId}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content: newComment,
        }),
      });

      if (!response.ok) throw new Error('Failed to post comment');
      setNewComment('');
      // You might want to refresh comments here
    } catch (error) {
      console.error('Error posting comment:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-4">
      {currentUser && (
        <form onSubmit={handleSubmitComment} className="space-y-4">
          <div className="flex space-x-4">
            <UserAvatar user={currentUser} size="sm" />
            <Textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Write a comment..."
              className="flex-1"
            />
          </div>
          <div className="flex justify-end">
            <Button 
              type="submit" 
              disabled={isSubmitting || !newComment.trim()}
            >
              Post Comment
            </Button>
          </div>
        </form>
      )}

      <div className="space-y-4">
        {comments.map((comment) => (
          <Card key={comment.id} className="bg-gray-50">
            <CardContent className="pt-4">
              <div className="flex space-x-4">
                <UserAvatar user={comment.author} size="sm" />
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-semibold">{comment.author.name}</h4>
                      <p className="text-sm text-gray-500">
                        {new Date(comment.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <p className="mt-2 text-gray-700">{comment.content}</p>
                  <div className="mt-2 flex space-x-4">
                    <Button variant="ghost" size="sm">
                      <Heart className="mr-2 h-4 w-4" />
                      {comment.likes}
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Reply className="mr-2 h-4 w-4" />
                      Reply
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}