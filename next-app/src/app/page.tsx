'use client'
import { useState, useEffect } from "react";
import Link from "next/link";
import { Search, Star, TrendingUp, Clock } from "lucide-react";

export default function Home() {
  const [activeTab, setActiveTab] = useState('popular');
  
  const featuredManga = {
    title: "Attack on Titan",
    description: "In a world where humanity lives inside cities surrounded by enormous walls due to the Titans, giant humanoid creatures who devour humans seemingly without reason...",
    cover: "/api/placeholder/500/700",
    rating: 4.8,
    genres: ["Action", "Drama", "Fantasy"]
  };

  const mangaList = [
    { 
      id: 1, 
      title: "One Piece", 
      cover: "/api/placeholder/300/400",
      rating: 4.9,
      chapter: 1089,
      views: "1.2M"
    },
    { 
      id: 2, 
      title: "Jujutsu Kaisen", 
      cover: "/api/placeholder/300/400",
      rating: 4.7,
      chapter: 235,
      views: "890K"
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="relative h-[500px] bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="absolute inset-0 bg-black/40" />
        <div className="relative container mx-auto px-4 py-20 flex flex-col justify-center h-full text-white">
          <h1 className="text-5xl font-bold mb-4">Discover Amazing Manga</h1>
          <p className="text-xl mb-8 max-w-2xl">Read your favorite manga online with our extensive collection of titles across various genres.</p>
          <div className="flex gap-4 max-w-2xl">
            <div className="flex-1 relative">
              <input 
                type="text" 
                placeholder="Search for manga..." 
                className="w-full px-6 py-3 rounded-full text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
              <Search className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
            </div>
            <button className="px-8 py-3 bg-blue-500 rounded-full hover:bg-blue-600 transition-colors">
              Browse All
            </button>
          </div>
        </div>
      </div>

      {/* Featured Manga */}
      <div className="container mx-auto px-4 -mt-20">
        <div className="bg-white rounded-xl shadow-xl p-6 flex gap-8">
          <img 
            src={featuredManga.cover} 
            alt={featuredManga.title}
            className="w-48 h-72 object-cover rounded-lg shadow-lg"
          />
          <div className="flex flex-col justify-center">
            <div className="flex items-center gap-4 mb-2">
              <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm font-medium">
                Featured
              </span>
              <div className="flex items-center gap-1">
                <Star className="w-5 h-5 fill-yellow-400 stroke-yellow-400" />
                <span className="font-medium">{featuredManga.rating}</span>
              </div>
            </div>
            <h2 className="text-3xl font-bold mb-3">{featuredManga.title}</h2>
            <p className="text-gray-600 mb-4 max-w-2xl">{featuredManga.description}</p>
            <div className="flex gap-2 mb-6">
              {featuredManga.genres.map((genre) => (
                <span key={genre} className="px-3 py-1 bg-gray-100 rounded-full text-sm">
                  {genre}
                </span>
              ))}
            </div>
            <Link 
              href={`/manga/${featuredManga.title.toLowerCase().replace(/ /g, '-')}`}
              className="self-start px-6 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors"
            >
              Read Now
            </Link>
          </div>
        </div>
      </div>

      {/* Manga List Section */}
      <div className="container mx-auto px-4 py-12">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold">Browse Manga</h2>
          <div className="flex gap-4">
            <button 
              onClick={() => setActiveTab('popular')}
              className={`flex items-center gap-2 px-4 py-2 rounded-full ${
                activeTab === 'popular' ? 'bg-blue-500 text-white' : 'bg-gray-100'
              }`}
            >
              <TrendingUp className="w-4 h-4" />
              Popular
            </button>
            <button 
              onClick={() => setActiveTab('latest')}
              className={`flex items-center gap-2 px-4 py-2 rounded-full ${
                activeTab === 'latest' ? 'bg-blue-500 text-white' : 'bg-gray-100'
              }`}
            >
              <Clock className="w-4 h-4" />
              Latest
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {mangaList.map((manga) => (
            <Link 
              key={manga.id} 
              href={`/manga/${manga.id}`}
              className="group"
            >
              <div className="relative overflow-hidden rounded-lg shadow-lg">
                <img 
                  src={manga.cover} 
                  alt={manga.title}
                  className="w-full h-[300px] object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                  <h3 className="text-white font-semibold mb-1">{manga.title}</h3>
                  <div className="flex items-center justify-between text-sm text-gray-300">
                    <span>Ch. {manga.chapter}</span>
                    <span>{manga.views} views</span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}