export type Language = 'en' | 'th';
export type Theme = 'light' | 'dark' | 'system';
export type FontSize = 'small' | 'medium' | 'large';

export interface MangaItem {
  id: number;
  title: string;
  cover: string;
  rating: number;
  chapter: number;
  views: string;
}

export interface FeaturedManga {
  title: string;
  description: string;
  cover: string;
  rating: number;
  genres: string[];
}

export interface TranslationKeys {
  // Hero Section
  discover: string;
  searchPlaceholder: string;
  browseAll: string;
  
  // Featured Section
  featured: string;
  readNow: string;
  chapter: string;
  views: string;
  
  // Manga List
  browseManga: string;
  popular: string;
  latest: string;
  topStories: string;
  viewAll: string;
}