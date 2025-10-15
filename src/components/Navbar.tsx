import { Search, SlidersHorizontal, LogOut, User } from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';
import { Button } from './ui/button';
import { useAuth } from '@/contexts/AuthContext';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { Avatar, AvatarFallback } from './ui/avatar';

interface NavbarProps {
  onSearchClick?: () => void;
  onFilterClick?: () => void;
}

export const Navbar = ({ onSearchClick, onFilterClick }: NavbarProps) => {
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      // Error is handled in the auth context
    }
  };

  const getUsername = () => {
    if (!user?.email) return 'User';
    // Extract username from email (remove @amberemporium.local)
    return user.email.split('@')[0];
  };

  const getInitials = () => {
    const username = getUsername();
    return username.substring(0, 2).toUpperCase();
  };

  return (
    <nav className="sticky top-0 z-50 glass-card border-b">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center gold-glow">
              <span className="text-xl font-bold text-primary-foreground">AE</span>
            </div>
            <h1 className="text-xl font-bold text-gradient hidden sm:block">
              Amber Emporium
            </h1>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={onSearchClick}
              className="hover:bg-primary/10"
              aria-label="Search"
            >
              <Search className="h-5 w-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={onFilterClick}
              className="hover:bg-primary/10"
              aria-label="Filters"
            >
              <SlidersHorizontal className="h-5 w-5" />
            </Button>
            <ThemeToggle />
            
            {user && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                    <Avatar className="h-10 w-10">
                      <AvatarFallback className="bg-primary text-primary-foreground font-semibold">
                        {getInitials()}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <div className="flex items-center justify-start gap-2 p-2">
                    <div className="flex flex-col space-y-1 leading-none">
                      <p className="font-medium">{getUsername()}</p>
                      <p className="w-[200px] truncate text-sm text-muted-foreground">
                        {user.email}
                      </p>
                    </div>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="cursor-pointer">
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};
