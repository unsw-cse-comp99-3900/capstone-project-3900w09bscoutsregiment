'use client'; // needed for useState to work
import React from 'react';
import Link from 'next/link';
import { toast } from 'react-toastify';

export default function ChangeEmail() {
  const [oldEmail, setOldEmail] = React.useState('');
  const [oldEmailError, setOldEmailError] = React.useState(false);
  const [newEmail, setNewEmail] = React.useState('');
  const [newEmailError, setNewEmailError] = React.useState(false);
  let port = process.env.NEXT_PUBLIC_PORT_NUM;

  /**
   * Keeps track of whether the old email form is in focus or not
   * @param {*} event
   * if the form is empty or is not a valid email when its out of focus, updates the state of oldEmailError to true, otherwise false
   */
  const handleOldEmailBlur = (event) => {
    if (event.target.validity.typeMismatch || event.target.value === '') {
      setOldEmailError(true);
    } else {
      setOldEmailError(false);
    }
  };

  /**
   * Keeps track of the changes inside the old email form
   * @param {*} event
   * if the current value inside the old email form is valid, updates the state of oldEmailError to false
   */
  const handleOldEmailChange = (event) => {
    setOldEmail(event.target.value);
    if (event.target.validity.valid) {
      setOldEmailError(false);
    }
  };

  /**
   * Keeps track of whether the new email form is in focus or not
   * @param {*} event
   * if the form is empty or is not a valid email when its out of focus, updates the state of newEmailError to true, otherwise false
   */
  const handleNewEmailBlur = (event) => {
    if (event.target.validity.typeMismatch || event.target.value === '') {
      setNewEmailError(true);
    } else {
      setNewEmailError(false);
    }
  };

  /**
   * Keeps track of the changes inside the new email form
   * @param {*} event
   * if the current value inside the new email form is valid, updates the state of newEmailError to false
   */
  const handleNewEmailChange = (event) => {
    setNewEmail(event.target.value);
    if (event.target.validity.valid) {
      setNewEmailError(false);
    }
  };

  const handleUpdateEmail = async () => {
    if (oldEmail === '' || newEmail === '') {
      toast.error('You have to input both old and new emails', {
        position: 'bottom-right',
        pauseOnHover: false,
      });
      return;
    }

    const response = await fetch(
      `http://localhost:${port}/api/profile/update/email`,
      {
        method: 'PUT',
        body: JSON.stringify({
          oldEmail,
          newEmail,
        }),
        headers: {
          'Content-type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      }
    );

    const data = await response.json();
    if (response.status === 200) {
      toast.success(data.message, {
        position: 'bottom-right',
        pauseOnHover: false,
      });
    } else {
      toast.error(data.message, {
        position: 'bottom-right',
        pauseOnHover: false,
      });
    }
  };

  return (
    <div>
      <div className="login_background z-10">
        <div className="min-h-screen flex justify-center items-center ">
          <form
            name="publish-form"
            id="form"
            className="justify-center mx-auto w-2/5 space-y-2 p-14 rounded-2xl bg-secondary-bkg shadow-2xl"
          >
            <div>
              <h2 className="block text-primary-theme-lb text-[4rem] font-bold my-4">
                Update Email
              </h2>
              <input
                name="old-email-address"
                className="shadow appearance-none border rounded w-full py-3 px-2 text-gray-700 placeholder-blue-400 leading-tight focus:outline-none focus:shadow-outline"
                id="email-address"
                type="text"
                placeholder="Enter your old email address"
                onChange={handleOldEmailChange}
                onBlur={handleOldEmailBlur}
                value={oldEmail}
              />
              {oldEmailError && (
                <p role="alert" className="text-red-600 font-bold">
                  Please make sure you've entered your old{' '}
                  <em>email address</em>
                </p>
              )}

              <input
                name="new-email-address"
                className="shadow appearance-none border rounded w-full py-3 px-2 text-gray-700 placeholder-blue-400 leading-tight focus:outline-none focus:shadow-outline"
                id="email-address"
                type="text"
                placeholder="Enter your new email address"
                onChange={handleNewEmailChange}
                onBlur={handleNewEmailBlur}
                value={newEmail}
              />
              {newEmailError && (
                <p role="alert" className="text-red-600 font-bold">
                  Please make sure you've entered your new{' '}
                  <em>email address</em>
                </p>
              )}
            </div>

            {/* Send email */}
            <div className="items-center justify-between">
              <button
                id="submit"
                className="bg-primary-theme-lb hover:bg-blue-700 text-white text-lg font-bold w-full italic py-2 mt-3 px-4 pb-3: rounded focus:outline-none focus:shadow-outline"
                type="button"
                onClick={handleUpdateEmail}
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
