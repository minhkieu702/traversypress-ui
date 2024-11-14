"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { Editor } from "@tiptap/core";
import { ContentEditor } from "./_components/editor";
import { axiosClientUpload } from "@/lib/axios";

export default function CreatePostPage() {
    const [inputValue, setInputValue] = useState<string>("");
    const [inputImage, setInputImage] = useState<File | null>(null);
    const [editorInstance, setEditorInstance] = useState<Editor | null>(null);
    const contentHtml = editorInstance?.getHTML() ?? "";

    const handleOnChangeSelectImage = (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        const file = event.target?.files?.[0];
        if (file) {
            setInputImage(file);
        } else {
            setInputImage(null);
        }
    };

    const handleCreate = async () => {
        if (!editorInstance) {
            return;
        }
        const formData = {
            title: inputValue,
            content: editorInstance.getText(),
            contentHtml: editorInstance.getHTML(),
            thumbnail: inputImage,
        };

        const response = await axiosClientUpload.post(`/v1/blog`, formData);

        console.log(response);
    };

    return (
        <div className="flex flex-col gap-10">
            <div className="flex flex-row justify-between items-center">
                <h1 className="text-3xl">Create post</h1>
                <Button onClick={handleCreate}>Create</Button>
            </div>
            <div className="flex flex-col gap-y-2">
                <div>Title</div>
                <Input onChange={(e) => setInputValue(e.target.value)} />
            </div>
            <div className="flex flex-col gap-y-2">
                <div>Thumbnail</div>
                <Input
                    type="file"
                    onChange={handleOnChangeSelectImage}
                    className="file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                />
            </div>

            <div className="flex flex-col gap-y-2">
                <div>Content</div>
                <ContentEditor
                    setEditor={setEditorInstance}
                    contentHtml={contentHtml}
                />
            </div>
        </div>
    );
}
