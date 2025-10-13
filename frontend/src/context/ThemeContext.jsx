import React, { createContext, useContext, useEffect, useState } from 'react';

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState('light');

  useEffect(() => {
    // Check for saved theme preference or use system preference
    const savedTheme = localStorage.getItem('theme');
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedTheme) {
      setTheme(savedTheme);
    } else if (systemPrefersDark) {
      setTheme('auto');
    }
  }, []);

  useEffect(() => {
    applyTheme(theme);
  }, [theme]);

  const applyTheme = (newTheme) => {
    const root = document.documentElement;
    const body = document.body;
    
    // Remove all theme classes
    root.classList.remove('light', 'dark');
    body.classList.remove('light', 'dark');
    
    let effectiveTheme = newTheme;
    
    if (newTheme === 'auto') {
      effectiveTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    
    // Add the effective theme class
    root.classList.add(effectiveTheme);
    body.classList.add(effectiveTheme);
    
    // Store theme preference
    localStorage.setItem('theme', newTheme);
  };

  const updateTheme = (newTheme) => {
    setTheme(newTheme);
  };

  const value = {
    theme,
    updateTheme,
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};