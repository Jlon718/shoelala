import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route, useNavigate } from "react-router-dom";

import './app.css'
import './styles.css'
import Header from './Components/Layout/Header';
import Footer from './Components/Layout/Footer';
import Index from './Components/Index';
import Home from './Components/Home';
import ProductDetails from './Components/Product/ProductDetails';
import Login from './Components/User/Login'
import Register from './Components/User/Register'
import Cart from './Components/Cart/Cart';
import NewProduct from './Components/Product/NewProduct';
import ProductForm from './Components/Admin/ProductForm';
import Shipping from './Components/Cart/Shipping';
import ConfirmOrder from './Components/Cart/ConfirmOrder';
import Payment from './Components/Cart/Payment';
import OrderSuccess from './Components/Cart/OrderSuccess';
import axios from 'axios';
import ProtectedRoute from './Components/Route/ProtectedRoute';
import Dashboard from './Components/Admin/Dashboard';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import OrdersList from './Components/Admin/OrdersList';
import OrderDetails from './Components/Order/OrderDetails';
import ProcessOrder from './Components/Admin/ProcessOrder';
import UpdateProduct from './Components/Admin/UpdateProduct';
import ListOrders from './Components/Order/ListOrders';
import ReviewProduct from './Components/Review/ReviewProduct';
import ProductReviews from './Components/Admin/ProcessReview';
import Profile from './Components/User/Profile';
import useNotification from './utils/useNotification';


function App() {
  useNotification();
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker
        .register('/firebase-messaging-sw.js')
        .then((registration) => {
            console.log('Service Worker registered with scope:', registration.scope);
        })
        .catch((error) => {
            console.error('Service Worker registration failed:', error);
        });
}

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
          <Route path="/index" element={<Index />} exact="true" />
          <Route path="/home" element={<Home />} exact="true" />
          <Route path="/product/:id" element={<ProductDetails cartItems={state.cartItems} addItemToCart={addItemToCart} />} exact="true" />
          <Route path="/review/product/:id" element={<ReviewProduct cartItems={state.cartItems} addItemToCart={addItemToCart} />} exact="true" />
          <Route path="/search/:keyword" element={<Index />} exact="true" />
          <Route path="/login" element={<Login />} exact="true" />
          <Route path="/register" element={<Register />} exact="true" />
          <Route path="/cart" element={<Cart cartItems={state.cartItems} addItemToCart={addItemToCart} removeItemFromCart={removeItemFromCart} />} exact="true" />
          <Route path="/product/new" element={<NewProduct />} exact />
          <Route path="/admin/product/new/form" element={<ProductForm />} exact />
          <Route path="/update-product/:id" element={<UpdateProduct />} exact="true" />
          <Route path="/shipping" element={<Shipping saveShippingInfo={saveShippingInfo} />} exact="true" />
          <Route path="/confirm-order" element={<ConfirmOrder cartItems={state.cartItems} shippingInfo={state.shippingInfo} />} exact="true" />
          <Route path="/payment" element={<Payment />} exact="true" />
          <Route path="/success" element={<OrderSuccess />} exact="true" />
          <Route path="/dashboard" element={<Dashboard />} exact="true" />
          <Route path="/orders/me" element={<ListOrders />} />
          <Route path="/order/:id" element={<OrderDetails />} />
          <Route path="/profile" element={<Profile />} />
          
          <Route
            path="/admin/orders"
            element={<OrdersList />} />
          <Route
            path="/admin/order/:id"
            element={<ProcessOrder />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute isAdmin={true}>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/product/:id"
            element={<UpdateProduct />} />
          <Route
          path="/admin/reviews"
          element={
           
              <ProductReviews />
          }/>
        </Routes>
      </Router>
      <Footer />
    </div>
  )
}

export default App