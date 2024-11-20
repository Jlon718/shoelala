import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import './App.css';
import Header from './Components/Layout/Header';
import Footer from './Components/Layout/Footer';
import Home from './Components/Home';
import ProductDetails from './Components/Product/ProductDetails';
import Login from './Components/User/Login';
import Register from './Components/User/Register';
import Cart from './Components/Cart/Cart';
import NewProduct from './Components/Product/NewProduct';
import UpdateProduct from './Components/Product/UpdateProduct';
import axios from 'axios';

function App() {
  const [state, setState] = useState({
    cartItems: localStorage.getItem('cartItems')
      ? JSON.parse(localStorage.getItem('cartItems'))
      : [], 
    shippingInfo: localStorage.getItem('shippingInfo')
      ? JSON.parse(localStorage.getItem('shippingInfo'))
      : {},
  });

  const addItemToCart = async (id, quantity) => {
    try {
      const { data } = await axios.get(`${import.meta.env.VITE_API}/product/${id}`);
      const item = {
        product: data.product._id,
        name: data.product.name,
        price: data.product.price,
        image: data.product.images[0].url,
        stock: data.product.stock,
        quantity: quantity
      };
      const isItemExist = state.cartItems.find(i => i.product === item.product);
      if (isItemExist) {
        setState({
          ...state,
          cartItems: state.cartItems.map(i => i.product === isItemExist.product ? item : i)
        });
      } else {
        setState({
          ...state,
          cartItems: [...state.cartItems, item]
        });
      }
      localStorage.setItem('cartItems', JSON.stringify(state.cartItems));
    } catch (error) {
      console.error(error);
    }
  };

  const removeItemFromCart = async (id) => {
    setState({
      ...state,
      cartItems: state.cartItems.filter(i => i.product !== id)
    });
    localStorage.setItem('cartItems', JSON.stringify(state.cartItems));
  };

  return (
    <div className="App">
      <Router>
        <Header cartItems={state.cartItems} />
        <Routes>
          <Route path="/" element={<Home />} exact />
          <Route path="/product/:id" element={<ProductDetails cartItems={state.cartItems} addItemToCart={addItemToCart} />} exact />
          <Route path="/search/:keyword" element={<Home />} exact />
          <Route path="/login" element={<Login />} exact />
          <Route path="/register" element={<Register />} exact />
          <Route path="/cart" element={<Cart cartItems={state.cartItems} addItemToCart={addItemToCart} removeItemFromCart={removeItemFromCart} />} exact />
          <Route path="/product/new" element={<NewProduct />} exact />
          <Route path="/product/update/:id" element={<UpdateProduct />} exact />
        </Routes>
      </Router>
      <Footer />
    </div>
  );
}

export default App;