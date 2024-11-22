import React from 'react';
import { AppBar, Toolbar, Typography, IconButton, Button, Box, Badge } from '@mui/material';
import { Link } from 'react-router-dom';
import LoginIcon from '@mui/icons-material/Login';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import shoelala from '../../img/shoelala.png'; 

const Header = ({ cartItems }) => {
  return (
    <AppBar position="static" sx={{ backgroundColor: '#21273D', color: '#fff' }}>
      <Toolbar>
        <IconButton edge="start" color="inherit" aria-label="menu">
          <img src={shoelala} alt="Shoelala Logo" style={{ height: '40px' }} />
        </IconButton>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          Shoelala
        </Typography>
        {/* Buttons */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <Link to="/login" style={{ textDecoration: 'none' }}>
            <Button
              variant="outlined"
              startIcon={<LoginIcon />}
              sx={{
                color: '#fff',
                borderColor: '#fff',
                '&:hover': {
                  borderColor: '#83B4FF',
                  color: '#83B4FF',
                },
              }}
            >
              Login
            </Button>
          </Link>
          <Link to="/cart" style={{ textDecoration: 'none' }}>
            <IconButton color="inherit" sx={{ color: '#83B4FF' }}>
              <Badge badgeContent={cartItems.length} sx={{ '& .MuiBadge-badge': { backgroundColor: '#FDFFE2', color: '#000' } }}>
                <ShoppingCartIcon />
              </Badge>
            </IconButton>
          </Link>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;