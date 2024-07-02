"use client";

import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';


const CoursesLayout = ({ children }) => {
  const router = useRouter();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  
  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };
  const logout = () => {
    window.localStorage.removeItem('token')
    router.push('/');
    return
  };

  return (
    <div>
        <nav className="bg-blue-600 px-4 py-2 flex justify-between items-center font-bold fixed w-full">
            <div className="flex items-center">
              <div className="bg-white rounded-md w-8 h-8 mr-3"></div>
              <span className="text-white text-xl font-bold">COTAM</span>
            </div>
            <div className='flex space-x-4'>
              <Link href="/courses" className='text-white hover:bg-blue-800 px-4 py-2 rounded-md'>Courses</Link>
              <Link href="/pathways" className='text-white hover:bg-blue-800 px-4 py-2 rounded-md'>Pathways</Link>
              <Link href="/settings" className='text-white hover:bg-blue-800 px-4 py-2 rounded-md'>Settings</Link>
              <Link href="/help" className='text-white hover:bg-blue-800 px-4 py-2 rounded-md'>Help</Link>
            </div>
            <button onClick={toggleDropdown} className='text-white hover:bg-blue-800 px-4 py-2 rounded-md'>Profile</button>
            {isDropdownOpen && (
              <div className='absolute bg-white flex flex-col right-0 top-14 rounded-bl-xl border-slate-300 border-2'>
                <button onClick={logout} className='text-sm px-20 py-2 hover:bg-gray-100 font-semibold'>
                  <Link href="/">Logout</Link>
                </button>
                <Link className='text-sm px-20 py-2 hover:bg-gray-100 font-semibold' href="/profile">Profile</Link>
                <Link className='text-sm px-20 py-2 hover:bg-gray-100 font-semibold' href="/theme">Theme</Link>
              </div>
            )}
        </nav>
        { children }
    </div>
  )
}

export default CoursesLayout