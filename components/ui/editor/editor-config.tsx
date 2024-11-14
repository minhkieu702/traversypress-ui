import Bold from "@tiptap/extension-bold";
import Document from "@tiptap/extension-document";
import History from "@tiptap/extension-history";
import Italic from "@tiptap/extension-italic";
import Paragraph from "@tiptap/extension-paragraph";
import Strike from "@tiptap/extension-strike";
import Text from "@tiptap/extension-text";
import Typography from "@tiptap/extension-typography";
import Underline from "@tiptap/extension-underline";
import Subscript from "@tiptap/extension-subscript";
import Superscript from "@tiptap/extension-superscript";
import TextStyle from "@tiptap/extension-text-style";
import { Color } from "@tiptap/extension-color";
import Link from "@tiptap/extension-link";
import Heading from "@tiptap/extension-heading";

import type { Extension, useEditor } from "@tiptap/react";

import { EmojiReplacer } from "./extension/emoji-replacer";
import { cx } from "class-variance-authority";
import { ImageCustom } from "./extension/image-custom";
import { AlignCustom } from "./extension/text-align-custom";
import { storageCustom } from "./extension/storage-custom";
import { HighlightExtension } from "@/lib/editor";

const grayBorder = "border-b-[2px]";
const blueBorder = "focus:border-b-blue focus:border-b-[2px]";
const boxShadow =
    "focus:shadow-[0px_1px_0px_0px_var(--chakra-colors-blue-300)]";

export const editorAttributes = (tabIndex?: number) => ({
    class: `focus:outline-none py-[7px] border-b-[1px] transition-[border,box-shadow] ${grayBorder}  ${blueBorder}  ${boxShadow}`,
    ...(tabIndex !== undefined ? { tabindex: `${tabIndex}` } : {}),
});

export const editorConfig = (
    tabIndex?: number,
    extensions?: Extension[]
): Parameters<typeof useEditor>[0] => ({
    extensions: [
        Document,
        Paragraph,
        Text,
        Typography,
        Bold,
        Italic,
        Strike,
        Underline,
        HighlightExtension.configure({
            multicolor: true,
        }),
        EmojiReplacer,
        History.configure({
            depth: 20,
        }),
        ...(extensions || []),
    ],
    editorProps: {
        attributes: editorAttributes(tabIndex),
    },
});

export const customEditorConfig = (
    extensions?: Extension[]
): Parameters<typeof useEditor>[0] => ({
    extensions: [
        Document,
        Paragraph,
        Text,
        Typography,
        Bold,
        Italic,
        Strike,
        Underline,
        Subscript,
        Link.configure({
            HTMLAttributes: {
                class: cx(
                    "text-muted-foreground underline underline-offset-[3px] hover:text-primary transition-colors cursor-pointer"
                ),
            },
        }),
        Superscript,
        TextStyle,
        Color,
        Heading,
        HighlightExtension.configure({
            multicolor: true,
        }),
        EmojiReplacer,
        History.configure({
            depth: 20,
        }),
        ImageCustom,
        AlignCustom.configure({
            types: ["paragraph", "heading", "imageCustom", "img"],
        }),
        storageCustom,
        ...(extensions || []),
    ],
    editorProps: {
        // handleDOMEvents: {
        //   keydown: (_view, event) => handleCommandNavigation(event)
        // },
        // handlePaste: (view, event) => handleImagePaste(view, event, uploadFn),
        // handleDrop: (view, event, _slice, moved) => handleImageDrop(view, event, moved, uploadFn),
        attributes: {
            class: `prose prose-lg dark:prose-invert prose-headings:font-title font-default focus:outline-none max-w-full`,
        },
    },
});
