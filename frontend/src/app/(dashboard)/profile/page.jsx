// pages/profile.js
'use client';
import dynamic from 'next/dynamic';

const Profile = dynamic(() => import('./ProfilePage'), {
  ssr: false,
});

const ProfilePage = () => <Profile />;

export default ProfilePage;
