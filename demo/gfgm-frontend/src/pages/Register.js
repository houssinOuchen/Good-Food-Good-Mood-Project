import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Auth.css';

const Register = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    email: '',
    firstName: '',
    lastName: '',
  });
  const [error, setError] = useState('');
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      await register(formData);
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to register');
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Register</h2>
        {error && <div className="error-message">{error}</div>}
        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
                type="text"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                required
            />
          </div>
          <div className="form-group">
            <label htmlFor="firstName">First Name</label>
            <input
                type="text"
                id="firstName"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label htmlFor="lastName">Last Name</label>
            <input
                type="text"
                id="lastName"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
            />
          </div>
          <button type="submit" className="auth-button">
            Register
          </button>
        </form>
      </div>
    </div>
  );
};

export default Register; 