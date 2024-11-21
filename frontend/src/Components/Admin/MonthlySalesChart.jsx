import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { TextField, Button, Grid, Select, MenuItem, InputLabel, FormControl } from '@mui/material';
import { getToken } from "../../utils/helpers";
import Loader from '../Layout/Loader';

const MonthlySalesChart = () => {
    const [originalSales, setOriginalSales] = useState([]);
    const [filteredSales, setFilteredSales] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [startMonth, setStartMonth] = useState('');
    const [endMonth, setEndMonth] = useState('');
    const [year, setYear] = useState(new Date().getFullYear());

    const months = [
        { value: 1, label: 'January' },
        { value: 2, label: 'February' },
        { value: 3, label: 'March' },
        { value: 4, label: 'April' },
        { value: 5, label: 'May' },
        { value: 6, label: 'June' },
        { value: 7, label: 'July' },
        { value: 8, label: 'August' },
        { value: 9, label: 'September' },
        { value: 10, label: 'October' },
        { value: 11, label: 'November' },
        { value: 12, label: 'December' }
    ];

    useEffect(() => {
        fetchSalesData();
    }, []);

    const fetchSalesData = async () => {
        try {
            const token = getToken();
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            };
            const { data } = await axios.get(`${import.meta.env.VITE_API}/admin/monthly-sales`, config);
            // Add year and month fields to the sales data
            const salesData = data.sales.map(sale => ({
                ...sale,
                year: sale.year, // Ensure year is included
                month: sale.month // Ensure month is included
            }));
            console.log('Fetched Sales Data:', salesData); // Debugging log
            setOriginalSales(salesData || []);
            setFilteredSales(salesData || []);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching sales data:', error);
            setError('Error fetching sales data');
            setLoading(false);
        }
    };

    const handleFilter = () => {
        const filtered = originalSales.filter(sale => sale.month >= startMonth && sale.month <= endMonth && sale.year === parseInt(year));
        console.log('Filtered Sales:', filtered); // Debugging log
        setFilteredSales(filtered);
    };

    if (loading) {
        return <Loader />;
    }

    if (error) {
        return <div>{error}</div>;
    }

    return (
        <div>
            <Grid container spacing={3}>
                <Grid item xs={4}>
                    <FormControl fullWidth>
                        <InputLabel>Start Month</InputLabel>
                        <Select
                            value={startMonth}
                            onChange={(e) => setStartMonth(e.target.value)}
                        >
                            {months.map((month) => (
                                <MenuItem key={month.value} value={month.value}>
                                    {month.label}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Grid>
                <Grid item xs={4}>
                    <FormControl fullWidth>
                        <InputLabel>End Month</InputLabel>
                        <Select
                            value={endMonth}
                            onChange={(e) => setEndMonth(e.target.value)}
                        >
                            {months.map((month) => (
                                <MenuItem key={month.value} value={month.value}>
                                    {month.label}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Grid>
                <Grid item xs={4}>
                    <TextField
                        label="Year"
                        type="number"
                        value={year}
                        onChange={(e) => setYear(e.target.value)}
                        fullWidth
                    />
                </Grid>
                <Grid item xs={12}>
                    <Button variant="contained" color="primary" onClick={handleFilter}>
                        Filter
                    </Button>
                </Grid>
            </Grid>
            <ResponsiveContainer width="100%" height={400}>
                <LineChart data={filteredSales}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="totalSales" stroke="#8884d8" />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
};

export default MonthlySalesChart;