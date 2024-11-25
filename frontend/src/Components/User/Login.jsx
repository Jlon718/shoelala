import React from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import FacebookIcon from "@mui/icons-material/Facebook";
import GoogleIcon from "@mui/icons-material/Google";
import shoelalaImage from "../../img/shoesbg.avif";
import { auth, googleProvider } from "../../firebaseConfig";
import { signInWithPopup } from "firebase/auth";

// Define the validation schema using Yup
const LoginSchema = Yup.object().shape({
  email: Yup.string()
    .email("Invalid email format")
    .required("Email is required"),
  password: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
});

const Login = () => {
  const navigate = useNavigate();

  // React Hook Form setup
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(LoginSchema),
  });

  // Function for logging in using API
  const login = async (data) => {
    try {
      const config = {
        headers: { "Content-Type": "application/json" },
      };
      const response = await axios.post(
        `http://localhost:4001/api/v1/login`,
        data = { 
          ...data,
          fcmToken: localStorage.getItem("fcmToken"),
        },
        config
      );

      // Store user data and token in local storage
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));

      // Success toast and navigation
      toast.success("Login successful!", { position: "bottom-right" });
      navigate("/index");
    } catch (error) {
      toast.error("Invalid email or password", { position: "bottom-right" });
    }
  };

  // Function for Facebook login
  const handleFacebookLogin = async () => {
    try {
      const result = await signInWithPopup(auth, facebookProvider);
      console.log("Facebook Login Success:", result.user);
      navigate("/index");
    } catch (error) {
      toast.error("Facebook login failed", { position: "bottom-right" });
    }
  };

  // Function for Google login
  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      console.log("Google Login Success:", result.user);
      navigate("/index");
    } catch (error) {
      toast.error("Google login failed", { position: "bottom-right" });
    }
  };

  // Form submission handler
  const onSubmit = (data) => {
    login(data);
  };

  return (
    <div style={{ ...styles.background, backgroundImage: `url(${shoelalaImage})` }}>
      <div style={styles.loginContainer}>
        <h2 style={styles.heading}>Customer Login</h2>
        <form onSubmit={handleSubmit(onSubmit)} style={styles.form}>
          <div style={styles.inputGroup}>
            <label htmlFor="email_field" style={styles.inputIcon}>
              📧
            </label>
            <input
              id="email_field"
              type="email"
              placeholder="Email ID"
              {...register("email")}
              style={styles.input}
            />
            {errors.email && (
              <p style={styles.error}>{errors.email.message}</p>
            )}
          </div>
          <div style={styles.inputGroup}>
            <label htmlFor="password_field" style={styles.inputIcon}>
              🔒
            </label>
            <input
              id="password_field"
              type="password"
              placeholder="Password"
              {...register("password")}
              style={styles.input}
            />
            {errors.password && (
              <p style={styles.error}>{errors.password.message}</p>
            )}
          </div>
          <div style={styles.extraOptions}>
            <label>
              <input type="checkbox" /> Remember me
            </label>
          </div>
          <button type="submit" style={styles.button}>
            LOGIN
          </button>
          <p style={styles.newUser}>
            New User?{" "}
            <Link to="/register" style={styles.registerLink}>
              Register
            </Link>
          </p>
        </form>
        <div style={styles.socialButtons}>
          <button onClick={handleGoogleLogin} style={styles.gmailButton}>
            <GoogleIcon style={styles.icon} />
            Login with Gmail
          </button>
        </div>
      </div>
    </div>
  );
};

// Define the styles object
const styles = {
  background: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
    backgroundColor: "#0e2433",
    backgroundSize: "cover",
    backgroundPosition: "center",
  },
  loginContainer: {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: "15px",
    padding: "30px",
    width: "400px",
    textAlign: "center",
    boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.3)",
    backdropFilter: "blur(10px)",
  },
  heading: {
    fontSize: "24px",
    fontWeight: "bold",
    color: "#ffffff",
    marginBottom: "20px",
  },
  form: {
    display: "flex",
    flexDirection: "column",
  },
  inputGroup: {
    display: "flex",
    alignItems: "center",
    marginBottom: "15px",
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    borderRadius: "10px",
    padding: "10px",
  },
  inputIcon: {
    fontSize: "18px",
    marginRight: "10px",
    color: "#ffffff",
  },
  input: {
    flex: 1,
    border: "none",
    outline: "none",
    backgroundColor: "transparent",
    color: "#ffffff",
    fontSize: "16px",
  },
  extraOptions: {
    display: "flex",
    justifyContent: "space-between",
    fontSize: "14px",
    color: "#ffffff",
    marginBottom: "20px",
  },
  button: {
    padding: "10px 20px",
    backgroundColor: "#00e5ff",
    border: "none",
    borderRadius: "10px",
    color: "#ffffff",
    fontWeight: "bold",
    cursor: "pointer",
    marginBottom: "20px",
  },
  newUser: {
    fontSize: "14px",
    color: "#ffffff",
  },
  registerLink: {
    color: "#00e5ff",
    textDecoration: "none",
    fontWeight: "bold",
  },
  socialButtons: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    marginTop: "20px",
  },
  facebookButton: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "10px",
    backgroundColor: "#3b5998",
    color: "#fff",
    border: "none",
    borderRadius: "10px",
    cursor: "pointer",
    margin: "10px 0",
    width: "100%",
    maxWidth: "400px",
  },
  gmailButton: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "10px",
    backgroundColor: "#db4437",
    color: "#fff",
    border: "none",
    borderRadius: "10px",
    cursor: "pointer",
    margin: "10px 0",
    width: "100%",
    maxWidth: "400px",
  },
  icon: {
    marginRight: "10px",
  },
  error: {
    color: "red",
    fontSize: "12px",
    marginTop: "5px",
  },
};

export default Login;
