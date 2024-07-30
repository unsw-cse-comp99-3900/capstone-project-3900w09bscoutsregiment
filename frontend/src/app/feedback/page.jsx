'use client'; // needed for useState to work
import React, { useRef, useState } from 'react';
import emailjs from '@emailjs/browser';
import Link from 'next/link';
import { toast } from 'react-toastify';

export default function sendFeedback() {
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState(false);
  const [name, setName] = useState('');
  const [nameError, setNameError] = useState(false);
  const [feedback, setFeedback] = useState('');
  const [feedbackError, setFeedbackError] = useState(false);
  const form = useRef();

  /**
   * Keeps track of whether the email form is in focus or not
   * @param {*} event
   * if the form is empty or is not a valid email when its out of focus, updates the state of EmailError to true, otherwise false
   */
  const handleEmailBlur = (event) => {
    if (event.target.validity.typeMismatch || event.target.value === '') {
      setEmailError(true);
    } else {
      setEmailError(false);
    }
  };

  /**
   * Keeps track of the changes inside the email form
   * @param {*} event
   * if the current value inside the email form is valid, updates the state of EmailError to true
   */
  const handleEmailChange = (event) => {
    setEmail(event.target.value);
    if (event.target.validity.valid) {
      setEmailError(false);
    }
  };

  /**
   * Keeps track of whether the name form is in focus or not
   * @param {*} event
   * if the name form is empty or is not a valid name when its out of focus, updates the state of NameError to true, otherwise false
   */
  const handleNameBlur = (event) => {
    if (event.target.validity.typeMismatch || event.target.value === '') {
      setNameError(true);
    } else {
      setNameError(false);
    }
  };

  /**
   * Keeps track of the changes inside the name form
   * @param {*} event
   * if the current value inside the name form is valid, updates the state of NameError to false
   */
  const handleNameChange = (event) => {
    setName(event.target.value);
    if (event.target.value !== '') {
      setNameError(false);
    }
  };

  /**
   * Keeps track of whether the feedback form is in focus or not
   * @param {*} event
   * if the feedback form is empty when its out of focus, updates the state of FeedbackError to true, otherwise false
   */
  const handleFeedbackBlur = (event) => {
    if (event.target.value === '') {
      setFeedbackError(true);
    } else {
      setFeedbackError(false);
    }
  };

  /**
   * Keeps track of the changes inside the Feedback form
   * @param {*} event
   * if the current value inside the Feedback form is valid, updates the state of FeedbackError to false
   */
  const handleFeedbackChange = (event) => {
    setFeedback(event.target.value);
    if (event.target.value !== '') {
      setFeedbackError(false);
    }
  };

  /**
   * Resets the form by clearing all the states connected to the form after submission
   * This method is not to be confused with form.current.reset which clears all the values inside the form
   */
  const resetForm = () => {
    setEmail('');
    setName('');
    setFeedback('');
    setEmailError(false);
    setNameError(false);
    setFeedbackError(false);
  };

  /**
   * Sends an email using EmailJS service
   * @param {*} e
   */
  const sendEmail = (e) => {
    e.preventDefault();

    /**
     * @param {string} service_id (Service ID of the service through which email (Gmail, Outlook, Yahoo, etc.,) should be sent.)
     * @param {string} template_id (Template ID of the email)
     * @param {string} user_id (Public key of the account connected to EmailJS)
     */
    emailjs
      .sendForm('service_er8htcs', 'template_u05rmji', form.current, {
        publicKey: 'T-4nNNwWfnuu31iUv',
      })
      .then(
        () => {
          console.log('SUCCESS!');
          resetForm();
          form.current.reset();
        },
        (error) => {
          console.log('FAILED...', error.text);
        }
      );
    // pop up a toast if feedback is sent
    toast.success('Your feedback is sent, thank you for reaching out to us', {
      position: 'bottom-center',
      pauseOnHover: false,
    });
  };

  return (
    <div>
      <div className="login_background z-10">
        {/* start of form */}
        <div className="min-h-screen flex justify-center items-center ">
          <form
            name="publish-form"
            id="form"
            className="justify-center mx-auto w-2/5 space-y-2 p-14 rounded-2xl bg-secondary-bkg shadow-2xl"
            ref={form}
            onSubmit={sendEmail}
          >
            {/* email */}
            <div className="mb-2">
              <label
                className="block text-primary-theme-lb text-[3rem] font-bold my-0"
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
          </form>
        </div>
      </div>
    </div>
  );
}
