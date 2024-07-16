// components/ThemeToggle.js
"use client";
import { useTheme } from '../../context/ThemeContext';
import Image from 'next/image';

import 'flowbite';

const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();
  const isActive = (currentTheme) => theme === currentTheme;

  return (
    <>
      <div data-modal-target="default-modal" data-modal-toggle="default-modal" className="option_menu" type="button">
        {/* <Image src='/assets/icons/theme.svg' className='fill-blue-100' width={30} height={30} alt='feedback' /> */}
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" class="fill-main-txt" width={30} height={30}><path d="M512 256c0 .9 0 1.8 0 2.7c-.4 36.5-33.6 61.3-70.1 61.3H344c-26.5 0-48 21.5-48 48c0 3.4 .4 6.7 1 9.9c2.1 10.2 6.5 20 10.8 29.9c6.1 13.8 12.1 27.5 12.1 42c0 31.8-21.6 60.7-53.4 62c-3.5 .1-7 .2-10.6 .2C114.6 512 0 397.4 0 256S114.6 0 256 0S512 114.6 512 256zM128 288a32 32 0 1 0 -64 0 32 32 0 1 0 64 0zm0-96a32 32 0 1 0 0-64 32 32 0 1 0 0 64zM288 96a32 32 0 1 0 -64 0 32 32 0 1 0 64 0zm96 96a32 32 0 1 0 0-64 32 32 0 1 0 0 64z" /></svg>
        <div className='flex flex-col'>
          <b>Theme</b>
          <p>Change Theme</p>
        </div>
        <span className='ml-auto pl-20'>&gt;</span>
      </div>

      {/* <!-- Theme Change modal --> */}
      <div id="default-modal" tabindex="-1" aria-hidden="true" class="hidden overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full">
        <div class="relative p-4 w-full max-w-2xl max-h-full">
          <div class="relative bg-white rounded-lg shadow dark:bg-gray-700">
            <div class="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
              <h3 class="text-xl font-semibold text-gray-900 dark:text-white">
                Themes
              </h3>
              {/* "X" button */}
              <button type="button" class="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white" data-modal-hide="default-modal">
                <svg class="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                  <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6" />
                </svg>
                <span class="sr-only">Close modal</span>
              </button>
            </div>
            <div class="p-4 md:p-5 space-y-4">
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
            <div class="flex items-center justify-end p-4 md:p-5 border-t border-gray-200 rounded-b dark:border-gray-600">
              <button data-modal-hide="default-modal" type="button" class="py-2.5 px-5 ms-3 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 text-white focus:ring-gray-100 dark:focus:ring-gray-700 bg-red-600">Close</button>
            </div>
          </div>
        </div>
      </div>





    </>
  );
};

export default ThemeToggle;
