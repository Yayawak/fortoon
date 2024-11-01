"use client";

import React, { useState, useRef, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useSettings } from "@/contexts/SettingsContext";
import { Button } from "@/components/ui/button";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import { 
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

// TypeScript type for file previews
type FilePreview = {
  url: string;
  name: string;
};

export default function EditChapter() {
  const params = useParams();
  const mangaId = params.sId as string;
  const chapterId = params.cId as string;
  const { theme } = useSettings();
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);

  const [chapterImages, setChapterImages] = useState<File[]>([]); // State to hold images
  const [imagePreviews, setImagePreviews] = useState<FilePreview[]>([]); // To preview the images
  const [viewMode, setViewMode] = useState<'preview' | 'name'>('preview'); // State to toggle between preview and name view
  const [draggingIndex, setDraggingIndex] = useState<number | null>(null); // Track the dragging image index
  const [error, setError] = useState<string>(""); // To handle errors
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false); // For finish confirmation dialog
  const [isErrorDialogOpen, setIsErrorDialogOpen] = useState(false); // For empty images error dialog

  const fileInputRef = useRef<HTMLInputElement | null>(null); // Reference to the file input

  // Add new state for chapter data
  const [chapterData, setChapterData] = useState<{
    name: string;
    price: number;
    images: string[];
  } | null>(null);

  // Add new state for editable fields
  const [editForm, setEditForm] = useState({
    name: '',
    priceType: 'free' as 'free' | 'coin',
    coinPrice: 0
  });

  // Fetch existing chapter data
  useEffect(() => {
    const fetchChapterData = async () => {
      try {
        const response = await fetch(`/api/story/${mangaId}`);
        if (!response.ok) throw new Error('Failed to fetch manga');
        
        const data = await response.json();
        console.log('Fetched manga data:', data); // Debug log
        
        // Find the specific chapter from the chapters array
        const chapter = data.chapters.find((ch: any) => ch.cId === Number(chapterId));
        
        if (!chapter) {
          throw new Error('Chapter not found');
        }

        console.log('Found chapter:', chapter); // Debug log
        
        setChapterData(chapter);
        
        // Set initial form values
        setEditForm({
          name: chapter.name || '',
          priceType: chapter.price > 0 ? 'coin' : 'free',
          coinPrice: chapter.price || 0
        });

        // Convert existing images to FilePreview format
        if (chapter.images && Array.isArray(chapter.images)) {
          const previews = chapter.images.map((imageUrl: string, index: number) => ({
            url: imageUrl,
            name: `Image ${index + 1}`,
          }));
          setImagePreviews(previews);
        }
      } catch (error) {
        console.error('Error fetching chapter:', error); // Debug log
        toast({
          title: "Error",
          description: "Failed to fetch chapter data",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchChapterData();
  }, [mangaId, chapterId, toast]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []) as File[]; // Ensure that files are typed as File[]

    // Check if the user tries to add more than 50 images
    if (files.length + chapterImages.length > 50) {
      setError("You can upload a maximum of 50 images.");
      return;
    }

    setError(""); // Clear previous errors

    const newImages = files.slice(0, 50 - chapterImages.length); // Limit the selection to remaining slots

    // Generate preview URLs for the newly added images
    const newImagePreviews: FilePreview[] = newImages.map((file) => ({
      url: URL.createObjectURL(file),
      name: file.name,
    }));

    setChapterImages((prev) => [...prev, ...newImages]);
    setImagePreviews((prev) => [...prev, ...newImagePreviews]);

    // Reset file input after upload to ensure proper behavior when re-uploading
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleRemoveImage = (index: number) => {
    const newChapterImages = [...chapterImages];
    const newImagePreviews = [...imagePreviews];

    newChapterImages.splice(index, 1); // Remove image at index
    URL.revokeObjectURL(imagePreviews[index].url); // Revoke object URL to avoid memory leaks
    newImagePreviews.splice(index, 1); // Remove corresponding preview

    setChapterImages(newChapterImages);
    setImagePreviews(newImagePreviews);

    // Reset file input to allow re-uploading files
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleClearAllImages = () => {
    // Revoke all object URLs to avoid memory leaks
    imagePreviews.forEach((preview) => URL.revokeObjectURL(preview.url));

    setChapterImages([]);
    setImagePreviews([]);
    setError(""); // Clear any existing errors

    // Reset file input after clearing all images
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleDragStart = (index: number) => {
    setDraggingIndex(index);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>, index: number) => {
    e.preventDefault();

    if (draggingIndex === null) return;

    const draggedImage = chapterImages[draggingIndex];
    const draggedPreview = imagePreviews[draggingIndex];

    const newChapterImages = [...chapterImages];
    const newImagePreviews = [...imagePreviews];

    // Remove the dragged item from its original position
    newChapterImages.splice(draggingIndex, 1);
    newImagePreviews.splice(draggingIndex, 1);

    // Insert the dragged item into the new position
    newChapterImages.splice(index, 0, draggedImage);
    newImagePreviews.splice(index, 0, draggedPreview);

    setChapterImages(newChapterImages);
    setImagePreviews(newImagePreviews);
    setDraggingIndex(index); // Update the dragging index
  };

  const handleDragEnd = () => {
    setDraggingIndex(null); // Reset the dragging index
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Validate chapter name
    if (!editForm.name.trim()) {
      toast({
        title: "Error",
        description: "Chapter name is required",
        variant: "destructive"
      });
      return;
    }

    // Check if there are no images, show error dialog
    if (chapterImages.length === 0) {
      setIsErrorDialogOpen(true);
      return;
    }

    // Open confirmation dialog before finishing
    setIsConfirmDialogOpen(true);
  };

  // Modify handleFinish to use PUT request
  const handleFinish = async () => {
    try {
      const chapterName = editForm.name.trim();
      if (!chapterName) {
        throw new Error("Chapter name is required");
      }

      const formData = new FormData();
      
      // Add chapter info with explicit price handling
      formData.append('chapterName', chapterName);
      const finalPrice = editForm.priceType === 'free' ? 0 : editForm.coinPrice;
      formData.append('price', finalPrice.toString());
      
      // Debug log to verify price
      console.log('Sending price:', finalPrice);

      // Add new images
      chapterImages.forEach((file) => {
        formData.append('imageChapterFiles', file);
      });

      // Add existing images if any
      if (chapterData?.images) {
        chapterData.images.forEach((imageUrl) => {
          formData.append('existingImages', imageUrl);
        });
      }

      // Debug log all form data
      console.log('Form data contents:');
      for (let pair of formData.entries()) {
        console.log(pair[0], ':', pair[1]);
      }

      const response = await fetch(`/api/story/${mangaId}/chapter/${chapterId}`, {
        method: 'PUT',
        body: formData,
      });

      const responseData = await response.json();
      
      if (!response.ok) {
        throw new Error(responseData.msg || 'Failed to update chapter');
      }

      toast({
        title: "Success",
        description: responseData.msg || "Chapter updated successfully",
      });

      router.push(`/manga/${mangaId}`);
      router.refresh();
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update chapter",
        variant: "destructive"
      });
    }
  };

  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
    </div>;
  }

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Edit Chapter</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Chapter Info Card */}
          <Card className={`${theme === 'dark' ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white text-gray-900'}`}>
            <CardContent className="p-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="chapterName" className="text-lg font-semibold mb-2">
                    Chapter Name
                  </Label>
                  <Input
                    id="chapterName"
                    value={editForm.name}
                    onChange={(e) => setEditForm(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Enter chapter name"
                    className={`mt-1 ${theme === 'dark' ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white text-gray-900'}`}
                  />
                </div>

                {/* Price Selection */}
                <div className="mt-6">
                  <Label className="text-lg font-semibold mb-4">
                    Price Setting
                  </Label>
                  <div className="mt-2">
                    <div className="flex items-center space-x-2">
                      <input 
                        type="radio" 
                        value="free" 
                        id="free" 
                        name="price-type" 
                        checked={editForm.priceType === 'free'}
                        onChange={(e) => setEditForm(prev => ({ ...prev, priceType: e.target.value as 'free' | 'coin' }))}
                        className="h-4 w-4" 
                      />
                      <Label htmlFor="free">Free Chapter</Label>
                    </div>
                    <div className="flex items-center space-x-2 mt-2">
                      <input 
                        type="radio" 
                        value="coin" 
                        id="coin" 
                        name="price-type"
                        checked={editForm.priceType === 'coin'}
                        onChange={(e) => setEditForm(prev => ({ ...prev, priceType: e.target.value as 'free' | 'coin' }))}
                        className="h-4 w-4" 
                      />
                      <Label htmlFor="coin">Paid Chapter</Label>
                    </div>
                  </div>

                  {editForm.priceType === 'coin' && (
                    <div className="mt-4">
                      <Label htmlFor="coinPrice">Coin Price</Label>
                      <Input
                        id="coinPrice"
                        type="number"
                        min="1"
                        max="999"
                        value={editForm.coinPrice}
                        onChange={(e) => setEditForm(prev => ({ ...prev, coinPrice: Number(e.target.value) }))}
                        className={`mt-1 w-32 ${theme === 'dark' ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white text-gray-900'}`}
                      />
                      <p className={`text-sm mt-1 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                        Enter price between 1-999 coins
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          <div>
            <label htmlFor="images" className="block text-sm font-medium mb-2">
              Upload Chapter Images (Max 50)
            </label>
            <input
              ref={fileInputRef}
              type="file"
              id="images"
              name="images"
              accept="image/*"
              multiple
              onChange={handleImageChange}
              className="w-full"
            />
            <p className="text-sm mt-2">Images uploaded: {chapterImages.length} / 50</p>
          </div>

          {/* Toggle buttons for "Preview" and "Name" view modes */}
          <div className="flex gap-4 mb-4">
            <button
              type="button"
              onClick={() => setViewMode('preview')}
              className={`flex items-center gap-2 px-4 py-2 rounded-full ${
                viewMode === 'preview'
                  ? 'bg-blue-500 text-white'
                  : theme === 'dark' ? 'bg-gray-700 text-white' : 'bg-gray-100'
              }`}
            >
              <span>🖼️</span> {/* Icon for preview */}
              View by Preview
            </button>

            <button
              type="button"
              onClick={() => setViewMode('name')}
              className={`flex items-center gap-2 px-4 py-2 rounded-full ${
                viewMode === 'name'
                  ? 'bg-blue-500 text-white'
                  : theme === 'dark' ? 'bg-gray-700 text-white' : 'bg-gray-100'
              }`}
            >
              <span>📄</span> {/* Icon for name */}
              View by Name
            </button>
          </div>

          {error && (
            <p className="text-red-500 text-sm">{error}</p>
          )}

          {imagePreviews.length > 0 && (
            <div className="flex flex-col space-y-4 mt-4">
              {viewMode === 'preview' && (
                imagePreviews.map((image, index) => (
                  <div
                    key={index}
                    className="relative flex-shrink-0 w-96 h-[50vh]"
                    draggable
                    onDragStart={() => handleDragStart(index)}
                    onDragOver={(e) => handleDragOver(e, index)}
                    onDragEnd={handleDragEnd}
                  >
                    <img
                      src={image.url}
                      alt={`Preview ${index + 1}`}
                      className="object-cover w-full h-full"
                    />
                    <p className="text-sm text-center mt-2">{image.name}</p> {/* Display file name */}
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(index)}
                      className="absolute top-0 right-0 bg-red-600 text-white px-2 py-1 text-xs"
                    >
                      Remove
                    </button>
                  </div>
                ))
              )}

              {viewMode === 'name' && (
                imagePreviews.map((image, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded">
                    <p className="text-sm">{image.name}</p>
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(index)}
                      className="bg-red-600 text-white px-2 py-1 text-xs"
                    >
                      Remove
                    </button>
                  </div>
                ))
              )}
            </div>
          )}

          {chapterImages.length > 0 && (
            <div className="mt-4">
              <button
                type="button"
                onClick={handleClearAllImages}
                className="bg-red-600 text-white px-4 py-2"
              >
                Clear All Images
              </button>
            </div>
          )}

          {/* Finish Button */}
          <div className="mt-4">
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded"
            >
              Finish
            </button>
          </div>

          {/* Go Back Button */}
          <div className="mt-4">
            <button
              type="button"
              className="bg-gray-500 text-white px-4 py-2 rounded"
              onClick={() => router.back()} // Go back to the previous page
            >
              Go Back
            </button>
          </div>

          {/* Confirmation Dialog for Finish */}
          <AlertDialog open={isConfirmDialogOpen} onOpenChange={setIsConfirmDialogOpen}>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you sure you want to update this chapter?</AlertDialogTitle>
                <AlertDialogDescription>
                  This will update the existing chapter with your new changes.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel onClick={() => setIsConfirmDialogOpen(false)}>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleFinish}>Confirm Update</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>

          {/* Error Dialog for No Images */}
          <AlertDialog open={isErrorDialogOpen} onOpenChange={setIsErrorDialogOpen}>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>No Images Selected</AlertDialogTitle>
                <AlertDialogDescription>
                  You need to have at least one image in the chapter.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel onClick={() => setIsErrorDialogOpen(false)}>Go Back to Edit</AlertDialogCancel>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </form>
      </div>
    </div>
  );
}
