"use client";

import React, { useState, useRef } from "react";
import { X, GripVertical, Upload } from "lucide-react";

interface MultiImageUploaderProps {
  value: string; // Comma-separated image URLs
  onChange: (value: string) => void;
  onUpload: (files: File[]) => Promise<string[]>; // Function to upload files to your server/bucket
}

export default function MultiImageUploader({
  value,
  onChange,
  onUpload,
}: MultiImageUploaderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const dragItem = useRef<number | null>(null);
  const dragOverItem = useRef<number | null>(null);

  // Convert comma-separated string back to array safely
  const images = value
    ? value.split(",").filter((url) => url.trim() !== "")
    : [];

  const handleSort = () => {
    if (dragItem.current === null || dragOverItem.current === null) return;
    const _images = [...images];
    const draggedContent = _images.splice(dragItem.current, 1)[0];
    _images.splice(dragOverItem.current, 0, draggedContent);

    dragItem.current = null;
    dragOverItem.current = null;

    onChange(_images.join(",")); // Automatically convert back to comma-separated
  };

  const handleRemove = (index: number) => {
    const _images = [...images];
    _images.splice(index, 1);
    onChange(_images.join(","));
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.length) return;
    setIsUploading(true);
    try {
      const filesArray = Array.from(e.target.files);
      // Wait for your backend to upload the images and return their URLs
      const uploadedUrls = await onUpload(filesArray);
      const newUrls = [...images, ...uploadedUrls].join(",");
      onChange(newUrls);
    } catch (error) {
      console.error("Upload failed", error);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Drag & Drop File Input */}
      <div
        className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-colors ${
          isDragging
            ? "border-amber-500 bg-amber-50"
            : "border-gray-300 hover:border-gray-400"
        }`}
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setIsDragging(false);
        }}
      >
        <input
          type="file"
          multiple
          accept="image/*"
          onChange={handleFileSelect}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          disabled={isUploading}
        />
        <Upload className="mx-auto h-8 w-8 text-gray-400 mb-2" />
        <p className="text-sm font-medium text-gray-700">
          {isUploading
            ? "Uploading..."
            : "Click or drag multiple images to upload"}
        </p>
      </div>

      {/* Reorderable Image List */}
      {images.length > 0 && (
        <div className="space-y-2">
          {images.map((url, index) => (
            <div
              key={`${url}-${index}`}
              draggable
              onDragStart={() => (dragItem.current = index)}
              onDragEnter={() => (dragOverItem.current = index)}
              onDragEnd={handleSort}
              onDragOver={(e) => e.preventDefault()}
              className="flex items-center gap-4 p-2 bg-white border border-gray-200 rounded-lg shadow-sm cursor-move hover:border-amber-400 transition-colors"
            >
              <GripVertical
                className="text-gray-400 cursor-grab pointer-events-none"
                size={20}
              />
              <img
                src={url}
                alt={`Upload ${index}`}
                className="w-16 h-16 object-cover rounded-md bg-gray-100 shrink-0 pointer-events-none"
              />
              <input
                type="text"
                value={url}
                readOnly
                className="flex-1 text-sm bg-transparent border-none focus:ring-0 text-gray-600 truncate pointer-events-none"
              />
              <button
                type="button"
                onClick={() => handleRemove(index)}
                className="p-2 text-gray-400 hover:text-red-500 transition-colors"
              >
                <X size={18} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
