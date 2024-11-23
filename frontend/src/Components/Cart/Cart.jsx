import React from 'react';
import { Link } from 'react-router-dom';
import MetaData from '../Layout/MetaData';
import { useNavigate } from 'react-router-dom';

const Cart = ({ cartItems, addItemToCart, removeItemFromCart }) => {
  const navigate = useNavigate();

  const increaseQty = (id, quantity, stock) => {
    const newQty = quantity + 1;
    if (newQty > stock) return;
    addItemToCart(id, newQty);
  };

  const decreaseQty = (id, quantity) => {
    const newQty = quantity - 1;
    if (newQty <= 0) return;
    addItemToCart(id, newQty);
  };

  const removeCartItemHandler = (id) => {
    removeItemFromCart(id);
  };

  const checkoutHandler = () => {
    navigate('/shipping');
  };

  localStorage.setItem('cartItems', JSON.stringify(cartItems));

  return (
    <>
      <MetaData title={'Your Cart'} />
      {cartItems.length === 0 ? (
        <h2 className="mt-5">Your Cart is Empty</h2>
      ) : (
        <div style={{ padding: '20px', backgroundColor: '#f9f9f9', minHeight: '100vh' }}>
          <h2 style={{ textAlign: 'center', marginBottom: '20px', color: '#333' }}>
            Your Cart: <b>{cartItems.length} items</b>
          </h2>

          <div style={{ display: 'flex', justifyContent: 'space-between', gap: '20px' }}>
            {/* Cart Items */}
            <div style={{ flex: 2, background: '#fff', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
              {cartItems.map((item) => (
                <div
                  key={item.product}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    borderBottom: '1px solid #ddd',
                    padding: '10px 0',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <img src={item.image} alt={item.name} style={{ width: '80px', height: '80px', borderRadius: '8px' }} />
                    <Link to={`/products/${item.product}`} style={{ color: '#007bff', textDecoration: 'none', fontWeight: 'bold' }}>
                      {item.name}
                    </Link>
                  </div>
                  <p style={{ color: '#333', margin: 0 }}>${item.price}</p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <button
                      onClick={() => decreaseQty(item.product, item.quantity)}
                      style={{
                        border: 'none',
                        backgroundColor: '#f5f5f5',
                        padding: '5px 10px',
                        borderRadius: '4px',
                        cursor: 'pointer',
                      }}
                    >
                      -
                    </button>
                    <input
                      type="text"
                      value={item.quantity}
                      readOnly
                      style={{
                        width: '40px',
                        textAlign: 'center',
                        border: '1px solid #ddd',
                        borderRadius: '4px',
                      }}
                    />
                    <button
                      onClick={() => increaseQty(item.product, item.quantity, item.stock)}
                      style={{
                        border: 'none',
                        backgroundColor: '#f5f5f5',
                        padding: '5px 10px',
                        borderRadius: '4px',
                        cursor: 'pointer',
                      }}
                    >
                      +
                    </button>
                  </div>
                  <button
                    onClick={() => removeCartItemHandler(item.product)}
                    style={{
                      border: 'none',
                      backgroundColor: '#dc3545',
                      color: '#fff',
                      padding: '5px 10px',
                      borderRadius: '4px',
                      cursor: 'pointer',
                    }}
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>

            {/* Order Summary */}
            <div style={{ flex: 1, background: '#fff', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
              <h4 style={{ marginBottom: '20px', color: '#333' }}>Order Summary</h4>
              <p style={{ display: 'flex', justifyContent: 'space-between', margin: '10px 0', color: '#555' }}>
                Subtotal: <span>{cartItems.reduce((acc, item) => acc + Number(item.quantity), 0)} (Units)</span>
              </p>
              <p style={{ display: 'flex', justifyContent: 'space-between', margin: '10px 0', color: '#555' }}>
                Est. total: <span>${cartItems.reduce((acc, item) => acc + item.quantity * item.price, 0).toFixed(2)}</span>
              </p>
              <button
                onClick={checkoutHandler}
                style={{
                  width: '100%',
                  backgroundColor: '#007bff',
                  color: '#fff',
                  border: 'none',
                  padding: '10px',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  marginTop: '20px',
                }}
              >
                Proceed to Checkout
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Cart;
