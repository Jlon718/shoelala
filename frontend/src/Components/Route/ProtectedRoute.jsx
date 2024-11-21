import { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';

import Loader from '../Layout/Loader';
import { getUser } from '../../utils/helpers';

const ProtectedRoute = ({ children, isAdmin = false }) => {
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState(null);

    useEffect(() => {
        const userData = getUser();
        console.log('User Data:', userData); // Debugging log
        if (userData) {
            setUser(userData);
        }
        setLoading(false);
    }, []);

    if (loading) {
        return <Loader />;
    }

    if (!user) {
        return <Navigate to='/login' />;
    }

    if (isAdmin && user.role !== 'admin') {
        console.log('User is not an admin:', user); // Debugging log
        return <Navigate to='/' />;
    }

    return children;
};

export default ProtectedRoute;