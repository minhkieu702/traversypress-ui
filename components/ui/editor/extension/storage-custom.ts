import { Extension } from '@tiptap/core';

declare module '@tiptap/core' {
    interface Commands<ReturnType> {
        storageCustom: {
            getContentText: () => ReturnType;
            getContentHtml: () => ReturnType;
            getUploadedImages: () => ReturnType;
        };
    }
}

export const storageCustom = Extension.create({
    name: 'storageCustom',

    addStorage() {
        return {
            contentText: '',
            contentHtml: '',
            uploadedImages: [] as string[],
        };
    },

    addCommands() {
        return {
            // Command to get text content
            getContentText: () => ({ editor }) => {
                return editor.storage.storageCustom.contentText;
            },

            // Command to get HTML content
            getContentHtml: () => ({ editor }) => {
                return editor.storage.storageCustom.contentHtml;
            },

            // Command to get list of uploaded images
            getUploadedImages: () => ({ editor }) => {
                return editor.storage.storageCustom.uploadedImages;
            },
        };
    },

    onUpdate() {
        const editor = this.editor;

        // Ensure contentText and contentHtml are up to date
        this.storage.contentText = editor.getText();
        this.storage.contentHtml = editor.getHTML();
    },
});
