// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  // import.meta.env instead of process.env because of Vite
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "mern-blog-e3942.firebaseapp.com",
  projectId: "mern-blog-e3942",
  storageBucket: "mern-blog-e3942.appspot.com",
  messagingSenderId: "712205221260",
  appId: "1:712205221260:web:6812261596a7c9598f2aa9",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
