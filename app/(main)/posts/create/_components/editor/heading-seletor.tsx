import { Popover } from '@radix-ui/react-popover';
import { PopoverContent, PopoverTrigger } from '@/components//ui/popover';
import { Button } from '@/components//ui/button';
import { Editor } from '@tiptap/react';
import {
  IconCheck,
  IconChevronDown,
  IconH1,
  IconH2,
  IconH3,
  IconLetterT,
  TablerIcon
} from '@tabler/icons-react';

export type SelectorItem = {
  name: string;
  icon: TablerIcon;
  command: (editor: Editor) => void;
  isActive: (editor: Editor) => boolean;
};

const items: SelectorItem[] = [
  {
    name: 'Text',
    icon: IconLetterT,
    command: (editor) => editor.chain().focus().clearNodes().run(),
    // I feel like there has to be a more efficient way to do this – feel free to PR if you know how!
    isActive: (editor) =>
      editor.isActive('paragraph') &&
      !editor.isActive('bulletList') &&
      !editor.isActive('orderedList')
  },
  {
    name: 'Heading 1',
    icon: IconH1,
    command: (editor) =>
      editor.chain().focus().clearNodes().toggleHeading({ level: 1 }).run(),
    isActive: (editor) => editor.isActive('heading', { level: 1 })
  },
  {
    name: 'Heading 2',
    icon: IconH2,
    command: (editor) =>
      editor.chain().focus().clearNodes().toggleHeading({ level: 2 }).run(),
    isActive: (editor) => editor.isActive('heading', { level: 2 })
  },
  {
    name: 'Heading 3',
    icon: IconH3,
    command: (editor) =>
      editor.chain().focus().clearNodes().toggleHeading({ level: 3 }).run(),
    isActive: (editor) => editor.isActive('heading', { level: 3 })
  }
  // {
  //   name: 'To-do List',
  //   icon: CheckSquare,
  //   command: (editor) => editor.chain().focus().clearNodes().toggleTaskList().run(),
  //   isActive: (editor) => editor.isActive('taskItem')
  // },
  // {
  //   name: 'Bullet List',
  //   icon: ListOrdered,
  //   command: (editor) => editor.chain().focus().clearNodes().toggleBulletList().run(),
  //   isActive: (editor) => editor.isActive('bulletList')
  // },
  // {
  //   name: 'Numbered List',
  //   icon: ListOrdered,
  //   command: (editor) => editor.chain().focus().clearNodes().toggleOrderedList().run(),
  //   isActive: (editor) => editor.isActive('orderedList')
  // },
  // {
  //   name: 'Quote',
  //   icon: TextQuote,
  //   command: (editor) => editor.chain().focus().clearNodes().toggleBlockquote().run(),
  //   isActive: (editor) => editor.isActive('blockquote')
  // },
  // {
  //   name: 'Code',
  //   icon: Code,
  //   command: (editor) => editor.chain().focus().clearNodes().toggleCodeBlock().run(),
  //   isActive: (editor) => editor.isActive('codeBlock')
  // }
];
interface HeadingSelectorProps {
  editor: Editor;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const HeadingSelector = ({
  editor,
  open,
  onOpenChange
}: HeadingSelectorProps) => {
  if (!editor) return null;

  const activeItem = items.filter((item) => item.isActive(editor)).pop() ?? {
    name: 'Multiple'
  };

  return (
    <Popover modal={true} open={open} onOpenChange={onOpenChange}>
      <PopoverTrigger
        asChild
        className="gap-2 border-none hover:bg-accent focus:ring-0"
      >
        <Button variant="ghost" className="gap-2">
          <span className="whitespace-nowrap text-lg">{activeItem.name}</span>
          <IconChevronDown className="h-4 w-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent sideOffset={5} align="start" className="w-48 p-1">
        {items.map((item, index) => (
          <div
            key={index}
            onClick={() => {
              item.command(editor);
              onOpenChange(false);
            }}
            className="flex cursor-pointer items-center justify-between rounded-sm px-2 py-1 text-sm hover:bg-accent"
          >
            <div className="flex items-center space-x-2">
              <div className="rounded-sm border p-1">
                <item.icon size={18} />
              </div>
              <span>{item.name}</span>
            </div>
            {activeItem.name === item.name && <IconCheck className="h-4 w-4" />}
          </div>
        ))}
      </PopoverContent>
    </Popover>
  );
};
