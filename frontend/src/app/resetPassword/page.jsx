'use client';
import React from 'react';
import Link from 'next/link';

export default function ResetPassword() {
  const [oldPassword, setOldPassword] = React.useState('');
  const [newPassword, setNewPassword] = React.useState('');
  const [confirmPassword, setConfirmPassword] = React.useState('');
  let port = 5000;

  const handleResetPassword = async () => {
    if (oldPassword === '' || newPassword === '' || confirmPassword === '') {
      alert('Please input all fields');
    }

    if (newPassword !== confirmPassword) {
      alert('New passwords do not match');
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
      console.log(data);
    }
  };
  return (
    <div>
      <div
        id='top-content'
        className='text-white w-full bg-primary-theme-db flex justify-start gap-4 px-4 py-4'
      >
        <img src='Cotam-logo.png' alt='' className='rounded-md' />
        <Link href='/' className='text-white' style={{ fontSize: '2rem' }}>
          COTAM
        </Link>
      </div>
      <div className='login-background'>
        {/* start of form */}
        <form
          name='publish-form'
          id='form'
          className=' w-1/3 justify-center mx-auto pt-3 relative top-40'
        >
          <div className='mb-2'>
            <label
              className='block text-white text-[4rem] font-bold my-0'
              htmlFor='password'
            >
              Reset Password
            </label>
          </div>

          {/* password */}
          <div className='mb-2'>
            <input
              name='old-password'
              className='shadow appearance-none border border-500 rounded w-full py-2 px-2 placeholder-blue-400 my-0'
              id='old-password'
              type='password'
              placeholder='Password'
              onChange={(e) => {
                setOldPassword(e.target.value);
              }}
            />
          </div>

          <div className='mb-2'>
            <input
              name='new-password'
              className='shadow appearance-none border border-500 rounded w-full py-2 px-2 placeholder-blue-400 my-0'
              id='new-password'
              type='password'
              placeholder='New password'
              onChange={(e) => {
                setNewPassword(e.target.value);
              }}
            />
          </div>

          {/* confirm password */}
          <div className='mb-6'>
            <input
              name='confirm-password'
              className='shadow appearance-none border border-500 rounded w-full py-2 px-2 my-0 placeholder-blue-400'
              id='confirm-password'
              type='password'
              placeholder='Confirm new password'
              onChange={(e) => {
                setConfirmPassword(e.target.value);
              }}
            />
          </div>

          {/* submit */}
          <div className='flex items-center justify-between pb-2'>
            <button
              id='submit'
              className='bg-blue-500 hover:bg-blue-700 text-white font-bold w-full italic py-2 px-4 pb-3: rounded focus:outline-none focus:shadow-outline'
              type='button'
              onClick={handleResetPassword}
            >
              Reset
            </button>
          </div>
          <div className='flex items-center justify-center relative top-52'>
            Return to &nbsp;
            <Link href='/' className='text-primary-theme-lb underline'>
              Home
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
