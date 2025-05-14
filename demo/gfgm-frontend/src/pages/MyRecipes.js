import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { recipeService } from '../services/recipeService';
import './RecipeList.css';

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
    <div className="recipe-list-container">
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
    </div>
  );
};

export default MyRecipes; 