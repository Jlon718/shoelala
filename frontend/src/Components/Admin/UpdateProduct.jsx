import React, { useState, useEffect } from 'react';
import { Box, TextField, Button, Typography, Grid } from '@mui/material';
import Sidebar from './SideBar'; // Assuming you have the Sidebar component in the same directory
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import { getToken } from '../../utils/helpers';
import shoelalaImage from '../../img/shoesbg.avif'; // Ensure this path is correct

const UpdateProduct = () => {
  const [name, setName] = useState('');
  const [price, setPrice] = useState(0);
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [brand, setBrand] = useState('');
  const [stock, setStock] = useState(0);
  const [seller, setSeller] = useState('');
  const [images, setImages] = useState([]);
  const [oldImages, setOldImages] = useState([]);
  const [imagesPreview, setImagesPreview] = useState([]);
  const [error, setError] = useState('');
  const [product, setProduct] = useState({});
  const [isUpdated, setIsUpdated] = useState(false);

  const categories = [
    'Electronics',
    'Cameras',
    'Laptops',
    'Accessories',
    'Headphones',
    'Food',
    'Books',
    'Clothes/Shoes',
    'Beauty/Health',
    'Sports',
    'Outdoor',
    'Home',
  ];

  const { id } = useParams();
  const navigate = useNavigate();

  const fetchProductDetails = async (id) => {
    try {
      const { data } = await axios.get(`${import.meta.env.VITE_API}/product/${id}`);
      setProduct(data.product);
      setName(data.product.name);
      setPrice(data.product.price);
      setDescription(data.product.description);
      setCategory(data.product.category);
      setBrand(data.product.brand);
      setSeller(data.product.seller);
      setStock(data.product.stock);
      setOldImages(data.product.images);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to load product details', {
        position: 'bottom-left',
      });
    }
  };

  const updateProduct = async (id, productData) => {
    try {
      const config = {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${getToken()}`,
        },
      };
      await axios.put(`${import.meta.env.VITE_API}/admin/product/${id}`, productData, config);
      setIsUpdated(true);
      toast.success('Product updated successfully!', { position: 'bottom-right' });
      navigate('/product/new');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update product', {
        position: 'bottom-left',
      });
    }
  };

  useEffect(() => {
    if (product && product._id !== id) {
      fetchProductDetails(id);
    }
  }, [id, product]);

  const submitHandler = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.set('name', name);
    formData.set('price', price);
    formData.set('description', description);
    formData.set('category', category);
    formData.set('stock', stock);
    formData.set('brand', brand);
    formData.set('seller', seller);

    images.forEach((image) => formData.append('images', image));

    updateProduct(product._id, formData);
  };

  const onChange = (e) => {
    const files = Array.from(e.target.files);
    setImages([]);
    setOldImages([]);
    setImagesPreview([]);

    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = () => {
        if (reader.readyState === 2) {
          setImagesPreview((old) => [...old, reader.result]);
          setImages((old) => [...old, file]);
        }
      };
      reader.readAsDataURL(file);
    });
  };

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
            Update Product
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

          <TextField
            label="Category"
            fullWidth
            sx={{ mb: 2 }}
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          />

          <TextField
            label="Brand"
            fullWidth
            sx={{ mb: 2 }}
            value={brand}
            onChange={(e) => setBrand(e.target.value)}
          />

          <TextField
            label="Stock"
            type="number"
            fullWidth
            sx={{ mb: 2 }}
            value={stock}
            onChange={(e) => setStock(e.target.value)}
          />

          <TextField
            label="Seller Name"
            fullWidth
            sx={{ mb: 2 }}
            value={seller}
            onChange={(e) => setSeller(e.target.value)}
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
            />
          </Box>

          <Box sx={{ mb: 2, display: 'flex', gap: 2, flexWrap: 'wrap' }}>
            {oldImages.map((img, index) => (
              <img
                key={index}
                src={img.url}
                alt={`Old Preview ${index}`}
                style={{ width: '60px', height: '60px', borderRadius: '5px' }}
              />
            ))}
            {imagesPreview.map((img, index) => (
              <img
                key={index}
                src={img}
                alt={`Preview ${index}`}
                style={{ width: '60px', height: '60px', borderRadius: '5px' }}
              />
            ))}
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
              transition: 'background-color 0.3s ease',
            }}
          >
            UPDATE
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default UpdateProduct;