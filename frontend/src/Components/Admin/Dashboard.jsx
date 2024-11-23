import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import MetaData from '../Layout/MetaData';
import Loader from '../Layout/Loader';
import Sidebar from './SideBar';
import { getToken } from '../../utils/helpers';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Box, Grid, Card, CardContent, Typography, Divider } from '@mui/material';
import { AttachMoney, ShoppingCart, Store, People } from '@mui/icons-material'; // Import Material-UI icons
import MonthlySalesChart from './MonthlySalesChart';
import ProductSalesChart from './ProductSalesChart';

const Dashboard = () => {
    const [products, setProducts] = useState([]);
    const [error, setError] = useState('');
    const [users, setUsers] = useState([]);
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [totalAmount, setTotalAmount] = useState(0);
    const [totalUsers, setTotalUsers] = useState(0);
    const [grossSales, setGrossSales] = useState(0);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const config = {
                    headers: {
                        'Authorization': `Bearer ${getToken()}`
                    }
                };

                const { data: productsData } = await axios.get(`${import.meta.env.VITE_API}/total/products`, config);
                const { data: usersData } = await axios.get(`${import.meta.env.VITE_API}/total/users`, config); 
                console.log(usersData)// Updated endpoint
                const { data: ordersData } = await axios.get(`${import.meta.env.VITE_API}/total/orders`, config);
                const { data: grossSalesData } = await axios.get(`${import.meta.env.VITE_API}/total/gross-sales`, config);

                setProducts(productsData.products);
                setUsers(usersData.users);
                setTotalUsers(usersData.totalUsers); // Set total users
                setOrders(ordersData.orders);
                setTotalAmount(ordersData.totalAmount);
                setGrossSales(grossSalesData.totalSales); // Set gross sales
                setLoading(false);
            } catch (error) {
                setError(error.response ? error.response.data.message : error.message);
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    return (
        <div className="dashboard">
            <MetaData title={'Admin Dashboard'} />
            <Grid container>
                <Grid item xs={12} md={2}>
                    <Sidebar />
                </Grid>
                <Grid item xs={12} md={10}>
                    {loading ? <Loader /> : (
                        <Box p={3}>
                            <Typography variant="h4" gutterBottom>
                                Dashboard
                            </Typography>
                            <Divider />
                            <Grid container spacing={3}>
                                <Grid item xs={12} sm={6} md={4}>
                                    <Card sx={{ backgroundColor: '#f5f5f5' }}>
                                        <CardContent>
                                            <Box display="flex" alignItems="center">
                                                <AttachMoney fontSize="large" color="primary" />
                                                <Box ml={2}>
                                                    <Typography variant="h6" gutterBottom>
                                                        Gross Sales
                                                    </Typography>
                                                    <Typography variant="h4">
                                                        ${grossSales}
                                                    </Typography>
                                                </Box>
                                            </Box>
                                        </CardContent>
                                    </Card>
                                </Grid>
                                <Grid item xs={12} sm={6} md={4}>
                                    <Card sx={{ backgroundColor: '#e0f7fa' }}>
                                        <CardContent>
                                            <Box display="flex" alignItems="center">
                                                <Store fontSize="large" color="primary" />
                                                <Box ml={2}>
                                                    <Typography variant="h6" gutterBottom>
                                                        Products
                                                    </Typography>
                                                    <Typography variant="h4">
                                                        {products.length}
                                                    </Typography>
                                                </Box>
                                            </Box>
                                        </CardContent>
                                    </Card>
                                </Grid>
                                <Grid item xs={12} sm={6} md={4}>
                                    <Card sx={{ backgroundColor: '#fff3e0' }}>
                                        <CardContent>
                                            <Box display="flex" alignItems="center">
                                                <ShoppingCart fontSize="large" color="primary" />
                                                <Box ml={2}>
                                                    <Typography variant="h6" gutterBottom>
                                                        Orders
                                                    </Typography>
                                                    <Typography variant="h4">
                                                        {orders.length}
                                                    </Typography>
                                                </Box>
                                            </Box>
                                        </CardContent>
                                    </Card>
                                </Grid>
                                <Grid item xs={12} sm={6} md={4}>
                                    <Card sx={{ backgroundColor: '#e8f5e9' }}>
                                        <CardContent>
                                            <Box display="flex" alignItems="center">
                                                <People fontSize="large" color="primary" />
                                                <Box ml={2}>
                                                    <Typography variant="h6" gutterBottom>
                                                        Users
                                                    </Typography>
                                                    <Typography variant="h4">
                                                        {totalUsers} {/* Display total users */}
                                                    </Typography>
                                                </Box>
                                            </Box>
                                        </CardContent>
                                    </Card>
                                </Grid>
                                <Grid item xs={12}>
                                <Card sx={{ backgroundColor: '#e0f7fa' }}>
                                        <CardContent>
                                            <Box display="flex" alignItems="center">
                                            <AttachMoney fontSize="large" color="primary" />
                                                <Box ml={2}>
                                                    <Typography variant="h6" gutterBottom>
                                                        Monthly Sales
                                                    </Typography>
                                                    </Box>
                                            </Box>
                                            <MonthlySalesChart />
                                        </CardContent>
                                    </Card>
                                    
                                </Grid>
                                <Grid item xs={12}>
                                <Card sx={{ backgroundColor: '#e0f7fa' }}>
                                        <CardContent>
                                            <Box display="flex" alignItems="center">
                                            <AttachMoney fontSize="large" color="primary" />
                                                <Box ml={2}>
                                                    <Typography variant="h6" gutterBottom>
                                                        Product Sales
                                                    </Typography>
                                                    </Box>
                                            </Box>
                                            <ProductSalesChart />
                                        </CardContent>
                                    </Card>
                                    
                                </Grid>
                            </Grid>
                        </Box>
                    )}
                </Grid>
            </Grid>
        </div>
    );
};

export default Dashboard;