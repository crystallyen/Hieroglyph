import { useEffect, useState, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { TextStyle } from "@tiptap/extension-text-style";
import { FontFamily } from "@tiptap/extension-font-family";
import { Color } from "@tiptap/extension-color";
import { Highlight } from "@tiptap/extension-highlight";
import { TextAlign } from "@tiptap/extension-text-align";
import { CharacterCount } from "@tiptap/extension-character-count";
import { Underline } from "@tiptap/extension-underline";
import { Heading } from "@tiptap/extension-heading";
import { PageNode, PaginationExtension, PaginationStyles } from "./Pagination.jsx";
import { Toolbar } from "./toolbar/Toolbar.jsx";
import TiptapEditor from "./TiptapEditor.jsx";
import { Button } from "@/components/ui/button.jsx";
import { UserCircle, Share2 } from "lucide-react";
import axios from "@/config/axiosConfig.js";

const DocumentEditor = () => {
    const { documentId } = useParams();
    const [initialContent, setInitialContent] = useState(null);
    const [editorContent, setEditorContent] = useState(null);
    const [isSaving, setIsSaving] = useState(false);
    const navigate = useNavigate();

    const editor = useEditor({
        editorProps: {
            attributes: {
                class:
                    "printable focus:outline-none overflow-visible bg-transparent cursor-text print:shadow-none print:border-none print:p-0 print:w-full print:h-auto",
            },
        },
        extensions: [
            StarterKit.configure({
                heading: { levels: [1, 2, 3] },
            }),
            Heading.configure({ levels: [1, 2, 3] }),
            TextStyle,
            FontFamily.configure({ types: ["textStyle"] }),
            Color.configure({ types: ["textStyle"] }),
            Highlight.configure({ multicolor: true }),
            TextAlign.configure({ types: ["heading", "paragraph"] }),
            CharacterCount.configure({
                textCounter: (text) => [...new Intl.Segmenter().segment(text)].length,
            }),
            Underline,
            PageNode,
            PaginationExtension,
        ],
        content: null,
        autofocus: true,
        editable: true,
    });

    useEffect(() => {
        const fetchDocument = async () => {
            try {
                const response = await axios(`/api/documents/${documentId}`);
                const docContent = response.data.content;
                setInitialContent(docContent);
                setEditorContent(docContent);

                if (editor && docContent) {
                    editor.commands.setContent(docContent);
                }
            } catch (error) {
                console.error("Error fetching document", error);
                navigate('/login');
            }
        };

        fetchDocument();
    }, [documentId, editor, navigate]);

    const saveDocument = useCallback(async () => {
        if (!editor || !editorContent) return;
        await axios.put(`/api/documents/${documentId}`, {
            content: editorContent,
        }).catch((error) => {
            console.error("Error saving document", error);
        });
    }, [editorContent, documentId, editor]);

    useEffect(() => {
        setIsSaving(true);
        const timer = setInterval(() => {
            saveDocument();
            setIsSaving(false);
        }, 5000);

        return () => clearInterval(timer);
    }, [editorContent]);

    useEffect(() => {
        const handleBeforeUnload = (event) => {
            if (isSaving) {
                event.preventDefault();
                event.returnValue = "";
            }
        };

        window.addEventListener("beforeunload", handleBeforeUnload);

        return () => {
            window.removeEventListener("beforeunload", handleBeforeUnload);
        };
    }, [isSaving]);

    useEffect(() => {
        const handleChange = () => {
            if (editor) {
                setEditorContent(editor.getJSON());
            }
        };

        if (editor) {
            editor.on('update', handleChange);
        }

        return () => {
            if (editor) {
                editor.off('update', handleChange);
            }
        };
    }, [editor]);

    return (
        <>
            <PaginationStyles />
            <div className="flex flex-col h-screen bg-background">
                <div className="flex justify-end items-center p-2">
                    <div className="flex gap-2">
                        <Button variant="ghost" size="icon" title="Share">
                            <Share2 className="h-5 w-5" />
                        </Button>
                        <Button variant="ghost" size="icon" title="Profile">
                            <UserCircle className="h-5 w-5" />
                        </Button>
                    </div>
                </div>
                <div className="flex flex-1 overflow-hidden">
                    <div className="flex-none h-full">
                        <Toolbar editor={editor} isSaving={isSaving} />
                    </div>
                    <div className="flex-grow h-full overflow-hidden">
                        {editor && <TiptapEditor editor={editor} />}
                    </div>
                </div>
            </div>
        </>
    );
};

export default DocumentEditor;
