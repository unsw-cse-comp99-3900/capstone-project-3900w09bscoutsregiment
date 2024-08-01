"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { jwtDecode } from "jwt-decode";
import { toast } from 'react-toastify';

/**
 * This is the Profile page, 
 * consisting of user details and options to change email, password, theme and logout
 * This page is what you would see in a typical  settings / profile page
 * @returns Page for user profile
 */
const Profile = () => {
  const [userDetails, setUserDetails] = React.useState({
    email: "",
    name: "",
  });
  const port = process.env.NEXT_PUBLIC_PORT_NUM;

  // Ensure stay logged in
  const router = useRouter();
  React.useEffect(() => {
    const token = localStorage.getItem("token") || null;
    if (token === null) {
      router.push("/");
      return;
    } else {
      const expiryTime = jwtDecode(token).exp
      const currentTime = Date.now() / 1000;

      if (expiryTime < currentTime) {
        localStorage.removeItem('token');
        toast.error('Session expired, please log in again');
        router.push('/login');
      }
    }

    const fetchProfile = async () => {
      try {
        const res = await fetch(
          `http://localhost:${port}/api/profile/details`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem(
                "token"
              )}`,
            },
          }
        );

        const data = await res.json();
        setUserDetails(data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchProfile();
  }, []);

  const logout = () => {
    localStorage.removeItem("token");
    router.push("/");
    closeDropdown();
    return;
  };

  return (
    <div className="bg-main-bkg min-h-screen">
      <div className="blue_background">
        {" "}
        {/* TODO , use login_background instead of blue background */}
        <div className="min-h-screen flex justify-center items-center gap-10">
          <div className="flex justify-center items-center pt-12 text-main-txt">
            <div className="flex flex-col gap-8 bg-secondary-bkg shadow-md rounded-xl py-10 px-20 w-full shadow-lg">
              <div className="w-32 h-32 bg-gray-300 rounded-full flex items-center justify-center">
                <span className="text-6xl text-white">👤</span>
              </div>
              <div>
                <h2 className="text-lg font-medium text-main-txt">
                  Name
                </h2>
                <p className="text-xl font-semibold text-primary-theme-lb">
                  {userDetails.name}
                </p>
              </div>
              <div>
                <h2 className="text-lg font-medium text-main-txt">
                  Email
                </h2>
                <input
                  type="text"
                  value={userDetails.email}
                  disabled
                  className="bg-gray-200 text-gray-700 border border-gray-300 rounded py-2 pr-20 pl-2"
                />
                <br />
              </div>
              <div>
                <h2 className="text-lg font-medium text-main-txt">
                  Password
                </h2>
                <input
                  type="text"
                  value="***********"
                  disabled
                  className="bg-gray-200 text-gray-700 border border-gray-300 rounded py-2 pr-20 pl-2"
                />
                <br />
              </div>
            </div>
          </div>
          <div className="bg-secondary-bkg text-main-txt rounded-xl p-10 shadow-lg">
            <Link href="/" onClick={logout} className="option_menu" id="logout-btn">
              {/* <Image src='/assets/icons/logout.svg' className='fill-cyan-500' width={30} height={30} alt='logout' /> */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 512 512"
                className="fill-main-txt"
                width={30}
                height={30}
              >
                <path d="M377.9 105.9L500.7 228.7c7.2 7.2 11.3 17.1 11.3 27.3s-4.1 20.1-11.3 27.3L377.9 406.1c-6.4 6.4-15 9.9-24 9.9c-18.7 0-33.9-15.2-33.9-33.9l0-62.1-128 0c-17.7 0-32-14.3-32-32l0-64c0-17.7 14.3-32 32-32l128 0 0-62.1c0-18.7 15.2-33.9 33.9-33.9c9 0 17.6 3.6 24 9.9zM160 96L96 96c-17.7 0-32 14.3-32 32l0 256c0 17.7 14.3 32 32 32l64 0c17.7 0 32 14.3 32 32s-14.3 32-32 32l-64 0c-53 0-96-43-96-96L0 128C0 75 43 32 96 32l64 0c17.7 0 32 14.3 32 32s-14.3 32-32 32z" />
              </svg>

              <div className="flex flex-col">
                <b>Logout</b>
                <p>Logout of your account.</p>
              </div>
              <span className="ml-auto pl-20">&gt;</span>
            </Link>
            <Link href="/changeEmail" className="option_menu">
              {/* <Image src='/assets/icons/email.svg' width={30} height={30} alt='email' /> */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 512 512"
                className="fill-main-txt"
                width={30}
                height={30}
              >
                <path d="M48 64C21.5 64 0 85.5 0 112c0 15.1 7.1 29.3 19.2 38.4L236.8 313.6c11.4 8.5 27 8.5 38.4 0L492.8 150.4c12.1-9.1 19.2-23.3 19.2-38.4c0-26.5-21.5-48-48-48H48zM0 176V384c0 35.3 28.7 64 64 64H448c35.3 0 64-28.7 64-64V176L294.4 339.2c-22.8 17.1-54 17.1-76.8 0L0 176z" />
              </svg>

              <div className="flex flex-col">
                <b>Change Email</b>
                <p>Change your account's email.</p>
              </div>
              <span className="ml-auto pl-20">&gt;</span>
            </Link>
            <Link href="/resetPassword" className="option_menu">
              {/* <Image src='/assets/icons/password.svg' width={30} height={30} alt='password' /> */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 512 512"
                className="fill-main-txt"
                width={30}
                height={30}
              >
                <path d="M144 144v48H304V144c0-44.2-35.8-80-80-80s-80 35.8-80 80zM80 192V144C80 64.5 144.5 0 224 0s144 64.5 144 144v48h16c35.3 0 64 28.7 64 64V448c0 35.3-28.7 64-64 64H64c-35.3 0-64-28.7-64-64V256c0-35.3 28.7-64 64-64H80z" />
              </svg>

              <div className="flex flex-col">
                <b>Change Password</b>
                <p>Change your account's password.</p>
              </div>
              <span className="ml-auto pl-20">&gt;</span>
            </Link>
            <Link href="/feedback" className="option_menu">
              {/* <Image src='/assets/icons/feedback.svg' width={30} height={30} alt='feedback' /> */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 512 512"
                className="fill-main-txt"
                width={30}
                height={30}
              >
                <path d="M512 240c0 114.9-114.6 208-256 208c-37.1 0-72.3-6.4-104.1-17.9c-11.9 8.7-31.3 20.6-54.3 30.6C73.6 471.1 44.7 480 16 480c-6.5 0-12.3-3.9-14.8-9.9c-2.5-6-1.1-12.8 3.4-17.4l0 0 0 0 0 0 0 0 .3-.3c.3-.3 .7-.7 1.3-1.4c1.1-1.2 2.8-3.1 4.9-5.7c4.1-5 9.6-12.4 15.2-21.6c10-16.6 19.5-38.4 21.4-62.9C17.7 326.8 0 285.1 0 240C0 125.1 114.6 32 256 32s256 93.1 256 208z" />
              </svg>

              <div className="flex flex-col">
                <b>Feedback</b>
                <p>Help us improve our app!</p>
              </div>
              <span className="ml-auto pl-20">&gt;</span>
            </Link>
            <Link href="/profile/themeToggle" className="option_menu" id="change-theme-btn"> 
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" className="fill-main-txt" width={30} height={30}><path d="M512 256c0 .9 0 1.8 0 2.7c-.4 36.5-33.6 61.3-70.1 61.3H344c-26.5 0-48 21.5-48 48c0 3.4 .4 6.7 1 9.9c2.1 10.2 6.5 20 10.8 29.9c6.1 13.8 12.1 27.5 12.1 42c0 31.8-21.6 60.7-53.4 62c-3.5 .1-7 .2-10.6 .2C114.6 512 0 397.4 0 256S114.6 0 256 0S512 114.6 512 256zM128 288a32 32 0 1 0 -64 0 32 32 0 1 0 64 0zm0-96a32 32 0 1 0 0-64 32 32 0 1 0 0 64zM288 96a32 32 0 1 0 -64 0 32 32 0 1 0 64 0zm96 96a32 32 0 1 0 0-64 32 32 0 1 0 0 64z" /></svg>
              <div className='flex flex-col'>
                <b>Theme</b>
                <p>Change Theme</p>
              </div>
              <span className='ml-auto pl-20'>&gt;</span>
            </Link>
          </div>
        </div>
      </div>
    </div >
  );
};

export default Profile;
