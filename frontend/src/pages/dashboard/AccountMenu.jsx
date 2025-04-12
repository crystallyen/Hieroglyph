import { User, LogOut, Settings } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {useAuth} from "@/hooks/useAuth.js";

function AccountMenu() {
  const navigate = useNavigate();
    const {logout} = useAuth();
  const handleLogout = async () => {
    await logout();
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
      <Button>
        <User /> Profile
      </Button>
      </ DropdownMenuTrigger>
      <DropdownMenuContent className="w-36">
        <DropdownMenuItem>
          <Settings />
          <span>Settings</span>
          <DropdownMenuShortcut>⇧⌘S</DropdownMenuShortcut>
        </DropdownMenuItem>
        <DropdownMenuItem onSelect={handleLogout}>
          <LogOut />
          <span>Log out</span>
          <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default AccountMenu;