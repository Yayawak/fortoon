'use client';

import { useState } from "react";
import { useSettings } from "@/contexts/SettingsContext";
import { Star, MessageSquare, Book, ThumbsUp, Eye, Calendar, Clock, ChevronRight } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import Link from "next/link";
import { Button } from "@/components/ui/button";

interface MangaDetailProps {
  params: {
    id: string;
  };
}

interface Chapter {
  number: number;
  title: string;
  releaseDate: string;
  views: number;
  comments: {
    user: string;
    avatar: string;
    comment: string;
    likes: number;
  }[];
}

interface Review {
  user: string;
  avatar: string;
  rating: number;
  comment: string;
  likes: number;
  date: string;
}

interface Recommendation {
  id: number;
  title: string;
  cover: string;
  similarity: string;
  rating: number;
}

interface Manga {
  id: string;
  title: string;
  cover: string;
  rating: number;
  description: string;
  author: string;
  status: string;
  releaseYear: number;
  genres: string[];
  chapters: Chapter[];
  reviews: Review[];
  recommendations: Recommendation[];
}

export default function MangaDetail({ params }: MangaDetailProps) {
  const { t, theme } = useSettings();
  const [activeTab, setActiveTab] = useState('description');

  const manga: Manga = {
    id: params.id,
    title: "Demon Slayer",
    cover: "/api/placeholder/500/700",
    rating: 4.8,
    author: "Koyoharu Gotouge",
    status: "Completed",
    releaseYear: 2016,
    description: "In Taisho-era Japan, Tanjiro Kamado is a kindhearted boy who makes a living selling charcoal. But his peaceful life is shattered when a demon slaughters his entire family. His little sister Nezuko is the only survivor, but she has been transformed into a demon herself! Tanjiro sets out on a dangerous journey to find a way to return his sister to normal and destroy the demon who ruined his life.\n\nAs Tanjiro and Nezuko encounter both demons and demon slayers on their journey, they not only learn more about the demons' powers and origins but also about the ancient history of the demon slayer corps. Together with his comrades, Tanjiro faces increasingly challenging battles against powerful demons, all while trying to find a cure for Nezuko.",
    genres: ["Action", "Adventure", "Fantasy", "Supernatural", "Drama"],
    chapters: [
      { 
        number: 205,
        title: "The Final Battle",
        releaseDate: "2020-05-17",
        views: 1500000,
        comments: [
          {
            user: "MangaExpert",
            avatar: "/api/placeholder/40/40",
            comment: "The way Muzan's backstory was revealed was masterful. It added so much depth to the final confrontation.",
            likes: 342
          },
          {
            user: "DemonSlayerFan",
            avatar: "/api/placeholder/40/40",
            comment: "Tanjiro's character development throughout the series really shines in this chapter. The artwork is absolutely stunning!",
            likes: 289
          }
        ]
      },
      { 
        number: 204,
        title: "Towards Tomorrow",
        releaseDate: "2020-05-10",
        views: 1450000,
        comments: [
          {
            user: "ArtCritic",
            avatar: "/api/placeholder/40/40",
            comment: "The emotional weight of this chapter is incredible. Every panel feels meaningful.",
            likes: 276
          }
        ]
      }
    ],
    reviews: [
      {
        user: "MangaScholar",
        avatar: "/api/placeholder/40/40",
        rating: 5,
        comment: "Demon Slayer is a masterpiece that combines stunning visuals with deep emotional storytelling. The character development is exceptional, and the way the story balances intense action sequences with moments of humor and heart is truly remarkable. The art style is unique and beautiful, particularly in the breathing technique animations. While the pacing can be a bit fast at times, it never detracts from the overall experience. A must-read for any manga fan.",
        likes: 1205,
        date: "2023-12-15"
      },
      {
        user: "CriticalReader",
        avatar: "/api/placeholder/40/40",
        rating: 4,
        comment: "An excellent series that breathes new life into the shounen genre. The art is consistently gorgeous, and the fight scenes are among the best I've seen. The protagonist's journey is compelling, though some side characters could use more development. The series sometimes relies on common tropes, but it executes them well. The emotional core of the story - the bond between siblings - resonates throughout and gives weight to every battle.",
        likes: 892,
        date: "2023-11-30"
      }
    ],
    recommendations: [
      {
        id: 101,
        title: "Jujutsu Kaisen",
        cover: "/api/placeholder/200/300",
        similarity: "Similar supernatural themes and exceptional fight scenes",
        rating: 4.7
      },
      {
        id: 102,
        title: "Chainsaw Man",
        cover: "/api/placeholder/200/300",
        similarity: "Dark fantasy with unique art style and compelling characters",
        rating: 4.8
      }
    ],
  };

  return (
    <div className={`min-h-screen ${
      theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'
    }`}>
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row gap-8">
          <div className="md:w-1/3">
            <img 
              src={manga.cover} 
              alt={manga.title}
              className="w-full rounded-lg shadow-lg"
            />
            <div className="mt-4 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Star className="w-5 h-5 text-yellow-400 mr-2" />
                  <span className="font-semibold">{manga.rating}</span>
                </div>
                <Button asChild>
                  <Link href={`/manga/${manga.id}/chapter/${manga.chapters[0].number}`}>
                    Start Reading
                  </Link>
                </Button>
              </div>
              <div className="flex items-center text-sm text-gray-500">
                <Calendar className="w-4 h-4 mr-2" />
                <span>{manga.releaseYear}</span>
              </div>
              <div className="flex items-center text-sm text-gray-500">
                <MessageSquare className="w-4 h-4 mr-2" />
                <span>{manga.status}</span>
              </div>
            </div>
            <div className="mt-4">
              <h3 className="font-semibold mb-2">Genres</h3>
              <div className="flex flex-wrap gap-2">
                {manga.genres.map(genre => (
                  <span key={genre} className="px-3 py-1 bg-blue-500 text-white rounded-full text-sm">
                    {genre}
                  </span>
                ))}
              </div>
            </div>
          </div>
          
          <div className="md:w-2/3">
            <h1 className="text-4xl font-bold mb-2">{manga.title}</h1>
            <p className="text-gray-500 mb-6">by {manga.author}</p>
            
            <Tabs defaultValue="description" className="w-full">
              <TabsList>
                <TabsTrigger value="description">Description</TabsTrigger>
                <TabsTrigger value="chapters">Chapters</TabsTrigger>
                <TabsTrigger value="reviews">Reviews</TabsTrigger>
              </TabsList>
              
              <TabsContent value="description" className="mt-4">
                <p className="text-lg leading-relaxed whitespace-pre-line">
                  {manga.description}
                </p>
              </TabsContent>
              
              <TabsContent value="chapters" className="mt-4">
                <div className="space-y-4">
                  {manga.chapters.map(chapter => (
                    <Link 
                      key={chapter.number}
                      href={`/manga/${manga.id}/chapter/${chapter.number}`}
                      className={`block p-4 rounded-lg transition-colors ${
                        theme === 'dark' 
                          ? 'hover:bg-gray-800' 
                          : 'hover:bg-gray-100'
                      }`}
                    >
                      <div className="flex justify-between items-center">
                        <div>
                          <h3 className="text-xl font-semibold">Chapter {chapter.number}: {chapter.title}</h3>
                          <div className="flex items-center mt-2 space-x-4 text-sm text-gray-500">
                            <div className="flex items-center">
                              <Eye className="w-4 h-4 mr-1" />
                              <span>{(chapter.views / 1000000).toFixed(1)}M</span>
                            </div>
                            <div className="flex items-center">
                              <Clock className="w-4 h-4 mr-1" />
                              <span>{chapter.releaseDate}</span>
                            </div>
                            <div className="flex items-center">
                              <MessageSquare className="w-4 h-4 mr-1" />
                              <span>{chapter.comments.length} comments</span>
                            </div>
                          </div>
                        </div>
                        <ChevronRight className="w-6 h-6 text-gray-400" />
                      </div>
                    </Link>
                  ))}
                </div>
              </TabsContent>
              
              <TabsContent value="reviews" className="mt-4">
                {/* ... (keep existing reviews content) ... */}
              </TabsContent>
            </Tabs>
          </div>
        </div>
        
        <div className="mt-12">
          <h2 className="text-2xl font-bold mb-6">You might also like</h2>
          <divd className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {manga.recommendations.map(rec => (
              <Link 
                key={rec.id}
                href={`/manga/${rec.id}`}
                className="group"
              >
                <div className="relative overflow-hidden rounded-lg">
                  <img 
                    src={rec.cover} 
                    alt={rec.title}
                    className="w-full h-[300px] object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                    <h3 className="text-white font-semibold mb-1">{rec.title}</h3>
                    <div className="flex items-center text-sm text-gray-300 mb-2">
                      <Star className="w-4 h-4 text-yellow-400 mr-1" />
                      <span>{rec.rating}</span>
                    </div>
                    <p className="text-sm text-gray-300">{rec.similarity}</p>
                  </div>
                </div>
              </Link>
            ))}
          </divd
        </div>
      </div>
    </div>
  );
}