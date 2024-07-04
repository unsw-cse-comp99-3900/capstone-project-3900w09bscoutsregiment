'use client';

import {
  AppBar,
  Toolbar,
  Button,
  Typography,
  Box,
  Container,
} from '@mui/material';
// import logosmall from './Components/HomePage/Cotam-logo.png';
import WaveSVG from './Components/HomePage/WaveSVG.js';
import FooterPage from './Components/HomePage/FooterPage';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function Home() {
  // Ensure stay logged in
  const router = useRouter();
  const token = window.localStorage.getItem('token');
  if (token !== null) {
    router.push('/courses');
    return;
  }

  return (
    <main className='flex bg-white flex-col p-0 b-0 m-0 items-center justify-between'>
      <div className='text-white pt-3 pb-8 w-full bg-primary-theme-db flex justify-between px-12'>
        <div className='text-white w-full bg-primary-theme-db flex justify-between px-4'>
          {/* <img src={logosmall} alt="logo" className='' /> */}
          <div className='flex gap-4'>
            <img src='Cotam-logo.png' alt='' className='rounded-md' />
            <Link href='/' className='text-white' style={{ fontSize: '2rem' }}>
              COTAM
            </Link>
          </div>
          <div>
            {/* <Link href="/login"> Login </Link> */}
            {/* <Link href="/register"> Register </Link> */}
            <button className='m-1 border bg-transparent border-white hover:bg-white text-white hover:text-blue-500  py-0 px-6 rounded'>
              <Link href='/login'> Login </Link>
            </button>
            <button className='m-1 bg-blue-500 bg-white hover:bg-white hover:text-primary-theme-db  hover:opacity-80 text-blue-500 py-0 px-5 rounded'>
              <Link href='/register'> Register </Link>
            </button>
          </div>
        </div>
      </div>

      <div className='bg-gradient-to-b px-12 from-primary-theme-db to-primary-theme-lb h-48  w-full'>
        <div className='text-white text-center flex justify-between p-2'>
          <div className='w-2/3 p-1'>
            <h1 className='text-5xl font-bold text-left'>
              Improve Your <br />
              Course <span className='underline font-light'>Outcomes</span>
            </h1>
            <button className='flex justify-start mt-4 px-6 py-2 bg-blue-500 hover:text-primary-theme-db hover:opacity-80 text-primary-theme-lb italic bg-white font-semibold rounded-lg'>
              Get Started
            </button>
            <p className='mt-2 text-left'>We will help you find a pathway</p>
          </div>
          <div className=' p-1'>image here</div>
        </div>
      </div>
      <WaveSVG />
      <br></br>

      <br></br>
      <div>
        <div className='text-4xl font-bold text-primary-theme-lb'>
          What we Offer
        </div>
        <div>
          <div>left pic</div>
          <div>middle pic</div>
          <div>bottom pic</div>
        </div>
      </div>
      <br></br>

      <div className='text-4xl font-bold text-primary-theme-lb'>
        <div>How it Works</div>
      </div>

      <br></br>

      <div class='bg-blue-500 text-white p-4 flex items-center justify-center'>
        <iframe
          width='560'
          height='315'
          src='https://www.youtube.com/embed/dQw4w9WgXcQ'
          title='YouTube video player'
          frameborder='0'
          allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share'
          allowfullscreen
        ></iframe>
      </div>
      <div>
        <button className='flex justify-start mt-4 px-6 py-2 bg-blue-500 hover:bg-blue-700 text-white italic bg-primary-theme-lb font-semibold rounded-lg'>
          Feedback
        </button>
      </div>
      <div>Want to help improve our app? Share your feedback!</div>
      <FooterPage />
    </main>
  );
}
