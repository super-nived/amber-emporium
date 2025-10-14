import { Home, PlusCircle, Info } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from './ui/button';

export const FooterBar = () => {
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 glass-card border-t safe-bottom">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-around max-w-md mx-auto">
          <Link to="/">
            <Button
              variant="ghost"
              size="icon"
              className={`hover:bg-primary/10 ${isActive('/') ? 'text-primary' : ''}`}
              aria-label="Home"
            >
              <Home className="h-6 w-6" />
            </Button>
          </Link>

          <Link to="/add-product">
            <Button
              size="icon"
              className="h-14 w-14 rounded-full gold-gradient shadow-lg hover:scale-110 transition-transform"
              aria-label="Add Product"
            >
              <PlusCircle className="h-7 w-7" />
            </Button>
          </Link>

          <Link to="/about">
            <Button
              variant="ghost"
              size="icon"
              className={`hover:bg-primary/10 ${isActive('/about') ? 'text-primary' : ''}`}
              aria-label="About"
            >
              <Info className="h-6 w-6" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};
