import { useRef, useState, useEffect } from "react";
import { EditorContent } from "@tiptap/react";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { PaginationControls } from "./Pagination.jsx";

const BASE_WIDTH = 814; // A4 width in pixels (210mm * 3.77953)

const TiptapEditor = ({ editor }) => {
    const [zoom, setZoom] = useState(1);
    const editorRef = useRef(null);

    // Handle print events to reset transform
    useEffect(() => {
        const handleBeforePrint = () => {
            // Save current transform to data attribute
            if (editorRef.current) {
                editorRef.current.dataset.originalTransform = editorRef.current.style.transform;
                editorRef.current.style.transform = 'none';
            }
        };

        const handleAfterPrint = () => {
            // Restore original transform
            if (editorRef.current && editorRef.current.dataset.originalTransform) {
                editorRef.current.style.transform = editorRef.current.dataset.originalTransform;
                delete editorRef.current.dataset.originalTransform;
            }
        };

        window.addEventListener('beforeprint', handleBeforePrint);
        window.addEventListener('afterprint', handleAfterPrint);

        return () => {
            window.removeEventListener('beforeprint', handleBeforePrint);
            window.removeEventListener('afterprint', handleAfterPrint);
        };
    }, []);

    // Zoom with Ctrl + mouse wheel
    useEffect(() => {
        const handleWheel = (e) => {
            if (e.ctrlKey) {
                e.preventDefault();
                const delta = e.deltaY;
                setZoom((prev) => {
                    const zoomStep = delta > 0 ? -0.1 : 0.1;
                    const next = Math.min(Math.max(prev + zoomStep, 0.5), 2.5);
                    return next;
                });
            }
        };
        window.addEventListener("wheel", handleWheel, { passive: false });
        return () => {
            window.removeEventListener("wheel", handleWheel);
        };
    }, []);

    if (!editor) return null;

    return (
        <div className="size-full flex items-center justify-center pt-2 print:pt-0 print:block print:min-h-0">
            <ScrollArea className="w-full h-full print:hidden">
                <div className="relative flex items-start justify-center min-w-full pb-20 print:pb-0 print:block">
                    <div className="print:w-auto">
                        <div
                            className="editor-print-view"
                            ref={editorRef}
                            style={{
                                transform: `scale(${zoom})`,
                                transformOrigin: "top center",
                                width: `${BASE_WIDTH}px`,
                            }}
                        >
                            <EditorContent
                                editor={editor}
                                className="mb-10 print:mb-0 dark:text-black"
                            />
                        </div>
                    </div>
                </div>
                <ScrollBar orientation="horizontal" />
            </ScrollArea>

            {/* Separate print-only container to ensure proper layout */}
            <div className="hidden print:block w-full">
                <EditorContent editor={editor} />
            </div>

            <PaginationControls editor={editor} className="print:hidden" />
        </div>
    );
};

export default TiptapEditor;