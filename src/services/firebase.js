import { initializeApp } from "firebase/app";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
} from "firebase/auth";
import { getFirestore, doc, setDoc, getDoc} from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDvXS-klw-HKReF9aoQPOdoqgwZ-ClhRDw",
  authDomain: "classmates-1a18d.firebaseapp.com",
  projectId: "classmates-1a18d",
  storageBucket: "classmates-1a18d.firebasestorage.app",
  messagingSenderId: "812020416911",
  appId: "1:812020416911:web:952943ea2d0f9a94e28bfa",
  measurementId: "G-ML6Y7NBPR7",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Google provider
const googleProvider = new GoogleAuthProvider();
export const provider = new GoogleAuthProvider();

export {
  auth,
  db,
  googleProvider,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  signInWithPopup,
  setDoc,
  doc,
  getDoc,
  getFirestore,
};
