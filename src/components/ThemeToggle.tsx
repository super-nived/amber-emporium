import { Moon, Sun } from 'lucide-react';
import { useEffect, useState } from 'react';
import { getTheme, setTheme } from '@/lib/localStorage';
import { Button } from '@/components/ui/button';

export const ThemeToggle = () => {
  const [theme, setThemeState] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    const currentTheme = getTheme();
    setThemeState(currentTheme);
    document.documentElement.classList.toggle('dark', currentTheme === 'dark');
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    setThemeState(newTheme);
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleTheme}
      className="hover:bg-primary/10 transition-colors"
      aria-label="Toggle theme"
    >
      {theme === 'light' ? (
        <Moon className="h-5 w-5 text-foreground" />
      ) : (
        <Sun className="h-5 w-5 text-primary" />
      )}
    </Button>
  );
};
