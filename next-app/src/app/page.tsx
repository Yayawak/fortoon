'use client';

import React, { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { Search, Star, TrendingUp, Clock ,MapPin} from "lucide-react";
import { useSettings } from "@/contexts/SettingsContext";
import { MangaItem, TopManga } from "@/lib/types";
import Slider from "react-slick";
import { CldImage } from 'next-cloudinary';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { motion, AnimatePresence } from 'framer-motion';

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
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5
      }
    }
  };
  
  const fadeInVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { duration: 0.6 }
    }
  };

export default function Home() {
  const { t, theme } = useSettings();
  const [activeTab, setActiveTab] = useState('popular');
  const [mangaList, setMangaList] = useState<MangaItem[]>([]);
  const [filteredMangaList, setFilteredMangaList] = useState<MangaItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

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

  const mobileNavVariants = {
    hidden: { y: -100, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { type: "spring", stiffness: 100 }
    }
  };

  return (
    <AnimatePresence>
      <motion.div 
        initial="hidden"
        animate="visible"
        exit="hidden"
        className={`min-h-screen ${theme === 'dark' ? 'dark bg-gray-900 text-white' : 'bg-gray-100 text-gray-900'}`}
      >
        {/* Hero Section with Enhanced Animations */}
        <section className="relative h-screen">
          <Slider {...sliderSettings}>
            {topManga.map((manga) => (
              <div key={manga.id} className="relative h-screen">
                <motion.div
                  initial={{ opacity: 0, scale: 1.1 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 1.2 }}
                  className="absolute inset-0"
                >
                  <CldImage 
                    src={manga.cover}
                    alt={manga.title}
                    fill
                    style={{objectFit: "cover"}}
                    className="opacity-70"
                  />
                </motion.div>
                <motion.div 
                  variants={fadeInVariants}
                  className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" 
                />
                <div className="absolute inset-0 flex flex-col items-center justify-center text-white p-8">
                  <motion.h1
                    initial={{ y: -50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="text-4xl md:text-6xl font-bold mb-4 text-center"
                  >
                    {manga.title}
                  </motion.h1>
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                    className="flex items-center mb-4"
                  >
                    <Star className="w-6 h-6 text-yellow-400 mr-2" />
                    <span className="text-xl">{manga.rating}</span>
                  </motion.div>
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.8, delay: 0.6 }}
                    className="text-base md:text-xl mb-8 max-w-2xl text-center"
                  >
                    {manga.description}
                  </motion.p>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="bg-blue-500 text-white px-6 md:px-8 py-3 rounded-full text-lg font-semibold hover:bg-blue-600 transition-colors duration-300"
                  >
                    Explore Now
                  </motion.button>
                </div>
              </div>
            ))}
          </Slider>
        </section>

        {/* Search Section with Animation */}
        <motion.section 
          variants={fadeInVariants}
          className="bg-blue-600 py-12 md:py-16"
        >
          <div className="container mx-auto px-4">
            <div className="max-w-2xl mx-auto">
              <motion.h2 
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.6 }}
                className="text-2xl md:text-3xl font-bold text-white mb-8 text-center"
              >
                Discover Your Next Manga Adventure
              </motion.h2>
              <motion.div 
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.6 }}
                className="relative"
              >
                <input 
                  type="text" 
                  placeholder={t('searchPlaceholder')}
                  value={searchTerm}
                  onChange={handleSearch}
                  className="w-full px-4 md:px-6 py-3 md:py-4 rounded-full bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
                <Search className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
              </motion.div>
            </div>
          </div>
        </motion.section>

        {/* Manga List Section with Grid Animation */}
        <motion.section 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="py-12 md:py-20 px-4"
        >
          <div className="container mx-auto">
            <motion.h2 
              variants={itemVariants}
              className="text-3xl md:text-4xl font-bold mb-8 md:mb-12 text-center"
            >
              Explore Manga Worlds
            </motion.h2>
            
            {isLoading ? (
              <motion.div 
                variants={fadeInVariants}
                className="text-center py-8"
              >
                Loading...
              </motion.div>
            ) : error ? (
              <motion.div 
                variants={fadeInVariants}
                className="text-center py-8 text-red-500"
              >
                {error}
              </motion.div>
            ) : (
              <motion.div 
                variants={containerVariants}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8"
              >
                <AnimatePresence>
                  {filteredMangaList.map((manga) => (
                    <motion.div
                      key={manga.sId}
                      variants={itemVariants}
                      layout
                      whileHover={{ y: -5 }}
                    >
                      <Link href={`/manga/${manga.sId}`}>
                        <div className={`bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden transform transition-all duration-300`}>
                          <div className="relative h-48 md:h-64">
                            <CldImage 
                              src={manga.coverImageUrl}
                              alt={manga.title}
                              fill
                              style={{objectFit: "cover"}}
                              className="transition-transform duration-300 hover:scale-105"
                            />
                          </div>
                          <div className="p-4 md:p-6">
                            <h3 className="text-xl md:text-2xl font-semibold mb-2 dark:text-white">
                              {manga.title}
                            </h3>
                            <p className="text-gray-600 dark:text-gray-300 text-sm md:text-base mb-4">
                              {manga.introduction.slice(0, 100)}...
                            </p>
                            <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
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
                        </div>
                      </Link>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </motion.div>
            )}
          </div>
        </motion.section>

        {/* Call to Action with Animation */}
        <motion.section 
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="bg-blue-600 text-white py-16 md:py-20 px-4"
        >
          <div className="container mx-auto text-center">
            <motion.h2 
              initial={{ y: -20, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              viewport={{ once: true }}
              className="text-3xl md:text-4xl font-bold mb-4"
            >
              Ready to Start Your Manga Journey?
            </motion.h2>
            <motion.p 
              initial={{ y: -20, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
              viewport={{ once: true }}
              className="text-lg md:text-xl mb-8"
            >
              Join our community and explore countless manga worlds!
            </motion.p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-white text-blue-600 px-6 md:px-8 py-3 rounded-full text-lg font-semibold hover:bg-blue-100 transition-colors duration-300"
            >
              Sign Up Now
            </motion.button>
          </div>
        </motion.section>

        {/* Footer with Animation */}
        <motion.footer 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="bg-gray-800 text-white py-6 md:py-8 px-4"
        >
          <div className="container mx-auto text-center">
            <p>&copy; 2024 Manga Journey Quest. All rights reserved.</p>
          </div>
        </motion.footer>
      </motion.div>
    </AnimatePresence>
  );
}