import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Box, Typography, IconButton, Container, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TablePagination, Button } from '@mui/material';
import { Delete, Visibility } from '@mui/icons-material';
import MetaData from '../Layout/MetaData';
import Loader from '../Layout/Loader';
import Sidebar from './SideBar';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { getToken } from '../../utils/helpers';
import axios from 'axios';

const OrdersList = () => {
    let navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [allOrders, setAllOrders] = useState([]);
    const [isDeleted, setIsDeleted] = useState(false);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    const errMsg = (message = '') => toast.error(message, {
        position: 'bottom-right'
    });
    const successMsg = (message = '') => toast.success(message, {
        position: 'bottom-right'
    });

    const listOrders = async () => {
        try {
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${getToken()}`
                }
            };
            const { data } = await axios.get(`${import.meta.env.VITE_API}/admin/orders`, config);
            setAllOrders(data.orders);
            setLoading(false);
        } catch (error) {
            setError(error.response.data.message);
        }
    };

    const deleteOrder = async (id) => {
        try {
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${getToken()}`
                }
            };
            const { data } = await axios.delete(`${import.meta.env.VITE_API}/admin/order/${id}`, config);
            setIsDeleted(data.success);
            setLoading(false);
        } catch (error) {
            setError(error.response.data.message);
        }
    };

    useEffect(() => {
        listOrders();
        if (error) {
            errMsg(error);
            setError('');
        }
        if (isDeleted) {
            successMsg('Order deleted successfully');
            navigate('/admin/orders');
        }
    }, [error, isDeleted]);

    const deleteOrderHandler = (id) => {
        deleteOrder(id);
    };

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    return (
        <>
            <MetaData title={'All Orders'} />
            <Box sx={{ display: 'flex', background: 'linear-gradient(to bottom, #7C93C3, #55679C)', minHeight: '100vh' }}>
                <Box sx={{ width: '250px' }}>
                    <Sidebar />
                </Box>
                <Box sx={{ flexGrow: 1, p: 3 }}>
                    <Container maxWidth="lg">
                        <Typography variant="h4" sx={{ mb: 3, fontWeight: 'bold', textAlign: 'center', color: '#1E2A5E', fontFamily: 'Roboto, sans-serif' }}>
                            All Orders
                        </Typography>
                        {loading ? <Loader /> : (
                            <Paper elevation={3} sx={{ p: 2, backgroundColor: '#7c93c3' }}>
                                <TableContainer>
                                    <Table>
                                        <TableHead>
                                            <TableRow>
                                                <TableCell sx={{ backgroundColor: '#7C93C3', color: '#FFFFFF', fontFamily: 'Roboto, sans-serif' }}>Order ID</TableCell>
                                                <TableCell sx={{ backgroundColor: '#7C93C3', color: '#FFFFFF', fontFamily: 'Roboto, sans-serif' }}>No of Items</TableCell>
                                                <TableCell sx={{ backgroundColor: '#7C93C3', color: '#FFFFFF', fontFamily: 'Roboto, sans-serif' }}>Amount</TableCell>
                                                <TableCell sx={{ backgroundColor: '#7C93C3', color: '#FFFFFF', fontFamily: 'Roboto, sans-serif' }}>Status</TableCell>
                                                <TableCell sx={{ backgroundColor: '#7C93C3', color: '#FFFFFF', fontFamily: 'Roboto, sans-serif' }}>Actions</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {allOrders.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((order) => (
                                                <TableRow key={order._id}>
                                                    <TableCell sx={{ backgroundColor: '#ffffff', color: '#1E2A5E', fontFamily: 'Roboto, sans-serif' }}>{order._id}</TableCell>
                                                    <TableCell sx={{ backgroundColor: '#ffffff', color: '#1E2A5E', fontFamily: 'Roboto, sans-serif' }}>{order.orderItems.length}</TableCell>
                                                    <TableCell sx={{ backgroundColor: '#ffffff', color: '#1E2A5E', fontFamily: 'Roboto, sans-serif' }}>${order.totalPrice}</TableCell>
                                                    <TableCell sx={{ backgroundColor: '#ffffff', color: order.orderStatus === 'Delivered' ? 'green' : 'red', fontFamily: 'Roboto, sans-serif' }}>
                                                        {order.orderStatus}
                                                    </TableCell>
                                                    <TableCell sx={{ backgroundColor: '#ffffff', color: '#1E2A5E', fontFamily: 'Roboto, sans-serif' }}>
                                                        <IconButton component={Link} to={`/admin/order/${order._id}`} color="primary">
                                                            <Visibility />
                                                        </IconButton>
                                                        <IconButton color="secondary" onClick={() => deleteOrderHandler(order._id)}>
                                                            <Delete />
                                                        </IconButton>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                                <TablePagination
                                    rowsPerPageOptions={[5, 10, 25]}
                                    component="div"
                                    count={allOrders.length}
                                    rowsPerPage={rowsPerPage}
                                    page={page}
                                    onPageChange={handleChangePage}
                                    onRowsPerPageChange={handleChangeRowsPerPage}
                                    sx={{
                                        backgroundColor: '#7C93C3',
                                        color: '#FFFFFF',
                                        fontFamily: 'Roboto, sans-serif',
                                    }}
                                />
                            </Paper>
                        )}
                    </Container>
                </Box>
            </Box>
        </>
    );
};

export default OrdersList;