import {  signInWithEmailAndPassword } from "firebase/auth";
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate from react-router-dom
import { auth } from "../firebase";
import {Link} from 'react-router-dom'

export const Login = () => {
  const [err, setError] = useState(false);
  const navigate = useNavigate(); // Use useNavigate hook to handle navigation

  const handleSubmit = async (e) => {
    e.preventDefault();
    const email = e.target[0].value;
    const password = e.target[1].value;

    try {
      await signInWithEmailAndPassword(auth, email, password)
        navigate("/login")
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
          <input type="password" placeholder="Password" />
          <button type="submit">Sign In</button>
          <p className="con">
            Don't have an account? <Link to="/register">Sign Up</Link> {/* Link to registration page */}
          </p>
        </form>
        {err && <span>Something went wrong</span>}
      </div>
      
    </div>
  );
};

export default Login;
