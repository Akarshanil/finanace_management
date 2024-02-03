import React, { useState } from 'react';
import './login.css';
import whatsappImage from './WhatsApp Image 2024-01-25 at 5.50.57 PM.jpeg';
import { useNavigate } from 'react-router-dom'; 

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await fetch('http://127.0.0.1:8000/finance_management/authenticate/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        throw new Error('Login failed');
      }

    
      const responseData = await response.json();
      console.log(responseData.user)

    
      localStorage.setItem('user', JSON.stringify(responseData.user));

      
      navigate('/Expenser'); 
    } catch (error) {
      setError('Login failed. Please check your email and password.');
    }
  };

  return (
    <div className="login-container">
      <div className="left-side">
        <img src={whatsappImage} alt="Unrecognisable businesswoman calculating finances in an office" />
      </div>
      <div className="right-side">
        <form onSubmit={handleSubmit}>
          <label>Email</label>
          <input
            type="email" 
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <label>Password</label><br />
          <input
            type="password"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required 
          />
          {error && <div className="error">{error}</div>}
          <button className="button1" type="submit">Login</button>
        </form>
      </div>
    </div>
  );
}

export default Login;
