import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { recipeService } from '../services/recipeService';
import { useAuth } from '../context/AuthContext';
import './RecipeDetail.css';

const RecipeDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchRecipe();
  }, [id]);

  const fetchRecipe = async () => {
    try {
      setLoading(true);
      const data = await recipeService.getRecipeById(id);
      setRecipe(data);
      console.log("Recipe data:", data);
      console.log("id:", id);
    } catch (err) {
      setError('Failed to fetch recipe');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this recipe?')) {
      return;
    }

    try {
      await recipeService.deleteRecipe(id);
      navigate('/my-recipes');
    } catch (err) {
      setError('Failed to delete recipe');
      console.error(err);
    }
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  if (!recipe) {
    return <div className="not-found">Recipe not found</div>;
  }

  const isOwner = user && recipe.author && user.id === recipe.author.id;

  const authorName = recipe.author?.username || 'Unknown User';
  console.log("username:", recipe.user?.username);
  return (
      <div className="recipe-detail-page">
        {loading && (
            <div className="rdp-loading-overlay">
              <div className="rdp-spinner"></div>
              <p>Loading recipe...</p>
            </div>
        )}

        {error && (
            <div className="rdp-error-overlay">
              <i className="fas fa-exclamation-triangle"></i>
              <p>{error}</p>
            </div>
        )}

        {!recipe && !loading && (
            <div className="rdp-not-found">
              <i className="fas fa-utensils"></i>
              <h3>Recipe Not Found</h3>
              <p>The recipe you're looking for doesn't exist or has been removed.</p>
              <Link to="/recipes" className="rdp-back-button">
                <i className="fas fa-arrow-left"></i> Browse Recipes
              </Link>
            </div>
        )}

        {recipe && (
            <>
              <div className="rdp-hero">
                <div className="rdp-hero-image">
                  {recipe.imageUrl ? (
                      <img src={`/api/uploads/${recipe.imageUrl}`} alt={recipe.title}/>
                  ) : (
                      <div className="rdp-placeholder-image">
                        <i className="fas fa-utensils"></i>
                      </div>
                  )}
                </div>

                <div className="rdp-hero-content">
                  <div className="rdp-header">
                    <div className="rdp-header-text">
                      <div className="rdp-categories">
                        <span className="rdp-category-badge">{recipe.category || 'General'}</span>
                        {recipe.isVegetarian && <span className="rdp-category-badge rdp-veg">Vegetarian</span>}
                        {recipe.isVegan && <span className="rdp-category-badge rdp-vegan">Vegan</span>}
                      </div>
                      <h1>{recipe.title || 'Untitled Recipe'}</h1>
                      <p className="rdp-description">{recipe.description || 'No description available'}</p>
                    </div>

                    {isOwner && (
                        <div className="rdp-actions">
                          <Link to={`/recipes/edit/${recipe.id}`} className="rdp-action-button rdp-edit">
                            <i className="fas fa-edit"></i> Edit Recipe
                          </Link>
                          <button onClick={handleDelete} className="rdp-action-button rdp-delete">
                            <i className="fas fa-trash"></i> Delete Recipe
                          </button>
                        </div>
                    )}
                  </div>

                  <div className="rdp-meta">
                    <div className="rdp-meta-item">
                      <i className="fas fa-clock"></i>
                      <div>
                        <span className="rdp-meta-label">Prep Time</span>
                        <span className="rdp-meta-value">{recipe.prepTime || 0} min</span>
                      </div>
                    </div>

                    <div className="rdp-meta-item">
                      <i className="fas fa-fire"></i>
                      <div>
                        <span className="rdp-meta-label">Cook Time</span>
                        <span className="rdp-meta-value">{recipe.cookTime || 0} min</span>
                      </div>
                    </div>

                    <div className="rdp-meta-item">
                      <i className="fas fa-users"></i>
                      <div>
                        <span className="rdp-meta-label">Servings</span>
                        <span className="rdp-meta-value">{recipe.servings || 0}</span>
                      </div>
                    </div>

                    <div className="rdp-meta-item">
                      <i className="fas fa-utensil-spoon"></i>
                      <div>
                        <span className="rdp-meta-label">Difficulty</span>
                        <span className="rdp-meta-value">{recipe.difficulty || 'Easy'}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="rdp-body">
                <div className="rdp-ingredients">
                  <h2>
                    <i className="fas fa-shopping-basket"></i>
                    Ingredients
                  </h2>

                  {recipe.ingredients && recipe.ingredients.length > 0 ? (
                      <ul className="rdp-ingredients-list">
                        {recipe.ingredients.map((ingredient, index) => (
                            <li key={index} className="rdp-ingredient">
                              <input type="checkbox" id={`rdp-ingredient-${index}`}/>
                              <label htmlFor={`rdp-ingredient-${index}`}>
                                <span className="rdp-ingredient-amount">{ingredient.amount || ''}</span>
                                <span className="rdp-ingredient-unit">{ingredient.unit || ''}</span>
                                <span className="rdp-ingredient-name">{ingredient.name || ''}</span>
                              </label>
                            </li>
                        ))}
                      </ul>
                  ) : (
                      <p className="rdp-empty">No ingredients listed</p>
                  )}
                </div>

                <div className="rdp-instructions">
                  <h2>
                    <i className="fas fa-list-ol"></i>
                    Instructions
                  </h2>

                  {recipe.instructions ? (
                      <div className="rdp-steps">
                        {recipe.instructions.split('\n').map((step, index) => (
                            <div key={index} className="rdp-step">
                              <div className="rdp-step-number">{index + 1}</div>
                              <div className="rdp-step-content">{step}</div>
                            </div>
                        ))}
                      </div>
                  ) : (
                      <p className="rdp-empty">No instructions available</p>
                  )}
                </div>
              </div>

              <div className="rdp-footer">
                <div className="rdp-author">
                  <div className="rdp-author-avatar">
                    {authorName ? authorName.charAt(0).toUpperCase() : 'U'}
                  </div>
                  <div className="rdp-author-info">
                    <span className="rdp-posted-by">Recipe by</span>
                    <span className="rdp-author-name">{authorName || 'Unknown User'}</span>
                    {recipe.createdAt && (
                        <span className="rdp-post-date">
                Posted on {new Date(recipe.createdAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
              </span>
                    )}
                  </div>
                </div>

                <div className="rdp-nutrition">
                  <h3>
                    <i className="fas fa-chart-pie"></i>
                    Nutrition Facts
                  </h3>
                  {recipe.nutrition ? (
                      <div className="rdp-nutrition-grid">
                        <div className="rdp-nutrition-item">
                          <span className="rdp-nutrition-value">{recipe.nutrition.calories || '--'}</span>
                          <span className="rdp-nutrition-label">Calories</span>
                        </div>
                        <div className="rdp-nutrition-item">
                          <span className="rdp-nutrition-value">{recipe.nutrition.protein || '--'}g</span>
                          <span className="rdp-nutrition-label">Protein</span>
                        </div>
                        <div className="rdp-nutrition-item">
                          <span className="rdp-nutrition-value">{recipe.nutrition.carbs || '--'}g</span>
                          <span className="rdp-nutrition-label">Carbs</span>
                        </div>
                        <div className="rdp-nutrition-item">
                          <span className="rdp-nutrition-value">{recipe.nutrition.fat || '--'}g</span>
                          <span className="rdp-nutrition-label">Fat</span>
                        </div>
                      </div>
                  ) : (
                      <p className="rdp-empty">No nutrition information available</p>
                  )}
                </div>
              </div>
            </>
        )}
      </div>
      /*<div className="recipe-detail-container">
        <div className="recipe-detail-header">
          <h1>{recipe.title || 'Untitled Recipe'}</h1>
          {isOwner && (
              <div className="recipe-actions">
                <Link to={`/recipes/edit/${recipe.id}`} className="edit-button">
                  Edit Recipe
                </Link>
                <button onClick={handleDelete} className="delete-button">
                  Delete Recipe
                </button>
              </div>
          )}
        </div>

        <div className="recipe-content">
          <div className="recipe-main">
            <div className="recipe-image">
              {recipe.imageUrl ? (
                  <img src={`/api/uploads/${recipe.imageUrl}`} alt={recipe.title} />
              ) : (
                  <div className="placeholder-image">No Image</div>
              )}
            </div>

            <div className="recipe-meta-info">
              <div className="meta-item">
                <span className="meta-label">Preparation Time:</span>
                <span>{recipe.prepTime || 0} minutes</span>
              </div>
              <div className="meta-item">
                <span className="meta-label">Cooking Time:</span>
                <span>{recipe.cookTime || 0} minutes</span>
              </div>
              <div className="meta-item">
                <span className="meta-label">Servings:</span>
                <span>{recipe.servings || 0}</span>
              </div>
              <div className="meta-item">
                <span className="meta-label">Category:</span>
                <span>{recipe.category || 'Uncategorized'}</span>
              </div>
            </div>

            <div className="recipe-description">
              <h2>Description</h2>
              <p>{recipe.description || 'No description available'}</p>
            </div>

            <div className="recipe-ingredients">
              <h2>Ingredients</h2>
              {recipe.ingredients && Array.isArray(recipe.ingredients) && recipe.ingredients.length > 0 ? (
                  <ul>
                    {recipe.ingredients.map((ingredient, index) => (
                        <li key={index}>
                          {ingredient.amount || ''} {ingredient.unit || ''} {ingredient.name || ''}
                        </li>
                    ))}
                  </ul>
              ) : (
                  <p>No ingredients listed</p>
              )}
            </div>

            <div className="recipe-instructions">
              <h2>Instructions</h2>
              <div className="instructions-text">
                {recipe.instructions ? (
                    recipe.instructions.split('\n').map((step, index) => (
                        <p key={index}>{step}</p>
                    ))
                ) : (
                    <p>No instructions available</p>
                )}
              </div>
            </div>
          </div>

          <div className="recipe-sidebar">
            <div className="recipe-author">
              <h3>Recipe by</h3>
              {console.log("user : ", user)}
              <p>{authorName || 'Unknown User'}</p>
              {recipe.createdAt && (
                  <p className="recipe-date">
                    Posted on {new Date(recipe.createdAt).toLocaleDateString()}
                  </p>
              )}
            </div>
          </div>
        </div>
      </div>*/
  );
};

export default RecipeDetail;