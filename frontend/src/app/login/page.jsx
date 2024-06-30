'use client'; // needed for useState to work
import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFacebook, faGoogle } from '@fortawesome/free-brands-svg-icons';
import Link from 'next/link';
import OAuth from '../components/OAuth';

export default function Login() {
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  let port = 5000;

  // backend stuff
  const login = async () => {
    const response = await fetch(`http://localhost:${port}/api/auth/login`, {
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
      <div id="top-content" className='text-white w-full bg-primary-theme-db flex justify-between px-4'>
        <span className="m-1 p-1 font-bold text-2xl">COTAM</span>
      </div>
      <div className='login-background'>
        <form
          name="publish-form"
          id="form"
          className=" w-1/3 justify-center mx-auto pt-3" // POSTIION MUST BE ABOSLUTE
        >
          <div className="mb-4">
            <label
              className="block text-white text-[2rem] font-bold mb-2"
              htmlFor="password"
            >
              Log in
            </label>
            <input
              name="email-address"
              className="shadow appearance-none border rounded w-full py-3 px-2 text-gray-700 placeholder-blue-400 leading-tight focus:outline-none focus:shadow-outline"
              id="email-address"
              type="text"
              placeholder="Email address"
              onChange={(e) => {
                setEmail(e.target.value);
              }}
            // multiple
            />
          </div>

          {/* password */}
          <div className="mb-6">
            <input
              name="password"
              className="shadow appearance-none border border-500 rounded w-full py-3 px-2 text-gray-700 placeholder-blue-400 mb-3"
              id="password"
              type="password"
              placeholder="Password"
              onChange={(e) => {
                setPassword(e.target.value);
              }}
            />
          </div>

          {/* submit */}
          <div className="items-center justify-between">
            <button
              id="submit"
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold w-full italic py-2 px-4 pb-3: rounded focus:outline-none focus:shadow-outline"
              type="button"
              onClick={login}
            >
              Log in
            </button>
            <div className='p-5'>
              <hr className='custom-login-hr '></hr>
            </div>
          </div>
          {/* other login options */}
          <div className="flex items-center justify-evenly">
            <OAuth></OAuth>
          </div>
          {/* forgot password */}
          <div className="pt-8 flex items-center justify-center">
            <a className="underline" href="/">
              Forgot Password
            </a>
          </div>
          {/* sign up */}
          <div className="flex items-center justify-center gap-2">
            <p> Don't have an account yet?</p>
            <Link href="/register" style={{ textDecoration: 'underline' }}>
              Sign up
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
