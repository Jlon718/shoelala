import React from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { auth, googleProvider } from "../../firebaseConfig";
import { signInWithPopup } from "firebase/auth";
import FacebookIcon from "@mui/icons-material/Facebook";
import GoogleIcon from "@mui/icons-material/Google";
import shoelalaImage from "../../img/shoesbg.avif";

const Register = () => {
    const navigate = useNavigate();

    // Validation schema using Yup
    const validationSchema = Yup.object().shape({
        name: Yup.string().required("Name is required"),
        email: Yup.string().email("Invalid email").required("Email is required"),
        password: Yup.string()
            .min(6, "Password must be at least 6 characters")
            .required("Password is required"),
        phone: Yup.string()
            .matches(/^[0-9]+$/, "Phone must be numeric")
            .min(10, "Phone must be at least 10 digits")
            .required("Phone number is required"),
        address: Yup.string().required("Address is required"),
        avatar: Yup.mixed().test(
            "fileSize",
            "Avatar is required and must be less than 2MB",
            (value) => {
                return value && value[0]?.size <= 2 * 1024 * 1024;
            }
        ),
    });

    // React Hook Form setup
    const {
        register,
        handleSubmit,
        formState: { errors },
        setValue,
    } = useForm({
        resolver: yupResolver(validationSchema),
    });

    // Register API call
    const registerUser = async (data) => {
        try {
            const { avatar, ...userData } = data;

            const avatarReader = new FileReader();
            avatarReader.onload = async () => {
                const avatarBase64 = avatarReader.result.split(",")[1];
                const payload = { ...userData, avatar: avatarBase64 };
                await axios.post(`http://localhost:4001/api/v1/register`, payload);
                navigate("/login");
            };

            avatarReader.readAsDataURL(avatar[0]);
        } catch (error) {
            console.error("Registration Error:", error.response.data.message);
        }
    };

    // Form submit handler
    const onSubmit = (data) => {
        registerUser(data);
    };

    // Google Signup Handler
    const handleGoogleSignUp = async () => {
        try {
            const result = await signInWithPopup(auth, googleProvider);
            const { displayName, email } = result.user;
            const googleUser = { name: displayName, email, password: "" };
            await registerUser(googleUser);
        } catch (error) {
            console.error("Google Sign-Up Error:", error);
        }
    };

    // Facebook Signup Handler
    const handleFacebookSignUp = async () => {
        try {
            const result = await signInWithPopup(auth, facebookProvider);
            const { displayName, email } = result.user;
            const facebookUser = { name: displayName, email, password: "" };
            await registerUser(facebookUser);
        } catch (error) {
            console.error("Facebook Sign-Up Error:", error);
        }
    };

    return (
        <div style={{ ...styles.background, backgroundImage: `url(${shoelalaImage})` }}>
            <div style={styles.container}>
                <h2 style={styles.heading}>Register</h2>
                <form onSubmit={handleSubmit(onSubmit)} style={styles.form}>
                    {/* Name Input */}
                    <input
                        type="text"
                        placeholder="Name"
                        {...register("name")}
                        style={{
                            ...styles.input,
                            borderColor: errors.name ? "red" : "transparent",
                        }}
                    />
                    {errors.name && <p style={styles.error}>{errors.name.message}</p>}

                    {/* Email Input */}
                    <input
                        type="email"
                        placeholder="Email"
                        {...register("email")}
                        style={{
                            ...styles.input,
                            borderColor: errors.email ? "red" : "transparent",
                        }}
                    />
                    {errors.email && <p style={styles.error}>{errors.email.message}</p>}

                    {/* Password Input */}
                    <input
                        type="password"
                        placeholder="Password"
                        {...register("password")}
                        style={{
                            ...styles.input,
                            borderColor: errors.password ? "red" : "transparent",
                        }}
                    />
                    {errors.password && <p style={styles.error}>{errors.password.message}</p>}

                    {/* Phone Input */}
                    <input
                        type="text"
                        placeholder="Phone"
                        {...register("phone")}
                        style={{
                            ...styles.input,
                            borderColor: errors.phone ? "red" : "transparent",
                        }}
                    />
                    {errors.phone && <p style={styles.error}>{errors.phone.message}</p>}

                    {/* Address Input */}
                    <input
                        type="text"
                        placeholder="Address"
                        {...register("address")}
                        style={{
                            ...styles.input,
                            borderColor: errors.address ? "red" : "transparent",
                        }}
                    />
                    {errors.address && <p style={styles.error}>{errors.address.message}</p>}

                    {/* Avatar Input */}
                    <input
                        type="file"
                        accept="image/*"
                        {...register("avatar")}
                        style={styles.fileInput}
                    />
                    {errors.avatar && <p style={styles.error}>{errors.avatar.message}</p>}

                    {/* Submit Button */}
                    <button type="submit" style={styles.submitButton}>
                        Register
                    </button>
                </form>

                {/* Social Sign-Up Buttons */}
                <div style={styles.socialSection}>
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
        backgroundSize: "cover",
        backgroundPosition: "center",
    },
    container: {
        backgroundColor: "#21273D",
        padding: "30px",
        borderRadius: "15px",
        width: "400px",
        boxShadow: "0 10px 30px rgba(0, 0, 0, 0.3)",
        position: "relative",
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
    error: {
        color: "red",
        fontSize: "12px",
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
