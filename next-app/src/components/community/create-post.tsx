import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Image, Send } from 'lucide-react';

export function CreatePost() {
  const [content, setContent] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Handle post creation
  };

  return (
    <Card className="mb-6">
      <CardContent className="pt-4">
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            placeholder="What's on your mind?"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="min-h-[100px]"
          />
          <div className="flex justify-between">
            <Button variant="outline" type="button">
              <Image className="mr-2 h-4 w-4" />
              Add Image
            </Button>
            <Button type="submit">
              <Send className="mr-2 h-4 w-4" />
              Post
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}