import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger,
  DropdownMenuSeparator 
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Film, Search, Heart, LogOut, User } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

interface HeaderProps {
  onSearch?: (query: string) => void;
  searchValue?: string;
}

export const Header: React.FC<HeaderProps> = ({ onSearch, searchValue = '' }) => {
  const [searchQuery, setSearchQuery] = useState(searchValue);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch?.(searchQuery);
  };

  const handleLogout = () => {
    logout();
  };

  const navigateToFavorites = () => {
    navigate('/favorites');
  };

  const navigateHome = () => {
    navigate('/');
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-cinema-gold/20 bg-background/80 backdrop-blur-md">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Button 
          variant="ghost" 
          className="flex items-center gap-2 text-lg font-bold hover:bg-transparent"
          onClick={navigateHome}
        >
          <div className="w-8 h-8 bg-gradient-to-br from-cinema-gold to-accent rounded-full flex items-center justify-center">
            <Film className="w-4 h-4 text-cinema-dark" />
          </div>
          <span className="bg-gradient-to-r from-cinema-gold to-accent bg-clip-text text-transparent">
            CinemaScape
          </span>
        </Button>

        {/* Search */}
        <form onSubmit={handleSearch} className="flex-1 max-w-md mx-8">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search movies..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-muted/50 border-cinema-gold/20 focus:border-cinema-gold"
            />
          </div>
        </form>

        {/* User Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-10 w-10 rounded-full">
              <Avatar className="h-10 w-10 border-2 border-cinema-gold/20">
                <AvatarFallback className="bg-gradient-to-br from-cinema-gold to-accent text-cinema-dark font-semibold">
                  {user?.name.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56 bg-card border-cinema-gold/20" align="end">
            <div className="flex items-center justify-start gap-2 p-2">
              <div className="flex flex-col space-y-1 leading-none">
                <p className="font-medium text-sm">{user?.name}</p>
                <p className="text-xs text-muted-foreground">{user?.email}</p>
              </div>
            </div>
            <DropdownMenuSeparator className="bg-cinema-gold/20" />
            <DropdownMenuItem onClick={navigateToFavorites} className="cursor-pointer">
              <Heart className="mr-2 h-4 w-4" />
              <span>My Favorites ({user?.favorites.length || 0})</span>
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer">
              <User className="mr-2 h-4 w-4" />
              <span>Profile</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator className="bg-cinema-gold/20" />
            <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-destructive focus:text-destructive">
              <LogOut className="mr-2 h-4 w-4" />
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};