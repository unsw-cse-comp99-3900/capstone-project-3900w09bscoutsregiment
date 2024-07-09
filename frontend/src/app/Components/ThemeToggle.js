// components/ThemeToggle.js
"use client";
import { useTheme } from '../context/ThemeContext';

const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <div>
      <button onClick={() => toggleTheme('light')}>Light Theme</button>
      <button onClick={() => toggleTheme('dark')}>Dark Theme</button>
      <button onClick={() => toggleTheme('color-blind')}>Color-blind Theme</button>
    </div>
  );
};

export default ThemeToggle;
