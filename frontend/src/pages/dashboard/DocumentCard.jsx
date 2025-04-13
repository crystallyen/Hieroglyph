import { useState, useRef, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Pencil } from "lucide-react";
import { useTheme } from './components/ui/theme-provider';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreVertical, Trash2 } from "lucide-react";
import { Input } from "@/components/ui/input";

export default function DocumentCard({ 
  title = "Untitled document", 
  timestamp = "Opened 2:10 AM",
  onDelete = () => {},
  onRename = () => {} 
}) {
  const [showDropdown, setShowDropdown] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [newTitle, setNewTitle] = useState(title);
  const dropdownRef = useRef(null);
  const inputRef = useRef(null);
  const { theme, setTheme } = useTheme();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  const handleDotsClick = (e) => {
    e.stopPropagation();
    setShowDropdown(!showDropdown);
  };

  const handleDelete = (e) => {
    e.stopPropagation();
    onDelete();
    setShowDropdown(false);
  };

  const handleRenameFromDropdown = (e) => {
    e.stopPropagation();
    setShowDropdown(false);
    setIsEditing(true);
  };

  const handleStartEdit = (e) => {
    e.stopPropagation();
    setIsEditing(true);
  };

  const handleSaveTitle = () => {
    onRename(newTitle);
    setIsEditing(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSaveTitle();
    } else if (e.key === 'Escape') {
      setNewTitle(title);
      setIsEditing(false);
    }
  };

  return (
    <Card className="transition-all duration-200 hover:shadow-md rounded-xl h-70 w-48 p-0">
      <div className="bg-gray-200 h-70 w-full relative rounded-xl cursor-pointer">
        <div className="absolute bottom-0 left-0 w-full bg-secondary p-2 rounded-b-xl">
          <div className="group relative">
            {isEditing ? (
              <Input
                ref={inputRef}
                type="text"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                onBlur={handleSaveTitle}
                onKeyDown={handleKeyDown}
                onClick={(e) => e.stopPropagation()}
              />
            ) : (
              <div className="flex items-center">
                <h1 className="text-sm font-bold text-left leading-tight">{title}</h1>
                <button
                  className="ml-2 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={handleStartEdit}
                >
                  <Pencil className="text-gray-400 hover:text-gray-600 w-3 h-3" />
                </button>
              </div>
            )}
          </div>
          <div className="flex justify-between items-center text-xs text-gray-500 mt-1">
            <div className="flex items-center gap-1">
              <span className="leading-none">{timestamp}</span>
            </div>
            <DropdownMenu open={isMenuOpen} onOpenChange={setIsMenuOpen}>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8 cursor-pointer">
                  <MoreVertical className="h-4 w-4" />
                  <span className="sr-only">Open menu</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem
                  className="text-destructive focus:text-destructive cursor-pointer"
                  onClick={handleDelete}
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </Card>
  );
}
