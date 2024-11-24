import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { Box, Typography, Button, Select, MenuItem, FormControl, InputLabel, Divider } from '@mui/material';
import MetaData from '../Layout/MetaData';
import Loader from '../Layout/Loader';
import Sidebar from './SideBar';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import { getToken } from '../../utils/helpers';

const ProcessOrder = () => {
    const [status, setStatus] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [order, setOrder] = useState({});
    const [isUpdated, setIsUpdated] = useState(false);

    const navigate = useNavigate();
    const { id } = useParams();
    const { shippingInfo, orderItems, paymentInfo, user, totalPrice, orderStatus } = order;
    const orderId = id;

    const errMsg = (message = '') =>
        toast.error(message, {
            position: 'bottom-right',
        });
    const successMsg = (message = '') =>
        toast.success(message, {
            position: 'bottom-right',
        });

    const getOrderDetails = async (id) => {
        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${getToken()}`,
                },
            };
            const { data } = await axios.get(`${import.meta.env.VITE_API}/order/${id}`, config);
            setOrder(data.order);
            setStatus(data.order.orderStatus);
            setLoading(false);
        } catch (error) {
            setError(error.response?.data?.message || 'Failed to fetch order details');
        }
    };

    const updateOrder = async (id, formData) => {
        try {
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${getToken()}`,
                },
            };
            const { data } = await axios.put(`${import.meta.env.VITE_API}/admin/order/${id}`, formData, config);
            setIsUpdated(data.success);
        } catch (error) {
            setError(error.response?.data?.message || 'Failed to update order');
        }
    };

    useEffect(() => {
        getOrderDetails(orderId);
        if (error) {
            errMsg(error);
            setError('');
        }
        if (isUpdated) {
            successMsg('Order updated successfully');
            setIsUpdated('');
            navigate('/admin/orders');
        }
    }, [error, isUpdated, orderId]);

    const updateOrderHandler = (id) => {
        const formData = new FormData();
        formData.set('status', status);
        updateOrder(id, formData);
    };

    const shippingDetails =
        shippingInfo && `${shippingInfo.address}, ${shippingInfo.city}, ${shippingInfo.postalCode}, ${shippingInfo.country}`;
    const isPaid = paymentInfo && paymentInfo.status === 'succeeded';

    return (
        <>
            <MetaData title={`Process Order # ${order && order._id}`} />
            <Box
                sx={{
                    display: 'flex',
                    minHeight: '100vh',
                    background: 'linear-gradient(to top, #F3F3E0, #133E87, #608BC1, #CBDCEB)',
                }}
            >
                {/* Sidebar */}
                <Box sx={{ width: '250px' }}>
                    <Sidebar />
                </Box>

                {/* Main Content */}
                <Box
                    component="main"
                    sx={{
                        flexGrow: 1,
                        p: 3,
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}
                >
                    {loading ? (
                        <Loader />
                    ) : (
                        <Box
                            sx={{
                                maxWidth: '800px',
                                width: '100%',
                                padding: 4,
                                borderRadius: '10px',
                                boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.2)',
                                backgroundColor: 'rgba(35, 47, 62, 0.9)',
                                backdropFilter: 'blur(10px)',
                            }}
                        >
                            <Typography
                                variant="h4"
                                sx={{
                                    marginBottom: 3,
                                    textAlign: 'center',
                                    color: '#ffffff',
                                    fontWeight: 'bold',
                                    fontFamily: 'Roboto, sans-serif',
                                }}
                            >
                                Order #{order._id}
                            </Typography>
                            <Box>
                                <Typography variant="h6" sx={{ color: '#E1D7B7', marginBottom: '10px', fontFamily: 'Roboto, sans-serif' }}>Shipping Info</Typography>
                                <Typography sx={{ color: '#FFFFFF', fontFamily: 'Roboto, sans-serif' }}><b>Name:</b> {user && user.name}</Typography>
                                <Typography sx={{ color: '#FFFFFF', fontFamily: 'Roboto, sans-serif' }}><b>Phone:</b> {shippingInfo && shippingInfo.phoneNo}</Typography>
                                <Typography sx={{ color: '#FFFFFF', fontFamily: 'Roboto, sans-serif' }}><b>Address:</b> {shippingDetails}</Typography>
                                <Typography sx={{ color: '#FFFFFF', fontFamily: 'Roboto, sans-serif' }}><b>Amount:</b> ${totalPrice}</Typography>
                                <Divider sx={{ my: 2, borderColor: '#E1D7B7' }} />
                                <Typography variant="h6" sx={{ color: '#E1D7B7', marginBottom: '10px', fontFamily: 'Roboto, sans-serif' }}>Payment</Typography>
                                <Typography sx={{ color: isPaid ? 'green' : 'red', fontWeight: 'bold', fontFamily: 'Roboto, sans-serif' }}>
                                    {isPaid ? 'PAID' : 'NOT PAID'}
                                </Typography>
                                <Typography variant="h6" sx={{ color: '#E1D7B7', marginBottom: '10px', fontFamily: 'Roboto, sans-serif' }}>Stripe ID</Typography>
                                <Typography sx={{ color: '#FFFFFF', fontFamily: 'Roboto, sans-serif' }}>{paymentInfo && paymentInfo.id}</Typography>
                                <Typography variant="h6" sx={{ color: '#E1D7B7', marginBottom: '10px', fontFamily: 'Roboto, sans-serif' }}>Order Status</Typography>
                                <Typography sx={{ color: orderStatus?.includes('Delivered') ? 'green' : 'red', fontWeight: 'bold', fontFamily: 'Roboto, sans-serif' }}>
                                    {orderStatus}
                                </Typography>
                                <Typography variant="h6" sx={{ color: '#E1D7B7', marginBottom: '10px', fontFamily: 'Roboto, sans-serif' }}>Order Items</Typography>
                                <Box>
                                    {orderItems && orderItems.map((item) => (
                                        <Box key={item.product} sx={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                                            <img src={item.image} alt={item.name} style={{ width: '50px', borderRadius: '5px' }} />
                                            <Link to={`/products/${item.product}`} style={{ color: '#007bff', textDecoration: 'none', fontFamily: 'Roboto, sans-serif' }}>
                                                {item.name}
                                            </Link>
                                            <Typography sx={{ color: '#FFFFFF', fontFamily: 'Roboto, sans-serif' }}>${item.price}</Typography>
                                            <Typography sx={{ color: '#FFFFFF', fontFamily: 'Roboto, sans-serif' }}>{item.quantity} Piece(s)</Typography>
                                        </Box>
                                    ))}
                                </Box>
                                <Divider sx={{ my: 2, borderColor: '#E1D7B7' }} />
                                <Box sx={{ marginTop: '20px' }}>
                                    <Typography variant="h6" sx={{ color: '#E1D7B7', fontFamily: 'Roboto, sans-serif' }}>Status</Typography>
                                    <FormControl fullWidth sx={{ mb: 2 }}>
                                        <InputLabel sx={{ color: '#E1D7B7', fontFamily: 'Roboto, sans-serif' }}>Status</InputLabel>
                                        <Select
                                            value={status}
                                            onChange={(e) => setStatus(e.target.value)}
                                            label="Status"
                                            sx={{ color: '#FFFFFF', fontFamily: 'Roboto, sans-serif' }}
                                        >
                                            <MenuItem value="Processing">Processing</MenuItem>
                                            <MenuItem value="Shipped">Shipped</MenuItem>
                                            <MenuItem value="Delivered">Delivered</MenuItem>
                                        </Select>
                                    </FormControl>
                                    <Button
                                        onClick={() => updateOrderHandler(order._id)}
                                        variant="contained"
                                        fullWidth
                                        sx={{
                                            bgcolor: '#4A628A',
                                            color: '#FFF',
                                            ':hover': { bgcolor: '#2E4B6A' },
                                            py: 1.5,
                                            fontWeight: 'bold',
                                            fontSize: '16px',
                                            fontFamily: 'Roboto, sans-serif',
                                        }}
                                    >
                                        Update Status
                                    </Button>
                                </Box>
                            </Box>
                        </Box>
                    )}
                </Box>
            </Box>
        </>
    );
};

export default ProcessOrder;