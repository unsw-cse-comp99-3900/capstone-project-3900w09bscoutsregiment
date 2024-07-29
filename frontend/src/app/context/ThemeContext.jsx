// context/ThemeContext.jsx
"use client";
import { createContext, useContext, useState, useEffect } from 'react';


const ThemeContext = createContext();
/**
 * This function allows to set the state of the thene throguout all pages 
 * 
 * @param {*} param0 
 * @returns State to set themes and toggle between them
 */
export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState('light');

  useEffect(() => {
    // Ensure this runs only on the client side
    const storedTheme = localStorage.getItem('theme') || 'light';
    setTheme(storedTheme);
    document.documentElement.className = storedTheme;
  }, []);

  useEffect(() => {
    localStorage.setItem('theme', theme);
    document.documentElement.className = theme;
  }, [theme]);

  const toggleTheme = (newTheme) => {
    setTheme(newTheme);
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
