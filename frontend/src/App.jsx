import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route, useNavigate } from "react-router-dom";

import './App.css'
// import './styles.css'
import Header from './Components/Layout/Header'
import Footer from './Components/Layout/Footer'
import Home from './Components/Home'
import ProductDetails from './Components/Product/ProductDetails';
import Login from './Components/User/Login'
import Register from './Components/User/Register'
import Cart from './Components/Cart/Cart';
import NewProduct from './Components/Product/NewProduct';
import UpdateProduct from './Components/Product/UpdateProduct';
import Shipping from './Components/Cart/Shipping';
import ConfirmOrder from './Components/Cart/ConfirmOrder';
import Payment from './Components/Cart/Payment';
import OrderSuccess from './Components/Cart/OrderSuccess';
import axios from 'axios';
import ProtectedRoute from './Components/Route/ProtectedRoute';
import Dashboard from './Components/Admin/Dashboard';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


function App() {
  const [state, setState] = useState({
    cartItems: localStorage.getItem('cartItems')
      ? JSON.parse(localStorage.getItem('cartItems'))
      : [], shippingInfo: localStorage.getItem('shippingInfo')
        ? JSON.parse(localStorage.getItem('shippingInfo'))
        : {},
  })
  // const navigate = useNavigate()
  const addItemToCart = async (id, quantity) => {
    // console.log(id, quantity)
    try {
      const { data } = await axios.get(`${import.meta.env.VITE_API}/product/${id}`)
      const item = {
        product: data.product._id,
        name: data.product.name,
        price: data.product.price,
        image: data.product.images[0].url,
        stock: data.product.stock,
        quantity: quantity
      }
      const isItemExist = state.cartItems.find(i => i.product === item.product)
      console.log(state)
      setState({
        ...state,
        cartItems: [...state.cartItems, item]
      })
      if (isItemExist) {
        setState({
          ...state,
          cartItems: state.cartItems.map(i => i.product === isItemExist.product ? item : i)
        })
      }
      else {
        setState({
          ...state,
          cartItems: [...state.cartItems, item]
        })
      }
      toast.success('Item Added to Cart', {
        position: 'bottom-right'
      })
    } catch (error) {
      toast.error(error, {
        position: 'top-left'
      });
      // navigate('/')
    }
  }
  const removeItemFromCart = async (id) => {
    setState({
      ...state,
      cartItems: state.cartItems.filter(i => i.product !== id)
    })
    localStorage.setItem('cartItems', JSON.stringify(state.cartItems))
  }

  const saveShippingInfo = (data) => {
    setState({
      ...state,
      shippingInfo: data
    })
    localStorage.setItem('shippingInfo', JSON.stringify(data))
  }

  return(
    <div className="App">
      <Router>
       <Header cartItems={state.cartItems} />
        <Routes>
          <Route path="/" element={<Home />} exact="true" />
          <Route path="/product/:id" element={<ProductDetails cartItems={state.cartItems} addItemToCart={addItemToCart} />} exact="true" />
          <Route path="/search/:keyword" element={<Home />} exact="true" />
          <Route path="/login" element={<Login />} exact="true" />
          <Route path="/register" element={<Register />} exact="true" />
          <Route path="/cart" element={<Cart cartItems={state.cartItems} addItemToCart={addItemToCart} removeItemFromCart={removeItemFromCart} />} exact="true" />
          <Route path="/product/new" element={<NewProduct />} exact />
          <Route path="/update-product/:id" element={<UpdateProduct />} exact="true" />
          <Route path="/shipping" element={<Shipping saveShippingInfo={saveShippingInfo} />} exact="true" />
          <Route path="/confirm-order" element={<ConfirmOrder cartItems={state.cartItems} shippingInfo={state.shippingInfo} />} exact="true" />
          <Route path="/payment" element={<Payment />} exact="true" />
          <Route path="/order-success" element={<OrderSuccess />} exact="true" />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute isAdmin={true}>
                <Dashboard />
              </ProtectedRoute>
            }
          />
        </Routes>
      </Router>
      <Footer />
    </div>
  )
}

export default App