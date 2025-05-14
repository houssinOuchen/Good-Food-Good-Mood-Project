import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Home.css';

const Home = () => {
  const { user } = useAuth();

  return (
    <div className="home-container">
      <div className="hero-section">
        <h1>Welcome to Gym Guy's Food</h1>
        <p className="hero-text">
          Discover and share delicious recipes tailored for fitness enthusiasts
        </p>
        {!user ? (
          <div className="hero-buttons">
            <Link to="/register" className="cta-button">
              Get Started
            </Link>
            <Link to="/login" className="secondary-button">
              Login
            </Link>
          </div>
        ) : (
          <div className="hero-buttons">
            <Link to="/recipes/add" className="cta-button">
              Share Your Recipe
            </Link>
            <Link to="/recipes" className="secondary-button">
              Browse Recipes
            </Link>
          </div>
        )}
      </div>

      <div className="features-section">
        <h2>Why Choose Gym Guy's Food?</h2>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">🏋️‍♂️</div>
            <h3>Fitness-Focused</h3>
            <p>Recipes designed with nutrition and fitness goals in mind</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">📱</div>
            <h3>Easy to Use</h3>
            <p>Simple and intuitive interface for sharing and discovering recipes</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">👥</div>
            <h3>Community Driven</h3>
            <p>Connect with other fitness enthusiasts and share your favorites</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">📊</div>
            <h3>Detailed Info</h3>
            <p>Complete nutritional information and preparation details</p>
          </div>
        </div>
      </div>

      <div className="cta-section">
        <h2>Ready to Start Your Culinary Journey?</h2>
        <p>Join our community and start sharing your favorite recipes today!</p>
        {!user ? (
          <Link to="/register" className="cta-button">
            Create Account
          </Link>
        ) : (
          <Link to="/recipes/add" className="cta-button">
            Add Your First Recipe
          </Link>
        )}
      </div>
    </div>
  );
};

export default Home; 