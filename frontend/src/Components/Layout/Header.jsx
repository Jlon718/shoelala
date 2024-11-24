import React, { useState } from 'react';
import { AppBar, Toolbar, Typography, IconButton, Button, Box, Badge, TextField, InputAdornment } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import LoginIcon from '@mui/icons-material/Login';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import SearchIcon from '@mui/icons-material/Search';
import shoelala from '../../img/shoelala.png';
import Search from './Search';

const Header = ({ cartItems }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search/${searchQuery}`);
    } else {
      navigate('/');
    }
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
          <Link to="/login" style={{ textDecoration: 'none', color: '#fff' }}>
            <Button color="inherit" startIcon={<LoginIcon />}>
              Login
            </Button>
          </Link>
          <Link to="/cart" style={{ textDecoration: 'none', color: '#fff' }}>
            <IconButton color="inherit">
              <Badge badgeContent={cartItems.length} color="secondary">
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