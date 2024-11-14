import { cn } from "@/lib/utils";
import { useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import {
    PopoverContent,
    Popover,
    PopoverTrigger,
} from "@/components/ui/popover";
import { Editor } from "@tiptap/react";
import { IconCheck, IconLink, IconUnlink } from "@tabler/icons-react";

export function isValidUrl(url: string) {
    try {
        new URL(url);
        return true;
    } catch {
        return false;
    }
}

export function getUrlFromString(str: string) {
    const trimmedStr = str.trim();
    if (isValidUrl(trimmedStr)) {
        return trimmedStr;
    }
    if (trimmedStr.includes(".") && !trimmedStr.includes(" ")) {
        try {
            return new URL(`https://${trimmedStr}`).toString();
        } catch {
            return null;
        }
    }
    return null;
}

interface LinkSelectorProps {
    activeEditor: Editor | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export const LinkSelector = ({
    activeEditor,
    open,
    onOpenChange,
}: LinkSelectorProps) => {
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (inputRef.current) {
            inputRef.current.focus();
        }
    }, []);

    if (!activeEditor) return null;

    return (
        <Popover modal={true} open={open} onOpenChange={onOpenChange}>
            <PopoverTrigger asChild>
                <Button
                    variant="ghost"
                    size="icon"
                    className="gap-2 rounded-full"
                >
                    <IconLink
                        size={18}
                        className={cn(
                            activeEditor.isActive("link") && "text-blue"
                        )}
                    />
                </Button>
            </PopoverTrigger>
            <PopoverContent align="start" className="w-60 p-0" sideOffset={10}>
                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        const input = e.currentTarget[0] as HTMLInputElement;
                        const url = getUrlFromString(input.value);
                        if (url) {
                            activeEditor
                                .chain()
                                .focus()
                                .setLink({ href: url })
                                .run();
                            onOpenChange(false);
                        }
                    }}
                    className="flex p-1"
                >
                    <input
                        ref={inputRef}
                        type="text"
                        placeholder="Paste a link"
                        className="flex-1 bg-background p-1 text-sm outline-none"
                        defaultValue={
                            activeEditor.getAttributes("link").href || ""
                        }
                    />
                    {activeEditor.getAttributes("link").href ? (
                        <Button
                            size="icon"
                            variant="outline"
                            type="button"
                            className="flex h-8 items-center rounded-sm p-1 text-red-600 transition-all hover:bg-red-100 dark:hover:bg-red-800"
                            onClick={() => {
                                activeEditor.chain().focus().unsetLink().run();
                                onOpenChange(false);
                            }}
                        >
                            <IconUnlink className="h-4 w-4" />
                        </Button>
                    ) : (
                        <Button size="icon" type="submit" className="h-8">
                            <IconCheck className="h-4 w-4" />
                        </Button>
                    )}
                </form>
            </PopoverContent>
        </Popover>
    );
};
