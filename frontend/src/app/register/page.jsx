'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import OAuth from '../components/OAuth';

export default function Register() {
  const [name, setName] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [confirmPassword, setConfirmPassword] = React.useState('');
  let port = 5000; // change later

  // Ensure stay logged in
  const router = useRouter();
  React.useEffect(() => {
    const token = localStorage.getItem('token') || null;
    if (token !== null) {
      router.push('/courses');
      return;
    }
  }, [])

  // backend stuff starts here
  const register = async () => {
    if (password !== confirmPassword) {
      alert('Passwords do not match');
    } else {
      const response = await fetch(`http://localhost:${port}/api/auth/signup`, {
        method: 'POST',
        body: JSON.stringify({
          name,
          email,
          password,
          confirmPassword,
        }),
        headers: {
          'Content-type': 'application/json',
        },
      });
      const data = await response.json();
      if (response.ok) {
        localStorage.setItem('token', data.token);
        router.push('/courses');
      } else {
        console.error(data.message);
      }
    }
  };
  return (
    <div>
      <div className='login_background'>
        <div className='min-h-screen flex justify-center items-center'>
          {/* start of form */}
          <form
            name="publish-form"
            id="form"
            className="justify-center bg-secondary-bkg mx-auto w-2/5 space-y-2 p-14 rounded-2xl shadow-2xl"
          >
            {/* email */}
            <div>
              <h2 className="block text-primary-theme-lb text-[4rem] font-bold my-4">
                Sign Up
              </h2>
              <input
                name="email-address"
                className="input_text"
                id="email-address"
                type="text"
                placeholder="Email address"
                onChange={(e) => {
                  setEmail(e.target.value);
                }}
                // multiple
              />
            </div>

            {/* name */}
            <div>
              <input
                color="#ff0000"
                name="name"
                className="input_text"
                id="name"
                type="name"
                placeholder="Name"
                onChange={(e) => {
                  setName(e.target.value);
                }}
              />
            </div>

            {/* password */}
            <div>
              <input
                name="password"
                className="input_text"
                id="password"
                type="password"
                placeholder="Password"
                onChange={(e) => {
                  setPassword(e.target.value);
                }}
              />
            </div>

            {/* confirm password */}
            <div>
              <input
                name="password"
                className="input_text"
                id="confirm-password"
                type="password"
                placeholder="Confirm Password"
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                }}
              />
            </div>

            {/* submit */}
            <div className="flex items-center justify-between pb-2">
              <button
                id="submit"
                className="bg-primary-theme-lb hover:bg-blue-700 text-white font-bold w-full italic py-2 px-4 pb-3: rounded focus:outline-none focus:shadow-outline"
                type="button"
                onClick={register}
              >
                Register
              </button>
            </div>
            <div>
              <div className="p-5">
                <hr className="custom-login-hr "></hr>
              </div>
              <div className="flex items-center justify-evenly">
                <OAuth></OAuth>
              </div>
              <div className="pt-2 flex items-center justify-center gap-2">
                <p className='text-main-txt'> Already have an account? </p>
                <Link href="/login" style={{ textDecoration: 'underline', color: '#1d4ed8' }}>
                  Sign in
                </Link>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
