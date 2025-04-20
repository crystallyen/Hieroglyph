import { useState, useRef, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Pencil } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { MoreVertical, Trash2 } from "lucide-react";

export default function DocumentCard({
  documentId,
  title = "Untitled document",
  timestamp,
  onDelete,
  onRename,
  onClick,
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [newTitle, setNewTitle] = useState(title);
  const inputRef = useRef(null);
  const editModeRef = useRef(false);
  const dropdownRenameRef = useRef(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  useEffect(() => {
    editModeRef.current = isEditing;
  }, [isEditing]);

  useEffect(() => {
    if (isEditing) {
      const focusTimer = setTimeout(() => {
        if (inputRef.current && editModeRef.current) {
          inputRef.current.focus();
          
          const length = inputRef.current.value.length;
          inputRef.current.setSelectionRange(length, length);
        }
      }, 200);
      return () => clearTimeout(focusTimer);
    }
  }, [isEditing]);

  useEffect(() => {
    setNewTitle(title);
  }, [title]);

  const startEditing = (e) => {
    if (e) e.stopPropagation();
    setIsEditing(true);
  };

  const handleDropdownRename = (e) => {
    e.preventDefault();
    setDropdownOpen(false);
    
    dropdownRenameRef.current = true;
    

    setTimeout(() => {
      setIsEditing(true);
      dropdownRenameRef.current = false;
    }, 100);
  };

  const saveTitle = (e) => {
    if (dropdownRenameRef.current) return;
    
    const trimmedNewTitle = newTitle.trim();
    if (trimmedNewTitle && trimmedNewTitle !== title) {
      onRename(documentId,trimmedNewTitle);
    }
    setIsEditing(false);
  };

  const cancelEditing = () => {
    setNewTitle(title);
    setIsEditing(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      saveTitle();
    } else if (e.key === "Escape") {
      cancelEditing();
    }
  };
  
  const handleCardClick = () => {
    if (onClick) {
      onClick(documentId);
    }
  };

  const handleInputBlur = (e) => {
    if (dropdownRenameRef.current) return;
    saveTitle(e);
  };

  return (
    <Card
      className="transition-all duration-200 hover:shadow-md rounded-xl min-h-78 w-48 p-0 border-0 overflow-hidden bg-transparent relative"
    >
      <div className="bg-gray-300 h-68 w-full rounded-xl">
        <div className="absolute bottom-0 left-0 w-full bg-secondary p-2 m-0 rounded-b-xl">
          <div className="group relative">
            {isEditing ? (
              <Input
                ref={inputRef}
                type="text"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                onKeyDown={handleKeyDown}
                onBlur={handleInputBlur}
                onClick={(e) => e.stopPropagation()}
              />
            ) : (
              <div className="flex items-center">
                <h1
                  className="text-sm font-bold text-left leading-tight mt-1 cursor-pointer"
                  onClick={handleCardClick}
                  
                >
                  {title}
                </h1>
                <button
                  className="ml-2 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={startEditing}
                >
                  <Pencil className="text-white-400 hover:text-gray-600 w-3 h-3" />
                </button>
              </div>
            )}
          </div>
          <div className="flex justify-between items-center text-xs text-gray-500 mt-1">
            <div className="flex items-center gap-1">
              <span className="leading-none text-l">{timestamp}</span>
            </div>
            <DropdownMenu open={dropdownOpen} onOpenChange={setDropdownOpen}>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8 cursor-pointer">
                  <MoreVertical className="h-4 w-4" />
                  <span className="sr-only">Open menu</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem
                  className="text-destructive focus:text-destructive cursor-pointer"
                  onClick={(e) => {
                    setDropdownOpen(false);
                    onDelete();
                  }}
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="cursor-pointer"
                  onClick={handleDropdownRename}
                >
                  <Pencil className="mr-2 h-4 w-4" />
                  Rename
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </Card>
  );
}