import { useState } from "react";

import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarHeader,
    SidebarProvider,
    SidebarSeparator
} from "@/components/ui/sidebar.jsx";

import { Heading } from "./Heading.jsx";
import FontFamiliy from "./FontFamily.jsx";
import { ColorPicker } from "./ColorPicker.jsx";
import { TextAlign } from "./TextAlign.jsx";
import { FontTool } from "./FontTool.jsx";

import { Label } from "@/components/ui/label.jsx";
import { Input } from "@/components/ui/input.jsx";

const AppSidebar = ({ editor, isSaving }) => {
    const [selectedColor, setSelectedColor] = useState("#6366f1");
    const [highlightColor, setHighlightColor] = useState("#090909");
    if(!editor) {
        return;
    }
    console.log(isSaving);
    return (
        <Sidebar variant="floating">
            <SidebarHeader>
                <Input className="shadow-none border-none" type="text" placeholder="File Name" />
                <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                    {isSaving ? (
                        <>
                            <svg
                                className="animate-spin h-4 w-4 text-gray-400"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                            >
                                <circle
                                    className="opacity-25"
                                    cx="12"
                                    cy="12"
                                    r="10"
                                    stroke="currentColor"
                                    strokeWidth="4"
                                ></circle>
                                <path
                                    className="opacity-75"
                                    fill="currentColor"
                                    d="M4 12a8 8 0 018-8v8H4z"
                                ></path>
                            </svg>
                            <span>Saving...</span>
                        </>
                    ) : (
                        <>
                            <svg
                                className="h-4 w-4 text-green-500"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M5 13l4 4L19 7"
                                />
                            </svg>
                            <span className="text-green-500">Saved</span>
                        </>
                    )}
                </div>
            </SidebarHeader>
            <SidebarContent className="overflow-hidden py-2 space-y-4">
                <SidebarGroup>
                    <SidebarGroupContent className="space-y-3">
                        <FontFamiliy editor={editor} />
                        <Heading editor={editor} />
                        <div className="flex gap-1">
                            <ColorPicker
                                defaultColor={selectedColor}
                                onChange={setSelectedColor}
                                mode="text"
                                editor={editor}
                            />
                            <ColorPicker
                                defaultColor={highlightColor}
                                onChange={setHighlightColor}
                                mode="highlight"
                                editor={editor}
                            />
                        </div>
                        <FontTool editor={editor} />
                        <TextAlign editor={editor} />
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>
            <SidebarFooter>
                <Label>Word count: {editor.storage.characterCount.words()}</Label>
            </SidebarFooter>
        </Sidebar>
    );
};

export const Toolbar = ({ editor, isSaving }) => (
    <SidebarProvider>
        <AppSidebar editor={editor} isSaving={isSaving} />
    </SidebarProvider>
);
