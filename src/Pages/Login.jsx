import { signInWithEmailAndPassword } from "firebase/auth";
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate from react-router-dom
import { auth } from "../firebase";
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai'; // Import eye icons

export const Login = () => {
  const [err, setError] = useState(false);
  const [showPassword, setShowPassword] = useState(false); // State to toggle password visibility
  const navigate = useNavigate(); // Use useNavigate hook to handle navigation

  const handleSubmit = async (e) => {
    e.preventDefault();
    const email = e.target[0].value;
    const password = e.target[1].value;

    try {
      await signInWithEmailAndPassword(auth, email, password);
      toast.success("Login successful!");
      navigate("/"); // Navigate to the home page on successful login
    } catch (error) {
      setError(true);
      console.error('Login error:', error.message);
    }
  };

  return (
    <div className="formContainer">
      <div className="formWrapper">
        <span className="Head">Monkey Chat</span>
        <span className="sub">Login</span>
        <form onSubmit={handleSubmit} className="form">
          <input type="email" placeholder="Email" />
          <div className="password-container">
            <input
              type={showPassword ? "text" : "password"} // Toggle between text and password input
              placeholder="Password"
            />
            <button
              type="button"
              className="show-password-btn"
              onClick={() => setShowPassword(!showPassword)} // Toggle password visibility
            >
              {showPassword ? <AiOutlineEyeInvisible /> : <AiOutlineEye />} {/* Eye icon */}
            </button>
          </div>
          <button type="submit">Sign In</button>
          <p className="con">
            Don't have an account? <Link to="/register">Sign Up</Link>
          </p>
        </form>
        {err && <span>Something went wrong</span>}
      </div>
    </div>
  );
};

export default Login;
