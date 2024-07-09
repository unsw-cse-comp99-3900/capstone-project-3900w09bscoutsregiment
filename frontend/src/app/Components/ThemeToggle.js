// components/ThemeToggle.js
"use client";
import { useTheme } from '../context/ThemeContext';

const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className='flex flex-col'>
      <button className='border w-1/4' onClick={() => toggleTheme('light')}>Light Theme</button>
      <button className='border w-1/4' onClick={() => toggleTheme('dark')}>Dark Theme</button>
      <button className='border w-1/4' onClick={() => toggleTheme('color-blind')}>Color-blind Theme</button>
    </div>
  );
};

export default ThemeToggle;
