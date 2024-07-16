'use client';

import {
  AppBar,
  Toolbar,
  Button,
  Typography,
  Box,
  Container,
} from '@mui/material';
import WaveSVG from './Components/HomePage/WaveSVG.js';
import FooterPage from './Components/HomePage/FooterPage';
import Link from 'next/link';
import Image from 'next/image';
import React from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
  // Ensure stay logged in
  const router = useRouter();
  React.useEffect(() => {
    const token = localStorage.getItem('token');
    if (token !== null) {
      router.push('/courses');
      return;
    }
  }, []);

  return (
    <main className='flex bg-main-bkg flex-col p-0 b-0 m-0 items-center justify-between'>
      <div className='bg-gradient-to-b px-12 from-primary-theme-db to-primary-theme-lb h-full pt-32 w-full'>
        <div className='text-secondary-txt text-center flex justify-between p-2'>
          <div className='w-2/3 p-1'>
            <h1 className='text-5xl font-bold text-left'>
              Improve Your <br />
              Course <span className='underline font-light'>Outcomes</span>
            </h1>
            <button className='flex justify-start mt-4 px-6 py-2 hover:text-primary-theme-db hover:opacity-80 text-primary-theme-lb italic bg-main-bkg font-semibold rounded-lg'>
              Get Started
            </button>
            <p className='mt-2 text-left'>We will help you find a pathway</p>
          </div>
          <div className=' p-1'>
            <Image
              src='/homepage/images/clip.svg'
              alt='Example3'
              className='p-0 m-0 '
              width={500}
              height={500}
            />
          </div>
        </div>
      </div>
      <WaveSVG />
      <br></br>

      <br></br>
      <div className='text-4xl font-bold text-primary-theme-lb items-center justify-center '>
        What we Offer
      </div>
      <div className='mt-12 p-5'>
        <div className='flex space-x-8 items-center justify-center home-background-how-it-works'>
          <div className='w-1/5 border-solid border-2 border-black rounded-xl h-60 p-2 flex flex-col justify-center items-center bg-white'>
            <Image
              src='/homepage/images/left-img.png'
              alt='Example2'
              width={70}
              height={70}
            />
            <div className='font-bold'>Accurate Mapping</div>
            <div>
              Our app uses bloom's taxonomy to carefully map all the course
              outline{' '}
            </div>
          </div>
          <div className='w-1/5 border-solid border-2 border-black rounded-xl h-60 p-2 pt-0 flex flex-col justify-center items-center bg-white'>
            <Image
              src='/homepage/images/mid-img.png'
              alt='Example3'
              width={70}
              height={70}
            />
            <div className='font-bold'>Breakdown Analysis</div>
            <div>
              Our app give a detail analysis for each of the taxonomy level
            </div>
          </div>
          <div className='w-1/5 border-solid border-2 border-black rounded-xl h-60 p-2 pt-4 flex flex-col justify-center items-center bg-white'>
            <Image
              src='/homepage/images/right-img.png'
              alt='Example'
              width={70}
              height={70}
              className=''
            />
            <div className='font-bold'>Multiple Course Comparison</div>
            <div>
              Our app support multiple course comparison for a better
              understanding
            </div>
          </div>
        </div>
      </div>
      <br></br>

      <div className='text-4xl font-bold text-primary-theme-lb mt-16'>
        <div>How it Works</div>
      </div>

      <br></br>

      <div className='bg-primary-theme-lb text-secondary-txt p-4 flex items-center justify-center'>
        <iframe
          width='560'
          height='315'
          src='https://www.youtube.com/embed/dQw4w9WgXcQ'
          title='YouTube video player'
          frameBorder='0'
          allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share'
          allowFullScreen
        ></iframe>
      </div>
      <div>
        <Link
          href='/feedback'
          className='flex justify-start mt-4 px-6 py-2 bg-blue-500 hover:bg-blue-700 text-white italic bg-primary-theme-1b font-semibold rounded-lg'
        >
          Feedback
        </Link>
        {/* <button className="flex justify-start mt-4 px-6 py-2 bg-blue-500 hover:bg-blue-700 text-white italic bg-primary-theme-lb font-semibold rounded-lg">Feedback</button> */}
        <button className='flex justify-start mt-4 px-6 py-2 bg-primary-theme-lb hover:bg-blue-700 text-secondary-txt italic bg-primary-theme-lb font-semibold rounded-lg'>
          Feedback
        </button>
      </div>
      <div className='text-main-txt'>
        Want to help improve our app? Share your feedback!
      </div>
      <FooterPage />
    </main>
  );
}
