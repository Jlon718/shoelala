import React from 'react';
import { Link } from 'react-router-dom';

const CheckoutSteps = ({ shipping, confirmOrder, payment }) => {
    return (
        <div style={styles.background}>
            <div style={styles.stepsContainer}>
                <div style={{ ...styles.step, color: shipping ? '#00e5ff' : '#BDBDBD' }}>
                    <Link to="/shipping" style={{ ...styles.link, color: shipping ? '#00e5ff' : '#BDBDBD' }}>
                        <div style={{ ...styles.circle, background: shipping ? '#00e5ff' : '#BDBDBD' }}>1</div>
                        <p style={styles.stepText}>Shipping</p>
                    </Link>
                </div>

                <div style={{ ...styles.step, color: confirmOrder ? '#00e5ff' : '#BDBDBD' }}>
                    <Link to="/confirm-order" style={{ ...styles.link, color: confirmOrder ? '#00e5ff' : '#BDBDBD' }}>
                        <div style={{ ...styles.circle, background: confirmOrder ? '#00e5ff' : '#BDBDBD' }}>2</div>
                        <p style={styles.stepText}>Confirm Order</p>
                    </Link>
                </div>

                <div style={{ ...styles.step, color: payment ? '#00e5ff' : '#BDBDBD' }}>
                    <Link to="/payment" style={{ ...styles.link, color: payment ? '#00e5ff' : '#BDBDBD' }}>
                        <div style={{ ...styles.circle, background: payment ? '#00e5ff' : '#BDBDBD' }}>3</div>
                        <p style={styles.stepText}>Payment</p>
                    </Link>
                </div>
            </div>
        </div>
    );
};

const styles = {
    background: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        background: 'linear-gradient(to top, #F3F3E0, #133E87, #608BC1, #CBDCEB)',
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
    link: {
        textDecoration: 'none',
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
};

export default CheckoutSteps;