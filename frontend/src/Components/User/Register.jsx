import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { auth, googleProvider, facebookProvider } from "../../firebaseConfig";
import { signInWithPopup } from "firebase/auth";
import FacebookIcon from "@mui/icons-material/Facebook";
import GoogleIcon from "@mui/icons-material/Google";
import shoelalaImage from "../../img/shoesbg.avif";

const Register = () => {
    const [user, setUser] = useState({
        name: "",
        email: "",
        password: "",
        phone: "",
        address: "",
        avatar: "",
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const onChange = (e) => {
        if (e.target.name === "avatar") {
            const reader = new FileReader();
            reader.onload = () => {
                if (reader.readyState === 2) {
                    setUser({ ...user, avatar: reader.result.split(",")[1] });
                }
            };
            reader.readAsDataURL(e.target.files[0]);
        } else {
            setUser({ ...user, [e.target.name]: e.target.value });
        }
    };

    const register = async (userData) => {
        try {
            const { data } = await axios.post(`http://localhost:4001/api/v1/register`, userData);
            setUser(data.user);
            navigate("/");
        } catch (error) {
            setLoading(false);
            setError(error.response.data.message);
            console.log(error.response.data.message);
        }
    };

    const submitHandler = (e) => {
        e.preventDefault();
        setLoading(true);
        register(user);
    };

    // Firebase Google Sign-In
    const handleGoogleSignUp = async () => {
        try {
            const result = await signInWithPopup(auth, googleProvider);
            const { displayName, email } = result.user;
            const googleUser = {
                name: displayName,
                email: email,
                password: "", 
            };
            await register(googleUser);
        } catch (error) {
            console.error("Google Sign-In Error:", error);
        }
    };

    // Firebase Facebook Sign-In
    const handleFacebookSignUp = async () => {
        try {
            const result = await signInWithPopup(auth, facebookProvider);
            const { displayName, email } = result.user;
            const facebookUser = {
                name: displayName,
                email: email,
                password: "", 
            };
            await register(facebookUser);
        } catch (error) {
            console.error("Facebook Sign-In Error:", error);
        }
    };

    const { name, email, password, phone, address, avatar } = user || {};

    return (
        <div style={{ ...styles.background, backgroundImage: `url(${shoelalaImage})` }}>
            <div style={styles.container}>
                <div style={styles.closeButton}>&times;</div>
                <h2 style={styles.heading}>Register</h2>
                <form onSubmit={submitHandler} style={styles.form}>
                    <input
                        type="email"
                        placeholder="Email"
                        name="email"
                        value={email}
                        onChange={onChange}
                        style={styles.input}
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        name="password"
                        value={password}
                        onChange={onChange}
                        style={styles.input}
                    />
                    <input
                        type="text"
                        placeholder="Username"
                        name="name"
                        value={name}
                        onChange={onChange}
                        style={styles.input}
                    />
                    <input
                        type="text"
                        placeholder="Phone"
                        name="phone"
                        value={phone}
                        onChange={onChange}
                        style={styles.input}
                    />
                    <input
                        type="text"
                        placeholder="Address"
                        name="address"
                        value={address}
                        onChange={onChange}
                        style={styles.input}
                    />
                    <input
                        type="file"
                        name="avatar"
                        onChange={onChange}
                        style={styles.fileInput}
                    />
                    <button type="submit" style={styles.submitButton}>
                        Register
                    </button>
                </form>
                <div style={styles.socialSection}>
                    <button onClick={handleFacebookSignUp} style={styles.facebookButton}>
                        <FacebookIcon style={styles.icon} />
                        Facebook
                    </button>
                    <button onClick={handleGoogleSignUp} style={styles.gmailButton}>
                        <GoogleIcon style={styles.icon} />
                        Google
                    </button>
                </div>
                <p style={styles.footerText}>
                    Already have an account?{" "}
                    <a href="/login" style={styles.link}>
                        Log In
                    </a>
                </p>
            </div>
        </div>
    );
};

const styles = {
    background: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        background: "linear-gradient(to bottom right, #00203FFF, #ADEFD1FF)",
    },
    container: {
        backgroundColor: "#21273D",
        padding: "30px",
        borderRadius: "15px",
        width: "400px",
        boxShadow: "0 10px 30px rgba(0, 0, 0, 0.3)",
        position: "relative",
    },
    closeButton: {
        position: "absolute",
        top: "10px",
        right: "10px",
        fontSize: "20px",
        cursor: "pointer",
        color: "#999",
    },
    heading: {
        textAlign: "center",
        fontSize: "24px",
        fontWeight: "bold",
        marginBottom: "20px",
        color: "#ffffff",
    },
    form: {
        display: "flex",
        flexDirection: "column",
        gap: "15px",
    },
    input: {
        padding: "10px",
        border: "1px solid #ddd",
        borderRadius: "8px",
        fontSize: "16px",
    },
    fileInput: {
        fontSize: "14px",
        padding: "10px",
        border: "1px solid #ddd",
        borderRadius: "8px",
    },
    submitButton: {
        padding: "12px",
        backgroundColor: "#4CAF50",
        border: "none",
        borderRadius: "8px",
        color: "#fff",
        fontSize: "16px",
        cursor: "pointer",
        fontWeight: "bold",
    },
    socialSection: {
        display: "flex",
        justifyContent: "space-between",
        marginTop: "20px",
    },
    facebookButton: {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#3b5998",
        color: "#fff",
        padding: "10px",
        borderRadius: "8px",
        border: "none",
        cursor: "pointer",
        flex: 1,
        marginRight: "10px",
    },
    gmailButton: {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#db4437",
        color: "#fff",
        padding: "10px",
        borderRadius: "8px",
        border: "none",
        cursor: "pointer",
        flex: 1,
        marginLeft: "10px",
    },
    icon: {
        marginRight: "10px",
    },
    footerText: {
        color: "#ffffff",
        textAlign: "center",
        marginTop: "15px",
        fontSize: "14px",
    },
    link: {
        color: "#4CAF50",
        textDecoration: "none",
        fontWeight: "bold",
    },
};

export default Register;