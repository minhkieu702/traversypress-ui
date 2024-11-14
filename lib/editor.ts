import { JSONContent } from "@tiptap/core";
import Bold from "@tiptap/extension-bold";
import Document from "@tiptap/extension-document";
import HighlightRaw from "@tiptap/extension-highlight";
import Italic from "@tiptap/extension-italic";
import Paragraph from "@tiptap/extension-paragraph";
import Strike from "@tiptap/extension-strike";
import Text from "@tiptap/extension-text";
import Underline from "@tiptap/extension-underline";
import { generateHTML, generateJSON } from "@tiptap/html";

export type EditorTerm = {
    termRichText: JSON | null | undefined;
    definitionRichText: JSON | null | undefined;
};

// Glad you're here! https://arc.net/e/D8FDAA6B-8BCD-4D3B-AAE5-4A6756C42D45
export const HighlightExtension = HighlightRaw.extend({
    priority: 200,
    addKeyboardShortcuts() {
        return {
            "Mod-Shift-h": () =>
                this.editor.commands.toggleHighlight({
                    color: Highlight.Yellow + A,
                }),
        };
    },
});

export const SERIALIZABLE_EXTENSIONS = [
    Document,
    Paragraph,
    Text,
    Bold,
    Italic,
    Strike,
    Underline,
    HighlightExtension.configure({
        multicolor: true,
        HTMLAttributes: {
            class: "highlight",
        },
    }),
];

export const A = "7F";

export enum Highlight {
    Red = "#FC8181",
    Orange = "#F6AD55",
    Yellow = "#F6E05E",
    Green = "#68D391",
    Blue = "#63B3ED",
    Purple = "#B794F4",
    Pink = "#F687B3",
}

export const getPlainText = (json: JSONContent, delimiter = "\n"): string => {
    return (
        json.content
            ?.map((node: JSONContent) => {
                if (node.type === "text" && node.text) {
                    return node.text;
                }
                if (node.type === "paragraph") {
                    return getPlainText(node, "");
                }
                return "";
            })
            .join(delimiter) || ""
    );
};

export const plainTextToHtml = (text: string): string => {
    // Split by newlines and make each line a paragraph
    const paragraphs = text.split("\n").map((line) => `<p>${line}</p>`);
    return paragraphs.join("");
};

export const richTextToHtml = (json: JSONContent, breaks = false): string => {
    if (!json?.content) return "";
    const raw = generateHTML(json, SERIALIZABLE_EXTENSIONS);
    if (!breaks) return raw;
    return raw.replace(/<p><\/p>/g, "<p><br></p>");
};

export const getRichTextJson = (html: string) => {
    return generateJSON(html, SERIALIZABLE_EXTENSIONS) as JSON;
};

export const hasRichText = (json: JSONContent, plainText: string): boolean => {
    if (
        !json ||
        !json.content ||
        json.content.length === 0 ||
        json === undefined
    ) {
        // If json is invalid or empty, treat it as no rich text.
        return false;
    }

    const plainHtml = plainTextToHtml(plainText);
    const richHtml = richTextToHtml(json);

    // Compare the plain HTML to the generated rich HTML
    return plainHtml !== richHtml;
};

export const editorInput = (
    term: {
        term: string;
        definition: string;
        termRichText?: JSON | null;
        definitionRichText?: JSON | null;
    },
    type: "term" | "definition"
) => {
    if (type == "term") {
        return term.termRichText ?? plainTextToHtml(term.term);
    } else {
        return term.definitionRichText ?? plainTextToHtml(term.definition);
    }
};

export const bioInput = (bio: string | JSON | null) => {
    if (typeof bio === "string") {
        return plainTextToHtml(bio);
    } else if (bio && typeof bio === "object") {
        return bio;
    } else {
        return "";
    }
};

export const disscusionInput = (
    discussion: string,
    discussionRichText?: JSON | null
) => {
    return discussionRichText ?? plainTextToHtml(discussion);
};
