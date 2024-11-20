// src/Components/Product/NewProduct.jsx
import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const NewProduct = () => {
    const [product, setProduct] = useState({
        name: '',
        price: 0,
        description: '',
        stock: 0,
        category: '',
        brand: '',
        seller: ''
    });

    const handleChange = (e) => {
        setProduct({ ...product, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const { data } = await axios.post(`${import.meta.env.VITE_API}/product/new`, product);
            toast.success('Product created successfully');
        } catch (error) {
            toast.error('Error creating product');
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
            <button type="submit">Create Product</button>
        </form>
    );
};

export default NewProduct;