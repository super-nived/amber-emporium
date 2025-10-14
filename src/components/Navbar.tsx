import { Search, SlidersHorizontal } from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';
import { Button } from './ui/button';

interface NavbarProps {
  onSearchClick?: () => void;
  onFilterClick?: () => void;
}

export const Navbar = ({ onSearchClick, onFilterClick }: NavbarProps) => {
  return (
    <nav className="sticky top-0 z-50 glass-card border-b">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center gold-glow">
              <span className="text-xl font-bold text-primary-foreground">GL</span>
            </div>
            <h1 className="text-xl font-bold text-gradient hidden sm:block">
              GoldLeaf Market
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
          </div>
        </div>
      </div>
    </nav>
  );
};
