import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import MetaData from '../Layout/MetaData';
import { countries } from 'countries-list';
import shoelalaImage from '../../img/shoesbg.avif';
import { getUser } from '../../utils/helpers';

const CheckoutSteps = ({ shipping, confirmOrder, payment }) => {
    return (
        <div style={styles.stepsContainer}>
            <Step label="Shipping" active={shipping} />
            <Step label="Confirm Order" active={confirmOrder} />
            <Step label="Payment" active={payment} />
        </div>
    );
};

const Step = ({ label, active }) => {
    return (
        <div style={{ ...styles.step, color: active ? '#00e5ff' : '#BDBDBD' }}>
            <div style={{ ...styles.circle, background: active ? '#00e5ff' : '#BDBDBD' }}>
                {label === 'Shipping' ? '1' : label === 'Confirm Order' ? '2' : '3'}
            </div>
            <p style={styles.stepText}>{label}</p>
        </div>
    );
};

export const Shipping = ({ shipping = {}, saveShippingInfo }) => {
    const countriesList = Object.values(countries);
    const [address, setAddress] = useState(shipping.address || '');
    const [city, setCity] = useState(shipping.city || '');
    const [postalCode, setPostalCode] = useState(shipping.postalCode || '');
    const [phoneNo, setPhoneNo] = useState(shipping.phoneNo || '');
    const [country, setCountry] = useState(shipping.country || '');
    const navigate = useNavigate();

    const submitHandler = (e) => {
        e.preventDefault();
        const shippingInfo = { address, city, phoneNo, postalCode, country };
        saveShippingInfo(shippingInfo);
        navigate('/confirm-order', { state: { shippingInfo } });
    };

    return (
        <>
            <MetaData title="Shipping Info" />
            <div style={styles.background}>
                <CheckoutSteps shipping />
                <div style={styles.container}>
                    <h2 style={styles.heading}>Shipping Info</h2>
                    <form onSubmit={submitHandler} style={styles.form}>
                        <InputField
                            id="address_field"
                            label="🏠"
                            placeholder="Address"
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                        />
                        <InputField
                            id="city_field"
                            label="🏙️"
                            placeholder="City"
                            value={city}
                            onChange={(e) => setCity(e.target.value)}
                        />
                        <InputField
                            id="phone_field"
                            label="📞"
                            placeholder="Phone No"
                            value={phoneNo}
                            onChange={(e) => setPhoneNo(e.target.value)}
                        />
                        <InputField
                            id="postal_code_field"
                            label="📮"
                            placeholder="Postal Code"
                            value={postalCode}
                            onChange={(e) => setPostalCode(e.target.value)}
                        />
                        <div style={styles.inputGroup}>
                            <label htmlFor="country_field" style={styles.inputIcon}>
                                🌍
                            </label>
                            <select
                                id="country_field"
                                value={country}
                                onChange={(e) => setCountry(e.target.value)}
                                style={styles.input}
                                required
                            >
                                {countriesList.map((country) => (
                                    <option key={country.name} value={country.name}>
                                        {country.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <button type="submit" style={styles.button}>
                            Continue
                        </button>
                    </form>
                </div>
            </div>
        </>
    );
};

export const ConfirmOrder = ({ cartItems }) => {
    const location = useLocation();
    const { shippingInfo } = location.state || {};
    const [user, setUser] = useState(getUser() || {});
    const navigate = useNavigate();

    const itemsPrice = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
    const shippingPrice = itemsPrice > 200 ? 0 : 25;
    const taxPrice = Number((0.05 * itemsPrice).toFixed(2));
    const totalPrice = (itemsPrice + shippingPrice + taxPrice).toFixed(2);

    const processToPayment = () => {
        const data = {
            itemsPrice: itemsPrice.toFixed(2),
            shippingPrice,
            taxPrice,
            totalPrice,
            shippingInfo,
        };
        sessionStorage.setItem('orderInfo', JSON.stringify(data));
        navigate('/payment', { state: { shippingInfo } });
    };

    return (
        <>
            <MetaData title="Confirm Order" />
            <div style={styles.background}>
                <CheckoutSteps shipping confirmOrder />
                <div style={{ ...styles.container, maxWidth: '800px' }}>
                    <h2 style={styles.heading}>Confirm Order</h2>
                    <div style={styles.section}>
                        <h4 style={styles.subheading}>Shipping Info</h4>
                        <p style={styles.text}>
                            <b>Name:</b> {user.name}
                        </p>
                        <p style={styles.text}>
                            <b>Phone:</b> {shippingInfo.phoneNo}
                        </p>
                        <p style={styles.text}>
                            <b>Address:</b>{' '}
                            {`${shippingInfo.address}, ${shippingInfo.city}, ${shippingInfo.postalCode}, ${shippingInfo.country}`}
                        </p>
                    </div>
                    <div style={styles.cartSection}>
                        <h4 style={styles.subheading}>Your Cart Items</h4>
                        {cartItems.map((item) => (
                            <div key={item.product} style={styles.cartItem}>
                                <img src={item.image} alt={item.name} style={styles.cartItemImage} />
                                <Link to={`/product/${item.product}`} style={styles.cartItemName}>
                                    {item.name}
                                </Link>
                                <p style={styles.cartItemPrice}>
                                    {item.quantity} x ${item.price} ={' '}
                                    <b>${(item.quantity * item.price).toFixed(2)}</b>
                                </p>
                            </div>
                        ))}
                    </div>
                    <div style={styles.orderSummary}>
                        <h4 style={styles.subheading}>Order Summary</h4>
                        <div style={styles.summaryRow}>
                            <span>Subtotal:</span>
                            <span style={styles.summaryValue}>${itemsPrice.toFixed(2)}</span>
                        </div>
                        <div style={styles.summaryRow}>
                            <span>Shipping:</span>
                            <span style={styles.summaryValue}>${shippingPrice}</span>
                        </div>
                        <div style={styles.summaryRow}>
                            <span>Tax:</span>
                            <span style={styles.summaryValue}>${taxPrice}</span>
                        </div>
                        <div style={{ ...styles.summaryRow, fontWeight: 'bold' }}>
                            <span>Total:</span>
                            <span style={styles.summaryValue}>${totalPrice}</span>
                        </div>
                        <button style={styles.button} onClick={processToPayment}>
                            Proceed to Payment
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
};

const InputField = ({ id, label, placeholder, value, onChange }) => (
    <div style={styles.inputGroup}>
        <label htmlFor={id} style={styles.inputIcon}>
            {label}
        </label>
        <input
            type="text"
            id={id}
            placeholder={placeholder}
            value={value}
            onChange={onChange}
            style={styles.input}
            required
        />
    </div>
);

const styles = {
    background: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        minHeight: '100vh',
        backgroundImage: `url(${shoelalaImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
    },
    stepsContainer: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        margin: '20px 0',
        gap: '20px',
        padding: '20px',
        borderRadius: '10px',
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.3)',
        backdropFilter: 'blur(10px)',
    },
    step: {
        textAlign: 'center',
    },
    circle: {
        width: '40px',
        height: '40px',
        borderRadius: '50%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        color: '#fff',
        margin: 'auto',
        fontSize: '18px',
        fontWeight: 'bold',
    },
    stepText: {
        marginTop: '10px',
        fontSize: '14px',
        fontWeight: 'bold',
        color: '#fff',
    },
    container: {
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        borderRadius: '15px',
        padding: '30px',
        width: '400px',
        textAlign: 'center',
        boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.3)',
        backdropFilter: 'blur(10px)',
    },
    heading: {
        fontSize: '28px',
        fontWeight: 'bold',
        color: '#ffffff',
        marginBottom: '20px',
    },
    form: {
        display: 'flex',
        flexDirection: 'column',
    },
    inputGroup: {
        display: 'flex',
        alignItems: 'center',
        marginBottom: '15px',
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        borderRadius: '10px',
        padding: '10px',
    },
    inputIcon: {
        fontSize: '18px',
        marginRight: '10px',
        color: '#ffffff',
    },
    input: {
        flex: 1,
        border: 'none',
        outline: 'none',
        backgroundColor: 'transparent',
        color: '#ffffff',
        fontSize: '16px',
    },
    button: {
        padding: '10px 20px',
        backgroundColor: '#00e5ff',
        border: 'none',
        borderRadius: '10px',
        color: '#ffffff',
        fontWeight: 'bold',
        cursor: 'pointer',
        marginTop: '20px',
    },
    section: {
        marginBottom: '20px',
    },
    subheading: {
        fontSize: '22px',
        fontWeight: 'bold',
        color: '#E1D7B7',
        marginBottom: '10px',
    },
    text: {
        color: '#ffffff',
        fontSize: '18px',
        marginBottom: '10px',
    },
    divider: {
        borderColor: '#E1D7B7',
        margin: '20px 0',
    },
    cartSection: {
        marginBottom: '20px',
    },
    cartItem: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '10px',
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        borderRadius: '10px',
        padding: '10px',
    },
    cartItemImage: {
        width: '50px',
        borderRadius: '5px',
    },
    cartItemName: {
        color: '#00e5ff',
        textDecoration: 'none',
        fontWeight: 'bold',
    },
    cartItemPrice: {
        color: '#ffffff',
        fontSize: '16px',
    },
    orderSummary: {
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        borderRadius: '10px',
        padding: '20px',
        marginTop: '20px',
    },
    summaryRow: {
        display: 'flex',
        justifyContent: 'space-between',
        marginBottom: '10px',
        fontSize: '18px',
        color: '#ffffff',
    },
    summaryValue: {
        fontWeight: 'bold',
    },
};

export default ConfirmOrder;