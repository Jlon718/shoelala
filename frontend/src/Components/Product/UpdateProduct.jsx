// src/components/UpdateProduct.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const UpdateProduct = () => {
    const [product, setProduct] = useState({
        name: '',
        price: 0,
        description: '',
        stock: 0,
        category: '',
        brand: '',
        seller: ''
    });
    const { id } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProduct = async () => {
            const { data } = await axios.get(`${import.meta.env.VITE_API}/product/${id}`);
            setProduct(data.product);
        };
        fetchProduct();
    }, [id]);

    const handleChange = (e) => {
        setProduct({ ...product, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.put(`${import.meta.env.VITE_API}/product/${id}`, product);
            toast.success('Product updated successfully');
            navigate(`/product/${id}`);
        } catch (error) {
            toast.error('Error updating product');
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <input type="text" name="name" value={product.name} onChange={handleChange} placeholder="Name" required />
            <input type="number" name="price" value={product.price} onChange={handleChange} placeholder="Price" required />
            <textarea name="description" value={product.description} onChange={handleChange} placeholder="Description" required />
            <input type="number" name="stock" value={product.stock} onChange={handleChange} placeholder="Stock" required />
            <input type="text" name="category" value={product.category} onChange={handleChange} placeholder="Category" required />
            <input type="text" name="brand" value={product.brand} onChange={handleChange} placeholder="Brand" required />
            <input type="text" name="seller" value={product.seller} onChange={handleChange} placeholder="Seller" required />
            <button type="submit">Update Product</button>
        </form>
    );
};

export default UpdateProduct;