import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { countries } from 'countries-list';
import MetaData from '../Layout/MetaData';
import shoelalaImage from '../../img/shoesbg.avif';

const Shipping = ({ shipping = {}, saveShippingInfo }) => {
    const countriesList = Object.values(countries);
    const [address, setAddress] = useState(shipping.address || '');
    const [city, setCity] = useState(shipping.city || '');
    const [postalCode, setPostalCode] = useState(shipping.postalCode || '');
    const [phoneNo, setPhoneNo] = useState(shipping.phoneNo || '');
    const [country, setCountry] = useState(shipping.country || '');
    let navigate = useNavigate();

    const submitHandler = (e) => {
        e.preventDefault();
        const shippingInfo = { address, city, phoneNo, postalCode, country };
        saveShippingInfo(shippingInfo);
        navigate('/confirm-order', { state: { shippingInfo } });
    };

    return (
        <>
            <MetaData title={'Shipping Info'} />
            <div style={styles.background}>
                <div style={styles.stepsContainer}>
                    <Step label="Shipping" active />
                    <Step label="Confirm Order" />
                    <Step label="Payment" />
                </div>
                <div style={styles.container}>
                    <h2 style={styles.heading}>Shipping Info</h2>
                    <form onSubmit={submitHandler} style={styles.form}>
                        <div style={styles.inputGroup}>
                            <label htmlFor="address_field" style={styles.inputIcon}>
                                🏠
                            </label>
                            <input
                                type="text"
                                id="address_field"
                                placeholder="Address"
                                value={address}
                                onChange={(e) => setAddress(e.target.value)}
                                style={styles.input}
                                required
                            />
                        </div>
                        <div style={styles.inputGroup}>
                            <label htmlFor="city_field" style={styles.inputIcon}>
                                🏙️
                            </label>
                            <input
                                type="text"
                                id="city_field"
                                placeholder="City"
                                value={city}
                                onChange={(e) => setCity(e.target.value)}
                                style={styles.input}
                                required
                            />
                        </div>
                        <div style={styles.inputGroup}>
                            <label htmlFor="phone_field" style={styles.inputIcon}>
                                📞
                            </label>
                            <input
                                type="phone"
                                id="phone_field"
                                placeholder="Phone No"
                                value={phoneNo}
                                onChange={(e) => setPhoneNo(e.target.value)}
                                style={styles.input}
                                required
                            />
                        </div>
                        <div style={styles.inputGroup}>
                            <label htmlFor="postal_code_field" style={styles.inputIcon}>
                                📮
                            </label>
                            <input
                                type="text"
                                id="postal_code_field"
                                placeholder="Postal Code"
                                value={postalCode}
                                onChange={(e) => setPostalCode(e.target.value)}
                                style={styles.input}
                                required
                            />
                        </div>
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
        fontSize: '24px',
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
};

export default Shipping;
