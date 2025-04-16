import { Check, ChevronsUpDown } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button.jsx"
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { ScrollArea } from "@/components/ui/scroll-area.jsx"
import { useState, useEffect } from "react"

const types = [
    { level: 1, label: "Heading 1", className: "text-2xl font-bold" },
    { level: 2, label: "Heading 2", className: "text-xl font-bold" },
    { level: 3, label: "Heading 3", className: "text-lg font-bold" },
    { level: 0, label: "Normal text", className: "text-base font-normal" },
]

export const Heading = ({ editor }) => {
    const [open, setOpen] = useState(false)
    const [value, setValue] = useState(null)

    useEffect(() => {
        if (!editor) return
        const active = types.find((type) =>
            type.level > 0 && editor.isActive("heading", { level: type.level })
        )
        setValue(active ? active.level : 0)
    }, [editor, editor?.state])

    const handleSelect = (level) => {
        if (!editor) return
        if (level === 0) {
            editor.chain().focus().setParagraph().run()
        } else {
            editor.chain().focus().toggleHeading({ level }).run()
        }

        const isActive = level > 0 ? editor.isActive("heading", { level }) : !types.slice(0, 3).some(t =>
            editor.isActive("heading", { level: t.level })
        )

        setValue(isActive ? level : (level > 0 ? 0 : level))
        setOpen(false)
    }

    const getCurrentStyle = () => {
        const currentType = types.find(type => type.level === value) || types[3]
        return currentType.className
    }

    if (!editor) {
        return null
    }

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className={`w-full justify-between ${getCurrentStyle()}`}
                >
                    {value !== null
                        ? types.find((type) => type.level === value)?.label
                        : "Text style..."}
                    <ChevronsUpDown className="ml-2 h-4 w-4 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent
                className="w-full h-40 p-0"
                style={{ width: "var(--radix-popover-trigger-width)" }}
            >
                <Command>
                    <CommandInput placeholder="Search style..." className="h-9" />
                    <CommandList>
                        <CommandEmpty>No style found.</CommandEmpty>
                        <CommandGroup>
                            <ScrollArea className="h-48">
                                {types.map((type) => (
                                    <CommandItem
                                        key={type.level}
                                        value={`heading-${type.level}`}
                                        onSelect={() => handleSelect(type.level)}
                                        className={cn(
                                            type.className,
                                            type.level > 0
                                                ? editor.isActive("heading", { level: type.level }) && "is-active"
                                                : !types.slice(0, 3).some(t => editor.isActive("heading", { level: t.level })) && "is-active"
                                        )}
                                    >
                                        {type.label}
                                        <Check
                                            className={cn(
                                                "ml-auto",
                                                value === type.level ? "opacity-100" : "opacity-0"
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
