import React, { Fragment, useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import MetaData from '../Layout/MetaData';
import CheckoutSteps from './CheckoutSteps';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { getToken } from '../../utils/helpers';

const Payment = ({ cartItems, shippingInfo }) => {
    const [loading, setLoading] = useState(true);
    let navigate = useNavigate();

    useEffect(() => {
    }, []);

    const order = {
        orderItems: cartItems,
        shippingInfo
    };

    const orderInfo = JSON.parse(sessionStorage.getItem('orderInfo'));
    if (orderInfo) {
        order.itemsPrice = orderInfo.itemsPrice;
        order.shippingPrice = orderInfo.shippingPrice;
        order.taxPrice = orderInfo.taxPrice;
        order.totalPrice = orderInfo.totalPrice;
    }

    const createOrder = async (order) => {
        try {
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${getToken()}`
                }
            };
            const response = await axios.post(`${import.meta.env.VITE_API}/order/new`, order, config);
            setLoading(false);
            if (response && response.data) {
                toast.success('Order created', {
                    position: 'bottom-right'
                });
                navigate('/success');
            } else {
                throw new Error('Failed to create order');
            }
        } catch (error) {
            setLoading(false);
            toast.error(error.response?.data?.message || error.message, {
                position: 'bottom-right'
            });
        }
    };

    const submitHandler = async (e) => {
        e.preventDefault();
        order.paymentInfo = {
            id: 'COD',
            status: 'pending'
        };
        createOrder(order);
    };

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