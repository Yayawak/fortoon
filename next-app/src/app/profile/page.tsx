'use client';
import { useState } from 'react';
import Link from 'next/link';
import { Settings, User, Mail, Phone, MapPin, Book, Github, Twitter, Linkedin ,PlusCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

export default function Profile() {
  const [isOpen, setIsOpen] = useState(false);
  const [showManga, setShowManga] = useState(false);

  // Mock data for user's manga
  const userManga = [
    { id: 1, title: "My Hero Academia", cover: "/api/placeholder/200/300", chapters: 10 },
    { id: 2, title: "One Piece", cover: "/api/placeholder/200/300", chapters: 15 },
    { id: 3, title: "Naruto", cover: "/api/placeholder/200/300", chapters: 20 },
  ];

  return (
    <div className="max-w-4xl mx-auto p-4">
      <Card className="w-full overflow-hidden bg-gradient-to-br from-purple-400 via-pink-500 to-red-500">
        <CardHeader className="flex flex-col md:flex-row items-center justify-between p-6">
          <div className="flex flex-col md:flex-row items-center md:space-x-6 text-white">
            <div className="w-32 h-32 rounded-full bg-white p-1 mb-4 md:mb-0">
              <div className="w-full h-full rounded-full bg-gradient-to-br from-yellow-400 via-red-500 to-pink-500 flex items-center justify-center">
                <User size={64} className="text-white" />
              </div>
            </div>
            <div className="text-center md:text-left">
              <h2 className="text-3xl font-bold">John Doe</h2>
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
              <DialogContent className="bg-gradient-to-br from-purple-100 to-pink-100">
                <DialogHeader>
                  <DialogTitle className="text-2xl font-bold text-purple-800">Profile Settings</DialogTitle>
                </DialogHeader>
                <div className="space-y-6 py-4">
                  <div className="flex items-center space-x-4">
                    <Mail className="text-pink-500" />
                    <div>
                      <p className="text-sm font-medium text-purple-800">Email</p>
                      <p className="text-sm text-purple-600">john.doe@example.com</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <Phone className="text-pink-500" />
                    <div>
                      <p className="text-sm font-medium text-purple-800">Phone</p>
                      <p className="text-sm text-purple-600">+1 234 567 890</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <MapPin className="text-pink-500" />
                    <div>
                      <p className="text-sm font-medium text-purple-800">Location</p>
                      <p className="text-sm text-purple-600">San Francisco, CA</p>
                    </div>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent className="bg-white p-6">
          <div className="space-y-6">
            {!showManga ? (
              <>
                <p className="text-gray-700 text-lg leading-relaxed">
                  Full-stack developer with 5 years of experience in web technologies.
                  Passionate about creating user-friendly applications and solving complex problems.
                  Also an aspiring manga artist with several ongoing series.
                </p>
                <div className="flex flex-wrap gap-4">
                  <Link href="/mymanga">
                    <Button 
                      className="bg-gradient-to-r from-blue-500 to-teal-500 text-white hover:from-blue-600 hover:to-teal-600 transition-all duration-300"
                    >
                      Go to Manga Dashboard
                    </Button>
                  </Link>

                  <Button 
                    className="bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600 transition-all duration-300"
                    onClick={() => setShowManga(true)}
                  >
                    Quick View My Manga
                  </Button>

                  <Link href="/create-manga">
                    <Button 
                      className="bg-gradient-to-r from-green-500 to-teal-500 text-white hover:from-green-600 hover:to-teal-600 transition-all duration-300"
                    >
                      <PlusCircle className="mr-2 h-4 w-4" />
                      Create New Manga
                    </Button>
                  </Link>
                </div>
              </>
            ) : (
              <>
                {/* ... (manga display content remains the same) ... */}
              </>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}