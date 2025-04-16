import {useState} from "react";
import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover.jsx";
import {Button} from "@/components/ui/button.jsx";
import {Command, CommandGroup, CommandInput, CommandItem, CommandList, CommandEmpty} from "@/components/ui/command.jsx";
import {ScrollArea} from "@/components/ui/scroll-area.jsx";
import {cn} from "@/lib/utils.js";
import { ChevronsUpDown, Check } from "lucide-react";

const fonts = [
    {
        fontFamily: "Arial",
        label: "Arial",
    },
    {
        fontFamily: "Inter",
        label: "Inter",
    },
    {
        fontFamily: "serif",
        label: "Serif",
    },
    {
        fontFamily: '"Comic Sans MS", "Comic Sans"',
        label: "Comic Sans",
    },
    {
        fontFamily: "monospace",
        label: "Monospace",
    },
    {
        fontFamily: "cursive",
        label: "Cursive",
    },
    {
        fontFamily: '"Exo 2"',
        label: "Exo 2",
    }
]

const FontFamiliy = ({editor}) => {
    const [open, setOpen] = useState(false)
    const [value, setValue] = useState("Arial")

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className="w-full justify-between"
                >
                    {value
                        ? fonts.find((font) => font.fontFamily === value)?.label
                        : "Select font..."}
                    <ChevronsUpDown className="opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-full p-0">
                <Command>
                    <CommandInput placeholder="Search font..." className="h-9" />
                    <CommandList>
                        <CommandEmpty>No font found.</CommandEmpty>
                        <CommandGroup>
                            <ScrollArea className="h-40">
                                {fonts.map((font) => (
                                    <CommandItem
                                        key={font.fontFamily}
                                        value={font.fontFamily}
                                        onSelect={(currentValue) => {
                                            setValue(currentValue)
                                            setOpen(false)
                                            editor.chain().focus().setFontFamily(currentValue).run()
                                        }}
                                        className={cn(
                                            editor.isActive('textStyle', { fontFamily: font.fontFamily }) && "is-active"
                                        )}
                                    >
                                        {font.label}
                                        <Check
                                            className={cn(
                                                "ml-auto",
                                                value === font.value ? "opacity-100" : "opacity-0"
                                            )}
                                        />
                                    </CommandItem>
                                ))}
                            </ScrollArea>
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    )
}

export default FontFamiliy;