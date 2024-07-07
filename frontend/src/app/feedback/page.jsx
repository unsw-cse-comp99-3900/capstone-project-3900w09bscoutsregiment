'use client'; // needed for useState to work
import React, { useRef } from 'react';
import emailjs from '@emailjs/browser';
import Link from 'next/link';

export default function sendFeedback() {
  const form = useRef();
  const sendEmail = (e) => {
    e.preventDefault();

    emailjs
      .sendForm('service_er8htcs', 'template_u05rmji', form.current, {
        publicKey: 'T-4nNNwWfnuu31iUv',
      })
      .then(
        () => {
          console.log('SUCCESS!');
        },
        (error) => {
          console.log('FAILED...', error.text);
        }
      );
    e.target.reset();
  };

  return (
    <div>
      <div
        id="top-content"
        className="text-white w-full bg-primary-theme-db flex justify-start gap-4 px-4 py-4"
      >
        <img src="Cotam-logo.png" alt="" className="rounded-md" />
        <Link href="/" className="text-white" style={{ fontSize: '2rem' }}>
          COTAM
        </Link>
      </div>
      <div className="login-background">
        {/* start of form */}
        <form
          name="publish-form"
          id="form"
          className=" w-1/3 justify-center mx-auto pt-3 relative top-12"
          ref={form}
          onSubmit={sendEmail}
        >
          {/* email */}
          <div className="mb-2">
            <label
              className="block text-white text-[3rem] font-bold my-0"
              htmlFor=""
            >
              Send us a feedback
            </label>
            <input
              name="user_email"
              className="shadow appearance-none border rounded w-full py-2 px-2 placeholder-blue-400 leading-tight focus:outline-none focus:shadow-outline"
              id="email-address"
              type="email"
              placeholder="Email address"
            />
          </div>

          {/* name */}
          <div className="mb-4">
            <input
              color="#ff0000"
              name="user_name"
              className="shadow appearance-none border border-500 rounded w-full py-2 px-2 placeholder-blue-400 my-0"
              id="name"
              type="name"
              placeholder="Name"
            />
          </div>

          {/* feedback form */}
          <div className="mb-4">
            <textarea
              color="#ff0000"
              name="message"
              className="shadow appearance-none border border-500 rounded w-full h-32  py-2 px-2 placeholder-blue-400 my-0"
              id="feedback"
              type="text"
              placeholder="Enter your feedback here"
            />
          </div>

          {/* submit */}
          <div className="flex items-center justify-between pb-2">
            <button
              id="submit"
              className="relative top-6 bg-blue-500 hover:bg-blue-700 text-white font-bold w-full italic py-2 px-4 pb-3: rounded focus:outline-none focus:shadow-outline"
              type="submit"
              value="Send"
            >
              Submit
            </button>
          </div>
          <div className="flex items-center justify-center relative top-48">
            Return to &nbsp;
            <Link href="/" className="text-primary-theme-lb underline">
              Home
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
