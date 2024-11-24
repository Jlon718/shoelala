import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export const authenticate = (data, next) => {
    if (typeof window !== 'undefined') {
        // console.log('authenticate', response)
        sessionStorage.setItem('token', JSON.stringify(data.token));
        sessionStorage.setItem('user', JSON.stringify(data.user));
    }
    next();
};

export const getUser = () => {
    if (typeof window !== 'undefined') {
        const user = localStorage.getItem('user');
        if (!user || user === 'undefined') {
            return null;
        }
        try {
            return JSON.parse(user);
        } catch (error) {
            console.error('Error parsing user data:', error);
            return null;
        }
    }
    return null;
};

// get token from session storage
export const getToken = () => {
    if (typeof window !== 'undefined') {
        const token = localStorage.getItem('access');
        console.log('getToken: ', token)
        if (!token || token === 'undefined') {
            return null;
        }
        try {
            return token;
        } catch (error) {
            console.error('Error parsing token:', error);
            return null;
        }
    }
    return null;
};

// remove token from session storage
export const logout = next => {
    if (typeof window !== 'undefined') {
        sessionStorage.removeItem('token');
        sessionStorage.removeItem('user');
        next();
    }
};

export const errMsg = (message = '') => toast.error(message, {
    position: 'bottom-right'
});
export const successMsg = (message = '') => toast.success(message, {
    position: 'bottom-right'
});