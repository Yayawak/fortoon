'use client';

import React, { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { Search, Star, TrendingUp, Clock, MapPin } from "lucide-react";
import { useSettings } from "@/contexts/SettingsContext";
import { MangaItem, TopManga } from "@/lib/types";
import Slider from "react-slick";
import { CldImage } from 'next-cloudinary';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { motion } from 'framer-motion';

type MangaItem = {
  sId: number;
  title: string;
  coverImageUrl: string;
  introduction: string;
  postedDatetime: string;
  chapters: Array<number>;
  genres: Array<string>;

  authorId: number;
  authorDisplayName: string;
};

export default function Home() {
  const { t, theme } = useSettings();
  const [activeTab, setActiveTab] = useState('popular');
  const [mangaList, setMangaList] = useState<MangaItem[]>([]);
  const [filteredMangaList, setFilteredMangaList] = useState<MangaItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const topManga: TopManga[] = [
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

  // const mangaList: MangaItem[] = [
  //   { 
  //     id: 1, 
  //     title: "One Piece", 
  //     cover: "/api/placeholder/300/400",
  //     rating: 4.9,
  //     chapter: 1089,
  //     views: "1.2M"
  //   },
  //   { 
  //     id: 2, 
  //     title: "Jujutsu Kaisen", 
  //     cover: "/api/placeholder/300/400",
  //     rating: 4.7,
  //     chapter: 235,
  //     views: "890K"
  //   },
  // ];

  const fetchMangaList = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/story");
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const responseData = await response.json();
      console.log("API Response:", responseData);

      if (responseData && Array.isArray(responseData.data)) {
        setMangaList(responseData.data);
        setFilteredMangaList(responseData.data);
      } else if (Array.isArray(responseData)) {
        setMangaList(responseData);
        setFilteredMangaList(responseData);
      } else {
        console.error("Unexpected data format:", responseData);
        throw new Error('Invalid data format');
      }
      setError(null);
    } catch (error) {
      console.error("There was a problem fetching the manga list:", error);
      setError("Failed to load manga list. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMangaList();
  }, [fetchMangaList]);

  useEffect(() => {
    console.log("mangaList has been updated:", mangaList);
  }, [mangaList]);

  console.log("Rendering component. mangaList:", mangaList);

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newSearchTerm = event.target.value.toLowerCase();
    setSearchTerm(newSearchTerm);

    if (newSearchTerm === '') {
      setFilteredMangaList(mangaList);
    } else {
      const filtered = mangaList.filter(manga =>
        manga.title.toLowerCase().includes(newSearchTerm)
        // || 
        // manga.authorDisplayName.toLowerCase().includes(newSearchTerm)
      );
      setFilteredMangaList(filtered);
    }
  };

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
    <div className={`min-h-screen bg-gray-100 text-gray-900 ${theme === 'dark' ? 'dark' : ''}`}>
      {/* Hero Section with Slider */}

      <section className="relative h-screen">
        <Slider {...sliderSettings}>
          {topManga.map((manga) => (
            <div key={manga.id} className="relative h-screen">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1 }}
                className="absolute inset-0"
              >
                <CldImage
                  src={manga.cover}
                  alt={manga.title}
                  fill
                  style={{ objectFit: "cover" }}
                  className="opacity-70"
                />
              </motion.div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
              <div className="absolute inset-0 flex flex-col items-center justify-center text-white p-8">
                <motion.h1
                  initial={{ y: -50, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.8 }}
                  className="text-6xl font-bold mb-4 text-center"
                >
                  {manga.title}
                </motion.h1>
                <motion.div
                  initial={{ y: 50, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                  className="flex items-center mb-4"
                >
                  <Star className="w-6 h-6 text-yellow-400 mr-2" />
                  <span className="text-xl">{manga.rating}</span>
                </motion.div>
                <motion.p
                  initial={{ y: 50, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.8, delay: 0.4 }}
                  className="text-xl mb-8 max-w-2xl text-center"
                >
                  {manga.description}
                </motion.p>
                <motion.button
                  initial={{ y: 50, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.8, delay: 0.6 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-blue-500 text-white px-8 py-3 rounded-full text-lg font-semibold hover:bg-blue-600 transition-colors duration-300"
                >
                  Explore Now
                </motion.button>
              </div>
            </div>
          ))}
        </Slider>
      </section>

      {/* Search Section */}
      <section className="bg-blue-600 py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-3xl font-bold text-white mb-8 text-center">Discover Your Next Manga Adventure</h2>
            <div className="relative">
              <input
                type="text"
                placeholder={t('searchPlaceholder')}
                value={searchTerm}
                onChange={handleSearch}
                className="w-full px-6 py-4 rounded-full bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
              <Search className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
            </div>
          </div>
        </div>
      </section>

      {/* Manga List Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <h2 className="text-4xl font-bold mb-12 text-center">Explore Manga Worlds</h2>
          {isLoading ? (
            <div className="text-center py-8">Loading...</div>
          ) : error ? (
            <div className="text-center py-8 text-red-500">{error}</div>
          ) : filteredMangaList.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredMangaList.map((manga) => (
                <Link
                  key={manga.sId}
                  href={`/manga/${manga.sId}`}
                  className="group"
                >
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="bg-white rounded-lg shadow-lg overflow-hidden"
                  >
                    <div className="relative h-64">
                      <CldImage
                        src={manga.coverImageUrl}
                        alt={manga.title}
                        fill
                        style={{ objectFit: "cover" }}
                        className="group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <div className="p-6">
                      <h3 className="text-2xl font-semibold mb-2">{manga.title}</h3>
                      <p className="text-gray-600 mb-4">{manga.introduction.slice(0, 100)}...</p>
                      <div className="flex items-center justify-between text-sm text-gray-500">
                        <div className="flex items-center">
                          <MapPin className="w-4 h-4 mr-1" />
                          <span>{manga.authorDisplayName}</span>
                        </div>
                        <div className="flex items-center">
                          <Clock className="w-4 h-4 mr-1" />
                          <span>{new Date(manga.postedDatetime).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              {searchTerm ? "No manga found matching your search." : "No manga available."}
            </div>
          )}
        </div>
      </section>

      {/* Call to Action */}
      <section className="bg-blue-600 text-white py-20 px-4">
        <div className="container mx-auto text-center">
          <h2 className="text-4xl font-bold mb-4">Ready to Start Your Manga Journey?</h2>
          <p className="text-xl mb-8">Join our community and explore countless manga worlds!</p>
          <button className="bg-white text-blue-600 px-8 py-3 rounded-full text-lg font-semibold hover:bg-blue-100 transition-colors duration-300">
            Sign Up Now
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8 px-4">
        <div className="container mx-auto text-center">
          <p>&copy; 2024 Manga Journey Quest. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}