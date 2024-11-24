import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { getToken } from '../../utils/helpers';
import MetaData from '../Layout/MetaData';
import shoelalaImage from '../../img/shoesbg.avif';

const Payment = () => {
    const location = useLocation();
    const { shippingInfo } = location.state || {};
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);

    const orderInfo = JSON.parse(sessionStorage.getItem('orderInfo'));
    const cartItems = localStorage.getItem('cartItems')
        ? JSON.parse(localStorage.getItem('cartItems'))
        : [];

    const order = {
        orderItems: cartItems,
        shippingInfo,
        itemsPrice: orderInfo.itemsPrice,
        shippingPrice: orderInfo.shippingPrice,
        taxPrice: orderInfo.taxPrice,
        totalPrice: orderInfo.totalPrice,
    };

    useEffect(() => {
        setLoading(false);
    }, []);

    const createOrder = async (order) => {
        try {
            const token = getToken();
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            };
            await axios.post(`${import.meta.env.VITE_API}/order/new`, order, config);
            navigate('/success');
        } catch (error) {
            console.error('Error creating order:', error);
            toast.error('Error creating order');
        }
    };

    const submitHandler = (e) => {
        e.preventDefault();
        createOrder(order);
    };

    if (loading) {
        return <div style={styles.loader}>Loading...</div>;
    }

    return (
        <>
            <MetaData title="Payment" />
            <div style={styles.background}>
                <div style={styles.stepsContainer}>
                    <Step label="Shipping" />
                    <Step label="Confirm Order" />
                    <Step label="Payment" active />
                </div>
                <div style={styles.container}>
                    <h2 style={styles.heading}>Cash on Delivery</h2>
                    <form onSubmit={submitHandler} style={styles.form}>
                        <p style={styles.infoText}>
                            Click the button below to confirm your order and pay upon delivery.
                        </p>
                        <button type="submit" style={styles.button}>
                            Place Order - ${orderInfo && orderInfo.totalPrice}
                        </button>
                    </form>
                </div>
            </div>
        </>
    );
};

const Step = ({ label, active }) => {
    return (
        <div style={{ ...styles.step, color: '#00e5ff' }}>
            <div style={{ ...styles.circle, background: '#00e5ff' }}>
                {(label === 'Shipping' ? '1' : (label === 'Confirm Order' ? '2' : (label === 'Payment' ? '3' : '')))}
            </div>
            <p style={styles.stepText}>{label}</p>
        </div>
    );
};

const styles = {
    background: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        minHeight: '100vh',
        backgroundImage: `url(${shoelalaImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
    },
    stepsContainer: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        margin: '20px 0',
        gap: '20px',
        padding: '20px',
        borderRadius: '10px',
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.3)',
        backdropFilter: 'blur(10px)',
    },
    step: {
        textAlign: 'center',
    },
    circle: {
        width: '40px',
        height: '40px',
        borderRadius: '50%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        color: '#fff',
        margin: 'auto',
        fontSize: '18px',
        fontWeight: 'bold',
    },
    stepText: {
        marginTop: '10px',
        fontSize: '14px',
        fontWeight: 'bold',
        color: '#fff',
    },
    container: {
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        borderRadius: '15px',
        padding: '30px',
        width: '400px',
        textAlign: 'center',
        boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.3)',
        backdropFilter: 'blur(10px)',
    },
    heading: {
        fontSize: '24px',
        fontWeight: 'bold',
        color: '#ffffff',
        marginBottom: '20px',
    },
    form: {
        display: 'flex',
        flexDirection: 'column',
    },
    infoText: {
        color: '#ffffff',
        fontSize: '16px',
        marginBottom: '20px',
    },
    button: {
        padding: '10px 20px',
        backgroundColor: '#00e5ff',
        border: 'none',
        borderRadius: '10px',
        color: '#ffffff',
        fontWeight: 'bold',
        cursor: 'pointer',
    },
    loader: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        color: '#ffffff',
        fontSize: '24px',
    },
};

export default Payment;
