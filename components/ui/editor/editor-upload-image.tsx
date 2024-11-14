'use client';

import { type Editor } from '@tiptap/core';
import React, { useRef } from 'react';
import { Image as LucideImage } from 'lucide-react';
import { Button } from '../button';
import { cn } from '@/lib/utils';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../tooltip';
import { Input } from '../input';

export interface UploadImageProps {
  activeEditor: Editor | null;
}

export const EditorUploadImage: React.FC<UploadImageProps> = ({
  activeEditor
}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleUpload = () => {
    if (inputRef.current) {
      inputRef.current.click();
    }
  }

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Convert file to Base64
    const reader = new FileReader();
    reader.onload = () => {
      const base64 = reader.result as string;

      // Insert the Base64 image into the editor
      activeEditor?.chain().focus().setImageCustom({ src: base64, alignment: "left" }).run();
    };

    reader.readAsDataURL(file); // This will trigger the `onload` function and convert to Base64
  };


  return (
    <>
      <Button
        type="button"
        variant="ghost"
        onClick={handleUpload}
        className={cn(
          'rounded-full',
        )}
      >
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild><LucideImage size={16} /></TooltipTrigger>
            <TooltipContent>
              <p>Upload image</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </Button>

      <Input
        ref={inputRef}
        type="file"
        style={{ display: 'none' }}
        onChange={handleFileChange}
        accept="image/*"
      />

    </>
  );
};

export default EditorUploadImage;
