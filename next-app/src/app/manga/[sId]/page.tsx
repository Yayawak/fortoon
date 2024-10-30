'use client';

import { useState, useEffect } from "react";
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
import { Manga, MangaDetailProps, Chapter, Review } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";

export default function MangaDetail({ params }: MangaDetailProps) {
  const { t, theme } = useSettings();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('description');
  const [isReviewDialogOpen, setIsReviewDialogOpen] = useState(false);
  const [manga, setManga] = useState<Manga | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingReview, setEditingReview] = useState<Review | null>(null);
  const [formErrors, setFormErrors] = useState<{
    rating?: string;
    review?: string;
  }>({});

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
        fetchReviews();
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
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.msg || 'Failed to fetch reviews');
      }

      setReviews(data.data || []);
    } catch (err) {
      console.error('Error fetching reviews:', err);
      toast({
        title: "Error",
        description: getErrorMessage(err),
        variant: "destructive"
      });
      setReviews([]);
    }
  };

  const validateForm = (formData: FormData): boolean => {
    const errors: { rating?: string; review?: string } = {};
    const rating = formData.get('rating');
    const review = formData.get('review');

    if (!rating || Number(rating) < 1 || Number(rating) > 5) {
      errors.rating = 'Rating must be between 1 and 5';
    }

    if (!review || (review as string).length < 5) {
      errors.review = 'Review must be at least 5 characters long';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleReviewSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setFormErrors({});

    const form = e.currentTarget;
    const formData = new FormData(form);

    // Validate form before submission
    if (!validateForm(formData)) {
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await fetch(`/api/story/${params.sId}/review`, {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        // Handle specific error cases
        if (data.msg === "You have already reviewed this story.") {
          throw new Error("You have already reviewed this story");
        }
        throw new Error(data.msg || 'Failed to submit review');
      }

      toast({
        title: "Success",
        description: "Review submitted successfully",
      });

      await fetchReviews();
      setIsReviewDialogOpen(false);
      form.reset();
    } catch (err: any) {
      toast({
        title: "Error",
        description: getErrorMessage(err),
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReviewUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editingReview) return;

    setIsSubmitting(true);
    setFormErrors({});

    const form = e.currentTarget;
    const formData = new FormData(form);

    // Validate form before submission
    if (!validateForm(formData)) {
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await fetch(`/api/story/${params.sId}/review`, {
        method: 'PUT',
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.msg || 'Failed to update review');
      }

      toast({
        title: "Success",
        description: "Review updated successfully",
      });

      await fetchReviews();
      setEditingReview(null);
      setIsReviewDialogOpen(false);
    } catch (err: any) {
      toast({
        title: "Error",
        description: getErrorMessage(err),
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const ReviewForm = ({ onSubmit, initialData = null }: { onSubmit: (e: React.FormEvent<HTMLFormElement>) => Promise<void>, initialData?: Review | null }) => (
    <form onSubmit={onSubmit} className="space-y-4">
      <div>
        <Label htmlFor="rating">Rating (1-5)</Label>
        <Input
          id="rating"
          name="rating"
          type="number"
          min="1"
          max="5"
          defaultValue={initialData?.rating || ""}
          required
          className={formErrors.rating ? "border-red-500" : ""}
        />
        {formErrors.rating && (
          <p className="text-sm text-red-500 mt-1">{formErrors.rating}</p>
        )}
      </div>
      <div>
        <Label htmlFor="review">Your Review</Label>
        <Textarea
          id="review"
          name="review"
          defaultValue={initialData?.comment || ""}
          required
          className={formErrors.review ? "border-red-500" : ""}
        />
        {formErrors.review && (
          <p className="text-sm text-red-500 mt-1">{formErrors.review}</p>
        )}
      </div>
      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Submitting..." : (initialData ? "Update Review" : "Submit Review")}
      </Button>
    </form>
  );

  // Helper function to extract error message from API response
const getErrorMessage = (error: any): string => {
  if (typeof error === 'string') return error;
  
  // Handle ZodError
  if (error.name === 'ZodError' && error.issues?.length > 0) {
    // Get the first validation error message
    const firstIssue = error.issues[0];
    if (firstIssue.code === 'too_small' && firstIssue.type === 'string') {
      return `Review must be at least ${firstIssue.minimum} characters long`;
    }
    return firstIssue.message || 'Invalid input provided';
  }

  // Handle standard API error messages
  if (error.msg) return error.msg;
  
  return 'An unexpected error occurred';
};

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;
  if (!manga) return <div>No manga data found</div>;

  return (
    <div
      className={`min-h-screen ${
        theme === "dark" ? "bg-gray-900 text-white" : "bg-gray-50 text-gray-900"
      }`}
    >
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row gap-8">
          <div className="md:w-1/3">
            {manga.coverImageUrl && (
              <CldImage
                src={manga.coverImageUrl}
                width={500}
                height={700}
                alt={manga.title}
                className="w-full rounded-lg shadow-lg"
              />
            )}
            <div className="mt-4 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Calendar className="w-5 h-5 text-gray-400 mr-2" />
                  <span className="font-semibold">
                    {new Date(manga.postedDatetime).toLocaleDateString()}
                  </span>
                </div>
                {manga.chapters && manga.chapters.length > 0 && (
                  <Button asChild>
                    <Link
                      href={`/manga/${manga.sId}/chapter/${manga.chapters[0].cId}`}
                    >
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
            {manga.genres && manga.genres.length > 0 && (
              <div className="mt-4">
                <h3 className="font-semibold mb-2">Genres</h3>
                <div className="flex flex-wrap gap-2">
                  {manga.genres.map((genre, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-blue-500 text-white rounded-full text-sm"
                    >
                      {genre}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="md:w-2/3">
            <h1 className="text-4xl font-bold mb-2">{manga.title}</h1>
            <p className="text-gray-500 mb-6">by {manga.authorDisplayName}</p>

            <Tabs defaultValue="description" className="w-full">
              <TabsList>
                <TabsTrigger value="description">Description</TabsTrigger>
                <TabsTrigger value="chapters">Chapters</TabsTrigger>
                <TabsTrigger value="reviews">Reviews</TabsTrigger>
              </TabsList>

              <TabsContent value="description" className="mt-4">
                <p className="text-lg leading-relaxed whitespace-pre-line">
                  {manga.introduction}
                </p>
              </TabsContent>

              <TabsContent value="chapters" className="mt-4">
                <div className="space-y-4">
                  {manga.chapters &&
                    manga.chapters.map((chapter) => (
                      <Link
                        key={chapter.cId}
                        href={`/manga/${manga.sId}/chapter/${chapter.cId}`}
                        className={`block p-4 rounded-lg transition-colors ${
                          theme === "dark"
                            ? "hover:bg-gray-800"
                            : "hover:bg-gray-100"
                        }`}
                      >
                        <div className="flex justify-between items-center">
                          <div>
                            <h3 className="text-xl font-semibold">
                              Chapter {chapter.chapterSequence}:{" "}
                              {chapter.name || "Untitled"}
                            </h3>
                            <div className="flex items-center mt-2 space-x-4 text-sm text-gray-500">
                              {chapter.price > 0 && (
                                <div className="flex items-center">
                                  <span className="font-bold text-green-500">
                                    ${chapter.price.toFixed(2)}
                                  </span>
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
                  <Dialog
                    open={isReviewDialogOpen}
                    onOpenChange={setIsReviewDialogOpen}
                  >
                    <DialogTrigger asChild>
                      <Button>Write a Review</Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>
                          {editingReview ? "Edit Review" : "Write a Review"}
                        </DialogTitle>
                        <DialogDescription>
                          {editingReview
                            ? "Update your review"
                            : `Share your thoughts about ${manga.title}`}
                        </DialogDescription>
                      </DialogHeader>
                      <ReviewForm
                        onSubmit={
                          editingReview
                            ? handleReviewUpdate
                            : handleReviewSubmit
                        }
                        initialData={editingReview}
                      />
                    </DialogContent>
                  </Dialog>
                </div>

                <div className="space-y-6">
                  {reviews.map((review) => (
                    <div
                      key={review.id}
                      className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg"
                    >
                      <div className="flex items-center mb-2">
                        {/* <Avatar className="w-10 h-10 mr-3">
                          <AvatarImage src={review.avatar} alt={review.user} />
                          <AvatarFallback>{review.user[0]}</AvatarFallback>
                        </Avatar> */}
                        <div>
                          <h3 className="font-semibold">{review.user}</h3>
                          <div className="flex items-center">
                            <Star className="w-4 h-4 text-yellow-400 mr-1" />
                            <span>{review.rating}</span>
                          </div>
                        </div>
                      </div>
                      <p className="text-gray-600 dark:text-gray-300">
                        {review.comment}
                      </p>
                      <div className="flex items-center mt-2 text-sm text-gray-500">
                        <ThumbsUp className="w-4 h-4 mr-1" />
                        <span>{review.likes} likes</span>
                        <span className="mx-2">•</span>
                        <span>
                          {new Date(review.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      {review.isOwner && (
                        <Button
                          variant="outline"
                          className="mt-2"
                          onClick={() => {
                            setEditingReview(review);
                            setIsReviewDialogOpen(true);
                          }}
                        >
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
