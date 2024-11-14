import type { Editor } from '@tiptap/core';

import { RichTextProperty } from './rich-text-property';
import { HighlightColorPopover } from './highlight-color-popover';
import {
  IconBold,
  IconItalic,
  IconStrikethrough,
  IconUnderline
} from '@tabler/icons-react';

export interface RichTextBarProps {
  activeEditor: Editor | null;
}

export const RichTextBar: React.FC<RichTextBarProps> = ({ activeEditor }) => {
  return (
    <>
      <div className="flex w-fit flex-row gap-x-1 rounded-full bg-secondary/50 p-1 shadow-sm">
        <RichTextProperty
          icon={<IconBold size={16} />}
          label="bold"
          onClick={() => activeEditor?.chain().focus().toggleBold().run()}
          isActive={activeEditor?.isActive('bold')}
        />
        <RichTextProperty
          icon={<IconItalic size={16} />}
          label="Italic"
          onClick={() => activeEditor?.chain().focus().toggleItalic().run()}
          isActive={activeEditor?.isActive('italic')}
        />
        <RichTextProperty
          icon={<IconUnderline size={16} />}
          label="Underline"
          onClick={() => activeEditor?.chain().focus().toggleUnderline().run()}
          isActive={activeEditor?.isActive('underline')}
        />
        <RichTextProperty
          icon={<IconStrikethrough size={16} />}
          label="Strikethrough"
          onClick={() => activeEditor?.chain().focus().toggleStrike().run()}
          isActive={activeEditor?.isActive('strike')}
        />
        <HighlightColorPopover activeEditor={activeEditor} />
      </div>
    </>
  );
};
