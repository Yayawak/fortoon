"use client";

import React, { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { Search, Star, TrendingUp, Clock, MapPin } from "lucide-react";
import { useSettings } from "@/contexts/SettingsContext";
import Slider from "react-slick";
import { CldImage } from "next-cloudinary";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { motion, AnimatePresence } from "framer-motion";

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
  rating?: number;
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
    },
  },
};

const fadeInVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.6 },
  },
};

export default function Home() {
  const { t, theme } = useSettings();
  const [activeTab, setActiveTab] = useState("popular");
  const [mangaList, setMangaList] = useState<MangaItem[]>([]);
  const [topMangaList, setTopMangaList] = useState<MangaItem[]>([]);
  const [filteredMangaList, setFilteredMangaList] = useState<MangaItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const fetchMangaList = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/story");
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const responseData = await response.json();
      console.log("API Response:", responseData);

      if (responseData && Array.isArray(responseData.data)) {
        const allManga = responseData.data;

        // Set regular manga list
        setMangaList(allManga);
        setFilteredMangaList(allManga);

        // Process top manga (for example, taking the first 5 with highest chapters count)
        const topManga = [...allManga]
          .sort((a, b) => {
            const dateA = new Date(a.postedDatetime).getTime();
            const dateB = new Date(b.postedDatetime).getTime();
            return dateB - dateA;
          })
          .slice(0, 5)
          .map((manga) => ({
            ...manga,
            rating: (4.5 + Math.random() * 0.4).toFixed(1), // Add random rating between 4.5-4.9
          }));

        setTopMangaList(topManga);
      } else {
        console.error("Unexpected data format:", responseData);
        throw new Error("Invalid data format");
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
    console.log(mangaList[0]?.coverImageUrl);
  }, [mangaList]);

  console.log("Rendering component. mangaList:", mangaList);

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newSearchTerm = event.target.value.toLowerCase();
    setSearchTerm(newSearchTerm);

    if (newSearchTerm === "") {
      setFilteredMangaList(mangaList);
    } else {
      const filtered = mangaList.filter(
        (manga) => manga.title.toLowerCase().includes(newSearchTerm)
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
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 5000,
    arrows: true,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 640,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };

  const mobileNavVariants = {
    hidden: { y: -100, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 100 },
    },
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
    });
  };

  return (
    <AnimatePresence>
      <motion.div
        initial="hidden"
        animate="visible"
        exit="hidden"
        className={`min-h-screen ${
          theme === "dark"
            ? "dark bg-gray-900 text-white"
            : "bg-gray-100 text-gray-900"
        }`}
      >
        {/* Hero Section with Enhanced Animations */}
        <section className="h-screen w-full bg-gradient-to-b from-blue-900 to-gray-900 flex items-center justify-center">
          <div className="container mx-auto px-4 py-8 lg:py-16 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-8 lg:mb-12"
            >
              <h2 className="text-3xl lg:text-4xl font-bold text-white">
                การ์ตูนยอดนิยม
              </h2>
            </motion.div>

            <div className="relative px-4 lg:px-8">
              <Slider {...sliderSettings} className="featured-manga-slider">
                {topMangaList.map((manga) => (
                  <motion.div
                    key={manga.sId}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="p-2 lg:p-4"
                  >
                    <div className="bg-gray-800 rounded-lg overflow-hidden shadow-2xl hover:scale-105 transition-transform duration-300">
                      <div className="relative aspect-[10/11] w-full">
                        <CldImage
                          src={manga.coverImageUrl}
                          alt={manga.title}
                          fill
                          className="object-cover transition-transform duration-300"
                        />
                        <div className="absolute inset-0 flex flex-col justify-between p-4">
                          <div className="flex items-center justify-between bg-gradient-to-b from-black/70 to-transparent p-2 rounded-t-lg">
                            <div className="flex items-center bg-yellow-500 rounded-full px-2 py-1">
                              <Star className="w-4 h-4 text-white" />
                              <span className="text-white ml-1 font-bold">
                                {manga.rating}
                              </span>
                            </div>
                            <span className="text-white bg-blue-600 rounded-full px-3 py-1 text-sm">
                              {formatDate(manga.postedDatetime)}
                            </span>
                          </div>

                          <div className="bg-gradient-to-t from-black/90 to-transparent p-4 rounded-b-lg">
                            <h3 className="text-white font-bold text-lg lg:text-xl mb-2 line-clamp-2">
                              {manga.title}
                            </h3>
                            <p className="text-gray-200 text-sm line-clamp-3 mb-4">
                              {manga.introduction}
                            </p>
                            <Link href={`/manga/${manga.sId}`}>
                              <button className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-300">
                                Read Now
                              </button>
                            </Link>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </Slider>
            </div>
          </div>
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
                  placeholder={t("searchPlaceholder")}
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
                        <div
                          className={`bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden transform transition-all duration-300`}
                        >
                          <div className="relative h-48 md:h-64">
                            <CldImage
                              src={manga.coverImageUrl}
                              alt={manga.title}
                              fill
                              style={{ objectFit: "cover" }}
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
                                <span>
                                  {new Date(
                                    manga.postedDatetime
                                  ).toLocaleDateString()}
                                </span>
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
