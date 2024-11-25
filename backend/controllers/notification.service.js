const admin = require('../firebase.js') ;

async function sendNotification({deviceToken, title = '', body='' }) {
    const message = {
      notification: {
        title, body
      },
      token: deviceToken
    }

    return admin.messaging().send(message).then((response) => {
      console.log('Successfully sent message:', response);
      return response;
    }).catch((e)=>{
      console.log('Error sending message:', e);
    })
    
  }

module.exports = sendNotification;