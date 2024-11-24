import React, { useState, useEffect, useRef  } from 'react';
import { useNavigate } from 'react-router-dom';
import { getToken } from '../../utils/helpers';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Box, TextField, Button, Typography, MenuItem, Select, FormControl, InputLabel } from '@mui/material';
import Sidebar from './SideBar'; // Assuming you have the Sidebar component in the same directory

const NewProduct = () => {
    const [name, setName] = useState('');
    const [price, setPrice] = useState(0);
    const [description, setDescription] = useState('');
    const [category, setCategory] = useState('');
    const [stock, setStock] = useState(0);
    const [seller, setSeller] = useState('');
    const [brand, setBrand] = useState('');
    const [images, setImages] = useState([]);
    const [imagesPreview, setImagesPreview] = useState([]);
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState(null);
    const [categories, setCategories] = useState([]);
    const [brands, setBrands] = useState([]);
    const [sellers, setSellers] = useState([]);

    let navigate = useNavigate();

    useEffect(() => {
        fetchCategories();
        fetchBrands();
        fetchSellers();
    }, []);

    const fetchCategories = async () => {
        try {
            const { data } = await axios.get(`${import.meta.env.VITE_API}/allCategories`);
            setCategories(data.categories);
        } catch (error) {
            toast.error('Error fetching categories');
        }
    };

    const fetchBrands = async () => {
        try {
            const { data } = await axios.get(`${import.meta.env.VITE_API}/allBrands`);
            setBrands(data.brands);
        } catch (error) {
            toast.error('Error fetching brands');
        }
    };

    const fetchSellers = async () => {
        try {
            const { data } = await axios.get(`${import.meta.env.VITE_API}/allSellers`);
            setSellers(data.sellers);
        } catch (error) {
            toast.error('Error fetching sellers');
        }
    };

    const submitHandler = (e) => {
      e.preventDefault();
      const formData = new FormData();
      formData.set('name', name);
      formData.set('price', price);
      formData.set('description', description);
      formData.set('category', category);
      formData.set('brand', brand);
      formData.set('stock', stock);
      formData.set('seller', seller);
  
      // Append each selected image file to the form data
      images.forEach(image => {
          formData.append('images', image); // 'images' field will contain the file object
      });
  
      // Send the form data to the backend
      newProduct(formData);
  };

  const fileInputRef = useRef();

  const onChange = e => {
    const files = Array.from(e.target.files)
    setImagesPreview([]);
    setImages([])
    files.forEach(file => {
        const reader = new FileReader();
        reader.onload = () => {
            if (reader.readyState === 2) {
                setImagesPreview(oldArray => [...oldArray, reader.result])
                setImages(oldArray => [...oldArray, reader.result])
            }
        }
        
        reader.readAsDataURL(file)
        // console.log(reader)
    })
   
}

    const newProduct = async (formData) => {
        try {
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${getToken()}`
                }
            };
            const { data } = await axios.post(`${import.meta.env.VITE_API}/admin/product/new`, formData, config);
            setLoading(false);
            setSuccess(data.success);
            toast.success('Product created successfully', {
                position: 'bottom-right'
            });
            navigate('/product/new');
        } catch (error) {
            setError(error.response.data.message);
            toast.error(error.response.data.message, {
                position: 'bottom-right'
            });
        }
    };

    useEffect(() => {
        if (error) {
            toast.error(error, {
                position: 'bottom-right'
            });
        }
        if (success) {
            toast.success('Product created successfully', {
                position: 'bottom-right'
            });
            navigate('/product/new');
        }
    }, [error, success, navigate]);

    return (
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
                <Box
                    component="form"
                    onSubmit={submitHandler}
                    sx={{
                        maxWidth: '600px',
                        width: '100%',
                        padding: 4,
                        borderRadius: '10px',
                        boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.2)',
                        backgroundColor: 'rgb(35 47 62, 0.9)',
                        backdropFilter: 'blur(10px)',
                    }}
                >
                    <Typography
                        variant="h4"
                        sx={{
                            marginBottom: 3,
                            textAlign: 'center',
                            color: '#133E87',
                            fontWeight: 'bold',
                        }}
                    >
                        Create Product
                    </Typography>

                    <TextField
                        label="Product Name"
                        fullWidth
                        sx={{ mb: 2 }}
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />

                    <TextField
                        label="Price"
                        type="number"
                        fullWidth
                        sx={{ mb: 2 }}
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                    />

                    <TextField
                        label="Description"
                        multiline
                        rows={4}
                        fullWidth
                        sx={{ mb: 2 }}
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    />

                    <FormControl fullWidth sx={{ mb: 2 }}>
                        <InputLabel>Category</InputLabel>
                        <Select
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                            label="Category"
                        >
                            {categories.map((category) => (
                                <MenuItem key={category._id} value={category._id}>
                                    {category.name}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    <FormControl fullWidth sx={{ mb: 2 }}>
                        <InputLabel>Brand</InputLabel>
                        <Select
                            value={brand}
                            onChange={(e) => setBrand(e.target.value)}
                            label="Brand"
                        >
                            {brands.map((brand) => (
                                <MenuItem key={brand._id} value={brand._id}>
                                    {brand.name}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    <FormControl fullWidth sx={{ mb: 2 }}>
                        <InputLabel>Seller</InputLabel>
                        <Select
                            value={seller}
                            onChange={(e) => setSeller(e.target.value)}
                            label="Seller"
                        >
                            {sellers.map((seller) => (
                                <MenuItem key={seller._id} value={seller._id}>
                                    {seller.name}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    <TextField
                        label="Stock"
                        type="number"
                        fullWidth
                        sx={{ mb: 2 }}
                        value={stock}
                        onChange={(e) => setStock(e.target.value)}
                    />

                    <Box sx={{ mb: 2 }}>
                        <Typography sx={{ mb: 1, color: '#4A628A', fontWeight: 'bold' }}>
                            Upload Images
                        </Typography>
                        <input
                            type="file"
                            accept="image/*"
                            multiple
                            onChange={onChange}
                            style={{ display: 'block' }}
                            ref={fileInputRef}
                        />
                    </Box>

                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={{
                            bgcolor: '#4A628A',
                            color: '#FFF',
                            ':hover': { bgcolor: '#2E4B6A' },
                            py: 1.5,
                            fontWeight: 'bold',
                            fontSize: '16px',
                        }}
                    >
                        CREATE
                    </Button>
                </Box>
            </Box>
        </Box>
    );
};

export default NewProduct;