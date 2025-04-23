import { Button } from "@/components/ui/button";
import { Minimize2, TableOfContents, Hammer, NotebookPen } from 'lucide-react';
import axios from '@/config/axiosConfig.js';
import {useState} from "react";
import {toast} from "sonner";

const AITools = ({ editor }) => {

    const handleAIRequest = async (type) => {
        if (!editor) return;
        const { from, to, empty } = editor.state.selection;
        const selectedText = editor.state.doc.textBetween(from, to, " ");

        if (empty || !selectedText.trim()) {
            return;
        }

        editor.chain().focus().setMark('aiLoading').run();

        const originalFrom = from;
        const originalTo = to;

        await axios.post(`/api/model/${type}`, { text: selectedText })
            .then((response) => {
                const data = response.data;
                editor
                    .chain()
                    .focus()
                    .unsetMark('aiLoading')
                    .insertContentAt({ from: originalFrom, to: originalTo }, data)
                    .run();
            })
            .catch((error) => {
                editor
                    .chain()
                    .focus()
                    .unsetMark('aiLoading')
                    .run();
                toast.error(`Could not ${type}`);
            });
    };

    return (
        <>
            <Button variant="outline" className="my-1 w-[100%] cursor-pointer" onClick={() => handleAIRequest('summarize')}><Minimize2 /> Summarize</Button>
            <Button variant="outline" className="my-1 w-[100%] cursor-pointer" onClick={() => handleAIRequest('bulletify')}><TableOfContents /> Bulletify</Button>
            <Button variant="outline" className="my-1 w-[100%] cursor-pointer" onClick={() => handleAIRequest('paraphrase')}><NotebookPen /> Paraphrase</Button>
            <Button variant="outline" className="my-1 w-[100%] cursor-pointer" onClick={() => handleAIRequest('proofread')}><Hammer /> Proofread</Button>
        </>
    );
};

export default AITools;