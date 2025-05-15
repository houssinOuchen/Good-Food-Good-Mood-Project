import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { recipeService } from '../services/recipeService';
import './MyRecipes.css';

const MyRecipes = () => {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    fetchRecipes();
  }, [page]);

  const fetchRecipes = async () => {
    try {
      setLoading(true);
      const response = await recipeService.getUserRecipes(page);
      setRecipes(prev => page === 0 ? response.content : [...prev, ...response.content]);
      setHasMore(!response.last);
    } catch (err) {
      setError('Failed to fetch your recipes');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this recipe?')) {
      return;
    }

    try {
      await recipeService.deleteRecipe(id);
      setRecipes(prev => prev.filter(recipe => recipe.id !== id));
    } catch (err) {
      setError('Failed to delete recipe');
      console.error(err);
    }
  };

  const loadMore = () => {
    setPage(prev => prev + 1);
  };

  return (
      <div className="my-recipes-page">
        <div className="mrp-header">
          <h1 className="mrp-title">My Recipes</h1>
          <Link to="/recipes/add" className="mrp-add-button">
            <i className="fas fa-plus"></i> Add New Recipe
          </Link>
        </div>

        {error && (
            <div className="mrp-error">
              <i className="fas fa-exclamation-circle"></i> {error}
            </div>
        )}

        <div className="mrp-grid">
          {recipes.map((recipe) => (
              <div key={recipe.id} className="mrp-card">
                <Link to={`/recipes/${recipe.id}`} className="mrp-card-link">
                  <div className="mrp-card-image">
                    {recipe.imageUrl ? (
                        <img src={`/api/uploads/${recipe.imageUrl}`} alt={recipe.title}/>
                    ) : (
                        <div className="mrp-placeholder">
                          <i className="fas fa-utensils"></i>
                        </div>
                    )}
                  </div>
                  <div className="mrp-card-body">
                    <h3 className="mrp-card-title">{recipe.title}</h3>
                    <p className="mrp-card-description">
                      {recipe.description || 'No description available'}
                    </p>
                    <div className="mrp-card-meta">
                      <div className="mrp-meta-item">
                        <i className="fas fa-clock"></i> {recipe.prepTime}min prep
                      </div>
                      <div className="mrp-meta-item">
                        <i className="fas fa-fire"></i> {recipe.cookTime}min cook
                      </div>
                      <div className="mrp-meta-item">
                        <i className="fas fa-users"></i> {recipe.servings} servings
                      </div>
                    </div>
                  </div>
                </Link>
                <div className="mrp-card-actions">
                  <Link
                      to={`/recipes/edit/${recipe.id}`}
                      className="mrp-action-btn mrp-edit-btn"
                  >
                    <i className="fas fa-edit"></i> Edit
                  </Link>
                  <button
                      onClick={() => handleDelete(recipe.id)}
                      className="mrp-action-btn mrp-delete-btn"
                  >
                    <i className="fas fa-trash"></i> Delete
                  </button>
                </div>
              </div>
          ))}
        </div>

        {loading && (
            <div className="mrp-loading">
              <div className="mrp-spinner"></div>
              <p>Loading your recipes...</p>
            </div>
        )}

        {!loading && hasMore && (
            <button onClick={loadMore} className="mrp-load-more">
              <i className="fas fa-chevron-down"></i> Load More Recipes
            </button>
        )}

        {!loading && recipes.length === 0 && (
            <div className="mrp-empty">
              <div className="mrp-empty-content">
                <i className="fas fa-book-open"></i>
                <h3>Your Recipe Book is Empty</h3>
                <p>You haven't created any recipes yet. Let's get cooking!</p>
                <Link to="/recipes/add" className="mrp-empty-btn">
                  Create Your First Recipe
                </Link>
              </div>
            </div>
        )}
      </div>
      /*<div className="recipe-list-container">
        <div className="recipe-list-header">
          <h1>My Recipes</h1>
          <Link to="/recipes/add" className="add-recipe-button">
            Add New Recipe
          </Link>
        </div>

        {error && <div className="error-message">{error}</div>}

        <div className="recipe-grid">
          {recipes.map((recipe) => (
            <div key={recipe.id} className="recipe-card">
              <Link to={`/recipes/${recipe.id}`} className="recipe-link">
                <div className="recipe-image">
                  {recipe.imageUrl ? (
                    <img
                      src={`/api/uploads/${recipe.imageUrl}`}
                      alt={recipe.title}
                    />
                  ) : (
                    <div className="placeholder-image">No Image</div>
                  )}
                </div>
                <div className="recipe-info">
                  <h3>{recipe.title}</h3>
                  <p className="recipe-description">{recipe.description}</p>
                  <div className="recipe-meta">
                    <span>Prep: {recipe.prepTime}min</span>
                    <span>Cook: {recipe.cookTime}min</span>
                    <span>Servings: {recipe.servings}</span>
                  </div>
                </div>
              </Link>
              <div className="recipe-actions">
                <Link
                  to={`/recipes/edit/${recipe.id}`}
                  className="edit-button"
                >
                  Edit
                </Link>
                <button
                  onClick={() => handleDelete(recipe.id)}
                  className="delete-button"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>

        {loading && <div className="loading">Loading...</div>}

        {!loading && hasMore && (
          <button onClick={loadMore} className="load-more-button">
            Load More
          </button>
        )}

        {!loading && recipes.length === 0 && (
          <div className="no-recipes">
            You haven't created any recipes yet.{' '}
            <Link to="/recipes/add">Create your first recipe</Link>
          </div>
        )}
      </div>*/
  );
};

export default MyRecipes; 