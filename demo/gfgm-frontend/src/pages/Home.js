import React, {useState} from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Home.css';
import axios from "axios";

const Home = () => {
    const { user } = useAuth();
    const [aiLoading, setAiLoading] = useState(false);
    const [input, setInput] = useState('');
    const [result, setResult] = useState(null);


    const handleGenerate = async () => {
        const ingredients = input.split(',').map(i => i.trim());
        try {
            setAiLoading(true);
            const res = await axios.post('/api/ai/predict', { ingredients },{
                headers: { 'Content-Type': 'application/json' },
            });
            setResult(res.data);
        } catch (error) {
            console.error(error);
            alert('AI prediction failed');
        }finally {
            setAiLoading(false);
        }
    };

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
          {user && (
              <div className="ai-generator-section">
                  <div className="ai-generator-card">
                      <h2>AI Recipe Generator</h2>
                      <p>Let our AI create a custom recipe based on your ingredients</p>

                      <div className="ai-generator-form">
                          <textarea placeholder='Enter ingredients like chicken, rice, tomato'
                                    className="ai-input"
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                          />
                          <button onClick={handleGenerate} className="ai-generate-button">
                              Generate Recipe
                          </button>
                      </div>

                      {aiLoading && <div className="ai-loading">Generating your recipe...</div>}

                      {result && (
                          <div className="ai-recipe-result">
                              <h3>{result.name}</h3>
                              <div className="ai-recipe-details">
                                  <div className="ai-recipe-ingredients">
                                      <h4>Ingredients</h4>
                                      <ul>
                                          {result.ingredients.map((ing, index) => (
                                              <li key={index}>{ing}</li>
                                          ))}
                                      </ul>
                                  </div>
                                  <div className="ai-recipe-steps">
                                      <h4>Steps</h4>
                                      <ol>
                                          {result.steps.map((step, index) => (
                                              <li key={index}>{step}</li>
                                          ))}
                                      </ol>
                                  </div>
                              </div>
                              <button className="ai-save-button">
                                  Save This Recipe
                              </button>
                          </div>
                      )}
                  </div>
              </div>
          )}
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