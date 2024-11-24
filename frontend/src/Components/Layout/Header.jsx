import React, { useState } from 'react';
import { AppBar, Toolbar, Typography, IconButton, Button, Box, Badge, Menu, MenuItem, InputAdornment, TextField } from '@mui/material';
import { Link } from 'react-router-dom';
import LoginIcon from '@mui/icons-material/Login';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import SearchIcon from '@mui/icons-material/Search';
import shoelala from '../../img/shoelala.png';
import Search from './Search';

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
        {/* Search Bar */}
        <Search />
        <Box component="form" onSubmit={handleSearch} sx={{ flexGrow: 1, mx: 2 }}>
          <TextField
            variant="outlined"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            fullWidth
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton type="submit" color="inherit">
                    <SearchIcon />
                  </IconButton>
                </InputAdornment>
              ),
            }}
            sx={{ backgroundColor: '#fff', borderRadius: '4px' }}
          />
        </Box>
        {/* Buttons */}
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