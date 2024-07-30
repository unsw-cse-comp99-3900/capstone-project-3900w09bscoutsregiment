"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import React from "react";
import { jwtDecode } from "jwt-decode";
import { toast } from 'react-toastify';

const Helps = () => {
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
      return;
    }
  }, []);

  return (
    <div className="bg-main-bkg pt-12">
      <div className="bg-blue-100 p-8 flex flex-col items-center justify-center">
        <span className="font-semibold text-3xl">Common queries</span>
      </div>
      <div className="pt-5 flex flex-col items-center justify-center text-main-txt">
        <ul className="py-5">
          <Link href="help/search-courses-question" className="option_menu">
            <span>How do I search all the courses ?</span>
            <span>&gt;</span>
          </Link>
          <Link href="help/blooms-taxonomy-question" className="option_menu">
            <span>What is bloom's taxonomy and how will it help us ?</span>
            <span>&gt;</span>
          </Link>
          <Link href="help/cotam-question" className="option_menu">
            <span>What is COTAM and who developed it ?</span>
            <span>&gt;</span>
          </Link>
        </ul>
      </div>

      <div className="py-5 flex flex-col items-center justify-center text-main-txt">
        <Link
          href="/feedback"
          className="text-white bg-blue-800 hover:bg-blue-600 px-4 py-2 rounded-md"
        >
          Feedback
        </Link>
        <span className="mt-4">Do you want to help improve our app? Share your feedback!</span>
      </div>

      <div className="py-5 pb-10 flex flex-col items-center justify-center text-main-txt">
        <span className="font-semibold text-3xl">Get Started Guide</span>
        <span className="py-1">A quick guide in using COTAM</span>

        <video className="w-full max-w-3xl" controls>
          <source src="/path-to-your-video.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </div>
    </div>
  );
};

export default Helps;