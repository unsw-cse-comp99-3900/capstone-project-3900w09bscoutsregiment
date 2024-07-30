// components/ThemeToggle.js
"use client";
import { useTheme } from '../../../context/ThemeContext';
import Image from 'next/image';
import Link from "next/link";

// import 'flowbite';

const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();
  const isActive = (currentTheme) => theme === currentTheme;

  return (
    <div>
      <div className="login_background">
        <div className="min-h-screen flex justify-center items-center">
          {/* start of form */}
          <div className='justify-center bg-secondary-bkg mx-auto w-2/5 space-y-2 p-14 rounded-2xl shadow-2xl'>
            <div className="relative p-4 w-full max-w-2xl max-h-full">
              <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
                <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                    Themes
                  </h3>
                </div>
                <div className="p-4 md:p-5 space-y-4">
                  <div className='flex flex-row space-x-8'>
                    <button
                      className={`border w-1/4 ${isActive('light') ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-500'}`}
                      onClick={() => toggleTheme('light')}
                    >
                      Light Theme
                    </button>
                    <button
                      className={`border w-1/4 ${isActive('dark') ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-500'}`}
                      onClick={() => toggleTheme('dark')}
                    >
                      Dark Theme
                    </button>
                    <button
                      className={`border w-1/4 ${isActive('color-blind') ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-500'}`}
                      onClick={() => toggleTheme('color-blind')}
                    >
                      Color-blind Theme
                    </button>
                  </div>
                </div>
                <div className="flex items-center justify-end p-4 md:p-5 border-t border-gray-200 rounded-b dark:border-gray-600">
                  <Link href="/profile" className="text-sm text-blue-500 focus:outline-none">
                    back
                  </Link>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default ThemeToggle;
