"use client";

import { BubbleMenuBar } from "./editor/bubble-menu";
import { SelectorBar } from "./editor/selector-bar";
import { customEditorConfig } from "@/components/ui/editor/editor-config";
import { EditorGlobalStyles } from "@/components/ui/editor/editor-global-style";
import { Editor, EditorContent, useEditor } from "@tiptap/react";
import React, { useState } from "react";

type Props = {
    setEditor: React.Dispatch<React.SetStateAction<Editor | null>>;
    contentHtml: string;
};

export const ContentEditor = (props: Props) => {
    const [theoryFocused, setTheoryFocused] = useState<boolean>(false);

    const contentEditor = useEditor({
        ...customEditorConfig(),
        content: props.contentHtml,
        immediatelyRender: false,
        onCreate: ({ editor }) => {
            if (theoryFocused) {
                editor.chain().focus();
            }
            if (props.setEditor) {
                props.setEditor(editor);
            }
        },
    });

    return (
        <div className="w-full">
            <SelectorBar activeEditor={contentEditor} />
            <EditorGlobalStyles />
            <BubbleMenuBar activeEditor={contentEditor} />
            <div
                onFocus={() => setTheoryFocused(true)}
                onBlur={() => setTheoryFocused(false)}
            >
                {contentEditor && (
                    <EditorContent
                        editor={contentEditor}
                        className="rounded-b-xl border bg-white px-8 py-4 outline-none focus-visible:ring-0"
                        style={{ minHeight: "330px" }}
                        placeholder="Start writing your news here..."
                    />
                )}
            </div>
        </div>
    );
};
