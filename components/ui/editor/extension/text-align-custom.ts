// extension/align-custom.ts
import { Extension } from '@tiptap/core';

export interface AlignCustomOptions {
    types: string[]; // Các loại node mà bạn muốn áp dụng (ví dụ: 'paragraph', 'heading', 'imageCustom')
    alignments: string[]; // Các lựa chọn căn lề ('left', 'center', 'right', 'justify')
    defaultAlignment: string; // Căn lề mặc định
}

declare module '@tiptap/core' {
    interface Commands<ReturnType> {
        alignCustom: {
            setAlignCustom: (alignment: string) => ReturnType;
            unsetAlignCustom: () => ReturnType;
        };
    }
}

export const AlignCustom = Extension.create<AlignCustomOptions>({
    name: 'alignCustom',

    addOptions() {
        return {
            types: ['paragraph', 'heading', 'imageCustom'], // Các node hỗ trợ căn lề
            alignments: ['left', 'center', 'right', 'justify'],
            defaultAlignment: 'left',
        };
    },

    addGlobalAttributes() {
        return [
            {
                types: this.options.types,
                attributes: {
                    alignment: {
                        default: this.options.defaultAlignment,
                        parseHTML: (element) => {
                            const alignment = element.style.textAlign || element.style.justifyContent || this.options.defaultAlignment;
                            return this.options.alignments.includes(alignment) ? alignment : this.options.defaultAlignment;
                        },
                        renderHTML: (attributes) => {
                            const alignment = attributes.alignment || this.options.defaultAlignment;

                            if (alignment === 'left') {
                                return {}; // Không cần style cho căn trái
                            }

                            if (this.options.types.includes('imageCustom') && attributes.node?.type?.name === 'imageCustom') {
                                // Xử lý căn lề cho hình ảnh
                                let justifyContent = 'flex-start';
                                if (alignment === 'center') justifyContent = 'center';
                                if (alignment === 'right') justifyContent = 'flex-end';

                                return { style: `display: flex; justify-content: ${justifyContent};` };
                            }

                            return { style: `text-align: ${alignment};` };
                        },
                    },
                },
            },
        ];
    },

    addCommands() {
        return {
            setAlignCustom: (alignment: string) => ({ commands }) => {
                if (!this.options.alignments.includes(alignment)) {
                    return false;
                }

                return this.options.types
                    .map((type) => commands.updateAttributes(type, { alignment }))
                    .every((response) => response);
            },

            unsetAlignCustom: () => ({ commands }) => {
                return this.options.types
                    .map((type) => commands.resetAttributes(type, 'alignment'))
                    .every((response) => response);
            },
        };
    },

    addKeyboardShortcuts() {
        return {
            'Mod-Shift-l': () => this.editor.commands.setAlignCustom('left'),
            'Mod-Shift-e': () => this.editor.commands.setAlignCustom('center'),
            'Mod-Shift-r': () => this.editor.commands.setAlignCustom('right'),
            'Mod-Shift-j': () => this.editor.commands.setAlignCustom('justify'),
        };
    },
});
