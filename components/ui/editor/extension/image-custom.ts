
import { mergeAttributes, Node } from '@tiptap/core';

export interface ImageOptions {
    inline: boolean;
    allowBase64: boolean;
    HTMLAttributes: Record<string, string>;
}

declare module '@tiptap/core' {
    interface Commands<ReturnType> {
        imageCustom: {
            setImageCustom: (options: { src: string; alt?: string; title?: string; alignment?: 'left' | 'center' | 'right'; width?: string; height?: string }) => ReturnType;
            updateImageAlignment: (alignment: 'left' | 'center' | 'right') => ReturnType;
            updateImageSize: (width: string, height: string) => ReturnType;
            listUploadedImages: () => ReturnType;
        };
    }
}

export const ImageCustom = Node.create({
    name: 'imageCustom',

    addOptions() {
        return {
            inline: false,
            allowBase64: false,
            HTMLAttributes: {},
        };
    },

    inline() {
        return this.options.inline;
    },

    group() {
        return this.options.inline ? 'inline' : 'block';
    },

    addStorage() {
        return {
            uploadedImages: [] as string[], // Store image URLs or base64 strings
        };
    },

    draggable: true,

    addAttributes() {
        return {
            src: { default: null },
            alt: { default: null },
            title: { default: null },
            alignment: { default: 'left' },
            width: { default: 'auto' },
            height: { default: 'auto' },
        };
    },

    onCreate() {
        // Initialize `selectedImages` in editor storage if it doesn't exist
        console.log('onCreate');
        if (!this.editor.storage.selectedImages) {
            console.log('Initializing selectedImages');
            this.editor.storage.selectedImages = new Set();
        }
    },

    parseHTML() {
        return [
            {
                tag: this.options.allowBase64 ? 'img[src]' : 'img[src]:not([src^="data:"])',
            },
        ];
    },

    renderHTML({ HTMLAttributes }) {
        const alignment = HTMLAttributes.alignment || 'left';
        let justifyContent = 'flex-start';
        switch (alignment) {
            case 'center':
                justifyContent = 'center';
                break;
            case 'right':
                justifyContent = 'flex-end';
                break;
        }

        return [
            'div',
            { style: `display: flex; justify-content: ${justifyContent};` },
            [
                'img',
                mergeAttributes(this.options.HTMLAttributes, HTMLAttributes, {
                    style: `width: ${HTMLAttributes.width || 'auto'}; height: ${HTMLAttributes.height || 'auto'};`,
                }),
            ],
        ];
    },

    addCommands() {
        return {
            setImageCustom:
                (options) =>
                    ({ commands, editor }) => {
                        // Store the image in storage when adding it to the editor
                        if (options.src) {
                            editor.storage.storageCustom.uploadedImages.push(options.src); // Store image URL or base64 in storage
                        }

                        return commands.insertContent({
                            type: this.name,
                            attrs: options,
                        });
                    },

            updateImageAlignment:
                (alignment) =>
                    ({ commands, state }) => {
                        const { selection } = state;
                        const node = state.doc.nodeAt(selection.from);

                        if (node?.type.name === 'imageCustom') {
                            return commands.updateAttributes('imageCustom', { alignment });
                        }

                        return false;
                    },

            updateImageSize:
                (width, height) =>
                    ({ commands, state }) => {
                        const { selection } = state;
                        const node = state.doc.nodeAt(selection.from);

                        if (node?.type.name === 'imageCustom') {
                            return commands.updateAttributes('imageCustom', { width, height });
                        }

                        return false;
                    },

            listUploadedImages: () => () => {
                return this.storage.uploadedImages;
            },

        };
    },

    addNodeView() {
        return ({ node, editor }) => {
            const dom = document.createElement('div');
            dom.style.display = 'flex';
            dom.style.position = 'relative';

            // apply `alignment` to `img`
            if (node.attrs.alignment === 'center') {
                dom.style.justifyContent = 'center';
            } else if (node.attrs.alignment === 'right') {
                dom.style.justifyContent = 'flex-end';
            } else {
                dom.style.justifyContent = 'flex-start';
            }


            const img = document.createElement('img');
            img.src = node.attrs.src;
            img.alt = node.attrs.alt || '';
            img.title = node.attrs.title || '';
            img.style.width = node.attrs.width || 'auto';
            img.style.height = node.attrs.height || 'auto';
            img.classList.add('resizable-image', 'image-upload-content');

            const handle = document.createElement('div');
            handle.style.position = 'absolute';
            handle.style.bottom = '0';
            handle.style.right = '0';
            handle.style.cursor = 'nwse-resize';
            handle.classList.add('resize-handle');
            handle.innerHTML = '+';
            handle.style.display = 'none';

            dom.appendChild(img);
            dom.appendChild(handle);

            img.addEventListener('click', () => {
                handle.style.display = 'block';
            });

            document.addEventListener('click', (event) => {
                const target = event.target as HTMLElement;
                if (!dom.contains(target)) {
                    handle.style.display = 'none';
                }
            });

            // Update handle position based on img alignment and size
            const updateHandlePosition = (alignment: string) => {
                const imgRect = img.getBoundingClientRect();
                const domRect = dom.getBoundingClientRect();

                // Determine horizontal position of handle based on alignment
                let leftOffset;
                if (alignment === 'center') {
                    leftOffset = (domRect.width - imgRect.width) / 2 + imgRect.width - 15; // Center alignment
                } else if (alignment === 'right') {
                    leftOffset = domRect.width - imgRect.width + imgRect.width - 15; // Right alignment
                } else {
                    leftOffset = imgRect.width - 15; // Left alignment (default)
                }

                // Position the handle at the bottom-right corner of the image
                handle.style.left = `${leftOffset}px`;
                handle.style.top = `${imgRect.height - 15}px`;
            };



            let startX: number, startY: number, startWidth: number, startHeight: number;

            const onMouseDown = (event: MouseEvent) => {
                startX = event.clientX;
                startY = event.clientY;
                startWidth = img.clientWidth;
                startHeight = img.clientHeight;

                document.addEventListener('mousemove', onMouseMove);
                document.addEventListener('mouseup', onMouseUp);
                event.preventDefault();
            };

            const onMouseMove = (event: MouseEvent) => {
                const width = startWidth + (event.clientX - startX);
                const height = startHeight + (event.clientY - startY);

                img.style.width = `${width}px`;
                img.style.height = `${height}px`;

                editor
                    .chain()
                    .focus()
                    .updateAttributes('imageCustom', {
                        width: `${width}px`,
                        height: `${height}px`,
                    })
                    .run();
            };

            const onMouseUp = () => {
                document.removeEventListener('mousemove', onMouseMove);
                document.removeEventListener('mouseup', onMouseUp);
            };

            handle.addEventListener('mousedown', onMouseDown);


            return {
                dom,
                update: (updatedNode) => {
                    if (updatedNode.type.name !== 'imageCustom') return false;
                    img.src = updatedNode.attrs.src;
                    img.style.width = updatedNode.attrs.width || 'auto';
                    img.style.height = updatedNode.attrs.height || 'auto';

                    // Cập nhật `alignment`
                    if (updatedNode.attrs.alignment === 'center') {
                        dom.style.justifyContent = 'center';
                    } else if (updatedNode.attrs.alignment === 'right') {
                        dom.style.justifyContent = 'flex-end';
                    } else {
                        dom.style.justifyContent = 'flex-start';
                    }

                    updateHandlePosition(updatedNode.attrs.alignment);  // Ensure handle aligns after update

                    return true;
                },
                destroy() {
                    handle.removeEventListener('mousedown', onMouseDown);
                    img.removeEventListener('click', () => {
                        handle.style.display = 'block';
                    });
                    document.removeEventListener('click', (event) => {
                        const target = event.target as HTMLElement;
                        if (!dom.contains(target)) {
                            handle.style.display = 'none';
                        }
                    });
                },
            };
        };
    },
});
