import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { recipeService } from '../services/recipeService';
import RecipeForm from '../Components/RecipeForm';
import '../Components/RecipeForm.css';

const EditRecipe = () => {
  const { id } = useParams();
  const navigate = useNavigate();
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
    } catch (err) {
      setError('Failed to fetch recipe');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (formData, image) => {
    try {
      const updatedRecipe = await recipeService.updateRecipe(id, formData, image);
      navigate(`/recipes/${updatedRecipe.id}`);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to update recipe');
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

  return (
    <div className="recipe-form-container">
      <h1>Edit Recipe</h1>
      {error && <div className="error-message">{error}</div>}
      <RecipeForm onSubmit={handleSubmit} initialData={recipe} />
    </div>
  );
};

export default EditRecipe; 