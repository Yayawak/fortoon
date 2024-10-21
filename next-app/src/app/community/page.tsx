'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { 
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle 
} from '@/components/ui/card';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
interface Post {
  id: string;
  title: string;
  content: string;
  author: string;
  createdAt: string;
  image?: string;
}

const CommunityPage: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const response = await fetch('/api/community/post');
      if (!response.ok) {
        throw new Error('Failed to fetch posts');
      }
  
      const result = await response.json(); // Ensure you're reading the correct structure
      const posts = result?.data?.posts || []; // Extract posts from result.data.posts
      setPosts(posts); // Set the posts state
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setLoading(false);
    }
  };
  

  const handleSubmitPost = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);

    try {
      const response = await fetch('/api/community/post', {
        method: 'POST',
        body: formData,
      });
      if (!response.ok) {
        throw new Error('Failed to submit post');
      }
      form.reset();
      fetchPosts();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Community Page</h1>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Create a New Post</CardTitle>
          <CardDescription>Share your thoughts with the community</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmitPost}>
            <div className="mb-4">
              <Label htmlFor="post-title">Title</Label>
              <Input id="post-title" name="title" placeholder="Enter post title" required />
            </div>
            <div className="mb-4">
              <Label htmlFor="post-content">Your Post</Label>
              <Input id="post-content" name="content" placeholder="What's on your mind?" required />
            </div>
            <div className="mb-4">
              <Label htmlFor="post-image">Image (optional)</Label>
              <Input id="post-image" name="image" type="file" accept="image/*" />
            </div>
            <Button type="submit">Post</Button>
          </form>
        </CardContent>
      </Card>

      <Tabs defaultValue="all">
        <TabsList>
          <TabsTrigger value="all">All Posts</TabsTrigger>
          <TabsTrigger value="trending">Trending</TabsTrigger>
          <TabsTrigger value="my-posts">My Posts</TabsTrigger>
        </TabsList>
        <TabsContent value="all">
          {Array.isArray(posts) && posts.length > 0 ? (
            posts.map((post) => (
              <Card key={post.id} className="mb-4">
                <CardHeader>
                  <CardTitle>{post.title}</CardTitle>
                  <CardDescription>
                    {post.author} - {new Date(post.createdAt).toLocaleDateString()}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p>{post.content}</p>
                  {post.image && <img src={post.image} alt="Post image" className="mt-2 max-w-full h-auto" />}
                </CardContent>
              </Card>
            ))
          ) : (
            <p>No posts available.</p>
          )}
        </TabsContent>
        <TabsContent value="trending">
          <p>Trending posts will be displayed here.</p>
        </TabsContent>
        <TabsContent value="my-posts">
          <p>Your posts will be displayed here.</p>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CommunityPage;
