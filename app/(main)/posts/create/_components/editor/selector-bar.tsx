import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
    IconAlignCenter,
    IconAlignJustified,
    IconAlignLeft,
    IconAlignRight,
    IconArrowBackUp,
    IconArrowForwardUp,
    IconBold,
    IconItalic,
    IconStrikethrough,
    IconSubscript,
    IconSuperscript,
    IconUnderline,
} from "@tabler/icons-react";
import { Editor } from "@tiptap/react";
import { ColorSelector } from "./color-picker";
import { LinkSelector } from "./link-seletor";
import { useState } from "react";
import { HeadingSelector } from "./heading-seletor";
import { cn } from "@/lib/utils";
import EditorUploadImage from "@/components/ui/editor/editor-upload-image";
export interface SelectorBarProps {
    activeEditor: Editor | null;
}

export const SelectorBar = ({ activeEditor }: SelectorBarProps) => {
    const [openHeading, setOpenHeading] = useState<boolean>(false);
    const [openColor, setOpenColor] = useState<boolean>(false);
    const [openLink, setOpenLink] = useState<boolean>(false);

    if (!activeEditor) return null;

    const isActive = (format: string) => activeEditor.isActive(format);

    return (
        <div className="flex flex-row items-center gap-x-2 rounded-t-xl bg-white px-4 py-2 shadow-xl border border-b-0">
            <Button
                onClick={() => activeEditor.chain().focus().undo().run()}
                variant={"ghost"}
                size={"icon"}
                className={cn(
                    "rounded-full",
                    isActive("undo") && "bg-gray-100"
                )}
            >
                <IconArrowBackUp size={18} />
            </Button>
            <Button
                onClick={() => activeEditor.chain().focus().redo().run()}
                variant={"ghost"}
                size={"icon"}
                className={cn(
                    "rounded-full",
                    isActive("redo") && "bg-gray-100"
                )}
            >
                <IconArrowForwardUp size={18} />
            </Button>
            <Separator orientation="vertical" className="h-10" />

            <HeadingSelector
                editor={activeEditor}
                open={openHeading}
                onOpenChange={setOpenHeading}
            />

            <Separator orientation="vertical" className="h-10" />

            <Button
                onClick={() => activeEditor.chain().focus().toggleBold().run()}
                variant={"ghost"}
                size={"icon"}
                className={cn(
                    "rounded-full",
                    isActive("bold") && "bg-gray-100"
                )}
            >
                <IconBold size={18} />
            </Button>
            <Button
                onClick={() =>
                    activeEditor.chain().focus().toggleItalic().run()
                }
                variant={"ghost"}
                size={"icon"}
                className={cn(
                    "rounded-full",
                    isActive("italic") && "bg-gray-100"
                )}
            >
                <IconItalic size={18} />
            </Button>
            <Button
                onClick={() =>
                    activeEditor.chain().focus().toggleUnderline().run()
                }
                variant={"ghost"}
                size={"icon"}
                className={cn(
                    "rounded-full",
                    isActive("underline") && "bg-gray-100"
                )}
            >
                <IconUnderline size={18} />
            </Button>
            <Button
                onClick={() =>
                    activeEditor.chain().focus().toggleStrike().run()
                }
                variant={"ghost"}
                size={"icon"}
                className={cn(
                    "rounded-full",
                    isActive("strike") && "bg-gray-100"
                )}
            >
                <IconStrikethrough size={18} />
            </Button>

            <Separator orientation="vertical" className="h-10" />

            <Button
                onClick={() =>
                    activeEditor.chain().focus().toggleSubscript().run()
                }
                variant={"ghost"}
                size={"icon"}
                className={cn(
                    "rounded-full",
                    isActive("subscript") && "bg-gray-100"
                )}
            >
                <IconSubscript size={18} />
            </Button>
            <Button
                onClick={() =>
                    activeEditor.chain().focus().toggleSuperscript().run()
                }
                variant={"ghost"}
                size={"icon"}
                className={cn(
                    "rounded-full",
                    isActive("superscript") && "bg-gray-100"
                )}
            >
                <IconSuperscript size={18} />
            </Button>

            <Separator orientation="vertical" className="h-10" />

            <ColorSelector
                activeEditor={activeEditor}
                open={openColor}
                onOpenChange={setOpenColor}
            />

            <Separator orientation="vertical" className="h-10" />

            <Button
                onClick={() =>
                    activeEditor.chain().focus().setAlignCustom("left").run()
                }
                variant={"ghost"}
                size={"icon"}
                className={cn(
                    "rounded-full",
                    activeEditor.isActive({ textAlign: "left" }) &&
                        "bg-gray-100"
                )}
            >
                <IconAlignLeft size={18} />
            </Button>
            <Button
                onClick={() =>
                    activeEditor.chain().focus().setAlignCustom("center").run()
                }
                variant={"ghost"}
                size={"icon"}
                className={cn(
                    "rounded-full",
                    activeEditor.isActive({ textAlign: "center" }) &&
                        "bg-gray-100"
                )}
            >
                <IconAlignCenter size={18} />
            </Button>
            <Button
                onClick={() =>
                    activeEditor.chain().focus().setAlignCustom("right").run()
                }
                variant={"ghost"}
                size={"icon"}
                className={cn(
                    "rounded-full",
                    activeEditor.isActive({ textAlign: "right" }) &&
                        "bg-gray-100"
                )}
            >
                <IconAlignRight size={18} />
            </Button>
            <Button
                onClick={() =>
                    activeEditor.chain().focus().setAlignCustom("justify").run()
                }
                variant={"ghost"}
                size={"icon"}
                className={cn(
                    "rounded-full",
                    activeEditor.isActive({ textAlign: "justify" }) &&
                        "bg-gray-100"
                )}
            >
                <IconAlignJustified size={18} />
            </Button>

            <Separator orientation="vertical" className="h-10" />

            <LinkSelector
                activeEditor={activeEditor}
                open={openLink}
                onOpenChange={setOpenLink}
            />

            <EditorUploadImage activeEditor={activeEditor} />
        </div>
    );
};
