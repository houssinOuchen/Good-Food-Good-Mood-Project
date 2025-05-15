import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { recipeService } from '../services/recipeService';
import './RecipeList.css';
import {useAuth} from "../context/AuthContext";

const RecipeList = () => {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    fetchRecipes();
  }, [page]);

  const fetchRecipes = async () => {
    try {
      setLoading(true);
      const response = await (searchQuery
          ? recipeService.searchRecipes(searchQuery, page)
          : recipeService.getAllRecipes(page));

      // Debug log the response type and structure
      console.log("API response:", response);

      // Extract recipe data from the paginated response
      let recipeData = [];

      if (response && response.content && Array.isArray(response.content)) {
        // Standard Spring Data pagination format
        recipeData = response.content;
        setHasMore(!response.last);
      } else if (Array.isArray(response)) {
        // Direct array response
        recipeData = response;
        setHasMore(response.length > 0);
      } else if (response && typeof response === 'object') {
        // Single recipe object
        recipeData = [response];
        setHasMore(false);
      }

      console.log("Processed recipe data:", recipeData);

      // Update the recipes state with the new data
      setRecipes(prev => {
        // If it's the first page, replace current recipes
        if (page === 0) return recipeData;

        // Otherwise, append to existing recipes
        // Make sure we have an array to spread
        const prevArray = Array.isArray(prev) ? prev : [];
        return [...prevArray, ...recipeData];
      });
    } catch (err) {
      setError('Failed to fetch recipes');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(0);
    fetchRecipes();
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

  console.log("Rendering with recipes:", recipes);
  console.log("Is recipes an array?", Array.isArray(recipes));

  return (
      <div className="recipes-container">
        <div className="recipes-header">
          <div className="header-content">
            <h1>Discover Recipes</h1>
            <p>Find healthy meals to fuel your fitness journey</p>
          </div>

          <div className="search-container">
            <form onSubmit={handleSearch} className="search-form">
              <div className="search-input-container">
                <i className="fas fa-search"></i>
                <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search recipes..."
                    className="search-input"
                />
                <button type="submit" className="search-button">
                  Search
                </button>
              </div>
            </form>

            <div className="filter-buttons">
              <button className="filter-button active">All</button>
              <button className="filter-button">Breakfast</button>
              <button className="filter-button">Lunch</button>
              <button className="filter-button">Dinner</button>
              <button className="filter-button">Snacks</button>
            </div>
          </div>
        </div>

        {error && (
            <div className="error-message">
              <i className="fas fa-exclamation-circle"></i>
              {error}
            </div>
        )}

        <div className="recipes-grid">
          {Array.isArray(recipes) && recipes.length > 0 ? (
              recipes.map((recipe, index) => (
                  <div key={recipe?.id || index} className="recipe-card">
                    <Link to={`/recipes/${recipe?.id || index}`} className="card-link">
                      <div className="card-image">
                        {recipe?.imageUrl ? (
                            <img
                                src={`/api/uploads/${recipe.imageUrl}`}
                                alt={recipe?.title || 'Recipe'}
                            />
                        ) : (
                            <div className="placeholder-image">
                              <i className="fas fa-utensils"></i>
                            </div>
                        )}
                        <div className="card-badge">{recipe?.category || 'General'}</div>
                      </div>

                      <div className="card-content">
                        <h3>{recipe?.title || 'Untitled Recipe'}</h3>
                        <p className="card-description">
                          {recipe?.description || 'No description available'}
                        </p>

                        <div className="card-meta">
                          <div className="meta-item">
                            <i className="fas fa-clock"></i>
                            <span>{recipe?.prepTime + recipe?.cookTime || 0} min</span>
                          </div>
                          <div className="meta-item">
                            <i className="fas fa-user-friends"></i>
                            <span>{recipe?.servings || 0} servings</span>
                          </div>
                        </div>
                      </div>
                    </Link>

                    {user?.id === recipe?.author.id && (
                        <div className="card-actions">
                          <Link
                              to={`/recipes/edit/${recipe.id}`}
                              className="action-button edit"
                          >
                            <i className="fas fa-edit"></i>
                          </Link>
                          <button
                              onClick={(e) => {
                                e.preventDefault();
                                handleDelete(recipe.id);
                              }}
                              className="action-button delete"
                          >
                            <i className="fas fa-trash"></i>
                          </button>
                        </div>
                    )}
                  </div>
              ))
          ) : (
              !loading && (
                  <div className="empty-state">
                    <i className="fas fa-book-open"></i>
                    <h3>No recipes found</h3>
                    <p>{searchQuery ? 'Try a different search term' : 'Be the first to add a recipe!'}</p>
                    {user && (
                        <Link to="/recipes/add" className="empty-state-button">
                          Add New Recipe
                        </Link>
                    )}
                  </div>
              )
          )}
        </div>

        {loading && (
            <div className="loading-spinner">
              <div className="spinner"></div>
              <p>Loading recipes...</p>
            </div>
        )}

        {!loading && hasMore && recipes.length > 0 && (
            <div className="load-more-container">
              <button onClick={loadMore} className="load-more-button">
                Load More Recipes
                <i className="fas fa-chevron-down"></i>
              </button>
            </div>
        )}
      </div>
      /*<div className="recipe-list-container">
        <div className="recipe-list-header">
          <h1>All Recipes</h1>
          <form onSubmit={handleSearch} className="search-form">
            <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search recipes..."
                className="search-input"
            />
            <button type="submit" className="search-button">
              Search
            </button>
          </form>
        </div>

        {error && <div className="error-message">{error}</div>}

        <div className="recipe-grid">
          {Array.isArray(recipes) && recipes.length > 0 ? (
              recipes.map((recipe, index) => (
                  <Link
                      to={`/recipes/${recipe?.id || index}`}
                      key={recipe?.id || index}
                      className="recipe-card"
                  >
                    <div className="recipe-image">
                      {recipe?.imageUrl ? (
                          <img
                              src={`/api/uploads/${recipe.imageUrl}`}
                              alt={recipe?.title || 'Recipe'}
                          />
                      ) : (
                          <div className="placeholder-image">No Image</div>
                      )}
                    </div>
                    <div className="recipe-info">
                      <h3>{recipe?.title || 'Untitled Recipe'}</h3>
                      <p className="recipe-description">{recipe?.description || 'No description available'}</p>
                      <div className="recipe-meta">
                        <span>Prep: {recipe?.prepTime || 0}min</span>
                        <span>Cook: {recipe?.cookTime || 0}min</span>
                        <span>Servings: {recipe?.servings || 0}</span>
                      </div>
                    </div>
                  </Link>
              ))
          ) : (
              !loading && (
                  <div className="no-recipes">
                    No recipes found. {searchQuery && 'Try a different search term.'}
                  </div>
              )
          )}
        </div>

        {loading && <div className="loading">Loading...</div>}

        {!loading && hasMore && recipes.length > 0 && (
            <button onClick={loadMore} className="load-more-button">
              Load More
            </button>
        )}
      </div>*/
  );
}

export default RecipeList;