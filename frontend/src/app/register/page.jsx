'use client';
import React from 'react';
export default function Register() {
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [confirmPassword, setConfirmPassword] = React.useState('');
  let port = 8000; // change later

  // backend stuff starts here
  const register = async () => {
    if (password !== confirmPassword) {
      alert('Passwords do not match');
    } else {
      const response = await fetch(`http://localhost:${port}/api/auth/signup`, {
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
    }
  };
  return (
    <>
      <div>COTAM</div>
      <div
        id="container"
        className="absolute top-0 left-0 h-screen w-screen bg-black/30 flex justify-center items-center"
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
                  Sign Up
                </label>
                <input
                  name="email-address"
                  className="shadow appearance-none border rounded w-full py-2 px-3 placeholder-blue-400 leading-tight focus:outline-none focus:shadow-outline"
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
                  className="shadow appearance-none border border-500 rounded w-full py-2 px-3 placeholder-blue-400 mb-3"
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
                  className="shadow appearance-none border border-500 rounded w-full py-2 px-3 mb-3 placeholder-blue-400"
                  id="password"
                  type="password"
                  placeholder="Confirm Password"
                  onChange={(e) => {
                    setConfirmPassword(e.target.value);
                  }}
                />
              </div>

              {/* submit */}
              <div className="flex items-center justify-between pb-4">
                <button
                  id="submit"
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 pb-3: rounded focus:outline-none focus:shadow-outline"
                  type="button"
                  onClick={register}
                >
                  Register
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
