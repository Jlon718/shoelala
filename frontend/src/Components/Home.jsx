import React from 'react';
import { Box, Typography, Button, Container } from '@mui/material';
import Header from '../Components/Layout/Header'; 

const Home = () => {
  return (
    <Box>
      <Header />
      {/* Hero Section */}
      <Box
        sx={{
          backgroundImage: 'url(/path-to-hero-image.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          color: '#fff',
          textAlign: 'center',
          py: 8,
        }}
      >
        <Container>
          <Typography variant="h3" fontWeight="bold">
            Step Into Style
          </Typography>
          <Typography variant="h6" sx={{ my: 2 }}>
            Discover the latest collection of footwear.
          </Typography>
          <Button variant="contained" color="primary" size="large">
            Shop Now
          </Button>
        </Container>
      </Box>

      {/* About Section */}
      <Box sx={{ backgroundColor: '#f9f9f9', py: 6 }}>
        <Container>
          <Typography variant="h4" fontWeight="bold" sx={{ textAlign: 'center', mb: 4 }}>
            About Us
          </Typography>
          <Typography variant="body1" sx={{ textAlign: 'center', maxWidth: 600, mx: 'auto' }}>
            We are passionate about providing stylish, high-quality footwear for every occasion.
            Step up your game with our exclusive collection.
          </Typography>
        </Container>
      </Box>
    </Box>
  );
};

export default Home;