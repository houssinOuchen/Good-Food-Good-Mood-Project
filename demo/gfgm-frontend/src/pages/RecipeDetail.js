"use client"

import { useState, useEffect } from "react"
import { useParams, useNavigate, Link } from "react-router-dom"
import { recipeService } from "../services/recipeService"
import { useAuth } from "../context/AuthContext"
import DeleteConfirmModal from "../Components/DeleteConfirmModal"

const RecipeDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const [recipe, setRecipe] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  useEffect(() => {
    fetchRecipe()
  }, [id])

  const fetchRecipe = async () => {
    try {
      setLoading(true)
      const data = await recipeService.getRecipeById(id)
      setRecipe(data)
    } catch (err) {
      setError("Failed to fetch recipe")
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteConfirm = () => {
    setShowDeleteConfirm(true)
  }

  const handleDeleteCancel = () => {
    setShowDeleteConfirm(false)
  }

  const handleDeleteExecute = async () => {
    try {
      await recipeService.deleteRecipe(id)
      navigate("/my-recipes")
    } catch (err) {
      setError("Failed to delete recipe")
      console.error(err)
      setShowDeleteConfirm(false)
    }
  }

  if (loading) {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-white rounded-2xl shadow-lg mb-6">
              <div className="animate-spin rounded-full h-8 w-8 border-2 border-emerald-600 border-t-transparent"></div>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Loading Recipe</h3>
            <p className="text-gray-600">Preparing something delicious for you...</p>
          </div>
        </div>
    )
  }

  if (error) {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
          <div className="max-w-md w-full mx-4">
            <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-6">
                <i className="fas fa-exclamation-triangle text-2xl text-red-600"></i>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Oops! Something went wrong</h3>
              <p className="text-gray-600 mb-6">{error}</p>
              <Link
                  to="/recipes"
                  className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-emerald-600 to-emerald-700 text-white rounded-xl hover:from-emerald-700 hover:to-emerald-800 font-medium shadow-md hover:shadow-lg transition-all duration-200"
              >
                <i className="fas fa-arrow-left mr-2"></i>
                Back to Recipes
              </Link>
            </div>
          </div>
        </div>
    )
  }

  if (!recipe) {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
          <div className="max-w-md w-full mx-4">
            <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gray-100 rounded-full mb-6">
                <i className="fas fa-utensils text-3xl text-gray-400"></i>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Recipe Not Found</h3>
              <p className="text-gray-600 mb-8">
                The recipe you're looking for doesn't exist or has been removed from our kitchen.
              </p>
              <Link
                  to="/recipes"
                  className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-emerald-600 to-emerald-700 text-white rounded-xl hover:from-emerald-700 hover:to-emerald-800 font-semibold shadow-md hover:shadow-lg transition-all duration-200"
              >
                <i className="fas fa-arrow-left mr-2"></i>
                Browse All Recipes
              </Link>
            </div>
          </div>
        </div>
    )
  }

  const isOwner = user && recipe.author && user.id === recipe.author.id
  const authorName = recipe.author?.username || "Unknown User"

  return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        {/* Hero Section */}
        <div className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {/* Image Section */}
              <div className="relative">
                <div className="aspect-w-16 aspect-h-12 rounded-2xl overflow-hidden shadow-xl">
                  {recipe.imageUrl ? (
                      <img
                          src={`/api/uploads/${recipe.imageUrl}`}
                          alt={recipe.title}
                          className="w-full h-96 object-cover"
                      />
                  ) : (
                      <div className="w-full h-96 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                        <i className="fas fa-utensils text-6xl text-gray-400"></i>
                      </div>
                  )}
                </div>
              </div>

              {/* Content Section */}
              <div className="flex flex-col justify-between">
                <div>
                  <div className="flex flex-wrap gap-3 mb-6">
                  <span className="inline-flex items-center px-4 py-2 bg-emerald-100 text-emerald-800 rounded-full text-sm font-semibold">
                    {recipe.category || "General"}
                  </span>
                    {recipe.isVegetarian && (
                        <span className="inline-flex items-center px-4 py-2 bg-green-100 text-green-800 rounded-full text-sm font-semibold">
                      🌱 Vegetarian
                    </span>
                    )}
                    {recipe.isVegan && (
                        <span className="inline-flex items-center px-4 py-2 bg-green-100 text-green-800 rounded-full text-sm font-semibold">
                      🌿 Vegan
                    </span>
                    )}
                  </div>

                  <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6 leading-tight">
                    {recipe.title || "Untitled Recipe"}
                  </h1>
                  <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                    {recipe.description || "No description available"}
                  </p>

                  {isOwner && (
                      <div className="flex flex-wrap gap-4 mb-8">
                        <Link
                            to={`/recipes/edit/${recipe.id}`}
                            className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 font-medium shadow-md hover:shadow-lg transition-all duration-200"
                        >
                          <i className="fas fa-edit mr-2"></i>
                          Edit Recipe
                        </Link>
                        <button
                            onClick={handleDeleteConfirm}
                            className="inline-flex items-center px-6 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 font-medium shadow-md hover:shadow-lg transition-all duration-200"
                        >
                          <i className="fas fa-trash mr-2"></i>
                          Delete Recipe
                        </button>
                      </div>
                  )}
                </div>

                {/* Meta Information */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-xl">
                    <div className="flex items-center text-blue-600 mb-2">
                      <i className="fas fa-clock mr-2"></i>
                      <span className="text-sm font-semibold">Prep Time</span>
                    </div>
                    <p className="text-2xl font-bold text-blue-700">{recipe.prepTime || 0} min</p>
                  </div>

                  <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-4 rounded-xl">
                    <div className="flex items-center text-orange-600 mb-2">
                      <i className="fas fa-fire mr-2"></i>
                      <span className="text-sm font-semibold">Cook Time</span>
                    </div>
                    <p className="text-2xl font-bold text-orange-700">{recipe.cookTime || 0} min</p>
                  </div>

                  <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-xl">
                    <div className="flex items-center text-purple-600 mb-2">
                      <i className="fas fa-users mr-2"></i>
                      <span className="text-sm font-semibold">Servings</span>
                    </div>
                    <p className="text-2xl font-bold text-purple-700">{recipe.servings || 0}</p>
                  </div>

                  <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 p-4 rounded-xl">
                    <div className="flex items-center text-emerald-600 mb-2">
                      <i className="fas fa-utensil-spoon mr-2"></i>
                      <span className="text-sm font-semibold">Difficulty</span>
                    </div>
                    <p className="text-2xl font-bold text-emerald-700">{recipe.difficulty || "Easy"}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Ingredients Section */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl shadow-xl p-8 sticky top-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-8 flex items-center">
                  <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center mr-3">
                    <i className="fas fa-shopping-basket text-emerald-600"></i>
                  </div>
                  Ingredients
                </h2>

                {recipe.ingredients && recipe.ingredients.length > 0 ? (
                    <ul className="space-y-4">
                      {recipe.ingredients.map((ingredient, index) => (
                          <li key={index} className="flex items-start group">
                            <input
                                type="checkbox"
                                id={`ingredient-${index}`}
                                className="mt-1.5 h-5 w-5 text-emerald-600 focus:ring-emerald-500 border-gray-300 rounded transition-colors duration-200"
                            />
                            <label
                                htmlFor={`ingredient-${index}`}
                                className="ml-4 text-gray-700 cursor-pointer group-hover:text-gray-900 transition-colors duration-200"
                            >
                        <span className="font-semibold text-emerald-600">
                          {ingredient.amount || ""} {ingredient.unit || ""}
                        </span>
                              <span className="ml-2">{ingredient.name || ""}</span>
                            </label>
                          </li>
                      ))}
                    </ul>
                ) : (
                    <p className="text-gray-500 text-center py-8">No ingredients listed</p>
                )}
              </div>
            </div>

            {/* Instructions Section */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-2xl shadow-xl p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-8 flex items-center">
                  <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center mr-3">
                    <i className="fas fa-list-ol text-blue-600"></i>
                  </div>
                  Instructions
                </h2>

                {recipe.instructions ? (
                    <div className="space-y-8">
                      {recipe.instructions.split("\n").map((step, index) => (
                          <div key={index} className="flex group">
                            <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-full flex items-center justify-center text-white font-bold shadow-md">
                              {index + 1}
                            </div>
                            <div className="ml-6 text-gray-700 text-lg leading-relaxed group-hover:text-gray-900 transition-colors duration-200">
                              {step}
                            </div>
                          </div>
                      ))}
                    </div>
                ) : (
                    <p className="text-gray-500 text-center py-8">No instructions available</p>
                )}
              </div>
            </div>
          </div>

          {/* Author and Nutrition Section */}
          <div className="mt-12 grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Author Info */}
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Recipe Creator</h3>
              <div className="flex items-center">
                <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl flex items-center justify-center text-white text-2xl font-bold shadow-lg">
                  {authorName.charAt(0).toUpperCase()}
                </div>
                <div className="ml-6">
                  <p className="text-sm text-gray-500 font-medium">Created by</p>
                  <p className="text-2xl font-bold text-gray-900">{authorName}</p>
                  {recipe.createdAt && (
                      <p className="text-sm text-gray-500 mt-1">
                        Posted on{" "}
                        {new Date(recipe.createdAt).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </p>
                  )}
                </div>
              </div>
            </div>

            {/* Nutrition Facts */}
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center mr-3">
                  <i className="fas fa-chart-pie text-orange-600"></i>
                </div>
                Nutrition Facts
              </h3>
              <div className="grid grid-cols-2 gap-6">
                <div className="text-center p-4 bg-orange-50 rounded-xl">
                  <p className="text-3xl font-bold text-orange-600">{recipe.calories || "--"}</p>
                  <p className="text-sm font-semibold text-gray-600 mt-1">Calories</p>
                </div>
                <div className="text-center p-4 bg-red-50 rounded-xl">
                  <p className="text-3xl font-bold text-red-600">{recipe.protein || "--"}g</p>
                  <p className="text-sm font-semibold text-gray-600 mt-1">Protein</p>
                </div>
                <div className="text-center p-4 bg-yellow-50 rounded-xl">
                  <p className="text-3xl font-bold text-yellow-600">{recipe.carbs || "--"}g</p>
                  <p className="text-sm font-semibold text-gray-600 mt-1">Carbs</p>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-xl">
                  <p className="text-3xl font-bold text-purple-600">{recipe.fat || "--"}g</p>
                  <p className="text-sm font-semibold text-gray-600 mt-1">Fat</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Delete Confirmation Modal */}
        <DeleteConfirmModal
            show={showDeleteConfirm}
            onConfirm={handleDeleteExecute}
            onCancel={handleDeleteCancel}
            title="Delete Recipe"
            message={`Are you sure you want to delete "${recipe?.title}"? This action cannot be undone and the recipe will be permanently removed from your collection.`}
            itemType="recipe"
        />
      </div>
  )
}

export default RecipeDetail
