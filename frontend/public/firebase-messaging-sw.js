// Scripts for firebase and firebase messaging
importScripts("https://www.gstatic.com/firebasejs/8.2.0/firebase-app.js");
importScripts("https://www.gstatic.com/firebasejs/8.2.0/firebase-messaging.js");

// Initialize the Firebase app in the service worker by passing the generated config
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

firebase.initializeApp(firebaseConfig);

const messaging = firebase.messaging();

messaging.onBackgroundMessage(function(payload) {
  console.log("Received background message ", payload);

  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});