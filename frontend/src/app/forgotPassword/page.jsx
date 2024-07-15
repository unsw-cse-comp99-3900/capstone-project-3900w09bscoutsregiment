'use client'; // needed for useState to work
import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFacebook, faGoogle } from '@fortawesome/free-brands-svg-icons';
import Link from 'next/link';
import OAuth from '../components/OAuth';

export default function ForgotPassword() {
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  let port = 5000;

  // backend stuff
  // TODO: CHANGE THIS TO FORGOT PASSWORD
  const sendEmailForgotPassword = async () => {
    const response = await fetch(`http://localhost:${port}/api/auth/send`, {
      method: 'POST',
      body: JSON.stringify({
        email,
        password,
      }),
      headers: {
        'Content-type': 'application/json',
      },
    });
    const data = await response.json();
    console.log(data);
  };

  return (
    <div>
      <div className="login_background">
        <div className='min-h-screen flex justify-center items-center'>
          <form
            name="publish-form"
            id="form"
            className="justify-center mx-auto w-2/5 bg-secondary-bkg space-y-2 p-14 rounded-2xl shadow-2xl"
          >
            <div>
              <h2 className="block text-primary-theme-lb text-[3rem] font-bold my-4">
                Forgot Password
              </h2>
              <div className="mb-3 text-main-txt">
                We will send you an email with instructions on how to reset your
                password.
              </div>
              <input
                name="email-address"
                className="shadow appearance-none border rounded w-full py-3 px-2 text-gray-700 placeholder-primary-theme-lb leading-tight focus:outline-none focus:shadow-outline"
                id="email-address"
                type="text"
                placeholder="Email address"
                onChange={(e) => {
                  setEmail(e.target.value);
                }}
              />
            </div>

            {/* Send email */}
            <div className="items-center justify-between pt-2">
              <button
                id="submit"
                className="bg-primary-theme-lb hover:bg-blue-700 text-white font-bold w-1/4 italic py-2 px-4 pb-3: rounded focus:outline-none focus:shadow-outline mb-5"
                type="button"
                onClick={sendEmailForgotPassword}
              >
                Send Email
              </button>
            </div>
            <div className="flex items-center justify-center pt-2 text-main-txt">
              Return to &nbsp;
              <Link href="/" className="text-primary-theme-lb underline">
                Home
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
