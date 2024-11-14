import { Check, ChevronDown } from 'lucide-react';
import {
  PopoverTrigger,
  Popover,
  PopoverContent
} from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Editor } from '@tiptap/react';

export interface BubbleColorMenuItem {
  name: string;
  color: string;
}

const TEXT_COLORS: BubbleColorMenuItem[] = [
  { name: 'Default', color: 'var(--novel-black)' },
  { name: 'Purple', color: '#9333EA' },
  { name: 'Red', color: '#E00000' },
  { name: 'Yellow', color: '#EAB308' },
  { name: 'Blue', color: '#2563EB' },
  { name: 'Green', color: '#008A00' },
  { name: 'Orange', color: '#FFA500' },
  { name: 'Pink', color: '#BA4081' }
];

const HIGHLIGHT_COLORS: BubbleColorMenuItem[] = [
  { name: 'Default', color: 'var(--novel-highlight-default)' },
  { name: 'Purple', color: '#b6add8' },
  { name: 'Red', color: '#FC8181' },
  { name: 'Yellow', color: '#F6E05E' },
  { name: 'Blue', color: '#63B3ED' },
  { name: 'Green', color: '#68D391' },
  { name: 'Orange', color: '#F6AD55' },
  { name: 'Pink', color: '#F1A5c7' }
];

interface ColorSelectorProps {
  activeEditor: Editor | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const ColorSelector = ({
  activeEditor,
  open,
  onOpenChange
}: ColorSelectorProps) => {
  if (!activeEditor) return null;
  const activeColorItem = TEXT_COLORS.find(({ color }) =>
    activeEditor.isActive('textStyle', { color })
  );
  const activeHighlightItem = HIGHLIGHT_COLORS.find(({ color }) =>
    activeEditor.isActive('highlight', { color })
  );

  return (
    <Popover modal={true} open={open} onOpenChange={onOpenChange}>
      <PopoverTrigger asChild>
        <Button className="gap-2" variant="ghost">
          <span
            className="rounded-sm px-1 text-lg"
            style={{
              color: activeColorItem?.color,
              backgroundColor: activeHighlightItem?.color
            }}
          >
            A
          </span>
          <ChevronDown className="h-5 w-5" />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        sideOffset={5}
        className="my-1 flex max-h-80 w-48 flex-col overflow-hidden overflow-y-auto rounded border p-1 shadow-xl"
        align="start"
      >
        <div className="flex flex-col">
          <div className="my-1 px-2 text-sm font-semibold text-muted-foreground">
            Color
          </div>
          {TEXT_COLORS.map(({ name, color }, index) => (
            <div
              key={index}
              onClick={() => {
                activeEditor
                  .chain()
                  .focus()
                  .unsetColor()
                  .setColor(name !== 'Default' ? color : '')
                  .run();
                onOpenChange(false);
              }}
              className="flex cursor-pointer items-center justify-between px-2 py-1 text-sm hover:bg-accent"
            >
              <div className="flex items-center gap-2">
                <div
                  className="rounded-sm border px-2 py-px font-medium"
                  style={{ color }}
                >
                  A
                </div>
                <span>{name}</span>
              </div>
              {activeEditor.isActive('textStyle', { color }) && (
                <Check className="h-4 w-4" />
              )}
            </div>
          ))}
        </div>
        <div>
          <div className="my-1 px-2 text-sm font-semibold text-muted-foreground">
            Background
          </div>
          {HIGHLIGHT_COLORS.map(({ name, color }, index) => (
            <div
              key={index}
              onClick={() => {
                activeEditor
                  .chain()
                  .focus()
                  .unsetHighlight()
                  .setHighlight({ color: name !== 'Default' ? color : '' })
                  .run();
                onOpenChange(false);
              }}
              className="flex cursor-pointer items-center justify-between px-2 py-1 text-sm hover:bg-accent"
            >
              <div className="flex items-center gap-2">
                <div
                  className="rounded-sm border px-2 py-px font-medium"
                  style={{ backgroundColor: color }}
                >
                  A
                </div>
                <span>{name}</span>
              </div>
              {activeEditor.isActive('highlight', { color }) && (
                <Check className="h-4 w-4" />
              )}
            </div>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
};
