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
import { Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar.jsx";
import {useAuth} from "@/hooks/useAuth.js";

function AccountMenu() {
  const navigate = useNavigate();
    const { user, logout } = useAuth();
  const handleLogout = async () => {
    await logout();
  }
    console.log(user)
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
      <Button variant="" className="p-5 cursor-pointer">
        <span className="">{user.fullName}</span>
          <Avatar>
              <AvatarImage src="https://github.com/shadcn.png" />
              <AvatarFallback>{user.fullName[0]}</AvatarFallback>
          </Avatar>

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