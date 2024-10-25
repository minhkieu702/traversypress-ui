'use client'
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

// Define schema
const formSchema = z.object({
  deleteImages: z.array(z.string().uuid()).optional(),
});

type FormSchema = z.infer<typeof formSchema>;

interface Image {
  id: string;
  url: string;
}

// Example image data
const images: Image[] = [
  { id: '1', url: 'https://fish-ecomerce-fe.vercel.app/_next/image?url=https%3A%2F%2Fupload.wikimedia.org%2Fwikipedia%2Fcommons%2Fthumb%2Ff%2Ff3%2FYuyuan_Garden.jpg%2F800px-Yuyuan_Garden.jpg&w=640&q=75' },
  { id: '2', url: 'https://fish-ecomerce-fe.vercel.app/_next/image?url=https%3A%2F%2Fupload.wikimedia.org%2Fwikipedia%2Fcommons%2Fthumb%2Ff%2Ff3%2FYuyuan_Garden.jpg%2F800px-Yuyuan_Garden.jpg&w=640&q=75' },
  { id: '3', url: 'https://fish-ecomerce-fe.vercel.app/_next/image?url=https%3A%2F%2Fupload.wikimedia.org%2Fwikipedia%2Fcommons%2Fthumb%2Ff%2Ff3%2FYuyuan_Garden.jpg%2F800px-Yuyuan_Garden.jpg&w=640&q=75' },
];

const ImageGallery: React.FC = () => {
  const { handleSubmit } = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
  });

  const [deleteImages, setDeleteImages] = useState<string[]>([]);

  const toggleDeleteImage = (imageId: string) => {
    setDeleteImages((prev) =>
      prev.includes(imageId)
        ? prev.filter((id) => id !== imageId) // Remove from deleted list
        : [...prev, imageId] // Add to deleted list
    );
  };

  const onSubmit = (data: FormSchema) => {
    console.log('Deleted Images:', deleteImages);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="grid grid-cols-3 gap-4">
        {images.map((image) => (
          <div key={image.id} className="relative">
            <img src={image.url} alt={`Image ${image.id}`} className="w-full h-auto" />
            <button
              type="button"
              onClick={() => toggleDeleteImage(image.id)}
              className={`absolute top-2 right-2 p-1 rounded ${
                deleteImages.includes(image.id) ? 'bg-yellow-500' : 'bg-red-500'
              } text-white`}
            >
              {deleteImages.includes(image.id) ? 'Undo' : 'Delete'}
            </button>
          </div>
        ))}
      </div>

      <button
        type="submit"
        className="mt-4 bg-blue-500 text-white py-2 px-4 rounded"
      >
        Submit
      </button>
    </form>
  );
};

export default ImageGallery;
