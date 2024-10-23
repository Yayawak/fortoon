'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Heart, MessageSquare, Share2, Trash2 } from 'lucide-react';
import { 
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter
} from '@/components/ui/card';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import { Post } from '@/lib/types';
import { useAuth } from '@/contexts/AuthContext';
import { CldImage } from 'next-cloudinary';

// Extend Post type to include likes
interface EnhancedPost extends Post {
  likes?: number;
  isLiked?: boolean;
}

const PostCard: React.FC<{ 
  post: EnhancedPost; 
  level?: number;
  currentUserId: number | undefined;
  onPostUpdate: () => void;
}> = ({ 
  post, 
  level = 0,
  currentUserId,
  onPostUpdate 
}) => {
  const [isReplying, setIsReplying] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [likeCount, setLikeCount] = useState(post.likes || 0);
  const [isLiked, setIsLiked] = useState(post.isLiked || false);
  // const { theme } = useTheme();
  
  const isLongContent = post.content.length > 200;
  const displayContent = isLongContent && !isExpanded 
    ? `${post.content.substring(0, 200)}...` 
    : post.content;

  const handleLike = async () => {
    try {
      const response = await fetch(`/api/community/post/${post.pId}/like`, {
        method: 'POST',
      });
      
      if (!response.ok) {
        throw new Error('Failed to like post');
      }
      
      setIsLiked(!isLiked);
      setLikeCount(prev => isLiked ? prev - 1 : prev + 1);
    } catch (err) {
      console.error('Error liking post:', err);
    }
  };

  const handleReplySubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const form = e.currentTarget;
      const formData = new FormData(form);
      
      formData.append('postType', 'community');
      formData.append('parentPostId', post.pId.toString());
      
      const response = await fetch('/api/community/post', {
        method: 'POST',
        body: formData,
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to submit reply');
      }
      
      form.reset();
      setIsReplying(false);
      onPostUpdate();
    } catch (err) {
      console.error('Error posting reply:', err);
      alert(err instanceof Error ? err.message : 'Failed to post reply');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeletePost = async () => {
    if (!confirm('Are you sure you want to delete this post?')) return;
    
    try {
      const response = await fetch(`/api/community/post/${post.pId}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to delete post');
      }
      
      onPostUpdate();
    } catch (err) {
      console.error('Error deleting post:', err);
      alert(err instanceof Error ? err.message : 'Failed to delete post');
    }
  };

  const isOwnPost = post.posterId === currentUserId;

  return (
    <div style={{ marginLeft: `${level * 2}rem` }}>
      <Card className={`mb-4 ${isOwnPost ? 'border-primary/50 border-2' : ''} hover:shadow-lg transition-shadow duration-200`}>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>{post.title}</span>
            {isOwnPost && (
              <Button
                variant="ghost"
                size="icon"
                className="text-destructive hover:text-destructive/90"
                onClick={handleDeletePost}
              >
                <Trash2 className="h-5 w-5" />
              </Button>
            )}
          </CardTitle>
          <CardDescription className="flex justify-between items-center">
            <span className="font-medium">User ID: {post.posterId}</span>
            <span className="text-muted-foreground">
              {new Date(post.createdAt).toLocaleString()}
            </span>
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <div className="mb-4">
            <p className="whitespace-pre-wrap break-words">
              {displayContent}
            </p>
            {isLongContent && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsExpanded(!isExpanded)}
                className="mt-2"
              >
                {isExpanded ? 'Show Less' : 'Read More'}
              </Button>
            )}
          </div>
          
          {post.images && post.images.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              {post.images.map((image, index) => (
          <div key={index} className="relative w-full h-64">
            <CldImage
              src={image}
              alt={`Post image ${index + 1}`}
              fill
              style={{objectFit: "cover"}}
              className="transition-transform duration-300 hover:scale-105 rounded-lg"
            />
          </div>
              ))}
            </div>
          )}
        </CardContent>

        <CardFooter className="flex justify-between items-center">
          <div className="flex gap-4">
            <Button
              variant="ghost"
              size="sm"
              className={`flex items-center gap-2 ${isLiked ? 'text-red-500' : ''}`}
              onClick={handleLike}
            >
              <Heart className={`h-5 w-5 ${isLiked ? 'fill-current' : ''}`} />
              <span>{likeCount}</span>
            </Button>
            
            <Button 
              variant="ghost" 
              size="sm"
              disabled={isSubmitting}
              onClick={() => setIsReplying(!isReplying)}
              className="flex items-center gap-2"
            >
              <MessageSquare className="h-5 w-5" />
              <span>{isReplying ? 'Cancel' : 'Reply'}</span>
            </Button>

            <Button
              variant="ghost"
              size="sm"
              className="flex items-center gap-2"
            >
              <Share2 className="h-5 w-5" />
              <span>Share</span>
            </Button>
          </div>
        </CardFooter>

        {isReplying && (
          <CardContent>
            <form onSubmit={handleReplySubmit} className="mt-4">
              <div className="mb-4">
                <Label htmlFor={`reply-title-${post.pId}`}>Title</Label>
                <Input 
                  id={`reply-title-${post.pId}`}
                  name="title"
                  placeholder="Reply title"
                  required
                  disabled={isSubmitting}
                />
              </div>
              <div className="mb-4">
                <Label htmlFor={`reply-content-${post.pId}`}>Your Reply</Label>
                <textarea
                  id={`reply-content-${post.pId}`}
                  name="content"
                  placeholder="Write your reply..."
                  required
                  disabled={isSubmitting}
                  className="w-full min-h-[100px] p-2 border rounded-md"
                />
              </div>
              <div className="mb-4">
                <Label htmlFor={`reply-image-${post.pId}`}>Image (optional)</Label>
                <Input
                  id={`reply-image-${post.pId}`}
                  name="image"
                  type="file"
                  accept="image/*"
                  disabled={isSubmitting}
                />
              </div>
              <Button type="submit" size="sm" disabled={isSubmitting}>
                {isSubmitting ? 'Submitting...' : 'Submit Reply'}
              </Button>
            </form>
          </CardContent>
        )}

        {post.children && post.children.length > 0 && (
          <CardContent className="pt-0">
            {post.children.map(childPost => (
              <PostCard 
                key={childPost.pId} 
                post={childPost} 
                level={level + 1}
                currentUserId={currentUserId}
                onPostUpdate={onPostUpdate}
              />
            ))}
          </CardContent>
        )}
      </Card>
    </div>
  );
};

const CommunityPage: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useAuth();
  // const { theme, setTheme } = useTheme();

  const fetchPosts = async () => {
    try {
      const response = await fetch('/api/community/post');
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch posts');
      }
      const result = await response.json();
      setPosts(result.data.posts);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleSubmitPost = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const form = e.currentTarget;
      const formData = new FormData(form);

      // Add postType for community posts
    formData.append('postType', 'community');
      
      const response = await fetch('/api/community/post', {
        method: 'POST',
        body: formData,
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to submit post');
      }
      
      form.reset();
      fetchPosts(); // Refresh posts after successful submission
    } catch (err) {
      console.error('Error submitting post:', err);
      alert(err instanceof Error ? err.message : 'Failed to submit post');
    } finally {
      setIsSubmitting(false);
    }
  };

  const userPosts = posts.filter(post => post.posterId === user?.uId);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="container mx-auto p-4">

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Create a New Post</CardTitle>
          <CardDescription>Share your thoughts with the community</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmitPost} encType="multipart/form-data">
            <div className="mb-4">
              <Label htmlFor="post-title">Title</Label>
              <Input 
                id="post-title" 
                name="title" 
                placeholder="Enter post title" 
                required
                disabled={isSubmitting}
              />
            </div>
            <div className="mb-4">
              <Label htmlFor="post-content">Your Post</Label>
              <textarea
                id="post-content"
                name="content"
                placeholder="What's on your mind?"
                required
                disabled={isSubmitting}
                className="w-full min-h-[100px] p-2 border rounded-md"
              />
            </div>
            <div className="mb-4">
              <Label htmlFor="post-image">Image (optional)</Label>
              <Input 
                id="post-image" 
                name="image" 
                type="file" 
                accept="image/*" 
                multiple
                disabled={isSubmitting}
              />
            </div>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Posting...' : 'Post'}
            </Button>
          </form>
        </CardContent>
      </Card>

      <Tabs defaultValue="all" className="mb-6">
        <TabsList className="mb-4">
          <TabsTrigger value="all">All Posts</TabsTrigger>
          <TabsTrigger value="trending">Trending</TabsTrigger>
          <TabsTrigger value="my-posts">My Posts</TabsTrigger>
        </TabsList>
        <TabsContent value="all">
          {posts.length > 0 ? (
            posts.map(post => (
              <PostCard 
                key={post.pId} 
                post={post}
                currentUserId={user?.uId}
                onPostUpdate={fetchPosts}
              />
            ))
          ) : (
            <p className="text-center text-muted-foreground">No posts available.</p>
          )}
        </TabsContent>
        <TabsContent value="trending">
          <p className="text-center text-muted-foreground">Trending posts will be displayed here.</p>
        </TabsContent>
        <TabsContent value="my-posts">
          {userPosts.length > 0 ? (
            userPosts.map(post => (
              <PostCard 
                key={post.pId} 
                post={post}
                currentUserId={user?.uId}
                onPostUpdate={fetchPosts}
              />
            ))
          ) : (
            <p className="text-center text-muted-foreground">You haven&apos;t created any posts yet.</p>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CommunityPage;