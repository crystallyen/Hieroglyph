import { LogOut, Moon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useNavigate } from "react-router-dom"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar.jsx"
import { useAuth } from "@/hooks/useAuth.js"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { useTheme } from "@/components/theme-provider"

function AccountMenu() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { theme, setTheme } = useTheme();

  const handleLogout = async () => {
    await logout();
  };

  const handleThemeToggle = (checked) => {
    setTheme(checked ? "dark" : "light");
  };

  const isDark = theme === "dark";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
      <Button
  variant=""
  className={`p-5 cursor-pointer transition-colors duration-300 ${
    theme === "light"
      ? "bg-gray-300 text-white hover:bg-gray-400"
      : "bg-secondary text-white hover:bg-zinc-700"
  }`}
>
          <span className="mr-2">{user.fullName}</span>
          <Avatar>
            <AvatarImage src="https://github.com/shadcn.png" />
            <AvatarFallback>{user.fullName[0]}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="w-36">
        <DropdownMenuItem className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Moon className="h-4 w-4" />
            <Label htmlFor="dark-mode" className="text-sm">Dark</Label>
          </div>
          <Switch
            id="dark-mode"
            checked={isDark}
            onCheckedChange={handleThemeToggle}
          />
        </DropdownMenuItem>

        <DropdownMenuItem onSelect={handleLogout}>
          <LogOut className="mr-2 h-4 w-4" />
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default AccountMenu;
