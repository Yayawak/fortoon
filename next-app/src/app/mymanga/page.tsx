'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Heart,
  BookOpen,
  MoreHorizontal,
  Star,
  Clock,
  Bookmark,
} from 'lucide-react';
import { Manga } from '@/lib/types';
import { useSettings } from '@/contexts/SettingsContext';

export default function MangaDashboard() {
  const router = useRouter();
  const [favorites, setFavorites] = useState<Manga[]>([]);
  const [purchased, setPurchased] = useState<Manga[]>([]);
  const { theme } = useSettings();

  useEffect(() => {
    const fetchPurchasedManga = async () => {
      try {
        const response = await fetch('/api/story/purchased');
        if (!response.ok) throw new Error('Failed to fetch purchased manga');
        const data = await response.json();
        setPurchased(data.data || []);
      } catch (error) {
        console.error('Error fetching purchased manga:', error);
      }
    };

    fetchPurchasedManga();
  }, []);

  const handleCardClick = (mangaId: number) => {
    router.push(`/manga/${mangaId}`);
  };

  const MangaCard = ({ manga }: { manga: Manga }) => {
    const router = useRouter();
    const { theme } = useSettings();

    return (
      <Card 
        className={`w-full h-full cursor-pointer hover:shadow-lg transition-shadow ${
          theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white'
        }`}
        onClick={() => router.push(`/manga/${manga.sId}`)}
      >
        <CardContent className="p-3 md:p-4">
          <div className="flex flex-col h-full">
            <div className="flex-1">
              <h3 className={`font-semibold text-base md:text-lg truncate ${
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}>
                {manga.title}
              </h3>
              <p className={`text-xs md:text-sm truncate ${
                theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
              }`}>
                {manga.authorDisplayName}
              </p>
            </div>
            <Button 
              className={`w-full mt-3 text-sm md:text-base ${
                theme === 'dark' 
                  ? 'bg-blue-600 hover:bg-blue-700' 
                  : 'bg-blue-500 hover:bg-blue-600'
              }`}
              onClick={(e) => {
                e.stopPropagation();
                const firstAccessibleChapter = manga.chapters?.find(chapter => 
                  chapter.price === 0 || (chapter.images && chapter.images.length > 0)
                );
                
                if (firstAccessibleChapter) {
                  router.push(`/manga/${manga.sId}/chapter/${firstAccessibleChapter.cId}`);
                } else {
                  router.push(`/manga/${manga.sId}`);
                }
              }}
            >
              Continue Reading
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className={`min-h-screen w-full px-4 py-8 ${
      theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'
    }`}>
      <div className="max-w-7xl mx-auto">
        <h1 className={`text-2xl md:text-3xl font-bold mb-6 ${
          theme === 'dark' ? 'text-white' : 'text-gray-900'
        }`}>
          My Manga Collection
        </h1>
        
        <Tabs defaultValue="purchased" className={
          theme === 'dark' ? 'dark' : ''
        }>
          <TabsList className="mb-4">
            <TabsTrigger value="purchased">Purchased</TabsTrigger>
          </TabsList>
          
          <TabsContent value="purchased">
            {purchased.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {purchased.map((manga) => (
                  <MangaCard key={manga.sId} manga={manga} />
                ))}
              </div>
            ) : (
              <div className={`text-center py-8 ${
                theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
              }`}>
                No purchased manga yet
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}