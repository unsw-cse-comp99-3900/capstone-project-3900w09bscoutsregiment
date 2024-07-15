'use client'; // needed for useState to work
import React, { useRef, useState } from 'react';
import emailjs from '@emailjs/browser';
import Link from 'next/link';

export default function sendFeedback() {
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState(false);
  const [name, setName] = useState('');
  const [nameError, setNameError] = useState(false);
  const [feedback, setFeedback] = useState('');
  const [feedbackError, setFeedbackError] = useState(false);
  const form = useRef();

  const handleEmailBlur = (e) => {
    if (e.target.validity.typeMismatch || e.target.value === '') {
      setEmailError(true);
    } else {
      setEmailError(false);
    }
  };

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
    if (event.target.validity.valid) {
      setEmailError(false);
    }
  };

  const handleNameBlur = (e) => {
    if (e.target.value === '') {
      setNameError(true);
    } else {
      setNameError(false);
    }
  };

  const handleNameChange = (event) => {
    setName(event.target.value);
    if (event.target.value !== '') {
      setNameError(false);
    }
  };

  const handleFeedbackBlur = (e) => {
    if (e.target.value === '') {
      setFeedbackError(true);
    } else {
      setFeedbackError(false);
    }
  };

  const handleFeedbackChange = (event) => {
    setFeedback(event.target.value);
    if (event.target.value !== '') {
      setFeedbackError(false);
    }
  };

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
          className=" w-1/3 justify-center mx-auto pt-3 relative top-10"
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
              required
              name="user_email"
              className="shadow appearance-none border rounded w-full py-2 px-2 placeholder-blue-400 leading-tight focus:outline-none focus:shadow-outline"
              id="email-address"
              type="email"
              placeholder="Email address"
              onChange={handleEmailChange}
              onBlur={handleEmailBlur}
              value={email}
            />
            {emailError && (
              <p role="alert" className="text-red-600 font-bold">
                Please make sure you've entered an <em>email address</em>
              </p>
            )}
          </div>

          {/* name */}
          <div className="mb-4">
            <input
              required
              color="#ff0000"
              name="user_name"
              className="shadow appearance-none border border-500 rounded w-full py-2 px-2 placeholder-blue-400 my-0"
              id="name"
              type="name"
              placeholder="Name"
              onBlur={handleNameBlur}
              onChange={handleNameChange}
              value={name}
            />
            {nameError && (
              <p role="alert" className="text-red-600 font-bold">
                Please make sure you've entered a <em>name</em>
              </p>
            )}
          </div>

          {/* feedback form */}
          <div className="mb-4">
            <textarea
              required
              color="#ff0000"
              name="message"
              className="shadow appearance-none border border-500 rounded w-full h-32  py-2 px-2 placeholder-blue-400 my-0"
              id="feedback"
              type="text"
              placeholder="Enter your feedback here"
              onBlur={handleFeedbackBlur}
              onChange={handleFeedbackChange}
              value={feedback}
            />
            {feedbackError && (
              <p role="alert" className="text-red-600 font-bold">
                Please make sure you've entered a <em>feedback</em>
              </p>
            )}
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
