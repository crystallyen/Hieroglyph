import { Mark } from '@tiptap/core';

export const AiLoading = Mark.create({
    name: 'aiLoading',

    parseHTML() {
        return [{ tag: 'span.ai-loading' }];
    },

    renderHTML({ HTMLAttributes }) {
        return ['span', { ...HTMLAttributes, class: 'ai-loading' }, 0];
    },
});
