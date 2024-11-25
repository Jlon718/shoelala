import { messaging, requestFCMToken } from '../firebaseConfig';
import { onMessage } from 'firebase/messaging';
import { useEffect } from 'react';
import { toast } from 'react-toastify';

const useNotification = () => {
    let token = localStorage.getItem('fcmToken');

  useEffect(() => {
    const fetchToken = async () => {
      try {
        const token = await requestFCMToken();
        localStorage.setItem('fcmToken', token);
        console.log('FCM token:', token);
      } catch (error) {
        console.error('Error fetching FCM token:', error);
      }
    };
      fetchToken();

  }, [token]);

  useEffect(() => {
    if (!messaging) return;
    const unsubscribe = onMessage(messaging, (payload) => {
      try {
        console.log('Message received. ', payload);
        const { title = '', body = '', type = 'info' } = payload.notification;
        toast[type](body, { title });
      } catch (error) {
        console.error('Error displaying notification:', error)
      }
    });
    return () => unsubscribe();
  }, []);

  return null;
};

export default useNotification;