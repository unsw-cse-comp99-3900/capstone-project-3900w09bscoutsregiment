'use client';
import React from 'react';
import Link from 'next/link';
import { toast } from 'react-toastify';

export default function ResetPassword() {
  const [oldPassword, setOldPassword] = React.useState('');
  const [oldPasswordError, setOldPasswordError] = React.useState(false);
  const [newPassword, setNewPassword] = React.useState('');
  const [newPasswordError, setNewPasswordError] = React.useState(false);
  const [confirmPassword, setConfirmPassword] = React.useState('');
  const [confirmPasswordError, setConfirmPasswordError] = React.useState('');
  let port = process.env.NEXT_PUBLIC_PORT_NUM;
  /**
   * Keeps track of whether the old password form is in focus or not
   * @param {*} event
   * if the old password form is empty when its out of focus, updates the state of OldPasswordError to true, otherwise false
   */
  const handleOldPasswordBlur = (event) => {
    if (event.target.value === '') {
      setOldPasswordError(true);
    } else {
      setOldPasswordError(false);
    }
  };

  /**
   * Keeps track of the changes inside the old password form
   * @param {*} event
   * if the current value inside the old password form is valid (not empty), updates the state of OldPasswordError to false
   */
  const handleOldPasswordChange = (event) => {
    setOldPassword(event.target.value);
    if (event.target.value !== '') {
      setOldPasswordError(false);
    }
  };

  /**
   * Keeps track of whether the new password form is in focus or not
   * @param {*} event
   * if the new password form is empty when its out of focus, updates the state of NewPasswordError to true, otherwise false
   */
  const handleNewPasswordBlur = (event) => {
    if (event.target.value === '') {
      setNewPasswordError(true);
    } else {
      setNewPasswordError(false);
    }
  };

  /**
   * Keeps track of the changes inside the old password form
   * @param {*} event
   * if the current value inside the old password form is valid (not empty), updates the state of OldPasswordError to false
   */
  const handleNewPasswordChange = (event) => {
    setNewPassword(event.target.value);
    if (event.target.value !== '') {
      setNewPasswordError(false);
    }
  };

  /**
   * Keeps track of whether the confirm password form is in focus or not
   * @param {*} event
   * if the confirm password form is empty or does not have the same value as password form when its out of focus,
   * updates the state of ConfirmPasswordError to true, otherwise false
   */
  const handleConfirmPasswordBlur = (event) => {
    if (event.target.value === '' || event.target.value !== newPassword) {
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
  const handleResetPassword = async () => {
    if (oldPassword === '' || newPassword === '' || confirmPassword === '') {
      toast.error('You have to input all fields', {
        position: 'bottom-right',
        pauseOnHover: false,
      });
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error('New password is not the same as confirm password', {
        position: 'bottom-right',
        pauseOnHover: false,
      });
    } else {
      const res = await fetch(
        `http://localhost:${port}/api/profile/update/resetpassword`,
        {
          method: 'PUT',
          body: JSON.stringify({
            oldPassword,
            newPassword,
          }),
          headers: {
            'Content-type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );

      const data = await res.json();
      if (res.status === 200) {
        toast.success(data.message, {
          position: 'bottom-center',
          pauseOnHover: false,
        });
      } else {
        toast.error(data.message, {
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
            className="justify-center mx-auto w-2/5 space-y-2 p-14 rounded-2xl bg-secondary-bkg shadow-2xl"
          >
            <div className="mb-2">
              <label
                className="block text-primary-theme-lb text-[3rem] font-bold my-4"
                htmlFor="password"
              >
                Reset Password
              </label>
            </div>

            {/* password */}
            <div className="mb-2">
              <input
                name="old-password"
                className="shadow appearance-none border border-500 rounded w-full py-2 px-2 placeholder-blue-400 my-0"
                id="old-password"
                type="password"
                placeholder="Enter your password"
                onChange={handleOldPasswordChange}
                onBlur={handleOldPasswordBlur}
              />
              {oldPasswordError && (
                <p role="alert" className="text-red-600 font-bold">
                  Please make sure you've entered your old <em>password</em>
                </p>
              )}
            </div>

            <div className="mb-2">
              <input
                name="new-password"
                className="shadow appearance-none border border-500 rounded w-full py-2 px-2 placeholder-blue-400 my-0"
                id="new-password"
                type="password"
                placeholder="New password"
                onChange={handleNewPasswordChange}
                onBlur={handleNewPasswordBlur}
              />
              {newPasswordError && (
                <p role="alert" className="text-red-600 font-bold">
                  Please make sure you've entered a new <em>password</em>
                </p>
              )}
            </div>

            {/* confirm password */}
            <div className="mb-6">
              <input
                name="confirm-password"
                className="shadow appearance-none border border-500 rounded w-full py-2 px-2 my-0 placeholder-blue-400"
                id="confirm-password"
                type="password"
                placeholder="Confirm new password"
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
                onClick={handleResetPassword}
              >
                Reset
              </button>
            </div>
            <div className="flex items-center justify-center relative top-52 text-main-txt">
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
