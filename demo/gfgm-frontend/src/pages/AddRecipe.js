import React, {useEffect, useState} from 'react';
import { useNavigate } from 'react-router-dom';
import { recipeService } from '../services/recipeService';
import RecipeForm from '../Components/RecipeForm';

const AddRecipe = () => {
  const navigate = useNavigate();
  const [error, setError] = useState('');

  useEffect(() => {
    const storedAuth = localStorage.getItem('user');
    if(!storedAuth){
      navigate("/login");
    }
  }, [navigate]);

  const handleSubmit = async (formData, image) => {
    try {
      const recipe = await recipeService.createRecipe(formData, image);
      console.log("Loaded recipes:", recipe);
      if (recipe && recipe.id) {
        navigate(`/recipes/${recipe.id}`);
      } else {
        setError('Recipe created but no ID was returned');
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to create recipe');
      console.error(err);
    }
  };

  return (
    <div className="recipe-form-container">
      <h1>Add New Recipe</h1>
      {error && <div className="error-message">{error}</div>}
      <RecipeForm onSubmit={handleSubmit} />
    </div>
  );
};

export default AddRecipe; 