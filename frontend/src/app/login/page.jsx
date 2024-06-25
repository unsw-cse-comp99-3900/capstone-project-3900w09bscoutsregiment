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
    <>
      <div
        id="container"
        className="absolute top-0 left-0 h-screen w-screen bg-blue-600 flex justify-center items-center"
      >
        <div className="p-2">
          <div className="flex justify-start w-[500px] p-[30px]">
            {/* start of form */}
            <form
              name="publish-form"
              id="form"
              className="rounded px-10 pt-6 pb-10 mb-4 w-96 h-auto"
            >
              {/* email */}
              <div className="mb-4">
                <label
                  className="block text-white text-[2rem] font-bold mb-2"
                  htmlFor="password"
                >
                  Log in
                </label>
                <input
                  name="email-address"
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 placeholder-blue-400 leading-tight focus:outline-none focus:shadow-outline"
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
                  className="shadow appearance-none border border-500 rounded w-full py-2 px-3 text-gray-700 placeholder-blue-400 mb-3"
                  id="password"
                  type="password"
                  placeholder="Password"
                  onChange={(e) => {
                    setPassword(e.target.value);
                  }}
                />
              </div>

              {/* submit */}
              <div className="flex items-center justify-between pb-2">
                <button
                  id="submit"
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold w-full italic py-3 px-4 pb-3: rounded focus:outline-none focus:shadow-outline"
                  type="button"
                  onClick={login}
                >
                  Login
                </button>
              </div>
              <div className="flex items-center justify-evenly">
                <a className="flex items-center border-solid border-2 border-white/40 bg-black rounded-sm px-4 py-2">
                  <span className="mr-2">
                    <FontAwesomeIcon icon={faGoogle} />
                  </span>
                  <span className="">Google</span>
                </a>
                <OAuth></OAuth>
              </div>
              <div className="pt-8 flex items-center justify-center">
                <a className="underline" href="/">
                  Forgot Password
                </a>
              </div>
              <div className="flex items-center justify-center gap-2">
                <p> Don't have an account yet?</p>
                <Link href="/register" style={{ textDecoration: 'underline' }}>
                  Sign up
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
