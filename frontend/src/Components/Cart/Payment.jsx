import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { getToken } from '../../utils/helpers';
import MetaData from '../Layout/MetaData';
import Loader from '../Layout/Loader';
import CheckoutSteps from './CheckoutSteps';

const Payment = () => {
    const location = useLocation();
    const { shippingInfo } = location.state || {};
    const [loading, setLoading] = useState(true);
    let navigate = useNavigate();

    useEffect(() => {
        setLoading(false);
    }, []);

    const orderInfo = JSON.parse(sessionStorage.getItem('orderInfo'));
    const cartItems = localStorage.getItem('cartItems') ? JSON.parse(localStorage.getItem('cartItems')) : [];

    const order = {
        orderItems: cartItems,
        shippingInfo,
        itemsPrice: orderInfo.itemsPrice,
        shippingPrice: orderInfo.shippingPrice,
        taxPrice: orderInfo.taxPrice,
        totalPrice: orderInfo.totalPrice
    };

    const createOrder = async (order) => {
        try {
            const token = getToken();
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            };
            console.log('Request Body:', order); // Debugging log
            const { data } = await axios.post(`${import.meta.env.VITE_API}/order/new`, order, config);
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
        return <Loader />;
    }

    return (
        <>
            <MetaData title={'Payment'} />
            <CheckoutSteps shipping confirmOrder payment />
            <div className="row wrapper">
                <div className="col-10 col-lg-5">
                    <form className="shadow-lg" onSubmit={submitHandler}>
                        <h1 className="mb-4">Cash on Delivery</h1>
                        <button
                            id="pay_btn"
                            type="submit"
                            className="btn btn-block py-3"
                        >
                            Place Order {` - ${orderInfo && orderInfo.totalPrice}`}
                        </button>
                    </form>
                </div>
            </div>
        </>
    );
};

export default Payment;