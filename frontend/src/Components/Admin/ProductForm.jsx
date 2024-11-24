import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {
  Box,
  TextField,
  Button,
  Typography,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
} from '@mui/material';
import Sidebar from './SideBar';
import { getToken } from '../../utils/helpers';

const NewProduct = () => {
  const navigate = useNavigate();

  // States for categories, brands, and sellers
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [sellers, setSellers] = useState([]);

  // Fetch data for dropdowns
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

  // Validation schema
  const validationSchema = Yup.object().shape({
    name: Yup.string().required('Product name is required'),
    price: Yup.number()
      .typeError('Price must be a number')
      .positive('Price must be positive')
      .required('Price is required'),
    description: Yup.string().required('Description is required'),
    category: Yup.string().required('Category is required'),
    brand: Yup.string().required('Brand is required'),
    stock: Yup.number()
      .typeError('Stock must be a number')
      .integer('Stock must be an integer')
      .positive('Stock must be positive')
      .required('Stock is required'),
    seller: Yup.string().required('Seller is required'),
    images: Yup.mixed()
      .required('At least one image is required')
      .test('fileSize', 'Images must be less than 2MB each', (value) =>
        value ? value.every((file) => file.size <= 2 * 1024 * 1024) : false
      ),
  });

  // React Hook Form setup
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    watch,
  } = useForm({
    resolver: yupResolver(validationSchema),
  });

  // Handle image preview
  const imagesPreview = watch('images') || [];
  const fileInputRef = useRef();

  // Form submit handler
  const onSubmit = async (data) => {
    const formData = new FormData();

    // Populate formData
    Object.keys(data).forEach((key) => {
      if (key === 'images') {
        Array.from(data.images).forEach((file) => formData.append('images', file));
      } else {
        formData.append(key, data[key]);
      }
    });

    // API call
    try {
      const config = {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${getToken()}`,
        },
      };
      await axios.post(`${import.meta.env.VITE_API}/admin/product/new`, formData, config);
      toast.success('Product created successfully', { position: 'bottom-right' });
      navigate('/products');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error creating product', {
        position: 'bottom-right',
      });
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        minHeight: '100vh',
        background: 'linear-gradient(to top, #F3F3E0, #133E87, #608BC1, #CBDCEB)',
      }}
    >
      <Box sx={{ width: '250px' }}>
        <Sidebar />
      </Box>
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
          onSubmit={handleSubmit(onSubmit)}
          sx={{
            maxWidth: '600px',
            width: '100%',
            padding: 4,
            borderRadius: '10px',
            boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.2)',
            backgroundColor: 'rgba(100, 120, 150, 0.9)',
            backdropFilter: 'blur(10px)',
          }}
        >
          <Typography
            variant="h4"
            sx={{
              marginBottom: 3,
              textAlign: 'center',
              color: '#fff',
              fontWeight: 'bold',
            }}
          >
            Create Product
          </Typography>

          <TextField
            label="Product Name"
            fullWidth
            sx={{ mb: 2 }}
            {...register('name')}
            error={!!errors.name}
            helperText={errors.name?.message}
          />

          <TextField
            label="Price"
            type="number"
            fullWidth
            sx={{ mb: 2 }}
            {...register('price')}
            error={!!errors.price}
            helperText={errors.price?.message}
          />

          <TextField
            label="Description"
            multiline
            rows={4}
            fullWidth
            sx={{ mb: 2 }}
            {...register('description')}
            error={!!errors.description}
            helperText={errors.description?.message}
          />

          <FormControl fullWidth sx={{ mb: 2 }} error={!!errors.category}>
            <InputLabel>Category</InputLabel>
            <Select {...register('category')} defaultValue="">
              {categories.map((category) => (
                <MenuItem key={category._id} value={category._id}>
                  {category.name}
                </MenuItem>
              ))}
            </Select>
            <Typography color="error" variant="caption">
              {errors.category?.message}
            </Typography>
          </FormControl>

          <FormControl fullWidth sx={{ mb: 2 }} error={!!errors.brand}>
            <InputLabel>Brand</InputLabel>
            <Select {...register('brand')} defaultValue="">
              {brands.map((brand) => (
                <MenuItem key={brand._id} value={brand._id}>
                  {brand.name}
                </MenuItem>
              ))}
            </Select>
            <Typography color="error" variant="caption">
              {errors.brand?.message}
            </Typography>
          </FormControl>

          <FormControl fullWidth sx={{ mb: 2 }} error={!!errors.seller}>
            <InputLabel>Seller</InputLabel>
            <Select {...register('seller')} defaultValue="">
              {sellers.map((seller) => (
                <MenuItem key={seller._id} value={seller._id}>
                  {seller.name}
                </MenuItem>
              ))}
            </Select>
            <Typography color="error" variant="caption">
              {errors.seller?.message}
            </Typography>
          </FormControl>

          <TextField
            label="Stock"
            type="number"
            fullWidth
            sx={{ mb: 2 }}
            {...register('stock')}
            error={!!errors.stock}
            helperText={errors.stock?.message}
          />

          <Box sx={{ mb: 2 }}>
            <Typography sx={{ mb: 1, color: '#4A628A', fontWeight: 'bold' }}>
              Upload Images
            </Typography>
            <input
              type="file"
              accept="image/*"
              multiple
              {...register('images')}
              ref={fileInputRef}
            />
            <Typography color="error" variant="caption">
              {errors.images?.message}
            </Typography>
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
