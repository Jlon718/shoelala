import React, { useEffect, useState } from 'react';
import { Box, Grid, Card, CardContent, Typography, Divider } from '@mui/material';
import { AttachMoney, ShoppingCart, Store, People } from '@mui/icons-material'; // Material-UI icons
import Sidebar from './SideBar';
import MetaData from '../Layout/MetaData';
import Loader from '../Layout/Loader';
import MonthlySalesChart from './MonthlySalesChart';
import ProductSalesChart from './ProductSalesChart';
import { getToken } from '../../utils/helpers';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Dashboard = () => {
    const [products, setProducts] = useState([]);
    const [users, setUsers] = useState([]);
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [grossSales, setGrossSales] = useState(0);
    const [totalUsers, setTotalUsers] = useState(0);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const config = { headers: { Authorization: `Bearer ${getToken()}` } };

                const { data: productsData } = await axios.get(`${import.meta.env.VITE_API}/total/products`, config);
                const { data: usersData } = await axios.get(`${import.meta.env.VITE_API}/total/users`, config);
                const { data: ordersData } = await axios.get(`${import.meta.env.VITE_API}/total/orders`, config);
                const { data: grossSalesData } = await axios.get(`${import.meta.env.VITE_API}/total/gross-sales`, config);

                setProducts(productsData.products);
                setUsers(usersData.users);
                setTotalUsers(usersData.totalUsers);
                setOrders(ordersData.orders);
                setGrossSales(grossSalesData.totalSales);
                setLoading(false);
            } catch (error) {
                setError(error.response ? error.response.data.message : error.message);
                setLoading(false);
                toast.error('Failed to load data', { position: 'bottom-left' });
            }
        };

        fetchData();
    }, []);

    return (
        <Box
            sx={{
                display: 'flex',
                minHeight: '100vh',
                background: 'linear-gradient(to bottom, #7C93C3, #55679C)',
                color: '#FFFFFF',
            }}
        >
            <MetaData title="Admin Dashboard" />
            {/* Sidebar */}
            <Box sx={{ width: '250px' }}>
                    <Sidebar />
                </Box>

            {/* Main Dashboard */}
            <Grid item xs={30} md={30} sx={{ width:'100%', justifyContent: 'center', alignItems: 'center' }}>
                {loading ? (
                    <Loader />
                ) : (
                    <Box sx={{ p: 4, width: '100%', maxWidth: '2200px' }}>
                        <Typography
                            variant="h4"
                            sx={{
                                fontWeight: 'bold',
                                color: '#FFFFFF',
                                mb: 3,
                                textAlign: 'center',
                                textTransform: 'uppercase',
                            }}
                        >
                            Admin Dashboard
                        </Typography>
                        <Divider sx={{ borderColor: '#E1D7B7', mb: 4 }} />

                        {/* Cards Section */}
                        <Grid container spacing={4} justifyContent="center">
                            <Grid item xs={12} sm={6} md={3}>
                                <Card
                                    sx={{
                                        background: '#1E2A5E',
                                        color: '#FFFFFF',
                                        boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.2)',
                                    }}
                                >
                                    <CardContent>
                                        <Box display="flex" alignItems="center">
                                            <AttachMoney fontSize="large" sx={{ color: '#E1D7B7' }} />
                                            <Box ml={2}>
                                                <Typography variant="h6">Gross Sales</Typography>
                                                <Typography variant="h5" fontWeight="bold">
                                                    ${grossSales}
                                                </Typography>
                                            </Box>
                                        </Box>
                                    </CardContent>
                                </Card>
                            </Grid>
                            <Grid item xs={12} sm={6} md={3}>
                                <Card
                                    sx={{
                                        background: '#55679C',
                                        color: '#FFFFFF',
                                        boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.2)',
                                    }}
                                >
                                    <CardContent>
                                        <Box display="flex" alignItems="center">
                                            <Store fontSize="large" sx={{ color: '#E1D7B7' }} />
                                            <Box ml={2}>
                                                <Typography variant="h6">Products</Typography>
                                                <Typography variant="h5" fontWeight="bold">
                                                    {products.length}
                                                </Typography>
                                            </Box>
                                        </Box>
                                    </CardContent>
                                </Card>
                            </Grid>
                            <Grid item xs={12} sm={6} md={3}>
                                <Card
                                    sx={{
                                        background: '#7C93C3',
                                        color: '#FFFFFF',
                                        boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.2)',
                                    }}
                                >
                                    <CardContent>
                                        <Box display="flex" alignItems="center">
                                            <ShoppingCart fontSize="large" sx={{ color: '#E1D7B7' }} />
                                            <Box ml={2}>
                                                <Typography variant="h6">Orders</Typography>
                                                <Typography variant="h5" fontWeight="bold">
                                                    {orders.length}
                                                </Typography>
                                            </Box>
                                        </Box>
                                    </CardContent>
                                </Card>
                            </Grid>
                            <Grid item xs={12} sm={6} md={3}>
                                <Card
                                    sx={{
                                        background: '#E1D7B7',
                                        color: '#1E2A5E',
                                        boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.2)',
                                    }}
                                >
                                    <CardContent>
                                        <Box display="flex" alignItems="center">
                                            <People fontSize="large" sx={{ color: '#1E2A5E' }} />
                                            <Box ml={2}>
                                                <Typography variant="h6">Users</Typography>
                                                <Typography variant="h5" fontWeight="bold">
                                                    {totalUsers}
                                                </Typography>
                                            </Box>
                                        </Box>
                                    </CardContent>
                                </Card>
                            </Grid>
                        </Grid>

                        {/* Charts Section */}
                        <Box mt={6}>
                            <Card
                                sx={{
                                    backgroundColor: '#CBDCEB',
                                    color: '#1E2A5E',
                                    boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.3)',
                                    mb: 4,
                                }}
                            >
                                <CardContent>
                                    <Typography variant="h6" gutterBottom>
                                        Monthly Sales
                                    </Typography>
                                    <MonthlySalesChart />
                                </CardContent>
                            </Card>
                            <Card
                                sx={{
                                    backgroundColor: '#1E2A5E',
                                    color: '#FFFFFF',
                                    boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.3)',
                                }}
                            >
                                <CardContent>
                                    <Typography variant="h6" gutterBottom>
                                        Product Sales
                                    </Typography>
                                    <ProductSalesChart />
                                </CardContent>
                            </Card>
                        </Box>
                    </Box>
                )}
            </Grid>
        </Box>
    );
};

export default Dashboard;