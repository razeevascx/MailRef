'use client';

import { Button } from '@/components/ui/button';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';

const ThemeSwitcher = () => {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  const ICON_SIZE = 20;

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={toggleTheme}
      className="relative overflow-hidden rounded-[12px] p-2 hover:bg-[#1A2440]/5 dark:hover:bg-white/5 focus:outline-none"
    >
      <span className="sr-only">Toggle theme</span>
      <Sun
        size={ICON_SIZE}
        className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 transform transition-all duration-500
          ${theme === 'dark' ? 'rotate-90 opacity-0' : 'rotate-0 opacity-100'}`}
      />
      <Moon
        size={ICON_SIZE}
        className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 transform transition-all duration-500
          ${
            theme === 'light' ? '-rotate-90 opacity-0' : 'rotate-0 opacity-100'
          }`}
      />
    </Button>
  );
};

export { ThemeSwitcher };
