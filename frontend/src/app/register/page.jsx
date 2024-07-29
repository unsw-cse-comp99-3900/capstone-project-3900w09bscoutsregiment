'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import OAuth from '../components/OAuth';
import { toast } from 'react-toastify';

export default function Register() {
  const [name, setName] = React.useState('');
  const [nameError, setNameError] = React.useState(false);
  const [email, setEmail] = React.useState('');
  const [emailError, setEmailError] = React.useState(false);
  const [password, setPassword] = React.useState('');
  const [passwordError, setPasswordError] = React.useState(false);
  const [confirmPassword, setConfirmPassword] = React.useState('');
  const [confirmPasswordError, setConfirmPasswordError] = React.useState('');
  let port = process.env.NEXT_PUBLIC_PORT_NUM;

  // form validation
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

  const handlePasswordBlur = (e) => {
    if (e.target.value === '') {
      setPasswordError(true);
    } else {
      setPasswordError(false);
    }
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
    if (event.target.value !== '') {
      setPasswordError(false);
    }
  };

  const handleConfirmPasswordBlur = (e) => {
    if (e.target.value === '' || e.target.value !== password) {
      setConfirmPasswordError(true);
    } else {
      setConfirmPasswordError(false);
    }
  };

  const handleConfirmPasswordChange = (event) => {
    setConfirmPassword(event.target.value);
    if (event.target.value !== '') {
      setConfirmPasswordError(false);
    }
  };

  // Ensure stay logged in
  const router = useRouter();
  React.useEffect(() => {
    const token = localStorage.getItem('token') || null;
    if (token !== null) {
      router.push('/courses');
      return;
    }
  }, []);

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
        toast.success('User signed up successfully', {
          position: 'bottom-center',
          pauseOnHover: false,
        });
        setTimeout(() => {
          router.push('/courses');
        }, 1500);
      } else {
        console.error(data.message);
        toast.error('Something went wrong, please try again', {
          position: 'bottom-center',
          pauseOnHover: false,
        });
      }
    }
  };
  return (
    <div>
      <div className="login_background">
        <div className="min-h-screen flex justify-center items-center">
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
                onChange={handleEmailChange}
                onBlur={handleEmailBlur}
                value={email}
              // multiple
              />
              {emailError && (
                <p role="alert" className="text-red-600 font-bold">
                  Please make sure you've entered an <em>email address</em>
                </p>
              )}
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

            {/* password */}
            <div>
              <input
                name="password"
                className="input_text"
                id="password"
                type="password"
                placeholder="Password"
                onChange={handlePasswordChange}
                onBlur={handlePasswordBlur}
              />
              {passwordError && (
                <p role="alert" className="text-red-600 font-bold">
                  Please make sure you've entered a <em>password</em>
                </p>
              )}
            </div>

            {/* confirm password */}
            <div>
              <input
                name="password"
                className="input_text"
                id="confirm-password"
                type="password"
                placeholder="Confirm Password"
                onChange={handleConfirmPasswordChange}
                onBlur={handleConfirmPasswordBlur}
              />
              {confirmPasswordError && (
                <p role="alert" className="text-red-600 font-bold">
                  Please make sure the passwords match
                </p>
              )}
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
                <p className="text-main-txt"> Already have an account? </p>
                <Link
                  href="/login"
                  style={{ textDecoration: 'underline', color: '#1d4ed8' }}
                >
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
