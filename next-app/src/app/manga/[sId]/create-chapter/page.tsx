"use client";

import React, { useState, useRef } from 'react';
import { useRouter, useParams } from 'next/navigation'; // Use useParams for route parameters
import { useSettings } from "@/contexts/SettingsContext";
import { Button } from "@/components/ui/button";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";

// TypeScript type for file previews
type FilePreview = {
  url: string;
  name: string;
};

export default function CreateChapter() {
  const { theme } = useSettings();
  const router = useRouter();
  const { storyid: mangaId } = useParams(); // Get the route params

  const [chapterImages, setChapterImages] = useState<File[]>([]); // State to hold images
  const [imagePreviews, setImagePreviews] = useState<FilePreview[]>([]); // To preview the images
  const [viewMode, setViewMode] = useState<'preview' | 'name'>('preview'); // State to toggle between preview and name view
  const [draggingIndex, setDraggingIndex] = useState<number | null>(null); // Track the dragging image index
  const [error, setError] = useState<string>(""); // To handle errors
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false); // For finish confirmation dialog
  const [isErrorDialogOpen, setIsErrorDialogOpen] = useState(false); // For empty images error dialog

  const fileInputRef = useRef<HTMLInputElement | null>(null); // Reference to the file input

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

    // Check if there are no images, show error dialog
    if (chapterImages.length === 0) {
      setIsErrorDialogOpen(true);
      return;
    }

    // Open confirmation dialog before finishing
    setIsConfirmDialogOpen(true);
  };

  // Handle finishing after confirmation
  const handleFinish = () => {
    console.log("Submitting images:", chapterImages);
    router.push(`/manga/${mangaId}`); // Navigate back to manga
  };

  return (
    <div className={`min-h-screen ${
      theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'
    }`}>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Create New Chapter</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
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
                <AlertDialogTitle>Are you sure you want to finish?</AlertDialogTitle>
                <AlertDialogDescription>
                  Once you finish, you cannot edit the chapter.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel onClick={() => setIsConfirmDialogOpen(false)}>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleFinish}>Confirm Finish</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>

          {/* Error Dialog for No Images */}
          <AlertDialog open={isErrorDialogOpen} onOpenChange={setIsErrorDialogOpen}>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>No Images Uploaded</AlertDialogTitle>
                <AlertDialogDescription>
                  You need to upload at least one image before finishing.
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
