'use client';
import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFacebook, faGoogle } from '@fortawesome/free-brands-svg-icons';
import Link from 'next/link';
import OAuth from '../components/OAuth';

export default function Register() {
  const [name, setName] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [confirmPassword, setConfirmPassword] = React.useState('');
  let port = 5000; // change later

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
    }
  };
  return (
    <div>
      <div
        id="top-content"
        className="text-white w-full bg-primary-theme-db flex justify-between px-4"
      >
        <span className="m-1 p-1 font-bold text-2xl">COTAM</span>
      </div>
      <div className="login-background">
        {/* start of form */}
        <form
          name="publish-form"
          id="form"
          className=" w-1/3 justify-center mx-auto pt-3 relative top-16"
        >
          {/* email */}
          <div className="mb-2">
            <label
              className="block text-white text-[4rem] font-bold my-0"
              htmlFor="password"
            >
              Sign Up
            </label>
            <input
              name="email-address"
              className="shadow appearance-none border rounded w-full py-2 px-2 placeholder-blue-400 leading-tight focus:outline-none focus:shadow-outline"
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
          <div className="mb-4">
            <input
              color="#ff0000"
              name="name"
              className="shadow appearance-none border border-500 rounded w-full py-2 px-2 placeholder-blue-400 my-0"
              id="name"
              type="name"
              placeholder="Name"
              onChange={(e) => {
                setName(e.target.value);
              }}
            />
          </div>

          {/* password */}
          <div className="mb-2">
            <input
              name="password"
              className="shadow appearance-none border border-500 rounded w-full py-2 px-2 placeholder-blue-400 my-0"
              id="password"
              type="password"
              placeholder="Password"
              onChange={(e) => {
                setPassword(e.target.value);
              }}
            />
          </div>

          {/* confirm password */}
          <div className="mb-6">
            <input
              name="password"
              className="shadow appearance-none border border-500 rounded w-full py-2 px-2 my-0 placeholder-blue-400"
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
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold w-full italic py-2 px-4 pb-3: rounded focus:outline-none focus:shadow-outline"
              type="button"
              onClick={register}
            >
              Register
            </button>
          </div>
          <div className="pt-4 flex items-center justify-evenly">
            <OAuth></OAuth>
          </div>
          <div className="pt-4 flex items-center justify-center gap-2">
            <p> Already have an account? </p>
            <Link href="/login" style={{ textDecoration: 'underline' }}>
              Sign in
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
