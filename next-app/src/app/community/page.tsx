'use client';

import { useState, useEffect } from 'react';
import { CreatePost } from '@/components/community/create-post';
import { PostCard } from '@/components/community/post-card';
import type { Post } from '@/types/community';

export default function CommunityPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const response = await fetch('/api/community/posts');
      const data = await response.json();
      setPosts(data);
    } catch (error) {
      console.error('Failed to fetch posts:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLike = async (postId: string) => {
    try {
      await fetch(`/api/community/posts/${postId}/like`, {
        method: 'POST',
      });
      fetchPosts(); // Refresh posts
    } catch (error) {
      console.error('Failed to like post:', error);
    }
  };

  const handleComment = (postId: string) => {
    // Implement comment handling
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto py-6 max-w-3xl">
      <h1 className="text-3xl font-bold mb-6">Community Feed</h1>
      <CreatePost />
      <div className="space-y-4">
        {posts.map((post) => (
          <PostCard
            key={post.id}
            post={post}
            onLike={handleLike}
            onComment={handleComment}
          />
        ))}
      </div>
    </div>
  );
}