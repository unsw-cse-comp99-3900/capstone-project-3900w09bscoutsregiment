import React from 'react';
import { faGoogle } from '@fortawesome/free-brands-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Button from '@mui/material/Button';
import { GoogleAuthProvider, signInWithPopup, getAuth } from 'firebase/auth';
import { app } from '../firebase';

export default function OAuth() {
  const handleGoogleLogin = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const auth = getAuth(app);
      const res = await signInWithPopup(auth, provider);
      console.log(res);
    } catch (error) {
        console.log(error);
        console.log('could not log in with google');
    }
  };

  return (
    <Button onClick={handleGoogleLogin} color='secondary' variant='secondary'>
      <FontAwesomeIcon icon={faGoogle} />
      Continue with Google
    </Button>
  );
}
