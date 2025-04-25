// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCjeCx9C4xoljhqsy06_uT3x5BuBOI0oaI",
  authDomain: "my-kanban-2a8ce.firebaseapp.com",
  projectId: "my-kanban-2a8ce",
  storageBucket: "my-kanban-2a8ce.firebasestorage.app",
  messagingSenderId: "432827220116",
  appId: "1:432827220116:web:64e6f97bdec399784bb481",
  measurementId: "G-V5PXEQV1VM"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export const auth = getAuth(app);
export const db = getFirestore(app);