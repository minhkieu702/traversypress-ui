// extension/image-resize.ts

import { Node, mergeAttributes } from '@tiptap/core';

export const ImageResizeExtension = Node.create({
    name: 'imageResize',

    addOptions() {
        return {
            inline: false,
            HTMLAttributes: {},
        };
    },

    inline() {
        return this.options.inline;
    },

    group() {
        return this.options.inline ? 'inline' : 'block';
    },

    draggable: true,

    addAttributes() {
        return {
            src: { default: null },
            alt: { default: null },
            title: { default: null },
            width: { default: 'auto' },
            height: { default: 'auto' },
        };
    },

    parseHTML() {
        return [{ tag: 'img[src]' }];
    },

    renderHTML({ HTMLAttributes }) {
        return ['img', mergeAttributes(this.options.HTMLAttributes, HTMLAttributes)];
    },

    addNodeView() {
        return ({ node, editor }) => {
            const dom = document.createElement('div');
            dom.style.position = 'relative';
            dom.style.display = 'inline-block';

            const img = document.createElement('img');
            img.src = node.attrs.src;
            img.alt = node.attrs.alt || '';
            img.title = node.attrs.title || '';
            img.style.width = node.attrs.width || 'auto';
            img.style.height = node.attrs.height || 'auto';
            img.classList.add('resizable-image');

            const handle = document.createElement('div');
            handle.style.position = 'absolute';
            handle.style.width = '10px';
            handle.style.height = '10px';
            handle.style.backgroundColor = 'blue';
            handle.style.bottom = '0';
            handle.style.right = '0';
            handle.style.cursor = 'nwse-resize';
            handle.classList.add('resize-handle');

            dom.appendChild(img);
            dom.appendChild(handle);

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

                editor.chain().focus().updateAttributes('imageResize', {
                    width: `${width}px`,
                    height: `${height}px`,
                }).run();
            };

            const onMouseUp = () => {
                document.removeEventListener('mousemove', onMouseMove);
                document.removeEventListener('mouseup', onMouseUp);
            };

            handle.addEventListener('mousedown', onMouseDown);

            return {
                dom,
                update: (updatedNode) => {
                    if (updatedNode.type.name !== 'imageResize') return false;
                    img.src = updatedNode.attrs.src;
                    img.style.width = updatedNode.attrs.width || 'auto';
                    img.style.height = updatedNode.attrs.height || 'auto';
                    return true;
                },
                destroy() {
                    handle.removeEventListener('mousedown', onMouseDown);
                },
            };
        };
    },
});
