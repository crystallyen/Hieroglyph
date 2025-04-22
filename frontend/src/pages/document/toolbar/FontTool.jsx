import {Bold, Italic, Strikethrough, Underline} from "lucide-react";
import { Button } from "@/components/ui/button"

export const FontTool = ({ editor }) => {
    if (!editor) return null;

    return (
        <div className="w-full flex justify-evenly">
            <Button 
                variant="outline"
                size="icon"
                aria-label="Toggle bold"
                className="w-[25%] rounded-none rounded-l-lg"
                onClick={() => editor.chain().focus().toggleBold().run()}
            >
                <Bold className="h-4 w-4" />
            </Button>

            <Button 
                variant="outline"
                size="icon"
                value="italic"
                aria-label="Toggle italic"
                className="w-[25%] rounded-none"
                onClick={() => editor.chain().focus().toggleItalic().run()}
            >
                <Italic className="h-4 w-4" />
            </Button>
            <Button 
                variant="outline" 
                size="icon"
                value="underline"
                aria-label="Toggle underline"
                className="w-[25%] rounded-none"
                onClick={() => editor.chain().focus().toggleUnderline().run()}
            >
                <Underline className="h-4 w-4" />
            </Button>
            <Button 
                variant="outline" 
                size="icon"
                value="strike"
                aria-label="Toggle strikethrough"
                className="w-[25%] rounded-none rounded-r-lg"
                onClick={() => editor.chain().focus().toggleStrike().run()}
            >
                <Strikethrough className="h-4 w-4" />
            </Button>
        </div>
        
    );
};
