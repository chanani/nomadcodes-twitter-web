// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAYmTMCxeXLWGQVNzRwppZxcWUQolKpvEw",
  authDomain: "cwitter-reloadred.firebaseapp.com",
  projectId: "cwitter-reloadred",
  storageBucket: "cwitter-reloadred.appspot.com",
  messagingSenderId: "805609671312",
  appId: "1:805609671312:web:887ebdfa9a2b2ee0646615"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);

