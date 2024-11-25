import { initializeApp } from "firebase/app";
import { getMessaging, getToken, onMessage } from "firebase/messaging";
import { getAuth, GoogleAuthProvider, FacebookAuthProvider, signInWithPopup } from 'firebase/auth';

const firebaseConfig = {
    apiKey: "AIzaSyDaR6gEetXa3nSlv4n4waLh1wnjaqhI60s",
    authDomain: "shoelala-bd792.firebaseapp.com",
    databaseURL: "https://shoelala-bd792.firebaseio.com",
    projectId: "shoelala-bd792",
    storageBucket: "shoelala-bd792.firebasestorage.app",
    messagingSenderId: "23626742849",
    appId: "1:23626742849:web:43e93764dc1ce3202bdac0",
    measurementId: "G-TH3PMD38H9"
};

export const app = initializeApp(firebaseConfig);
export const messaging = getMessaging(app);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

export const requestForToken = async (setTokenFound) => {
  return getToken(messaging, { vapidKey: `BP4HNr__KmCMEXlaArrrMV51A6S1rgBsgtTrDZWl3176mI-9JPUTvaN4wGszpHp4TeIFfcO8Tv4lNpm8JEC30zs` }).then((currentToken) => {
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

export const requestFCMToken = async () => {
  return Notification.requestPermission().then((notif)=> {
    if (notif === 'granted') {
      return getToken(messaging, {vapidKey: `BP4HNr__KmCMEXlaArrrMV51A6S1rgBsgtTrDZWl3176mI-9JPUTvaN4wGszpHp4TeIFfcO8Tv4lNpm8JEC30zs`
      }).then((token) => {
        return token
      });
    } else {
      throw new Error("Permission denied");
    }
  }).catch((err) => {
    console.log("Error getting FCM token: ", err);
  });
};

export const onMessageListener = () =>
  new Promise((resolve) => {
    onMessage(messaging, (payload) => {
      resolve(payload);
    });
  });

