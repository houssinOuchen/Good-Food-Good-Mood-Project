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

      <div className="recipe-detail-container">
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
      </div>
  );
};

export default RecipeDetail;