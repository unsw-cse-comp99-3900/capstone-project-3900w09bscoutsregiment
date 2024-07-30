'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import OAuth from '../components/OAuth';
import { toast } from 'react-toastify';
import { jwtDecode } from 'jwt-decode';

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
    if (event.target.value === '') {
      setNameError(true);
    } else {
      setNameError(false);
    }
  };

  /**
   * Keeps track of the changes inside the name form
   * @param {*} event
   * if the current value inside the name form is valid (not empty), updates the state of NameError to false
   */
  const handleNameChange = (event) => {
    setName(event.target.value);
    if (event.target.value !== '') {
      setNameError(false);
    }
  };

  /**
   * Keeps track of whether the password form is in focus or not
   * @param {*} event
   * if the password form is empty when its out of focus, updates the state of PasswordError to true, otherwise false
   */
  const handlePasswordBlur = (event) => {
    if (event.target.value === '') {
      setPasswordError(true);
    } else {
      setPasswordError(false);
    }
  };

  /**
   * Keeps track of the changes inside the password form
   * @param {*} event
   * if the current value inside the password form is valid (not empty), updates the state of PasswordError to false
   */
  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
    if (event.target.value !== '') {
      setPasswordError(false);
    }
  };

  /**
   * Keeps track of whether the confirm password form is in focus or not
   * @param {*} event
   * if the confirm password form is empty or does not have the same value as password form when its out of focus,
   * updates the state of ConfirmPasswordError to true, otherwise false
   */
  const handleConfirmPasswordBlur = (event) => {
    if (event.target.value === '' || event.target.value !== password) {
      setConfirmPasswordError(true);
    } else {
      setConfirmPasswordError(false);
    }
  };

  /**
   * Keeps track of the changes inside the confirm password form
   * @param {*} event
   * if the current value inside the confirm password form is valid (not empty), updates the state of ConfirmPasswordError to false
   */
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
      const expiryTime = jwtDecode(token).exp;
      const currentTime = Date.now() / 1000;

      if (expiryTime < currentTime) {
        localStorage.removeItem('token');
        toast.error('Session expired, please log in again');
        router.push('/login');
      } else {
        router.push('/courses');
      }
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

      if (response.ok) {
        toast.success('User signed up successfully', {
          position: 'bottom-center',
          pauseOnHover: false,
        });
        router.push('/login');
      } else {
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
                name="confirm-password"
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
                id="register-submit-btn"
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
                  style={{
                    textDecoration: 'underline',
                    color: '#1d4ed8',
                  }}
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
