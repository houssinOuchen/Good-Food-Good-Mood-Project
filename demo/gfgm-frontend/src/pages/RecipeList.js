"use client"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { recipeService } from "../services/recipeService"
import { useAuth } from "../context/AuthContext"
import DeleteConfirmModal from "../Components/DeleteConfirmModal"

const RecipeList = () => {
  const [recipes, setRecipes] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [searchQuery, setSearchQuery] = useState("")
  const [page, setPage] = useState(0)
  const [hasMore, setHasMore] = useState(true)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState({ show: false, recipeId: null, recipeTitle: "" })
  const { user } = useAuth()

  useEffect(() => {
    fetchRecipes()
  }, [page])

  const fetchRecipes = async () => {
    try {
      setLoading(true)
      const response = await (searchQuery
          ? recipeService.searchRecipes(searchQuery, page)
          : recipeService.getAllRecipes(page))

      const recipeData = response.content || []
      setRecipes((prev) => (page === 0 ? recipeData : [...prev, ...recipeData]))
      setHasMore(!response.last)
    } catch (err) {
      setError("Failed to fetch recipes")
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = (e) => {
    e.preventDefault()
    setPage(0)
    fetchRecipes()
  }

  const handleDeleteConfirm = (recipeId, recipeTitle) => {
    setShowDeleteConfirm({ show: true, recipeId, recipeTitle })
  }

  const handleDeleteCancel = () => {
    setShowDeleteConfirm({ show: false, recipeId: null, recipeTitle: "" })
  }

  const handleDeleteExecute = async () => {
    try {
      await recipeService.deleteRecipe(showDeleteConfirm.recipeId)
      setRecipes((prev) => prev.filter((recipe) => recipe.id !== showDeleteConfirm.recipeId))
      setShowDeleteConfirm({ show: false, recipeId: null, recipeTitle: "" })
    } catch (err) {
      setError("Failed to delete recipe")
      console.error(err)
      setShowDeleteConfirm({ show: false, recipeId: null, recipeTitle: "" })
    }
  }

  const loadMore = () => {
    setPage((prev) => prev + 1)
  }

  return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Header Section */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl mb-6 shadow-lg">
              <i className="fas fa-utensils text-2xl text-white"></i>
            </div>
            <h1 className="text-5xl font-bold text-gray-900 mb-4 bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
              Discover Recipes
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
              Find healthy meals to fuel your fitness journey and achieve your goals
            </p>
          </div>

          {/* Search Section */}
          <div className="mb-12">
            <form onSubmit={handleSearch} className="max-w-3xl mx-auto">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <i className="fas fa-search text-gray-400 text-lg"></i>
                </div>
                <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search for recipes, ingredients, or nutrition goals..."
                    className="block w-full pl-12 pr-32 py-4 text-lg border border-gray-200 rounded-2xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-white shadow-sm placeholder-gray-400 transition-all duration-200"
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-2">
                  <button
                      type="submit"
                      className="px-8 py-2.5 bg-gradient-to-r from-emerald-600 to-emerald-700 text-white rounded-xl hover:from-emerald-700 hover:to-emerald-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 font-medium shadow-md hover:shadow-lg transition-all duration-200"
                  >
                    Search
                  </button>
                </div>
              </div>
            </form>

            {/* Filter Buttons */}
            <div className="flex flex-wrap justify-center gap-3 mt-8">
              {["All", "Breakfast", "Lunch", "Dinner", "Snacks"].map((filter) => (
                  <button
                      key={filter}
                      className={`px-6 py-3 rounded-full text-sm font-semibold transition-all duration-200 ${
                          filter === "All"
                              ? "bg-gradient-to-r from-emerald-600 to-emerald-700 text-white shadow-md hover:shadow-lg"
                              : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-200 hover:border-gray-300 shadow-sm"
                      }`}
                  >
                    {filter}
                  </button>
              ))}
            </div>
          </div>

          {/* Error Message */}
          {error && (
              <div className="max-w-2xl mx-auto mb-8">
                <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                  <div className="flex items-center text-red-700">
                    <div className="flex-shrink-0">
                      <i className="fas fa-exclamation-circle text-lg"></i>
                    </div>
                    <div className="ml-3">
                      <p className="font-medium">{error}</p>
                    </div>
                  </div>
                </div>
              </div>
          )}

          {/* Recipe Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {Array.isArray(recipes) && recipes.length > 0 ? (
                recipes.map((recipe, index) => (
                    <div
                        key={recipe?.id || index}
                        className="group bg-white rounded-2xl shadow-sm hover:shadow-xl overflow-hidden transition-all duration-300 border border-gray-100"
                    >
                      <div className="relative overflow-hidden">
                        {recipe?.imageUrl ? (
                            <img
                                src={`/api/uploads/${recipe.imageUrl}`}
                                alt={recipe?.title || "Recipe"}
                                className="w-full h-56 object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                        ) : (
                            <div className="w-full h-56 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                              <i className="fas fa-utensils text-5xl text-gray-400"></i>
                            </div>
                        )}

                        <div className="absolute top-4 right-4">
                    <span className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold bg-emerald-600 text-white shadow-lg">
                      {recipe?.category || "General"}
                    </span>
                        </div>

                        {user && recipe?.author && (user.id === recipe.author.id || user.role === "ADMIN") && (
                            <div className="absolute top-4 left-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                              <Link
                                  to={`/recipes/edit/${recipe.id}`}
                                  className="inline-flex items-center justify-center w-10 h-10 bg-white/95 backdrop-blur-sm text-emerald-600 rounded-full hover:bg-white transition-all duration-200 shadow-lg hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
                                  title="Edit Recipe"
                              >
                                <i className="fas fa-edit text-sm"></i>
                              </Link>
                              <button
                                  onClick={(e) => {
                                    e.preventDefault()
                                    handleDeleteConfirm(recipe.id, recipe.title)
                                  }}
                                  className="inline-flex items-center justify-center w-10 h-10 bg-white/95 backdrop-blur-sm text-red-600 rounded-full hover:bg-white transition-all duration-200 shadow-lg hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                                  title="Delete Recipe"
                              >
                                <i className="fas fa-trash text-sm"></i>
                              </button>
                            </div>
                        )}
                      </div>

                      <Link to={`/recipes/${recipe?.id || index}`} className="block">
                        <div className="p-6">
                          <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-emerald-600 transition-colors duration-200 line-clamp-2">
                            {recipe?.title || "Untitled Recipe"}
                          </h3>
                          <p className="text-gray-600 mb-6 line-clamp-2 leading-relaxed">
                            {recipe?.description || "No description available"}
                          </p>

                          <div className="flex justify-between items-center text-sm text-gray-500 mb-6 pb-4 border-b border-gray-100">
                            <div className="flex items-center space-x-1">
                              <i className="fas fa-clock text-emerald-600"></i>
                              <span className="font-medium">{recipe?.prepTime + recipe?.cookTime || 0} min</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <i className="fas fa-user-friends text-blue-600"></i>
                              <span className="font-medium">{recipe?.servings || 0} servings</span>
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-4">
                            <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
                              <div className="flex items-center space-x-2">
                                <i className="fas fa-fire-alt text-orange-500"></i>
                                <span className="text-xs font-medium text-gray-600">Calories</span>
                              </div>
                              <span className="font-bold text-orange-600">{recipe.calories || 0}</span>
                            </div>
                            <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                              <div className="flex items-center space-x-2">
                                <i className="fas fa-drumstick-bite text-red-500"></i>
                                <span className="text-xs font-medium text-gray-600">Protein</span>
                              </div>
                              <span className="font-bold text-red-600">{recipe.protein || 0}g</span>
                            </div>
                            <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                              <div className="flex items-center space-x-2">
                                <i className="fas fa-bread-slice text-yellow-500"></i>
                                <span className="text-xs font-medium text-gray-600">Carbs</span>
                              </div>
                              <span className="font-bold text-yellow-600">{recipe.carbs || 0}g</span>
                            </div>
                            <div className="flex items-center justify-between p-3 bg-amber-50 rounded-lg">
                              <div className="flex items-center space-x-2">
                                <i className="fas fa-cheese text-amber-500"></i>
                                <span className="text-xs font-medium text-gray-600">Fat</span>
                              </div>
                              <span className="font-bold text-amber-600">{recipe.fat || 0}g</span>
                            </div>
                          </div>
                        </div>
                      </Link>
                    </div>
                ))
            ) : (
                <div className="col-span-full text-center py-20">
                  <div className="inline-flex items-center justify-center w-20 h-20 bg-gray-100 rounded-full mb-6">
                    <i className="fas fa-utensils text-3xl text-gray-400"></i>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">No recipes found</h3>
                  <p className="text-gray-500">Try adjusting your search or filters to find what you're looking for.</p>
                </div>
            )}
          </div>

          {/* Load More Button */}
          {hasMore && !loading && (
              <div className="text-center mt-12">
                <button
                    onClick={loadMore}
                    className="px-8 py-4 bg-gradient-to-r from-emerald-600 to-emerald-700 text-white rounded-xl hover:from-emerald-700 hover:to-emerald-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 font-semibold shadow-md hover:shadow-lg transition-all duration-200"
                >
                  Load More Recipes
                </button>
              </div>
          )}

          {/* Loading State */}
          {loading && (
              <div className="text-center py-12">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-emerald-100 rounded-full">
                  <div className="animate-spin rounded-full h-6 w-6 border-2 border-emerald-600 border-t-transparent"></div>
                </div>
                <p className="mt-4 text-gray-600 font-medium">Loading delicious recipes...</p>
              </div>
          )}
        </div>

        {/* Delete Confirmation Modal */}
        <DeleteConfirmModal
            show={showDeleteConfirm.show}
            onConfirm={handleDeleteExecute}
            onCancel={handleDeleteCancel}
            title="Delete Recipe"
            message={`Are you sure you want to delete "${showDeleteConfirm.recipeTitle}"? This action cannot be undone and the recipe will be permanently removed from your collection.`}
            itemType="recipe"
        />
      </div>
  )
}

export default RecipeList
