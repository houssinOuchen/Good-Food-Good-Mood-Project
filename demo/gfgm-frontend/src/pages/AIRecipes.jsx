import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const AIRecipes = () => {
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
      const response = await axios.get(`/api/recipes/ai?page=${page}&size=12`);
      const newRecipes = response.data.content;
      
      if (page === 0) {
        setRecipes(newRecipes);
      } else {
        setRecipes(prev => [...prev, ...newRecipes]);
      }
      
      setHasMore(response.data.totalPages > page + 1);
      setLoading(false);
    } catch (error) {
      setError('Failed to load AI-generated recipes');
      setLoading(false);
    }
  };

  const loadMore = () => {
    setPage(prev => prev + 1);
  };

  if (loading && page === 0) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">AI-Generated Recipes</h1>

        {error && (
          <div className="bg-red-100 text-red-700 p-4 rounded mb-6">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {recipes.map(recipe => (
            <Link
              key={recipe.id}
              to={`/recipes/${recipe.id}`}
              className="bg-white rounded-lg shadow overflow-hidden hover:shadow-lg transition-shadow duration-300"
            >
              <div className="aspect-w-16 aspect-h-9">
                <img
                  src={recipe.imageUrl || '/default-recipe.jpg'}
                  alt={recipe.title}
                  className="object-cover w-full h-48"
                />
              </div>
              <div className="p-4">
                <h2 className="text-xl font-semibold text-gray-900 mb-2">
                  {recipe.title}
                </h2>
                <p className="text-gray-600 line-clamp-2 mb-4">
                  {recipe.description}
                </p>
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <div className="flex items-center space-x-4">
                    <span>🕒 {recipe.prepTime + recipe.cookTime} mins</span>
                    <span>👥 {recipe.servings} servings</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    {recipe.calories && (
                      <span className="bg-green-100 text-green-800 px-2 py-1 rounded">
                        {recipe.calories} cal
                      </span>
                    )}
                  </div>
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  {recipe.protein && (
                    <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm">
                      Protein: {recipe.protein}g
                    </span>
                  )}
                  {recipe.carbs && (
                    <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-sm">
                      Carbs: {recipe.carbs}g
                    </span>
                  )}
                  {recipe.fat && (
                    <span className="bg-red-100 text-red-800 px-2 py-1 rounded text-sm">
                      Fat: {recipe.fat}g
                    </span>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>

        {hasMore && (
          <div className="mt-8 flex justify-center">
            <button
              onClick={loadMore}
              className="bg-indigo-600 text-white px-6 py-2 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              Load More
            </button>
          </div>
        )}

        {!loading && recipes.length === 0 && (
          <div className="text-center py-12">
            <h3 className="text-xl text-gray-600">
              No AI-generated recipes found yet.
            </h3>
          </div>
        )}
      </div>
    </div>
  );
};

export default AIRecipes; 