'use client'
import React, { useEffect, useState } from 'react';
import { useSettings } from "@/contexts/SettingsContext";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CldImage } from 'next-cloudinary';

interface ChapterPageProps {
  params: {
    sId: string;
    cId: string;
  };
}

interface Image {
  imageSequenceNumber: number;
  url: string;
}

interface Chapter {
  name: string;
  cId: number;
  storyId: number;
  chapterSequence: number;
  price: number;
  images: Image[];
}

interface MangaData {
  sId: number;
  title: string;
  introduction: string;
  chapters: Chapter[];
}

export default function ChapterPage({ params }: ChapterPageProps) {
  const { theme } = useSettings();
  const [mangaData, setMangaData] = useState<MangaData | null>(null);
  const [currentChapter, setCurrentChapter] = useState<Chapter | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMangaData = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/story/${params.sId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch manga data');
        }
        const data = await response.json();
        console.log(data)
        setMangaData(data);
        
        // Find the current chapter
        const chapter = data.chapters.find(
          (ch: Chapter) => ch.cId.toString() === params.cId
        );
        if (chapter) {
          setCurrentChapter(chapter);
        } else {
          setError('Chapter not found');
        }
      } catch (err) {
        setError('Error loading manga data');
      } finally {
        setLoading(false);
      }
    };

    fetchMangaData();
  }, [params.sId, params.cId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent"></div>
      </div>
    );
  }

  if (error || !mangaData || !currentChapter) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-bold mb-4">Error</h2>
          <p>{error || 'Failed to load content'}</p>
          <Link href={'mange/${params.sid}'} className="text-primary hover:underline mt-4 block">
            Return to Manga List
          </Link>
        </div>
      </div>
    );
  }

  // Find previous and next chapters
  const sortedChapters = [...mangaData.chapters].sort((a, b) => 
    a.chapterSequence - b.chapterSequence
  );
  const currentIndex = sortedChapters.findIndex(ch => ch.cId === currentChapter.cId);
  const prevChapter = currentIndex > 0 ? sortedChapters[currentIndex - 1] : null;
  const nextChapter = currentIndex < sortedChapters.length - 1 ? sortedChapters[currentIndex + 1] : null;

  return (
    <div className={`min-h-screen ${
      theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'
    }`}>
      <nav className="fixed top-0 left-0 right-0 bg-gray-800 text-white z-50">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link href={`/manga/${params.sId}`} className="flex items-center">
            <ChevronLeft className="w-6 h-6 mr-2" />
            <span>{mangaData.title}</span>
          </Link>
          <div className="flex items-center space-x-4">
            {prevChapter && (
              <Button 
                variant="outline" 
                asChild
              >
                <Link href={`/manga/${params.sId}/chapter/${prevChapter.cId}`}>
                  Previous Chapter
                </Link>
              </Button>
            )}
            {nextChapter && (
              <Button asChild>
                <Link href={`/manga/${params.sId}/chapter/${nextChapter.cId}`}>
                  Next Chapter
                </Link>
              </Button>
            )}
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 pt-20 pb-8">
        <h1 className="text-2xl font-bold mb-4">
          Chapter {currentChapter.chapterSequence}
          {currentChapter.name && `: ${currentChapter.name}`}
        </h1>
        
        <div className="space-y-4">
          {currentChapter.images.length > 0 ? (
            currentChapter.images
              .sort((a, b) => a.imageSequenceNumber - b.imageSequenceNumber)
              .map((image) => (
                <CldImage 
                  key={image.imageSequenceNumber}
                  src={image.url}
                  alt={`Page ${image.imageSequenceNumber}`}
                  className="mx-auto max-w-full"
                  width={700}
                  height={1000}
                />
              ))
          ) : (
            <div className="text-center py-8">
              <p>No images available for this chapter.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}