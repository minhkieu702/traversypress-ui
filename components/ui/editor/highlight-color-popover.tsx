import type { Editor } from "@tiptap/core";
import React from "react";

import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { A, Highlight } from "@/lib/editor";
import { IconCircle, IconClearFormatting } from "@tabler/icons-react";
import { useOutsideClick } from "./use-out-side-click";

export interface HighlightColorPopoverProps {
    activeEditor: Editor | null;
}

export const HighlightColorPopover: React.FC<HighlightColorPopoverProps> = ({
    activeEditor,
}) => {
    const [isOpen, setIsOpen] = React.useState(false);
    const isActive = activeEditor?.isActive("highlight");
    const attributes = activeEditor?.getAttributes("highlight");
    const color = isActive ? (attributes?.color as string) : undefined;

    const ref = useOutsideClick(() => {
        setIsOpen(false);
    });

    return (
        <div ref={ref}>
            <Popover open={isOpen} onOpenChange={setIsOpen}>
                <PopoverTrigger asChild>
                    <div className={cn("relative h-6 w-6")}>
                        <Button
                            onMouseDown={(e) => e.preventDefault()}
                            onClick={(e) => {
                                e.preventDefault();
                                setIsOpen((o) => !o);
                            }}
                            variant={"ghost"}
                            size={"icon"}
                            className={cn(
                                "absolute left-0 top-0 h-full w-full rounded-full",
                                isActive && "bg-gray-300"
                            )}
                        >
                            <div className="absolute h-4 w-4">
                                <IconCircle size={16} />
                                <div className="absolute inset-0 flex h-full w-full items-center justify-center">
                                    <div
                                        className={`transition-background relative h-[7px] w-[7px] rounded-full duration-200 ease-in-out`}
                                        style={{
                                            backgroundColor: color
                                                ? color.slice(0, 7)
                                                : undefined,
                                        }}
                                    >
                                        <div
                                            className={`absolute inset-0 h-full w-full rounded-full transition-opacity duration-200 ease-in-out`}
                                            style={{
                                                opacity: color ? 0 : 1,
                                                backgroundImage:
                                                    "conic-gradient(#FC8181, #F6AD55, #F6E05E, #68D391, #63B3ED)",
                                            }}
                                        />
                                    </div>
                                </div>
                            </div>
                        </Button>
                    </div>
                </PopoverTrigger>
                <PopoverContent
                    onOpenAutoFocus={(e) => e.preventDefault()}
                    side="top"
                    sideOffset={10}
                    className="w-full p-[4px]"
                >
                    <div className="flex flex-row items-center gap-x-1">
                        {Object.values(Highlight).map((color) => (
                            <Button
                                className="h-4 w-4"
                                variant={"ghost"}
                                size={"icon"}
                                key={color}
                                onMouseDown={(e) => e.preventDefault()}
                                onClick={() => {
                                    activeEditor
                                        ?.chain()
                                        .focus()
                                        .toggleHighlight({ color: color + A })
                                        .run();
                                    setIsOpen(false);
                                }}
                                aria-label={color}
                            >
                                <div
                                    className="h-3 w-3 rounded-full"
                                    style={{ background: color }}
                                ></div>
                            </Button>
                        ))}
                        <Button
                            className="h-4 w-4"
                            variant={"ghost"}
                            size={"icon"}
                            key={color}
                            onMouseDown={(e) => e.preventDefault()}
                            onClick={() => {
                                activeEditor
                                    ?.chain()
                                    .focus()
                                    .unsetHighlight()
                                    .run();
                                setIsOpen(false);
                            }}
                            aria-label={color}
                        >
                            <IconClearFormatting size={16} />
                        </Button>
                    </div>
                </PopoverContent>
            </Popover>
        </div>
    );
};
