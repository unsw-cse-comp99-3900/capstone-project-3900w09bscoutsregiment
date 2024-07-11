// app/layout.js
import { Inter } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from './context/ThemeContext';
import Link from "next/link";

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Create Next App',
  description: 'Generated by create next app',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ThemeProvider>
          <div className="px-16 py-4 text-white w-full flex items-center justify-between absolute">
            <Link href='/' className='flex items-center gap-2'>
              <div className='bg-white rounded-md w-8 h-8'></div>
              <span className='text-white text-xl font-bold'>COTAM</span>
            </Link>
            <div>
              <Link href='/login' className='outline_btn me-2'>Login</Link>
              <Link href='/register' className='highlight_btn'>Register</Link>
            </div>
          </div>
          {/* <div className="bg-custom text-custom absolute">
            <Link href='/' className='flex items-center gap-2'>
              <div className='bg-custom text-custom'></div>
              <span className='bg-custom text-custom'>COTAM</span>
            </Link>
            <div>
              <Link href='/login' className='outline_btn me-2'>Login</Link>
              <Link href='/register' className='highlight_btn'>Register</Link>
            </div>
          </div> */}
          {children}
        </ThemeProvider>

      </body>
    </html>
  );
}
