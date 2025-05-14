import React, { useState, useEffect } from 'react';
import './RecipeForm.css';

const RECIPE_CATEGORIES = [
  'BREAKFAST',
  'LUNCH',
  'DINNER',
  'SNACK',
  'DESSERT',
  'BEVERAGE',
  'APPETIZER',
  'MAIN_COURSE',
  'SIDE_DISH',
  'SALAD',
  'SOUP',
  'OTHER',
];

const RecipeForm = ({ onSubmit, initialData }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    instructions: '',
    prepTime: '',
    cookTime: '',
    servings: '',
    category: 'MAIN_COURSE',
    ingredients: [{ name: '', amount: '', unit: '' }],
    isPublished: true,
  });

  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initialData) {
      setFormData({
        ...initialData,
        prepTime: initialData.prepTime.toString(),
        cookTime: initialData.cookTime.toString(),
        servings: initialData.servings.toString(),
      });
      if (initialData.imageUrl) {
        setImagePreview(`/api/uploads/${initialData.imageUrl}`);
      }
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleIngredientChange = (index, field, value) => {
    setFormData((prev) => {
      const newIngredients = [...prev.ingredients];
      newIngredients[index] = {
        ...newIngredients[index],
        [field]: value,
      };
      return {
        ...prev,
        ingredients: newIngredients,
      };
    });
  };

  const addIngredient = () => {
    setFormData((prev) => ({
      ...prev,
      ingredients: [...prev.ingredients, { name: '', amount: '', unit: '' }],
    }));
  };

  const removeIngredient = (index) => {
    setFormData((prev) => ({
      ...prev,
      ingredients: prev.ingredients.filter((_, i) => i !== index),
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }

    if (!formData.instructions.trim()) {
      newErrors.instructions = 'Instructions are required';
    }

    if (!formData.prepTime || isNaN(formData.prepTime) || Number(formData.prepTime) <= 0) {
      newErrors.prepTime = 'Valid preparation time is required';
    }

    if (!formData.cookTime || isNaN(formData.cookTime) || Number(formData.cookTime) <= 0) {
      newErrors.cookTime = 'Valid cooking time is required';
    }

    if (!formData.servings || isNaN(formData.servings) || Number(formData.servings) <= 0) {
      newErrors.servings = 'Valid number of servings is required';
    }

    const ingredientErrors = [];
    formData.ingredients.forEach((ingredient, index) => {
      const error = {};
      if (!ingredient.name.trim()) error.name = 'Name is required';
      if (!ingredient.amount || isNaN(ingredient.amount) || Number(ingredient.amount) <= 0) {
        error.amount = 'Valid amount is required';
      }
      if (!ingredient.unit.trim()) error.unit = 'Unit is required';
      if (Object.keys(error).length > 0) ingredientErrors[index] = error;
    });

    if (ingredientErrors.length > 0) {
      newErrors.ingredients = ingredientErrors;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      const processedData = {
        ...formData,
        prepTime: Number(formData.prepTime),
        cookTime: Number(formData.cookTime),
        servings: Number(formData.servings),
        ingredients: formData.ingredients.map(ing => ({
          ...ing,
          amount: Number(ing.amount),
        })),
      };
      onSubmit(processedData, image);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="recipe-form">
      <div className="form-group">
        <label htmlFor="title">Title</label>
        <input
          type="text"
          id="title"
          name="title"
          value={formData.title}
          onChange={handleChange}
        />
        {errors.title && <span className="error">{errors.title}</span>}
      </div>

      <div className="form-group">
        <label htmlFor="description">Description</label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows="3"
        />
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="prepTime">Prep Time (minutes)</label>
          <input
            type="number"
            id="prepTime"
            name="prepTime"
            value={formData.prepTime}
            onChange={handleChange}
            min="1"
          />
          {errors.prepTime && <span className="error">{errors.prepTime}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="cookTime">Cook Time (minutes)</label>
          <input
            type="number"
            id="cookTime"
            name="cookTime"
            value={formData.cookTime}
            onChange={handleChange}
            min="1"
          />
          {errors.cookTime && <span className="error">{errors.cookTime}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="servings">Servings</label>
          <input
            type="number"
            id="servings"
            name="servings"
            value={formData.servings}
            onChange={handleChange}
            min="1"
          />
          {errors.servings && <span className="error">{errors.servings}</span>}
        </div>
      </div>

      <div className="form-group">
        <label htmlFor="category">Category</label>
        <select
          id="category"
          name="category"
          value={formData.category}
          onChange={handleChange}
        >
          {RECIPE_CATEGORIES.map((category) => (
            <option key={category} value={category}>
              {category.replace('_', ' ')}
            </option>
          ))}
        </select>
      </div>

      <div className="form-group">
        <label>Ingredients</label>
        {formData.ingredients.map((ingredient, index) => (
          <div key={index} className="ingredient-row">
            <div className="ingredient-inputs">
              <input
                type="text"
                placeholder="Name"
                value={ingredient.name}
                onChange={(e) => handleIngredientChange(index, 'name', e.target.value)}
              />
              {errors.ingredients?.[index]?.name && (
                <span className="error">{errors.ingredients[index].name}</span>
              )}

              <input
                type="number"
                placeholder="Amount"
                value={ingredient.amount}
                onChange={(e) => handleIngredientChange(index, 'amount', e.target.value)}
                min="0.1"
                step="0.1"
              />
              {errors.ingredients?.[index]?.amount && (
                <span className="error">{errors.ingredients[index].amount}</span>
              )}

              <input
                type="text"
                placeholder="Unit"
                value={ingredient.unit}
                onChange={(e) => handleIngredientChange(index, 'unit', e.target.value)}
              />
              {errors.ingredients?.[index]?.unit && (
                <span className="error">{errors.ingredients[index].unit}</span>
              )}
            </div>

            <button
              type="button"
              onClick={() => removeIngredient(index)}
              className="remove-ingredient"
            >
              Remove
            </button>
          </div>
        ))}
        <button type="button" onClick={addIngredient} className="add-ingredient">
          Add Ingredient
        </button>
      </div>

      <div className="form-group">
        <label htmlFor="instructions">Instructions</label>
        <textarea
          id="instructions"
          name="instructions"
          value={formData.instructions}
          onChange={handleChange}
          rows="6"
        />
        {errors.instructions && <span className="error">{errors.instructions}</span>}
      </div>

      <div className="form-group">
        <label htmlFor="image">Recipe Image</label>
        <input
          type="file"
          id="image"
          accept="image/*"
          onChange={handleImageChange}
        />
        {imagePreview && (
          <div className="image-preview">
            <img src={imagePreview} alt="Recipe preview" />
          </div>
        )}
      </div>

      <div className="form-group">
        <label>
          <input
            type="checkbox"
            name="isPublished"
            checked={formData.isPublished}
            onChange={(e) => handleChange({
              target: { name: 'isPublished', value: e.target.checked },
            })}
          />
          Publish Recipe
        </label>
      </div>

      <button type="submit" className="submit-button">
        {initialData ? 'Update Recipe' : 'Create Recipe'}
      </button>
    </form>
  );
};

export default RecipeForm; 