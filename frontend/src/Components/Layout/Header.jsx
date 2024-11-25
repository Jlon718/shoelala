import React, { useState } from 'react';
import { AppBar, Toolbar, Typography, IconButton, Button, Box, Badge, Menu, MenuItem } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import LoginIcon from '@mui/icons-material/Login';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import shoelala from '../../img/shoelala.png';
import Search from './Search';

const Header = ({ cartItems }) => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user')); 
  const [anchorEl, setAnchorEl] = useState(null);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
    handleMenuClose();
  };

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
        <Search />
        <Box sx={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          {user ? (
            <>
              <Typography variant="h6" sx={{ color: '#83B4FF' }}>
                Hi! {user.name}
              </Typography>
              <IconButton color="inherit" onClick={handleMenuOpen}>
                <AccountCircleIcon sx={{ color: '#83B4FF' }} />
              </IconButton>
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
              >
                <MenuItem onClick={() => { navigate('/profile'); handleMenuClose(); }}>Profile</MenuItem>
                <MenuItem onClick={() => { navigate('/orders/me'); handleMenuClose(); }}>My Orders</MenuItem>
                <MenuItem onClick={handleLogout}>Logout</MenuItem>
              </Menu>
            </>
          ) : (
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
          )}
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