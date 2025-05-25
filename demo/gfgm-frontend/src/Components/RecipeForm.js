import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
//import './RecipeForm.css';

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
    calories: '',
    protein: '',
    carbs: '',
    fat: '',
    fiber: '',
    sugar: ''
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
        calories: Number(formData.calories) || 0,
        protein: Number(formData.protein) || 0,
        carbs: Number(formData.carbs) || 0,
        fat: Number(formData.fat) || 0,
        fiber: Number(formData.fiber) || 0,
        sugar: Number(formData.sugar) || 0,
        ingredients: formData.ingredients.map(ing => ({
          ...ing,
          amount: Number(ing.amount),
        })),
      };
      onSubmit(processedData, image);
    }
  };

  return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100 py-12">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-200">
            <div className="px-8 py-12">
              {/* Header */}
              <div className="text-center mb-12">
                <div
                    className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl mb-6">
                  <i className="fas fa-utensils text-2xl text-white"></i>
                </div>
                <h1 className="text-4xl lg:text-5xl font-bold text-slate-900 mb-4">
                  {initialData ? "Edit Recipe" : "Create New Recipe"}
                </h1>
                <p className="text-xl text-slate-600 max-w-2xl mx-auto">
                  {initialData
                      ? "Update your recipe details and share your improvements"
                      : "Share your delicious creation with our fitness community"}
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-12">
                {/* Basic Information Section */}
                <div className="bg-gradient-to-br from-slate-50 to-white rounded-2xl p-8 border border-slate-100">
                  <h2 className="text-2xl font-bold text-slate-900 mb-8 flex items-center">
                    <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center mr-4">
                      <i className="fas fa-info-circle text-emerald-600"></i>
                    </div>
                    Basic Information
                  </h2>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div className="space-y-2">
                      <label htmlFor="title" className="block text-sm font-semibold text-slate-700">
                        Recipe Title *
                      </label>
                      <input
                          type="text"
                          id="title"
                          name="title"
                          value={formData.title}
                          onChange={handleChange}
                          placeholder="e.g. High-Protein Chicken Bowl"
                          className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200 text-lg"
                      />
                      {errors.title && <p className="text-sm text-red-600 font-medium">{errors.title}</p>}
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="category" className="block text-sm font-semibold text-slate-700">
                        Category *
                      </label>
                      <select
                          id="category"
                          name="category"
                          value={formData.category}
                          onChange={handleChange}
                          className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200 text-lg"
                      >
                        <option value="">Select a category</option>
                        {RECIPE_CATEGORIES.map((category) => (
                            <option key={category} value={category}>
                              {category}
                            </option>
                        ))}
                      </select>
                      {errors.category && <p className="text-sm text-red-600 font-medium">{errors.category}</p>}
                    </div>
                  </div>

                  <div className="mt-8 space-y-2">
                    <label htmlFor="description" className="block text-sm font-semibold text-slate-700">
                      Description *
                    </label>
                    <textarea
                        id="description"
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        placeholder="Tell us about your recipe and what makes it special..."
                        rows={4}
                        className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200 text-lg resize-none"
                    />
                    {errors.description && <p className="text-sm text-red-600 font-medium">{errors.description}</p>}
                  </div>
                </div>

                {/* Time & Servings Section */}
                <div className="bg-gradient-to-br from-blue-50 to-white rounded-2xl p-8 border border-slate-100">
                  <h2 className="text-2xl font-bold text-slate-900 mb-8 flex items-center">
                    <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center mr-4">
                      <i className="fas fa-clock text-blue-600"></i>
                    </div>
                    Time & Servings
                  </h2>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="space-y-2">
                      <label htmlFor="prepTime" className="block text-sm font-semibold text-slate-700">
                        Prep Time (minutes) *
                      </label>
                      <input
                          type="number"
                          id="prepTime"
                          name="prepTime"
                          value={formData.prepTime}
                          onChange={handleChange}
                          min="1"
                          placeholder="15"
                          className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-lg"
                      />
                      {errors.prepTime && <p className="text-sm text-red-600 font-medium">{errors.prepTime}</p>}
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="cookTime" className="block text-sm font-semibold text-slate-700">
                        Cook Time (minutes) *
                      </label>
                      <input
                          type="number"
                          id="cookTime"
                          name="cookTime"
                          value={formData.cookTime}
                          onChange={handleChange}
                          min="1"
                          placeholder="25"
                          className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-lg"
                      />
                      {errors.cookTime && <p className="text-sm text-red-600 font-medium">{errors.cookTime}</p>}
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="servings" className="block text-sm font-semibold text-slate-700">
                        Servings *
                      </label>
                      <input
                          type="number"
                          id="servings"
                          name="servings"
                          value={formData.servings}
                          onChange={handleChange}
                          min="1"
                          placeholder="4"
                          className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-lg"
                      />
                      {errors.servings && <p className="text-sm text-red-600 font-medium">{errors.servings}</p>}
                    </div>
                  </div>
                </div>

                {/* Ingredients Section */}
                <div className="bg-gradient-to-br from-emerald-50 to-white rounded-2xl p-8 border border-slate-100">
                  <h2 className="text-2xl font-bold text-slate-900 mb-8 flex items-center">
                    <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center mr-4">
                      <i className="fas fa-shopping-basket text-emerald-600"></i>
                    </div>
                    Ingredients
                  </h2>

                  <div className="space-y-6">
                    {formData.ingredients.map((ingredient, index) => (
                        <div
                            key={index}
                            className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-end p-4 bg-white rounded-xl border border-slate-200"
                        >
                          <div className="lg:col-span-5 space-y-2">
                            <label className="block text-sm font-semibold text-slate-700">Ingredient Name *</label>
                            <input
                                type="text"
                                value={ingredient.name}
                                onChange={(e) => handleIngredientChange(index, "name", e.target.value)}
                                placeholder="e.g. Chicken breast"
                                className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200"
                            />
                            {errors.ingredients?.[index]?.name && (
                                <p className="text-sm text-red-600 font-medium">{errors.ingredients[index].name}</p>
                            )}
                          </div>

                          <div className="lg:col-span-3 space-y-2">
                            <label className="block text-sm font-semibold text-slate-700">Amount *</label>
                            <input
                                type="number"
                                value={ingredient.amount}
                                onChange={(e) => handleIngredientChange(index, "amount", e.target.value)}
                                placeholder="2"
                                min="0"
                                step="0.1"
                                className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200"
                            />
                            {errors.ingredients?.[index]?.amount && (
                                <p className="text-sm text-red-600 font-medium">{errors.ingredients[index].amount}</p>
                            )}
                          </div>

                          <div className="lg:col-span-3 space-y-2">
                            <label className="block text-sm font-semibold text-slate-700">Unit *</label>
                            <input
                                type="text"
                                value={ingredient.unit}
                                onChange={(e) => handleIngredientChange(index, "unit", e.target.value)}
                                placeholder="cups"
                                className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200"
                            />
                            {errors.ingredients?.[index]?.unit && (
                                <p className="text-sm text-red-600 font-medium">{errors.ingredients[index].unit}</p>
                            )}
                          </div>

                          <div className="lg:col-span-1 flex justify-center">
                            {index > 0 && (
                                <button
                                    type="button"
                                    onClick={() => removeIngredient(index)}
                                    className="w-12 h-12 flex items-center justify-center text-red-600 hover:text-red-800 hover:bg-red-50 rounded-xl transition-all duration-200"
                                >
                                  <i className="fas fa-trash"></i>
                                </button>
                            )}
                          </div>
                        </div>
                    ))}

                    <button
                        type="button"
                        onClick={addIngredient}
                        className="inline-flex items-center px-6 py-3 text-emerald-700 bg-emerald-100 hover:bg-emerald-200 rounded-xl font-semibold transition-all duration-200 hover:shadow-md"
                    >
                      <i className="fas fa-plus mr-2"></i>
                      Add Ingredient
                    </button>
                  </div>
                </div>

                {/* Instructions Section */}
                <div className="bg-gradient-to-br from-purple-50 to-white rounded-2xl p-8 border border-slate-100">
                  <h2 className="text-2xl font-bold text-slate-900 mb-8 flex items-center">
                    <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center mr-4">
                      <i className="fas fa-list-ol text-purple-600"></i>
                    </div>
                    Instructions
                  </h2>

                  <div className="space-y-2">
                    <label htmlFor="instructions" className="block text-sm font-semibold text-slate-700">
                      Step by Step Instructions *
                    </label>
                    <textarea
                        id="instructions"
                        name="instructions"
                        value={formData.instructions}
                        onChange={handleChange}
                        placeholder="1. Heat oil in a large pan over medium heat...&#10;2. Season chicken with salt and pepper...&#10;3. Cook chicken for 6-7 minutes per side..."
                        rows={8}
                        className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200 text-lg resize-none"
                    />
                    {errors.instructions && <p className="text-sm text-red-600 font-medium">{errors.instructions}</p>}
                    <p className="text-sm text-slate-500">Separate each step with a new line for better readability</p>
                  </div>
                </div>

                {/* Nutritional Information Section */}
                <div className="bg-gradient-to-br from-orange-50 to-white rounded-2xl p-8 border border-slate-100">
                  <h2 className="text-2xl font-bold text-slate-900 mb-8 flex items-center">
                    <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center mr-4">
                      <i className="fas fa-chart-pie text-orange-600"></i>
                    </div>
                    Nutritional Information
                    <span className="ml-3 text-sm font-normal text-slate-500">(per serving)</span>
                  </h2>

                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
                    {[
                      {name: "calories", label: "Calories", icon: "fas fa-fire-alt", color: "orange"},
                      {name: "protein", label: "Protein (g)", icon: "fas fa-drumstick-bite", color: "red"},
                      {name: "carbs", label: "Carbs (g)", icon: "fas fa-bread-slice", color: "yellow"},
                      {name: "fat", label: "Fat (g)", icon: "fas fa-cheese", color: "purple"},
                      {name: "fiber", label: "Fiber (g)", icon: "fas fa-leaf", color: "green"},
                      {name: "sugar", label: "Sugar (g)", icon: "fas fa-candy-cane", color: "pink"},
                    ].map(({name, label, icon, color}) => (
                        <div key={name} className="space-y-2">
                          <label htmlFor={name}
                                 className="block text-sm font-semibold text-slate-700 flex items-center">
                            <i className={`${icon} mr-2 text-${color}-500`}></i>
                            {label}
                          </label>
                          <input
                              type="number"
                              id={name}
                              name={name}
                              value={formData[name]}
                              onChange={handleChange}
                              min="0"
                              step="0.1"
                              placeholder="0"
                              className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200"
                          />
                        </div>
                    ))}
                  </div>
                </div>

                {/* Image Upload Section */}
                <div className="bg-gradient-to-br from-slate-50 to-white rounded-2xl p-8 border border-slate-100">
                  <h2 className="text-2xl font-bold text-slate-900 mb-8 flex items-center">
                    <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center mr-4">
                      <i className="fas fa-camera text-slate-600"></i>
                    </div>
                    Recipe Image
                  </h2>

                  <div className="relative">
                    <div
                        className="flex justify-center px-6 pt-8 pb-8 border-2 border-dashed border-slate-300 rounded-2xl hover:border-emerald-400 transition-colors duration-200">
                      <div className="space-y-4 text-center">
                        {imagePreview ? (
                            <div className="mb-6">
                              <img
                                  src={imagePreview || "/placeholder.svg"}
                                  alt="Preview"
                                  className="mx-auto h-48 w-48 object-cover rounded-2xl shadow-lg"
                              />
                            </div>
                        ) : (
                            <div
                                className="w-24 h-24 mx-auto bg-slate-100 rounded-2xl flex items-center justify-center mb-6">
                              <i className="fas fa-image text-3xl text-slate-400"></i>
                            </div>
                        )}
                        <div className="flex flex-col items-center">
                          <label
                              htmlFor="image-upload"
                              className="cursor-pointer inline-flex items-center px-6 py-3 bg-emerald-600 text-white rounded-xl font-semibold hover:bg-emerald-700 transition-all duration-200 shadow-md hover:shadow-lg"
                          >
                            <i className="fas fa-upload mr-2"></i>
                            {imagePreview ? "Change Image" : "Upload Image"}
                            <input
                                id="image-upload"
                                name="image"
                                type="file"
                                accept="image/*"
                                onChange={handleImageChange}
                                className="sr-only"
                            />
                          </label>
                          <p className="mt-2 text-sm text-slate-500">or drag and drop</p>
                        </div>
                        <p className="text-xs text-slate-400">PNG, JPG, GIF up to 10MB</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Submit Buttons */}
                <div className="flex flex-col sm:flex-row justify-end gap-4 pt-8">
                  <Link
                      to="/recipes"
                      className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-slate-700 bg-white border-2 border-slate-300 rounded-2xl hover:border-slate-400 hover:bg-slate-50 transition-all duration-200"
                  >
                    Cancel
                  </Link>
                  <button
                      type="submit"
                      className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-white bg-gradient-to-r from-emerald-600 to-emerald-700 rounded-2xl shadow-lg hover:shadow-xl hover:from-emerald-700 hover:to-emerald-800 transition-all duration-300 transform hover:-translate-y-1"
                  >
                    <i className="fas fa-save mr-3"></i>
                    {initialData ? "Update Recipe" : "Create Recipe"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
  );
};

export default RecipeForm; 