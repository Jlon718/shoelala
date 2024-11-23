import React, { useState } from 'react';
import { Box, TextField, Button, Typography, Grid } from '@mui/material';
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

  const submitHandler = (e) => {
    e.preventDefault();
    alert('Form submitted!');
  };

  const onChange = (e) => {
    const files = Array.from(e.target.files);
    setImages(files);
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
