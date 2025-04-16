import {AlignCenter, AlignJustify, AlignLeft, AlignRight} from "lucide-react"
import {
    ToggleGroup,
    ToggleGroupItem,
} from "@/components/ui/toggle-group"

export const TextAlign = ({editor}) => {
    const getToggleClass = (textAlign) =>
        editor.isActive({ textAlign })
            ? "bg-primary text-primary-foreground"
            : "text-foreground hover:bg-muted";
    return (
        <ToggleGroup type="single" variant="outline" size="lg" className="w-full">
            <ToggleGroupItem
                value="left"
                aria-label="Toggle left"
                // className="cursor-pointer data-[state=on]:bg-primary"
                className={getToggleClass("left")}
                onClick={() => editor.chain().focus().setTextAlign('left').run()}
            >
                <AlignLeft className="h-4 w-4" />
            </ToggleGroupItem>
            <ToggleGroupItem
                value="center"
                aria-label="Toggle center"
                // className="cursor-pointer data-[state=on]:bg-primary "
                className={getToggleClass("center")}
                onClick={() => editor.chain().focus().setTextAlign('center').run()}
            >
                <AlignCenter className="h-4 w-4" />
            </ToggleGroupItem>
            <ToggleGroupItem
                value="right"
                aria-label="Toggle right"
                // className="cursor-pointer data-[state=on]:bg-primary"
                className={getToggleClass("right")}
                onClick={() => editor.chain().focus().setTextAlign('right').run()}
            >

                <AlignRight className="h-4 w-4" />
            </ToggleGroupItem>
            <ToggleGroupItem
                value="justify"
                aria-label="Toggle justify"
                // className="cursor-pointer data-[state=on]:bg-primary"
                className={getToggleClass("justify")}
                onClick={() => editor.chain().focus().setTextAlign('justify').run()}
            >

                <AlignJustify className="h-4 w-4" />
            </ToggleGroupItem>
        </ToggleGroup>
    );
};