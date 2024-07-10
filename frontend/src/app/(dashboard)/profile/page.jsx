'use client'

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

const Profile = () => {
  const [userDetails, setUserDetails] = React.useState({ name: '', email: '' });

  // Ensure stay logged in
  const router = useRouter();
  React.useEffect(() => {
    const token = localStorage.getItem('token') || null
    if (token === null) {
      router.push('/');
      return
    }

    // const fetchProfile = async () => {
    //   try {
    //     const res = await fetch('https://localhost:5000/api/profile/details', {
    //       method: 'GET',
    //       headers: {
    //         'Content-Type': 'application/json',
    //         Authorization: `Bearer ${localStorage.getItem('token')}`,
    //       }
    //     })

        
  
    //     const data = await res.json();
    //     console.log(data)
    //   } catch (error) {
    //     console.error(error)
    //   } 
    // }  

    // fetchProfile();
  }, [])

  const logout = () => {
    localStorage.removeItem('token')
    router.push('/');
    closeDropdown();
    return;
  };

  return (
    <div className='min-h-screen bg-blue-100 flex justify-center items-center gap-10'>
      <div className='min-h-screen bg-blue-100 flex justify-center items-center pt-12'>
        <div className='flex flex-col gap-8 bg-white shadow-md rounded-xl p-10 w-full max-w-md'>
          <div className='w-32 h-32 bg-gray-300 rounded-full flex items-center justify-center'>
            <span className='text-6xl text-white'>👤</span>
          </div>
          <div>
            <h2 className='text-lg font-medium text-gray-700'>Name</h2>
            <p className='text-xl font-semibold'>MATCOTAK BUDI SETIAWAN</p>
          </div>
          <div>
            <h2 className='text-lg font-medium text-gray-700'>Email</h2>
            <input
              type='text'
              value='BUDISET@gmail.com'
              disabled
              className='bg-gray-200 text-gray-700 border border-gray-300 rounded py-2 px-4'
            />
            <br />
          </div>
          <div>
            <h2 className='text-lg font-medium text-gray-700'>Password</h2>
            <input
              type='text'
              value='***********'
              disabled
              className='bg-gray-200 text-gray-700 border border-gray-300 rounded py-2 px-4'
            />
            <br />
          </div>
        </div>
      </div>
      <div className='bg-white rounded-xl p-10'>
        <Link href='/' onClick={logout} className="option_menu">
          <Image src='/assets/icons/logout.svg' width={30} height={30} alt='logout' />
          <div className='flex flex-col'>
            <b>Logout</b>
            <p>Logout of your account.</p>
          </div>
          <span className='ml-auto pl-20'>&gt;</span>
        </Link>
        <Link href='/changeEmail' className="option_menu">
          <Image src='/assets/icons/email.svg' width={30} height={30} alt='email' />
          <div className='flex flex-col'>
            <b>Change Email</b>
            <p>Change your account's email.</p>
          </div>
          <span className='ml-auto pl-20'>&gt;</span>
        </Link>
        <Link href='/forgotPassword' className="option_menu">
          <Image src='/assets/icons/password.svg' width={30} height={30} alt='password' />
          <div className='flex flex-col'>
            <b>Change Password</b>
            <p>Change your account's password.</p>
          </div>
          <span className='ml-auto pl-20'>&gt;</span>
        </Link>
        <Link href='/feedback' className="option_menu">
          <Image src='/assets/icons/feedback.svg' width={30} height={30} alt='feedback' />
          <div className='flex flex-col'>
            <b>Feedback</b>
            <p>Help us improve our app!</p>
          </div>
          <span className='ml-auto pl-20'>&gt;</span>
        </Link>
      </div>
    </div>
  );
};

export default Profile;