"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import React from "react";

const Helps = () => {
  // Ensure stay logged in
  const router = useRouter();
  React.useEffect(() => {
    const token = localStorage.getItem('token') || null
    if (token === null) {
      router.push('/');
      return
    }
  }, [])

  return (
    <div className="bg-white pt-12">
      <div className="bg-blue-100 p-20 flex flex-col items-center justify-center">
        <span className="font-semibold text-4xl">How can we help?</span>
        <input
          type="text"
          placeholder="Search FAQs"
          className="w-8/12 p-4 m-4 border border-gray-300 rounded-md"
        />
      </div>
      <div className="pt-5 flex flex-col items-center justify-center">
        <span className="font-semibold text-3xl">Common queries</span>
        <ul className="py-5">
          <li className="flex justify-between items-center border-b p-4 gap-20">
            <span>How do I search all the courses ?</span>
            <span>&gt;</span>
          </li>
          <li className="flex justify-between items-center border-b p-4 gap-20">
            <span>What is bloom's taxonomy and how will it help us ?</span>
            <span>&gt;</span>
          </li>
          <li className="flex justify-between items-center border-b p-4 gap-20">
            <span>What is COTAM and who developed it ?</span>
            <span>&gt;</span>
          </li>
        </ul>
      </div>

      <div className="py-5 flex flex-col items-center justify-center">
        <Link
          href="/feedback"
          className="text-white bg-blue-800 hover:bg-blue-600 px-4 py-2 rounded-md"
        >
          Feedback
        </Link>
        <span>Do you want to help improve our app? Share your feedback!</span>
      </div>

      <div className="py-5 pb-10 flex flex-col items-center justify-center">
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
