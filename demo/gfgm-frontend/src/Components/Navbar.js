import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Navbar.css';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <Link to="/" className="navbar-logo">
          Gym Guy's Food
        </Link>
      </div>
      <div className="navbar-menu">
        <Link to="/recipes" className="navbar-item">
          Recipes
        </Link>
        {user ? (
          <>
            <Link to="/my-recipes" className="navbar-item">
              My Recipes
            </Link>
            <Link to="/recipes/add" className="navbar-item">
              Add Recipe
            </Link>
            <div className="navbar-item user-menu">
              <span className="username">{user.username}</span>
              <button onClick={handleLogout} className="logout-button">
                Logout
              </button>
            </div>
          </>
        ) : (
          <div className="auth-buttons">
            <Link to="/login" className="navbar-item">
              Login
            </Link>
            <Link to="/register" className="navbar-item">
              Register
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar; 