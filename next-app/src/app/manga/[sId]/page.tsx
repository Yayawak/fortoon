'use client';

import { useState,useEffect } from "react";
import { useSettings } from "@/contexts/SettingsContext";
import { Star, MessageSquare, Book, ThumbsUp, Eye, Calendar, Clock, ChevronRight, Plus } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CldImage } from 'next-cloudinary';

interface MangaDetailProps {
  params: {
    sId: string;
  };
}

interface Chapter {
  name: string;
  cId: number;
  storyId: number;
  chapterSequence: number;
  price: number;
  images: string[];
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
  sId: number;
  title: string;
  introduction: string;
  postedDatetime: string;
  authorId: number;
  coverImageUrl: string;
  authorDisplayName: string;
  chapters: Chapter[];
  genres: string[];
}

export default function MangaDetail({ params }: MangaDetailProps) {
  const { t, theme } = useSettings();
  const [activeTab, setActiveTab] = useState('description');
  const [newReview, setNewReview] = useState({ rating: 0, comment: '' });
  const [isReviewDialogOpen, setIsReviewDialogOpen] = useState(false);
  const [manga, setManga] = useState<Manga | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchManga = async () => {
      if (!params.sId) {
        setError('No manga ID provided');
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`/api/story/${params.sId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch manga data');
        }
        const data = await response.json();
        setManga(data);
      } catch (err) {
        setError('Error fetching manga data');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchManga();
  }, [params.sId]);


  const fetchReviews = async () => {
    try {
      const response = await fetch(`/api/story/${params.sId}/review`);
      if (!response.ok) {
        throw new Error('Failed to fetch reviews');
      }
      const data = await response.json();
      setReviews(data);
    } catch (err) {
      console.error('Error fetching reviews:', err);
    }
  };

  const handleReviewSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);

    try {
      const response = await fetch(`/api/story/${params.sId}/review`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to submit review');
      }

      // Refresh reviews after submission
      fetchReviews();
      setIsReviewDialogOpen(false);
      setNewReview({ rating: 0, comment: '' });
      form.reset();
    } catch (err) {
      console.error('Error submitting review:', err);
    }
  };

  const handleReviewUpdate = async (reviewId: number, updatedReview: Partial<Review>) => {
    const formData = new FormData();
    Object.entries(updatedReview).forEach(([key, value]) => {
      formData.append(key, value.toString());
    });

    try {
      const response = await fetch(`/api/story/${params.sId}/review/${reviewId}`, {
        method: 'PUT',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to update review');
      }

      // Refresh reviews after update
      fetchReviews();
    } catch (err) {
      console.error('Error updating review:', err);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;
  if (!manga) return <div>No manga data found</div>;

  return(
    <div className={`min-h-screen ${
      theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'
    }`}>
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row gap-8">
          <div className="md:w-1/3">
            <CldImage 
              src={manga.coverImageUrl}
              width={500}
              height={700}
              alt={manga.title}
              className="w-full rounded-lg shadow-lg"
            />
            <div className="mt-4 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Calendar className="w-5 h-5 text-gray-400 mr-2" />
                  <span className="font-semibold">{new Date(manga.postedDatetime).toLocaleDateString()}</span>
                </div>
                {manga.chapters.length > 0 && (
                  <Button asChild>
                    <Link href={`/manga/${manga.sId}/chapter/${manga.chapters[0].cId}`}>
                      Start Reading
                    </Link>
                  </Button>
                )}
              </div>
              <div className="flex items-center text-sm text-gray-500">
                <Book className="w-4 h-4 mr-2" />
                <span>{manga.authorDisplayName}</span>
              </div>
            </div>
            <div className="mt-4">
              <h3 className="font-semibold mb-2">Genres</h3>
              <div className="flex flex-wrap gap-2">
                {manga.genres.map((genre, index) => (
                  <span key={index} className="px-3 py-1 bg-blue-500 text-white rounded-full text-sm">
                    {genre}
                  </span>
                ))}
              </div>
            </div>
          </div>
          
          <div className="md:w-2/3">
            <h1 className="text-4xl font-bold mb-2">{manga.title}</h1>
            <p className="text-gray-500 mb-6">by {manga.authorDisplayName}</p>
            
            <Tabs defaultValue="description" className="w-full">
              <TabsList>
                <TabsTrigger value="description">Description</TabsTrigger>
                <TabsTrigger value="chapters">Chapters</TabsTrigger>
                <TabsTrigger value="reviews">reviews</TabsTrigger>
              </TabsList>
              
              <TabsContent value="description" className="mt-4">
                <p className="text-lg leading-relaxed whitespace-pre-line">
                  {manga.introduction}
                </p>
              </TabsContent>
              
              <TabsContent value="chapters" className="mt-4">
                <div className="space-y-4">
                  {manga.chapters.map((chapter) => (
                    <Link 
                      key={chapter.cId}
                      href={`/manga/${manga.sId}/chapter/${chapter.cId}`}
                      className={`block p-4 rounded-lg transition-colors ${
                        theme === 'dark' 
                          ? 'hover:bg-gray-800' 
                          : 'hover:bg-gray-100'
                      }`}
                    >
                      <div className="flex justify-between items-center">
                        <div>
                          <h3 className="text-xl font-semibold">Chapter {chapter.chapterSequence}: {chapter.name || 'Untitled'}</h3>
                          <div className="flex items-center mt-2 space-x-4 text-sm text-gray-500">
                            {chapter.price > 0 && (
                              <div className="flex items-center">
                                <span className="font-bold text-green-500">${chapter.price.toFixed(2)}</span>
                              </div>
                            )}
                            {chapter.price === 0 && (
                              <span className="text-green-500">Free</span>
                            )}
                          </div>
                        </div>
                        <ChevronRight className="w-6 h-6 text-gray-400" />
                      </div>
                    </Link>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="reviews" className="mt-4">
            <div className="mb-6 flex justify-between items-center">
              <h2 className="text-2xl font-bold">User Reviews</h2>
              <Dialog open={isReviewDialogOpen} onOpenChange={setIsReviewDialogOpen}>
                <DialogTrigger asChild>
                  <Button>Write a Review</Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Write a Review</DialogTitle>
                    <DialogDescription>Share your thoughts about {manga.title}</DialogDescription>
                  </DialogHeader>
                  <form onSubmit={handleReviewSubmit} className="space-y-4">
                    <div>
                      <Label htmlFor="rating">Rating</Label>
                      <Input
                        id="rating"
                        type="number"
                        min="1"
                        max="5"
                        value={newReview.rating}
                        onChange={(e) => setNewReview({ ...newReview, rating: Number(e.target.value) })}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="comment">Your Review</Label>
                      <Textarea
                        id="comment"
                        value={newReview.comment}
                        onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                        required
                      />
                    </div>
                    <Button type="submit">Submit Review</Button>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
            <div className="space-y-6">
              {reviews.map((review) => (
                <div key={review.id} className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg">
                  <div className="flex items-center mb-2">
                    <Avatar className="w-10 h-10 mr-3">
                      <AvatarImage src={review.avatar} alt={review.user} />
                      <AvatarFallback>{review.user[0]}</AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-semibold">{review.user}</h3>
                      <div className="flex items-center">
                        <Star className="w-4 h-4 text-yellow-400 mr-1" />
                        <span>{review.rating}</span>
                      </div>
                    </div>
                  </div>
                  <p className="text-gray-600 dark:text-gray-300">{review.comment}</p>
                  <div className="flex items-center mt-2 text-sm text-gray-500">
                    <ThumbsUp className="w-4 h-4 mr-1" />
                    <span>{review.likes} likes</span>
                    <span className="mx-2">•</span>
                    <span>{review.date}</span>
                  </div>
                  {/* Add edit functionality if the user owns this review */}
                  {/* This is a placeholder and should be replaced with actual user authentication logic */}
                  {review.user === 'CurrentUser' && (
                    <Button onClick={() => handleReviewUpdate(review.id, { comment: 'Updated comment' })}>
                      Edit Review
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
} 

// (
//     <div className={`min-h-screen ${
//       theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'
//     }`}>
//       <div className="container mx-auto px-4 py-8">
//         <div className="flex flex-col md:flex-row gap-8">
//           <div className="md:w-1/3">
//             <img 
//               src={manga.cover} 
//               alt={manga.title}
//               className="w-full rounded-lg shadow-lg"
//             />
//             <div className="mt-4 space-y-4">
//               <div className="flex items-center justify-between">
//                 <div className="flex items-center">
//                   <Star className="w-5 h-5 text-yellow-400 mr-2" />
//                   <span className="font-semibold">{manga.rating}</span>
//                 </div>
//                 <Button asChild>
//                   <Link href={`/manga/${manga.id}/chapter/${manga.chapters[0].number}`}>
//                     Start Reading
//                   </Link>
//                 </Button>
//               </div>
//               {isOwner && (
//                 <Button asChild className="w-full">
//                   <Link href={`/manga/${manga.id}/create-chapter`}>
//                     <Plus className="w-4 h-4 mr-2" />
//                     Add New Chapter
//                   </Link>
//                 </Button>
//               )}
//               <div className="flex items-center text-sm text-gray-500">
//                 <Calendar className="w-4 h-4 mr-2" />
//                 <span>{manga.releaseYear}</span>
//               </div>
//               <div className="flex items-center text-sm text-gray-500">
//                 <MessageSquare className="w-4 h-4 mr-2" />
//                 <span>{manga.status}</span>
//               </div>
//             </div>
//             <div className="mt-4">
//               <h3 className="font-semibold mb-2">Genres</h3>
//               <div className="flex flex-wrap gap-2">
//                 {manga.genres.map(genre => (
//                   <span key={genre} className="px-3 py-1 bg-blue-500 text-white rounded-full text-sm">
//                     {genre}
//                   </span>
//                 ))}
//               </div>
//             </div>
//           </div>
          
//           <div className="md:w-2/3">
//             <h1 className="text-4xl font-bold mb-2">{manga.title}</h1>
//             <p className="text-gray-500 mb-6">by {manga.author}</p>
            
//             <Tabs defaultValue="description" className="w-full">
//               <TabsList>
//                 <TabsTrigger value="description">Description</TabsTrigger>
//                 <TabsTrigger value="chapters">Chapters</TabsTrigger>
//                 <TabsTrigger value="reviews">Reviews</TabsTrigger>
//               </TabsList>
              
//               <TabsContent value="description" className="mt-4">
//                 <p className="text-lg leading-relaxed whitespace-pre-line">
//                   {manga.description}
//                 </p>
//               </TabsContent>
              
//               <TabsContent value="chapters" className="mt-4">
//                 <div className="space-y-4">
//                   {manga.chapters.map(chapter => (
//                     <Link 
//                       key={chapter.number}
//                       href={`/manga/${manga.id}/chapter/${chapter.number}`}
//                       className={`block p-4 rounded-lg transition-colors ${
//                         theme === 'dark' 
//                           ? 'hover:bg-gray-800' 
//                           : 'hover:bg-gray-100'
//                       }`}
//                     >
//                       <div className="flex justify-between items-center">
//                         <div>
//                           <h3 className="text-xl font-semibold">Chapter {chapter.number}: {chapter.title}</h3>
//                           <div className="flex items-center mt-2 space-x-4 text-sm text-gray-500">
//                             <div className="flex items-center">
//                               <Eye className="w-4 h-4 mr-1" />
//                               <span>{(chapter.views / 1000000).toFixed(1)}M</span>
//                             </div>
//                             <div className="flex items-center">
//                               <Clock className="w-4 h-4 mr-1" />
//                               <span>{chapter.releaseDate}</span>
//                             </div>
//                             <div className="flex items-center">
//                               <MessageSquare className="w-4 h-4 mr-1" />
//                               <span>{chapter.comments.length} comments</span>
//                             </div>
//                           </div>
//                         </div>
//                         <ChevronRight className="w-6 h-6 text-gray-400" />
//                       </div>
//                     </Link>
//                   ))}
//                 </div>
//               </TabsContent>
              
//               <TabsContent value="reviews" className="mt-4">
//                 <div className="mb-6 flex justify-between items-center">
//                   <h2 className="text-2xl font-bold">User Reviews</h2>
//                   <div>
//                     <Dialog open={isReviewDialogOpen} onOpenChange={setIsReviewDialogOpen}>
//                       <DialogTrigger asChild>
//                         <Button>Write a Review</Button>
//                       </DialogTrigger>
//                       <DialogContent>
//                         <DialogHeader>
//                           <DialogTitle>Write a Review</DialogTitle>
//                           <DialogDescription>Share your thoughts about {manga.title}</DialogDescription>
//                         </DialogHeader>
//                         <form onSubmit={handleReviewSubmit} className="space-y-4">
//                           <div>
//                             <Label htmlFor="rating">Rating</Label>
//                             <Input
//                               id="rating"
//                               type="number"
//                               min="1"
//                               max="5"
//                               value={newReview.rating}
//                               onChange={(e) => setNewReview({ ...newReview, rating: Number(e.target.value) })}
//                               required
//                             />
//                           </div>
//                           <div>
//                             <Label htmlFor="comment">Your Review</Label>
//                             <Textarea
//                               id="comment"
//                               value={newReview.comment}
//                               onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
//                               required
//                             />
//                           </div>
//                           <Button type="submit">Submit Review</Button>
//                         </form>
//                       </DialogContent>
//                     </Dialog>
//                   </div>
//                 </div>
//                 <div className="space-y-6">
//                   {manga.reviews.map((review, index) => (
//                     <div key={index} className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg">
//                       <div className="flex items-center mb-2">
//                         <Avatar className="w-10 h-10 mr-3">
//                           <AvatarImage src={review.avatar} alt={review.user} />
//                           <AvatarFallback>{review.user[0]}</AvatarFallback>
//                         </Avatar>
//                         <div>
//                           <h3 className="font-semibold">{review.user}</h3>
//                           <div className="flex items-center">
//                             <Star className="w-4 h-4 text-yellow-400 mr-1" />
//                             <span>{review.rating}</span>
//                           </div>
//                         </div>
//                       </div>
//                       <p className="text-gray-600 dark:text-gray-300">{review.comment}</p>
//                       <div className="flex items-center mt-2 text-sm text-gray-500">
//                         <ThumbsUp className="w-4 h-4 mr-1" />
//                         <span>{review.likes} likes</span>
//                         <span className="mx-2">•</span>
//                         <span>{review.date}</span>
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               </TabsContent>
//             </Tabs>
//           </div>
//         </div>
        
//         <div className="mt-12">
//           <h2 className="text-2xl font-bold mb-6">You might also like</h2>
//           <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
//             {manga.recommendations.map(rec => (
//               <Link 
//                 key={rec.id}
//                 href={`/manga/${rec.id}`}
//                 className="group"
//               >
//                 <div className="relative overflow-hidden rounded-lg">
//                   <img 
//                     src={rec.cover} 
//                     alt={rec.title}
//                     className="w-full h-[300px] object-cover group-hover:scale-105 transition-transform duration-300"
//                   />
//                   <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
//                     <h3 className="text-white font-semibold mb-1">{rec.title}</h3>
//                     <div className="flex items-center text-sm text-gray-300 mb-2">
//                       <Star className="w-4 h-4 text-yellow-400 mr-1" />
//                       <span>{rec.rating}</span>
//                     </div>
//                     <p className="text-sm text-gray-300">{rec.similarity}</p>
//                   </div>
//                 </div>
//               </Link>
//             ))}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }
