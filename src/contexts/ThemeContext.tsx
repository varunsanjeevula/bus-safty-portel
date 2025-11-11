import React, { createContext, useContext, useState, useEffect } from 'react';
import { useThemeClasses } from '@/lib/themeConfig';

interface ThemeContextType {
  isDarkMode: boolean;
  toggleTheme: () => void;
  themeClasses: ReturnType<typeof useThemeClasses>;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    // Check localStorage for saved preference
    const saved = localStorage.getItem('theme-preference');
    if (saved) return saved === 'dark';
    
    // Check system preference
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  const themeClasses = useThemeClasses(isDarkMode);

  const toggleTheme = () => {
    setIsDarkMode(prev => {
      const newValue = !prev;
      localStorage.setItem('theme-preference', newValue ? 'dark' : 'light');
      return newValue;
    });
  };

  // Update document class for tailwind dark mode
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleTheme, themeClasses }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
};
