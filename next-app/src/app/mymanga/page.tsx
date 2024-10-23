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

export default function MangaDashboard() {
  const router = useRouter();
  const [favorites, setFavorites] = useState<Manga[]>([]);
  const [purchased, setPurchased] = useState<Manga[]>([]);

  useEffect(() => {
   
  }, []);

  const handleCardClick = (mangaId: number) => {
    router.push(`/manga/${mangaId}`);
  };

  const MangaCard = ({ manga }: { manga: Manga }) => (
    <Card 
      className="h-full cursor-pointer hover:shadow-lg transition-shadow"
      onClick={(e) => {
        // Prevent navigation if clicking on dropdown or button
        if (
          !(e.target as HTMLElement).closest('.dropdown-trigger') &&
          !(e.target as HTMLElement).closest('button')
        ) {
          handleCardClick(manga.sId);
        }
      }}
    >
      <CardContent className="p-4">
        <div className="flex space-x-4">
          {/* <img
            src={manga.coverImage}
            alt={manga.title}
            className="h-40 w-28 object-cover rounded"
          /> */}
          <div className="flex flex-col justify-between flex-1">
            <div>
              <div className="flex justify-between items-start">
                <h3 className="font-semibold text-lg">{manga.title}</h3>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="dropdown-trigger">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem>
                      <Heart className="mr-2 h-4 w-4" /> Toggle Favorite
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <BookOpen className="mr-2 h-4 w-4" /> Mark as Read
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              <p className="text-sm text-gray-500">{manga.authorDisplayName}</p>
            </div>
            {/* <div className="space-y-2">
              <div className="flex items-center text-sm">
                <Clock className="mr-2 h-4 w-4" />
                Last read: {manga.lastRead}
              </div>
              <div className="flex items-center text-sm">
                <Bookmark className="mr-2 h-4 w-4" />
                Progress: {manga.chaptersRead} / {manga.totalChapters}
              </div>
              <div className="flex items-center text-sm">
                <Star className="mr-2 h-4 w-4" />
                Status: {manga.status}
              </div>
            </div> */}
            <Button className="mt-2">Continue Reading</Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">My Manga Collection</h1>
      
      <Tabs defaultValue="favorites">
        <TabsList className="mb-4">
          <TabsTrigger value="favorites">Favorites</TabsTrigger>
          <TabsTrigger value="purchased">Purchased</TabsTrigger>
        </TabsList>
        
        <TabsContent value="favorites">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {favorites.map((manga) => (
              <MangaCard key={manga.sId} manga={manga} />
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="purchased">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {purchased.map((manga) => (
              <MangaCard key={manga.sId} manga={manga} />
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}