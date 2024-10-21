import { translations } from '@/lib/translations';

export type Language = 'en' | 'th';
export type Theme = 'light' | 'dark' ;
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

export interface User {
  uId: number;
  username: string;
  credit: number;
  age: number;
  
}

export interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  loginSuccess: boolean;
  signIn: (username: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}

export interface SettingsContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  theme: Theme;
  setTheme: (theme: Theme) => void;
  fontSize: FontSize;
  setFontSize: (size: FontSize) => void;
  t: (key: keyof typeof translations.en) => string;
}

export interface FormData {
  username: string;
  password: string;
  displayName: string;
  sex: string;
  email: string;
  profilePic: File | null;
  age: string;
}

export interface FormErrors {
  [key: string]: string;
}

export interface Post {
  id: string;
  title: string;
  content: string;
  author: string;
  createdAt: string;
  image?: string;
}