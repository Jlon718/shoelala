import React, { useState, useEffect } from 'react';
import { getToken } from "../../utils/helpers";
import axios from "axios";
import Loader from '../Layout/Loader';
import { PieChart, Pie, Legend, Tooltip, ResponsiveContainer, Cell } from 'recharts';

export default function ProductSalesChart({ data }) {
    const [sales, setSales] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const generateColors = (numColors) => {
        // Generate a dynamic array of colors
        const colors = [];
        for (let i = 0; i < numColors; i++) {
            // Randomly generate RGB colors
            const r = Math.floor(Math.random() * 256);
            const g = Math.floor(Math.random() * 256);
            const b = Math.floor(Math.random() * 256);
            colors.push(`rgb(${r}, ${g}, ${b})`);
        }
        return colors;
    };

    const RADIAN = Math.PI / 180;
    const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index }) => {
        const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
        const x = cx + radius * Math.cos(-midAngle * RADIAN);
        const y = cy + radius * Math.sin(-midAngle * RADIAN);
        return (
            <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central">
                {`${(percent * 10).toFixed(0)}%`}
            </text>
        );
    };

    const productSales = async () => {
        try {
            const config = {
                headers: {
                    'Authorization': `Bearer ${getToken()}`
                }
            };
            const { data } = await axios.get(`${import.meta.env.VITE_API}/admin/product-sales`, config);
            setSales(data.totalPercentage);
            setLoading(false);
        } catch (error) {
            setError(error.response?.data?.message || "Error fetching sales data");
            setLoading(false);
        }
    };

    useEffect(() => {
        productSales();
    }, []);

    // Dynamically generate colors based on the number of sales items
    const dynamicColors = generateColors(sales.length);

    return (
        loading ? <Loader /> : (
            <ResponsiveContainer width="90%" height={1000}>
                <PieChart width={1000} height={1000}>
                    <Pie
                        dataKey="percent"
                        nameKey="name"
                        isAnimationActive={true}
                        data={sales}
                        cx="50%"
                        cy="50%"
                        outerRadius={300}
                        fill="#8884d8"
                        label={renderCustomizedLabel}
                        labelLine={false}
                    >
                        {sales.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={dynamicColors[index]} />
                        ))}
                    </Pie>
                    <Tooltip />
                    <Legend layout="vertical" verticalAlign="top" align="right" />
                </PieChart>
            </ResponsiveContainer>
        )
    );
}
