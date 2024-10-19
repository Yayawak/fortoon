'use client';

import { useState } from "react";
import { useSettings } from "@/contexts/SettingsContext";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

interface ChapterPageProps {
  params: {
    id: string;
    chapterNumber: string;
  };
}

export default function ChapterPage({ params }: ChapterPageProps) {
  const { t, theme } = useSettings();
  
  // In a real app, you'd fetch this data based on the manga ID and chapter number
  const chapterData = {
    mangaId: params.id,
    mangaTitle: "Demon Slayer",
    chapterNumber: parseInt(params.chapterNumber),
    chapterTitle: "The Final Battle",
    pages: [
      "/api/placeholder/800/1200",
      "/api/placeholder/800/1200",
      "/api/placeholder/800/1200",
    ],
  };

  return (
    <div className={`min-h-screen ${
      theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'
    }`}>
      <nav className="fixed top-0 left-0 right-0 bg-gray-800 text-white z-50">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link href={`/manga/${chapterData.mangaId}`} className="flex items-center">
            <ChevronLeft className="w-6 h-6 mr-2" />
            <span>{chapterData.mangaTitle}</span>
          </Link>
          <div className="flex items-center space-x-4">
            <Button 
              variant="outline" 
              asChild 
              disabled={chapterData.chapterNumber <= 1}
            >
              <Link href={`/manga/${chapterData.mangaId}/chapter/${chapterData.chapterNumber - 1}`}>
                Previous Chapter
              </Link>
            </Button>
            <Button asChild>
              <Link href={`/manga/${chapterData.mangaId}/chapter/${chapterData.chapterNumber + 1}`}>
                Next Chapter
              </Link>
            </Button>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 pt-20 pb-8">
        <h1 className="text-2xl font-bold mb-4">
          Chapter {chapterData.chapterNumber}: {chapterData.chapterTitle}
        </h1>
        
        <div className="space-y-4">
          {chapterData.pages.map((page, index) => (
            <img 
              key={index}
              src={page}
              alt={`Page ${index + 1}`}
              className="mx-auto max-w-full"
            />
          ))}
        </div>
      </div>
    </div>
  );
}