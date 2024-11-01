'use client';
import { useState, useCallback, useEffect } from 'react';
import Link from 'next/link';
import { Settings, User, Mail, Phone, MapPin, Github, Twitter, Linkedin, PlusCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { useAuth } from '@/contexts/AuthContext';
import { useSettings } from '@/contexts/SettingsContext';
import { CldImage } from 'next-cloudinary';

// Update the UserManga type to match the response
type UserManga = {
  sId: number;
  title: string;
  introduction: string;
  postedDatetime: string;
  authorId: number;
  coverImageUrl: string;
  chapters: {
    name: string;
    cId: number;
    storyId: number;
    chapterSequence: number;
    price: number;
  }[];
  genres: {
    gId: number;
    genreName: string;
  }[];
};

export default function Profile() {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [showManga, setShowManga] = useState(false);
  const { theme } = useSettings();
  const [userManga, setUserManga] = useState<UserManga[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Update the fetch function to filter by authorId
  const fetchUserManga = useCallback(async () => {
    if (!user?.uId) return;
    
    try {
      const response = await fetch(`/api/story`);
      if (!response.ok) throw new Error('Failed to fetch manga');
      const data = await response.json();
      // Filter manga by authorId matching user.uId
      const userMangaList = data.data.filter((manga: UserManga) => 
        manga.authorId === user.uId
      );
      setUserManga(userMangaList);
    } catch (error) {
      console.error('Error fetching user manga:', error);
    } finally {
      setIsLoading(false);
    }
  }, [user?.uId]);

  // Add useEffect to fetch manga
  useEffect(() => {
    fetchUserManga();
  }, [fetchUserManga]);

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <div className="max-w-4xl mx-auto p-4">
        <Card className={`w-full overflow-hidden ${
          theme === 'dark' 
            ? 'bg-gradient-to-br from-purple-900 via-pink-900 to-red-900' 
            : 'bg-gradient-to-br from-purple-400 via-pink-500 to-red-500'
        }`}>
          <CardHeader className="flex flex-col md:flex-row items-center justify-between p-6">
            <div className="flex flex-col md:flex-row items-center md:space-x-6 text-white">
              <div className="w-32 h-32 rounded-full bg-white p-1 mb-4 md:mb-0">
                <div className="w-full h-full rounded-full bg-gradient-to-br from-yellow-400 via-red-500 to-pink-500 flex items-center justify-center">
                  <User size={64} className="text-white" />
                </div>
              </div>
              <div className="text-center md:text-left">
                <h2 className="text-3xl font-bold">{user?.displayName || 'Anonymous'}</h2>
                <p className="text-xl">Software Developer & Manga Artist</p>
                <div className="flex justify-center md:justify-start space-x-4 mt-4">
                  <Link href="#"><Github className="hover:text-yellow-300 transition-colors" /></Link>
                  <Link href="#"><Twitter className="hover:text-blue-400 transition-colors" /></Link>
                  <Link href="#"><Linkedin className="hover:text-blue-700 transition-colors" /></Link>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-2 mt-4 md:mt-0">
              <Link href="/settings">
                <Button variant="secondary" size="sm" className="bg-white text-purple-600 hover:bg-purple-100">
                  Edit Profile
                </Button>
              </Link>
              <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline" size="icon" className="bg-white text-purple-600 hover:bg-purple-100">
                    <Settings className="h-4 w-4" />
                  </Button>
                </DialogTrigger>
                <DialogContent className={`${
                  theme === 'dark' 
                    ? 'bg-gradient-to-br from-purple-900 to-pink-900' 
                    : 'bg-gradient-to-br from-purple-100 to-pink-100'
                }`}>
                  <DialogHeader>
                    <DialogTitle className="text-2xl font-bold text-purple-800">Profile Settings</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-6 py-4">
                    <div className="flex items-center space-x-4">
                      <Mail className="text-pink-500" />
                      <div>
                        <p className="text-sm font-medium text-purple-800">User ID</p>
                        <p className="text-sm text-purple-600">{user?.uId}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <Phone className="text-pink-500" />
                      <div>
                        <p className="text-sm font-medium text-purple-800">Username</p>
                        <p className="text-sm text-purple-600">{user?.username}</p>
                      </div>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </CardHeader>
          <CardContent className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} p-6`}>
            <div className="space-y-6">
              <div className="flex flex-wrap gap-4">
                <Link href="/mymanga">
                  <Button 
                    className="bg-gradient-to-r from-blue-500 to-teal-500 text-white hover:from-blue-600 hover:to-teal-600 transition-all duration-300"
                  >
                    Go to Manga Dashboard
                  </Button>
                </Link>

                <Link href="/create-manga">
                  <Button 
                    className="bg-gradient-to-r from-green-500 to-teal-500 text-white hover:from-green-600 hover:to-teal-600 transition-all duration-300"
                  >
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Create New Manga
                  </Button>
                </Link>
              </div>

              {isLoading ? (
                <div className="flex justify-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500" />
                </div>
              ) : userManga.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {userManga.map((manga) => (
                    <Link href={`/manga/${manga.sId}`} key={manga.sId}>
                      <div className={`border rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow ${
                        theme === 'dark' ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-200'
                      }`}>
                        <CldImage 
                          src={`${manga.coverImageUrl}`}
                          alt={manga.title} 
                          className="w-full h-48 object-cover"
                          width={300}
                          height={300}
                        />
                        <div className="p-4">
                          <h3 className={`font-bold text-lg ${
                            theme === 'dark' ? 'text-white' : 'text-gray-900'
                          }`}>{manga.title}</h3>
                          <p className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                            Chapters: {manga.chapters.length}
                          </p>
                          <p className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                            Posted: {new Date(manga.postedDatetime).toLocaleDateString()}
                          </p>
                          {manga.genres.length > 0 && (
                            <div className="flex flex-wrap gap-1 mt-2">
                              {manga.genres.map(genre => (
                                <span 
                                  key={genre.gId}
                                  className="text-xs px-2 py-1 bg-blue-100 dark:bg-blue-900 rounded-full"
                                >
                                  {genre.genreName}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="text-center py-10">
                  <p className={`text-lg ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                    You haven`t created any manga yet. Start creating now!
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}