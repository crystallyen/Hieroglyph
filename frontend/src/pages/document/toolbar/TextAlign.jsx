import {AlignCenter, AlignJustify, AlignLeft, AlignRight} from "lucide-react"
import { Button } from "@/components/ui/button"

export const TextAlign = ({editor}) => {
    return (
        <div className="w-full flex justify-evenly">
          <Button
              variant="outline"
                value="left"
                aria-label="Toggle left"
                className="w-[25%] rounded-none rounded-l-lg"
                onClick={() => editor.chain().focus().setTextAlign('left').run()}
            >
                <AlignLeft className="h-4 w-4" />
            </Button>
            <Button
                variant="outline"
                value="center"
                aria-label="Toggle center"
                className="w-[25%] rounded-none"
                onClick={() => editor.chain().focus().setTextAlign('center').run()}
            >
                <AlignCenter className="h-4 w-4" />
            </Button>
            <Button
                variant="outline"
                value="right"
                aria-label="Toggle right"
                className="w-[25%] rounded-none"
                onClick={() => editor.chain().focus().setTextAlign('right').run()}
            >
                <AlignRight className="h-4 w-4" />
            </Button>
            <Button
                variant="outline"
                value="justify"
                aria-label="Toggle justify"
                className="w-[25%] rounded-none rounded-r-lg"
                onClick={() => editor.chain().focus().setTextAlign('justify').run()}
            >
                <AlignJustify className="h-4 w-4" />
            </Button>
        </div>
    );
};