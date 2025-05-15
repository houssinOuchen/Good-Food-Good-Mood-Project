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
      // Updated navbar.js
      <nav className="navbar">
          <div className="navbar-container">
              <div className="navbar-brand">
                  <Link to="/" className="navbar-logo">
                      <span className="logo-icon">🍏</span>
                      <span>Gym Guy's Food</span>
                  </Link>
              </div>

              <div className="navbar-links">
                  <Link to="/recipes" className="navbar-link">
                      <i className="fas fa-utensils"></i>
                      <span>Recipes</span>
                  </Link>

                  {user ? (
                      <>
                          <Link to="/my-recipes" className="navbar-link">
                              <i className="fas fa-book"></i>
                              <span>My Recipes</span>
                          </Link>
                          <Link to="/recipes/add" className="navbar-link highlight">
                              <i className="fas fa-plus"></i>
                              <span>Add Recipe</span>
                          </Link>

                          <div className="user-dropdown">
                              <button className="user-toggle">
                                  <span className="user-avatar">{user.username.charAt(0).toUpperCase()}</span>
                                  <span className="username">{user.username}</span>
                                  <i className="fas fa-chevron-down"></i>
                              </button>
                              <div className="dropdown-menu">
                                  <button onClick={handleLogout} className="dropdown-item">
                                      <i className="fas fa-sign-out-alt"></i> Logout
                                  </button>
                              </div>
                          </div>
                      </>
                  ) : (
                      <div className="auth-links">
                          <Link to="/login" className="navbar-link">
                              <i className="fas fa-sign-in-alt"></i>
                              <span>Login</span>
                          </Link>
                          <Link to="/register" className="navbar-link highlight">
                              <i className="fas fa-user-plus"></i>
                              <span>Register</span>
                          </Link>
                      </div>
                  )}
              </div>

              <button className="navbar-toggle">
                  <i className="fas fa-bars"></i>
              </button>
          </div>
      </nav>
    /*<nav className="navbar">
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
    </nav>*/
  );
};

export default Navbar; 