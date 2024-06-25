// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_VITE_FIREBASE_API_KEY,
  authDomain: 'project-3656360145323654996.firebaseapp.com',
  projectId: 'project-3656360145323654996',
  storageBucket: 'project-3656360145323654996.appspot.com',
  messagingSenderId: '308194862827',
  appId: '1:308194862827:web:525d5b5065ddc8b48d80ae',
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
