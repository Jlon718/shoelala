// Import the functions you need from the SDKs you need
const { initializeApp } = require('firebase/app');
import { getAuth, GoogleAuthProvider, FacebookAuthProvider, signInWithPopup } from 'firebase/auth';
import { getStorage } from 'firebase/storage';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDaR6gEetXa3nSlv4n4waLh1wnjaqhI60s",
  authDomain: "shoelala-bd792.firebaseapp.com",
  projectId: "shoelala-bd792",
  storageBucket: "shoelala-bd792.firebasestorage.app",
  messagingSenderId: "23626742849",
  appId: "1:23626742849:web:43e93764dc1ce3202bdac0",
  measurementId: "G-TH3PMD38H9"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const storage = getStorage(app);
const googleProvider = new GoogleAuthProvider();
const facebookProvider = new FacebookAuthProvider();

module.exports = { auth, storage, googleProvider, facebookProvider };