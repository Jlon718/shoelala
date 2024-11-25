const admin = require('firebase-admin');
const serviceAccount = require('./serviceAccount.json'); 

// Initialize the Firebase Admin SDK
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://shoelala-bd792.firebaseio.com"
});

module.exports = admin;