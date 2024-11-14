'use client';

import { RichTextBar } from '@/components/ui/editor/rich-text-bar';
import { Editor } from '@tiptap/react';
import { BubbleMenu } from '@tiptap/react';
import React from 'react';

interface BubbleMenuBarProps {
  activeEditor: Editor | null;
}

export const BubbleMenuBar = ({ activeEditor }: BubbleMenuBarProps) => {
  return (
    <>
      {activeEditor && (
        <BubbleMenu editor={activeEditor} tippyOptions={{ duration: 100 }}>
          <div className="flex flex-row items-center gap-x-1 rounded-full border bg-white px-2 py-1">
            <RichTextBar activeEditor={activeEditor} />
          </div>
        </BubbleMenu>
      )}
    </>
  );
};
