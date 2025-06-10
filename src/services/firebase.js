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
  apiKey: "AIzaSyAAANCF6vsT3bn5jOLSEq1QwvdRS_e84h4",
  authDomain: "classmate-mvp.firebaseapp.com",
  projectId: "classmate-mvp",
  storageBucket: "classmate-mvp.firebasestorage.app",
  messagingSenderId: "804205725994",
  appId: "1:804205725994:web:408aae817eea6f33eb3653",
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
