import { Extension } from '@tiptap/core';
import { Node, mergeAttributes } from '@tiptap/core';
import { Node as PMNode } from '@tiptap/pm/model';
import { Plugin, PluginKey, TextSelection } from '@tiptap/pm/state';
import { useEffect } from 'react';

export const PageNode = Node.create({
    name: 'page',
    group: 'block',
    content: 'block+',
    defining: true,
    isolating: true,

    parseHTML() {
        return [
            {
                tag: 'div[data-page]',
            },
        ];
    },

    renderHTML({ HTMLAttributes }) {
        return ['div', mergeAttributes(HTMLAttributes, { 'data-page': true, class: 'editor-page' }), 0];
    },

    addNodeView() {
        return () => {
            const dom = document.createElement('div');
            dom.setAttribute('data-page', 'true');
            dom.classList.add('editor-page');
            dom.style.position = 'relative';

            const contentDOM = document.createElement('div');
            contentDOM.classList.add('page-content');
            dom.appendChild(contentDOM);

            return {
                dom,
                contentDOM,
            };
        };
    },
});

export const PaginationExtension = Extension.create({
    name: 'pagination',

    addProseMirrorPlugins() {
        return [
            new Plugin({
                key: new PluginKey('pagination'),
                appendTransaction: (transactions, oldState, newState) => {
                    const paginationMeta = 'pagination';
                    const lastTransaction = transactions[transactions.length - 1];
                    const isPaginationTransaction = lastTransaction?.getMeta(paginationMeta);

                    if (isPaginationTransaction || !lastTransaction?.docChanged) {
                        return null;
                    }

                    const { schema } = newState;
                    const pageType = schema.nodes.page;

                    if (!pageType) {
                        return null;
                    }

                    const contentNodes = [];

                    newState.doc.forEach((node) => {
                        if (node.type === pageType) {
                            node.forEach((child) => contentNodes.push(child));
                        } else {
                            contentNodes.push(node);
                        }
                    });

                    const pages = [];
                    let currentPageContent = [];
                    let currentHeight = 0;
                    const lineHeight = 24;
                    const pagePadding = 25.4 * 3.77953;
                    const pageHeight = (297 * 3.77953) - (2 * pagePadding);

                    for (const node of contentNodes) {
                        const nodeHeight = estimateNodeHeight(node, lineHeight);

                        if (currentHeight + nodeHeight > pageHeight && currentPageContent.length > 0) {
                            pages.push(pageType.create({}, currentPageContent));
                            currentPageContent = [node];
                            currentHeight = nodeHeight;
                        } else {
                            currentPageContent.push(node);
                            currentHeight += nodeHeight;
                        }
                    }

                    if (currentPageContent.length > 0) {
                        pages.push(pageType.create({}, currentPageContent));
                    }

                    const newDoc = schema.topNodeType.create(null, pages);

                    if (newDoc.content.eq(newState.doc.content)) {
                        return null;
                    }

                    const tr = newState.tr.replaceWith(0, newState.doc.content.size, newDoc.content);
                    tr.setMeta(paginationMeta, true);

                    const { selection } = oldState;
                    const mappedSelection = selection.map(tr.doc, tr.mapping);

                    if (mappedSelection) {
                        tr.setSelection(mappedSelection);
                    } else {
                        tr.setSelection(TextSelection.create(tr.doc, tr.doc.content.size));
                    }

                    return tr;
                },
            }),
        ];
    },
});

function estimateNodeHeight(node, lineHeight) {
    if (node.isTextblock) {
        const text = node.textContent;
        const lines = Math.max(text.split('\n').length, Math.ceil(text.length / 50));
        return lines * lineHeight;
    } else if (node.type.name === 'image') {
        return 200;
    } else if (node.type.name === 'heading') {
        return lineHeight * 1.5;
    } else {
        return lineHeight;
    }
}

export const PaginationStyles = () => {
    return (
        <style dangerouslySetInnerHTML={{__html: `
      .editor-page {
        height: 297mm;
        width: 210mm;
        padding: 25.4mm;
        border: 1px solid #ccc;
        background: white;
        position: relative;
        margin-bottom: 40px;
        box-shadow: 0 0 10px rgba(0,0,0,0.1);
        box-sizing: border-box;
        overflow: hidden;
      }

      .editor-page::after {
        content: '';
        position: absolute;
        bottom: 10mm;
        right: 25.4mm;
        font-size: 10px;
        color: #999;
      }

      .page-content {
        min-height: 246.2mm;
        width: 100%;
        overflow: hidden;
      }

      @media print {
        @page {
          size: A4 portrait;
          margin: 0;
        }

        body {
          margin: 0 !important;
          padding: 0 !important;
          background: white !important;
        }

        .editor-print-view {
          transform: none !important;
          width: auto !important;
        }

        .editor-page {
          margin: 0 !important;
          padding: 25.4mm !important;
          box-shadow: none !important;
          border: none !important;
          height: 297mm !important;
          width: 210mm !important;
          page-break-after: always !important;
          break-inside: avoid !important;
          overflow: hidden !important;
        }

        .editor-page:last-child {
          page-break-after: avoid !important;
        }

        .page-content {
          overflow: hidden !important;
        }

        .toolbar-container,
        .pagination-controls,
        .avatar-container,
        .ScrollArea-root,
        .ScrollBar {
          display: none !important;
        }

        .print\\:hidden {
          display: none !important;
        }

        .print\\:block {
          display: block !important;
        }
      }
    `}} />
    );
};

export const PaginationControls = ({ editor, className = '' }) => {
    if (!editor) {
        return null;
    }
    const pageCount = editor ? editor.state.doc.content.childCount : 0;
    return (
        <div className={`pagination-controls flex items-center gap-2 p-2 bg-white/90 dark:bg-card rounded shadow fixed bottom-4 right-4 z-10 ${className}`}>
            <span className="text-sm font-medium">
                {pageCount} {pageCount === 1 ? 'page' : 'pages'}
            </span>
        </div>
    );
};

export const PageNumbers = ({ editor }) => {
    useEffect(() => {
        if (!editor) return;

        const updatePageNumbers = () => {
            const pageElements = document.querySelectorAll('.editor-page');
            pageElements.forEach((page, index) => {
                const pageNumber = page.querySelector('.page-number');
                if (pageNumber) {
                    pageNumber.textContent = `Page ${index + 1} of ${pageElements.length}`;
                } else {
                    const numberElement = document.createElement('div');
                    numberElement.className = 'page-number';
                    numberElement.style.position = 'absolute';
                    numberElement.style.bottom = '10mm';
                    numberElement.style.right = '25.4mm';
                    numberElement.style.fontSize = '10px';
                    numberElement.style.color = '#999';
                    numberElement.textContent = `Page ${index + 1} of ${pageElements.length}`;
                    page.appendChild(numberElement);
                }
            });
        };

        updatePageNumbers();

        const observer = new MutationObserver(updatePageNumbers);
        observer.observe(document.body, { childList: true, subtree: true });

        return () => observer.disconnect();
    }, [editor]);

    return null;
};
