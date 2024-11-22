import { initializeApp } from "firebase/app";
import { getMessaging, getToken, onMessage } from "firebase/messaging";
import { getAuth, GoogleAuthProvider, FacebookAuthProvider, signInWithPopup } from 'firebase/auth';

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
const messaging = getMessaging(app);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();
const facebookProvider = new FacebookAuthProvider();

export { auth, googleProvider, facebookProvider };

export const requestForToken = (setTokenFound) => {
  return getToken(messaging, { vapidKey: 'YOUR_VAPID_KEY' }).then((currentToken) => {
    if (currentToken) {
      console.log('current token for client: ', currentToken);
      setTokenFound(true);
      // Perform any other necessary action with the token
    } else {
      console.log('No registration token available. Request permission to generate one.');
      setTokenFound(false);
    }
  }).catch((err) => {
    console.log('An error occurred while retrieving token. ', err);
    setTokenFound(false);
  });
};

export const onMessageListener = () =>
  new Promise((resolve) => {
    onMessage(messaging, (payload) => {
      resolve(payload);
    });
  });

