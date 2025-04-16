import {Bold, Italic, Strikethrough, Underline} from "lucide-react";
import {
    ToggleGroup,
    ToggleGroupItem,
} from "@/components/ui/toggle-group";

export const FontTool = ({ editor }) => {
    if (!editor) return null;

    const getToggleClass = (format) =>
        editor.isActive(format)
            ? "bg-primary text-primary-foreground"
            : "text-foreground hover:bg-muted";

    return (
        <ToggleGroup type="multiple" variant="outline" size="lg" className="w-full">
            <ToggleGroupItem
                value="bold"
                aria-label="Toggle bold"
                className={getToggleClass("bold")}
                onClick={() => editor.chain().focus().toggleBold().run()}
            >
                <Bold className="h-4 w-4" />
            </ToggleGroupItem>

            <ToggleGroupItem
                value="italic"
                aria-label="Toggle italic"
                className={getToggleClass("italic")}
                onClick={() => editor.chain().focus().toggleItalic().run()}
            >
                <Italic className="h-4 w-4" />
            </ToggleGroupItem>
            <ToggleGroupItem
                value="strike"
                aria-label="Toggle underline"
                className={getToggleClass("underline")}
                onClick={() => editor.chain().focus().toggleUnderline().run()}
            >
                <Underline className="h-4 w-4" />
            </ToggleGroupItem>
            <ToggleGroupItem
                value="strike"
                aria-label="Toggle strikethrough"
                className={getToggleClass("strike")}
                onClick={() => editor.chain().focus().toggleStrike().run()}
            >
                <Strikethrough className="h-4 w-4" />
            </ToggleGroupItem>

        </ToggleGroup>
    );
};
