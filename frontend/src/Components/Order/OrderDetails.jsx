import React, { Fragment, useEffect, useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import MetaData from '../Layout/MetaData';
import Loader from '../Layout/Loader';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { getToken } from '../../utils/helpers';
import { Button } from '@mui/material'; // Import Button from Material-UI

const OrderDetails = () => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [order, setOrder] = useState({});
    const { shippingInfo, orderItems, paymentInfo, user, totalPrice, orderStatus } = order;
    let { id } = useParams();
    const navigate = useNavigate();

    const getOrderDetails = async (id) => {
        try {
            const config = {
                headers: {
                    'Authorization': `Bearer ${getToken()}`
                }
            };
            const { data } = await axios.get(`${import.meta.env.VITE_API}/order/${id}`, config);
            setOrder(data.order);
            setLoading(false);
        } catch (error) {
            setError(error.response.data.message);
        }
    };

    useEffect(() => {
        getOrderDetails(id);
    }, [id]);

    return (
        <Fragment>
            <MetaData title={'Order Details'} />
            {loading ? <Loader /> : (
                <div className="container" style={{ backgroundColor: '#F1F6F8', padding: '2rem', borderRadius: '8px' }}>
                    <h1 className="my-5" style={{ color: '#21273D' }}>Order # {order._id}</h1>

                    {/* Shipping Info Section */}
                    <div className="shipping-info" style={{ backgroundColor: '#B9D4F1', padding: '1.5rem', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)', marginBottom: '2rem' }}>
                        <h4 style={{ color: '#21273D' }} className="mb-4">Shipping Info</h4>
                        <p><b>Name:</b> {user && user.name}</p>
                        <p><b>Phone:</b> {shippingInfo && shippingInfo.phoneNo}</p>
                        <p className="mb-4"><b>Address:</b> {shippingInfo && `${shippingInfo.address}, ${shippingInfo.city}, ${shippingInfo.postalCode}, ${shippingInfo.country}`}</p>
                        <p><b>Amount:</b> ${totalPrice}</p>
                    </div>

                    <hr />

                    {/* Payment Section */}
                    <div className="payment-info" style={{ backgroundColor: '#B9D4F1', padding: '1.5rem', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)', marginBottom: '2rem' }}>
                        <h4 className="my-4" style={{ color: '#21273D' }}>Payment</h4>
                        <p className={paymentInfo && paymentInfo.status === 'succeeded' ? 'greenColor' : 'redColor'} style={{ fontWeight: 'bold' }}>
                            <b>{paymentInfo && paymentInfo.status === 'succeeded' ? 'PAID' : 'NOT PAID'}</b>
                        </p>
                    </div>

                    {/* Order Status Section */}
                    <div className="order-status" style={{ backgroundColor: '#B9D4F1', padding: '1.5rem', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)', marginBottom: '2rem' }}>
                        <h4 className="my-4" style={{ color: '#21273D' }}>Order Status:</h4>
                        <p className={orderStatus && String(orderStatus).includes('Delivered') ? 'greenColor' : 'redColor'} style={{ fontWeight: 'bold' }}>
                            <b>{orderStatus}</b>
                        </p>
                    </div>

                    {/* Order Items Section */}
                    <h4 className="my-4" style={{ color: '#21273D' }}>Order Items:</h4>
                    <div className="cart-item my-1">
                        {orderItems && orderItems.map(item => (
                            <div key={item.product} className="row my-5" style={{ backgroundColor: '#FFFFFF', padding: '1rem', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)' }}>
                                <div className="col-4 col-lg-2">
                                    <img src={item.image} alt={item.name} height="45" width="65" style={{ borderRadius: '5px' }} />
                                </div>

                                <div className="col-5 col-lg-5">
                                    <p style={{ color: '#21273D', fontWeight: 'bold' }}>{item.name}</p>
                                </div>

                                <div className="col-4 col-lg-2 mt-4 mt-lg-0">
                                    <p style={{ color: '#21273D', fontWeight: 'bold' }}>${item.price}</p>
                                </div>

                                <div className="col-4 col-lg-3 mt-4 mt-lg-0">
                                    <p style={{ color: '#21273D' }}>{item.quantity} Piece(s)</p>
                                </div>

                                <div className="col-4 col-lg-4 mt-4 mt-lg-0">
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        onClick={() => navigate(`/review/product/${item.product}`)}
                                        style={{ backgroundColor: '#6A759B', borderColor: '#6A759B', color: '#FFFFFF' }}
                                    >
                                        Add Review
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </Fragment>
    );
};

export default OrderDetails;
