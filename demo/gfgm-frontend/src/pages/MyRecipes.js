import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { recipeService } from '../services/recipeService';

const MyRecipes = () => {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchRecipes();
  }, [page]);

  useEffect(() => {
    const storedAuth = localStorage.getItem('user');
    if (!storedAuth) {
      navigate("/login");
    }
  }, [navigate]);

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
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Header Section */}
          <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center mb-12">
            <div className="mb-6 lg:mb-0">
              <h1 className="text-4xl lg:text-5xl font-bold text-slate-900 mb-4">My Recipe Collection</h1>
              <p className="text-xl text-slate-600 max-w-2xl">
                Manage and organize your personal recipe collection. Create, edit, and share your culinary masterpieces.
              </p>
            </div>
            <div className="flex-shrink-0">
              <Link
                  to="/recipes/add"
                  className="group inline-flex items-center px-8 py-4 text-lg font-semibold text-white bg-gradient-to-r from-emerald-600 to-emerald-700 rounded-2xl shadow-lg hover:shadow-xl hover:from-emerald-700 hover:to-emerald-800 transition-all duration-300 transform hover:-translate-y-1"
              >
                <i className="fas fa-plus mr-3 group-hover:rotate-90 transition-transform duration-300"></i>
                Add New Recipe
              </Link>
            </div>
          </div>

          {/* Stats Section */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-100">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center">
                  <i className="fas fa-book text-emerald-600"></i>
                </div>
                <div className="ml-4">
                  <div className="text-2xl font-bold text-slate-900">{recipes.length}</div>
                  <div className="text-sm text-slate-500 font-medium">Total Recipes</div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-100">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                  <i className="fas fa-utensils text-blue-600"></i>
                </div>
                <div className="ml-4">
                  <div className="text-2xl font-bold text-slate-900">
                    {recipes.filter((r) => r.category === "Lunch").length}
                  </div>
                  <div className="text-sm text-slate-500 font-medium">Lunch Recipes</div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-100">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
                  <i className="fas fa-fire-alt text-orange-600"></i>
                </div>
                <div className="ml-4">
                  <div className="text-2xl font-bold text-slate-900">
                    {Math.round(recipes.reduce((acc, r) => acc + (r.calories || 0), 0) / recipes.length) || 0}
                  </div>
                  <div className="text-sm text-slate-500 font-medium">Avg Calories</div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-100">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                  <i className="fas fa-clock text-purple-600"></i>
                </div>
                <div className="ml-4">
                  <div className="text-2xl font-bold text-slate-900">
                    {Math.round(recipes.reduce((acc, r) => acc + (r.prepTime + r.cookTime || 0), 0) / recipes.length) ||
                        0}
                  </div>
                  <div className="text-sm text-slate-500 font-medium">Avg Time (min)</div>
                </div>
              </div>
            </div>
          </div>

          {/* Error Message */}
          {error && (
              <div className="mb-8">
                <div className="bg-red-50 border border-red-200 rounded-2xl p-6">
                  <div className="flex items-center text-red-700">
                    <div className="flex-shrink-0">
                      <i className="fas fa-exclamation-circle text-xl"></i>
                    </div>
                    <div className="ml-4">
                      <h3 className="font-semibold">Error</h3>
                      <p className="mt-1">{error}</p>
                    </div>
                  </div>
                </div>
              </div>
          )}

          {/* Recipe Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {recipes.map((recipe) => (
                <div
                    key={recipe.id}
                    className="group bg-white rounded-2xl shadow-lg hover:shadow-xl overflow-hidden transition-all duration-300 border border-slate-100 hover:border-emerald-200"
                >
                  <Link to={`/recipes/${recipe.id}`} className="block">
                    <div className="relative overflow-hidden">
                      {recipe.imageUrl ? (
                          <img
                              src={`/api/uploads/${recipe.imageUrl}`}
                              alt={recipe.title}
                              className="w-full h-56 object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                      ) : (
                          <div
                              className="w-full h-56 bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center">
                            <i className="fas fa-utensils text-5xl text-slate-400"></i>
                          </div>
                      )}
                      <div className="absolute top-4 right-4">
                    <span
                        className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold bg-emerald-600 text-white shadow-lg">
                      {recipe.category || "General"}
                    </span>
                      </div>
                    </div>

                    <div className="p-6">
                      <h3 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-emerald-600 transition-colors duration-200 line-clamp-2">
                        {recipe.title || "Untitled Recipe"}
                      </h3>
                      <p className="text-slate-600 mb-6 line-clamp-2 leading-relaxed">
                        {recipe.description || "No description available"}
                      </p>

                      <div
                          className="flex justify-between items-center text-sm text-slate-500 mb-6 pb-4 border-b border-slate-100">
                        <div className="flex items-center space-x-1">
                          <i className="fas fa-clock text-emerald-600"></i>
                          <span className="font-medium">{recipe.prepTime + recipe.cookTime || 0} min</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <i className="fas fa-user-friends text-blue-600"></i>
                          <span className="font-medium">{recipe.servings || 0} servings</span>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="flex items-center justify-between p-3 bg-orange-50 rounded-xl">
                          <div className="flex items-center space-x-2">
                            <i className="fas fa-fire-alt text-orange-500"></i>
                            <span className="text-xs font-medium text-slate-600">Calories</span>
                          </div>
                          <span className="font-bold text-orange-600">{recipe.calories || 0}</span>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-red-50 rounded-xl">
                          <div className="flex items-center space-x-2">
                            <i className="fas fa-drumstick-bite text-red-500"></i>
                            <span className="text-xs font-medium text-slate-600">Protein</span>
                          </div>
                          <span className="font-bold text-red-600">{recipe.protein || 0}g</span>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-xl">
                          <div className="flex items-center space-x-2">
                            <i className="fas fa-bread-slice text-yellow-500"></i>
                            <span className="text-xs font-medium text-slate-600">Carbs</span>
                          </div>
                          <span className="font-bold text-yellow-600">{recipe.carbs || 0}g</span>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-purple-50 rounded-xl">
                          <div className="flex items-center space-x-2">
                            <i className="fas fa-cheese text-purple-500"></i>
                            <span className="text-xs font-medium text-slate-600">Fat</span>
                          </div>
                          <span className="font-bold text-purple-600">{recipe.fat || 0}g</span>
                        </div>
                      </div>
                    </div>
                  </Link>

                  <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex justify-end gap-3">
                    <Link
                        to={`/recipes/edit/${recipe.id}`}
                        className="inline-flex items-center px-4 py-2 text-sm font-semibold text-blue-700 bg-blue-100 hover:bg-blue-200 rounded-xl transition-all duration-200 hover:shadow-md"
                    >
                      <i className="fas fa-edit mr-2"></i>
                      Edit
                    </Link>
                    <button
                        onClick={() => handleDelete(recipe.id)}
                        className="inline-flex items-center px-4 py-2 text-sm font-semibold text-red-700 bg-red-100 hover:bg-red-200 rounded-xl transition-all duration-200 hover:shadow-md"
                    >
                      <i className="fas fa-trash mr-2"></i>
                      Delete
                    </button>
                  </div>
                </div>
            ))}
          </div>

          {/* Loading State */}
          {loading && (
              <div className="flex justify-center items-center py-16">
                <div className="text-center">
                  <div
                      className="inline-flex items-center justify-center w-16 h-16 bg-white rounded-2xl shadow-lg mb-6">
                    <div
                        className="animate-spin rounded-full h-8 w-8 border-2 border-emerald-600 border-t-transparent"></div>
                  </div>
                  <h3 className="text-xl font-semibold text-slate-900 mb-2">Loading Your Recipes</h3>
                  <p className="text-slate-600">Gathering your culinary creations...</p>
                </div>
              </div>
          )}

          {/* Load More Button */}
          {!loading && hasMore && recipes.length > 0 && (
              <div className="text-center mt-16">
                <button
                    onClick={loadMore}
                    className="inline-flex items-center px-8 py-4 text-lg font-semibold text-white bg-gradient-to-r from-emerald-600 to-emerald-700 rounded-2xl shadow-lg hover:shadow-xl hover:from-emerald-700 hover:to-emerald-800 transition-all duration-300 transform hover:-translate-y-1"
                >
                  Load More Recipes
                  <i className="fas fa-chevron-down ml-3"></i>
                </button>
              </div>
          )}

          {/* Empty State */}
          {!loading && recipes.length === 0 && (
              <div className="text-center py-20">
                <div className="max-w-md mx-auto">
                  <div className="bg-white rounded-3xl shadow-xl p-12 border border-slate-100">
                    <div className="inline-flex items-center justify-center w-20 h-20 bg-emerald-100 rounded-full mb-8">
                      <i className="fas fa-book-open text-3xl text-emerald-600"></i>
                    </div>
                    <h3 className="text-2xl font-bold text-slate-900 mb-4">Your Recipe Book Awaits</h3>
                    <p className="text-slate-600 mb-8 leading-relaxed">
                      You haven't created any recipes yet. Start building your personal collection of healthy, delicious
                      meals!
                    </p>
                    <Link
                        to="/recipes/add"
                        className="group inline-flex items-center px-8 py-4 text-lg font-semibold text-white bg-gradient-to-r from-emerald-600 to-emerald-700 rounded-2xl shadow-lg hover:shadow-xl hover:from-emerald-700 hover:to-emerald-800 transition-all duration-300 transform hover:-translate-y-1"
                    >
                      <i className="fas fa-plus mr-3 group-hover:rotate-90 transition-transform duration-300"></i>
                      Create Your First Recipe
                    </Link>
                  </div>
                </div>
              </div>
          )}
        </div>
      </div>
  );
};

export default MyRecipes; 