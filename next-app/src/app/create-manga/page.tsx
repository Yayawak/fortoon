'use client'
import React, { useState, ChangeEvent, FormEvent, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card';
import { useRouter } from 'next/navigation';
import { useToast } from "@/hooks/use-toast";
import { useAuth } from '@/contexts/AuthContext'; 
import { MangaFormData } from '@/lib/types';
import Image from 'next/image';
import { useSettings } from '@/contexts/SettingsContext';

const CreateManga: React.FC = () => {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useAuth(); 
  const { theme } = useSettings();

  const [formData, setFormData] = useState<MangaFormData>({
    title: '',
    description: '',
    genre: '',
    coverImage: null,
  });

  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setFormData(prev => ({ ...prev, coverImage: file }));
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!user?.uId) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please log in to create a story.",
      });
      router.push('/login');
      return;
    }

    setIsSubmitting(true);
    
    const formDataToSend = new FormData();
    formDataToSend.append('authorId', user.uId.toString());
    formDataToSend.append('title', formData.title);
    formDataToSend.append('introduction', formData.description);
    if (formData.coverImage) {
      formDataToSend.append('coverImage', formData.coverImage);
    }

    try {
      const response = await fetch(`/api/story`, {
        method: 'POST',
        body: formDataToSend,
        credentials: 'include',
      });

      if (!response.ok) {
        const errorData = await response.text();
        throw new Error(errorData);
      }

      const result = await response.json();
      console.log(result)
      toast({
        title: "Success",
        description: "Story created successfully!",
      });
      router.push(`/manga/${result.id}`);
    } catch (error) {
      console.error('Error creating story:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to create story. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // // Show loading state while checking authentication
  // if (isLoading) {
  //   return (
  //     <div className="min-h-screen flex items-center justify-center">
  //       <div className="flex flex-col items-center space-y-4">
  //         <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
  //         <p className="text-lg">Loading...</p>
  //       </div>
  //     </div>
  //   );
  // }

  // // If not loading and no user, the middleware will handle redirect
  // if (!user) {
  //   return null;
  // }

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <div className="max-w-4xl mx-auto p-4">
        <Card className={`w-full ${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
          <CardHeader>
            <h1 className={`text-2xl font-bold text-center ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
              Create New Manga
            </h1>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title" className={theme === 'dark' ? 'text-white' : 'text-gray-900'}>
                  Title
                </Label>
                <Input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  required
                  disabled={isSubmitting}
                  className={`w-full ${
                    theme === 'dark' 
                      ? 'bg-gray-700 text-white border-gray-600' 
                      : 'bg-white text-gray-900 border-gray-300'
                  }`}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description" className={theme === 'dark' ? 'text-white' : 'text-gray-900'}>
                  Description
                </Label>
                <Textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={3}
                  required
                  disabled={isSubmitting}
                  className={`w-full ${
                    theme === 'dark' 
                      ? 'bg-gray-700 text-white border-gray-600' 
                      : 'bg-white text-gray-900 border-gray-300'
                  }`}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="genre" className={theme === 'dark' ? 'text-white' : 'text-gray-900'}>
                  Genre
                </Label>
                <Input
                  type="text"
                  id="genre"
                  name="genre"
                  value={formData.genre}
                  onChange={handleInputChange}
                  required
                  disabled={isSubmitting}
                  className={`w-full ${
                    theme === 'dark' 
                      ? 'bg-gray-700 text-white border-gray-600' 
                      : 'bg-white text-gray-900 border-gray-300'
                  }`}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="coverImage" className={theme === 'dark' ? 'text-white' : 'text-gray-900'}>
                  Cover Image
                </Label>
                <Input
                  type="file"
                  id="coverImage"
                  name="coverImage"
                  onChange={handleFileChange}
                  accept="image/*"
                  disabled={isSubmitting}
                  className={`cursor-pointer ${
                    theme === 'dark' 
                      ? 'bg-gray-700 text-white border-gray-600' 
                      : 'bg-white text-gray-900 border-gray-300'
                  }`}
                />
                {imagePreview && (
                  <div className="mt-4">
                    <Image 
                      src={imagePreview} 
                      alt="Cover preview" 
                      width={300}
                      height={200}
                      className="rounded-lg shadow-md"
                    />
                  </div>
                )}
              </div>

              <CardFooter className="flex justify-end px-0">
                <Button 
                  type="submit" 
                  disabled={isSubmitting}
                  className={`${
                    theme === 'dark' 
                      ? 'bg-blue-600 hover:bg-blue-700' 
                      : 'bg-blue-500 hover:bg-blue-600'
                  } text-white transition-colors`}
                >
                  {isSubmitting ? (
                    <div className="flex items-center space-x-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      <span>Creating...</span>
                    </div>
                  ) : (
                    'Create Manga'
                  )}
                </Button>
              </CardFooter>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CreateManga;