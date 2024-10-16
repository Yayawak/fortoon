'use client';

import { useState } from "react";
import Link from "next/link";
import { Search, Star, TrendingUp, Clock } from "lucide-react";
import { useSettings } from "@/contexts/SettingsContext";
import Slider from "react-slick";

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { CldImage } from "next-cloudinary";


export default function Home() {
  const { t, theme } = useSettings();
  const [activeTab, setActiveTab] = useState('popular');
  
  const topManga: any[] = [
    {
      id: 1,
      title: "Attack on Titan",
      cover: "/api/placeholder/1200/600",
      rating: 4.8,
      description: "In a world where humanity lives inside cities surrounded by enormous walls due to the Titans, giant humanoid creatures who devour humans seemingly without reason...",
    },
    {
      id: 2,
      title: "One Piece",
      cover: "/api/placeholder/1200/600",
      rating: 4.9,
      description: "Follow Monkey D. Luffy and his swashbuckling crew in their search for the ultimate treasure, One Piece.",
    },
    {
      id: 3,
      title: "Demon Slayer",
      cover: "/api/placeholder/1200/600",
      rating: 4.7,
      description: "Tanjiro Kamado, a young boy who becomes a demon slayer after his family is slaughtered and his younger sister Nezuko is turned into a demon.",
    },
    {
      id: 4,
      title: "My Hero Academia",
      cover: "/api/placeholder/1200/600",
      rating: 4.6,
      description: "In a world where people with superpowers known as 'Quirks' are the norm, Izuku Midoriya has dreams of one day becoming a Hero, despite being bullied for not having a Quirk.",
    },
    {
      id: 5,
      title: "Jujutsu Kaisen",
      cover: "/api/placeholder/1200/600",
      rating: 4.8,
      description: "Yuji Itadori, a high schooler who joins a secret organization of Jujutsu Sorcerers in order to kill a powerful Curse named Ryomen Sukuna, of whom Yuji becomes the host.",
    },
  ];

  const mangaList: any[] = [
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

  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 5000,
    arrows: true,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        }
      }
    ]
  };

  return (
    <div className={`min-h-screen ${
      theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'
    }`}>
      {/* Hero Section with Slider */}
      <div className="relative h-[600px]">
        <Slider {...sliderSettings}>
          {topManga.map((manga) => (
            <div key={manga.id}>
              <div className="relative h-[600px]">
                <img
                  src={manga.cover}
                  alt={manga.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-8">
                  <div className="container mx-auto">
                    <h2 className="text-4xl font-bold text-white mb-4">{manga.title}</h2>
                    <div className="flex items-center text-white mb-4">
                      <Star className="w-5 h-5 fill-yellow-400 stroke-yellow-400 mr-2" />
                      <span className="text-lg">{manga.rating}</span>
                    </div>
                    <p className="text-gray-200 text-lg max-w-2xl">{manga.description}</p>
                    <button className="mt-6 px-6 py-3 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors">
                      Read Now
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </Slider>
      </div>

      {/* Search Section */}
      <div className="container mx-auto px-4 py-8">
        <div className="flex gap-4 max-w-2xl mx-auto">
          <div className="flex-1 relative">
            <input 
              type="text" 
              placeholder={t('searchPlaceholder')}
              className={`w-full px-6 py-3 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-400 ${
                theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'
              }`}
            />
            <Search className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>
          <button className="px-8 py-3 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors">
            {t('browseAll')}
          </button>
        </div>
      </div>

      {/* Manga List Section */}
      <div className="container mx-auto px-4 py-12">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold">{t('browseManga')}</h2>
          <div className="flex gap-4">
            <button
              onClick={() => setActiveTab('popular')}
              className={`flex items-center gap-2 px-4 py-2 rounded-full ${
                activeTab === 'popular' 
                  ? 'bg-blue-500 text-white' 
                  : theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'
              }`}
            >
              <TrendingUp className="w-4 h-4" />
              {t('popular')}
            </button>
            <button
              onClick={() => setActiveTab('latest')}
              className={`flex items-center gap-2 px-4 py-2 rounded-full ${
                activeTab === 'latest' 
                  ? 'bg-blue-500 text-white' 
                  : theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'
              }`}
            >
              <Clock className="w-4 h-4" />
              {t('latest')}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {mangaList.map((manga) => (
            <Link
              key={manga.id}
              href={`/manga/${manga.id}`}
              className="group"
            >
              <div className="relative overflow-hidden rounded-lg shadow-lg">
                <div
                  // src={manga.cover}
                  // alt={manga.title}
                  className="w-full h-[300px] object-cover group-hover:scale-105 transition-transform duration-300"
                >
                  <CldImage
                    src="wn70o4bjjurvs6fwftnm" // Use this sample image or upload your own via the Media Explorer
                    width="500" // Transform the image: auto-crop to square aspect_ratio
                    height="500"
                    alt="555"
                    crop={{
                      type: 'auto',
                      source: true
                    }}
                  />
                </div>
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                  <h3 className="text-white font-semibold">{manga.title}</h3>
                  <div className="flex items-center text-sm text-gray-300">
                    <Star className="w-4 h-4 fill-yellow-400 stroke-yellow-400 mr-1" />
                    <span>{manga.rating}</span>
                    <span className="ml-auto">{manga.views}</span>
                  </div>
                  <div className="text-gray-400 text-xs">
                    {t('chapter')} {manga.chapter}
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
