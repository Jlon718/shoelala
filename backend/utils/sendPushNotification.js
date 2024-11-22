const admin = require('firebase-admin');
const serviceAccount = require('../path/to/serviceAccountKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const sendPushNotification = async (token, message) => {
  const payload = {
    notification: {
      title: 'Order Confirmation',
      body: message,
    },
  };

  try {
    await admin.messaging().sendToDevice(token, payload);
    console.log('Push notification sent successfully');
  } catch (error) {
    console.error('Error sending push notification:', error);
  }
};

module.exports = sendPushNotification;