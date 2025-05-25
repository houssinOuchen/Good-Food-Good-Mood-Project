import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalRecipes: 0,
    aiGeneratedRecipes: 0,
  });
  const [users, setUsers] = useState([]);
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { user, isAdmin, updateUser } = useAuth();
  const navigate = useNavigate();
  const [editingUser, setEditingUser] = useState(null);
  const [editingRecipe, setEditingRecipe] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState({ show: false, id: null, type: null });
  const [message, setMessage] = useState(null);

  useEffect(() => {
    if (!isAdmin()) {
      navigate('/');
      return;
    }
    fetchData();
  }, [isAdmin, navigate]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [statsRes, usersRes, recipesRes] = await Promise.all([
        axios.get('/api/admin/stats'),
        axios.get('/api/admin/users'),
        axios.get('/api/admin/recipes')
      ]);

      setStats(statsRes.data);
      // Make sure we're getting all user fields
      const usersWithFullData = usersRes.data.map(user => ({
        ...user,
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        role: user.role || 'USER'
      }));
      console.log("user", usersWithFullData);
      setUsers(usersWithFullData);
      // Handle paginated response and ensure all fields are present
      const recipesWithFullData = (recipesRes.data.content || []).map(recipe => ({
        ...recipe,
        ingredients: recipe.ingredients || [],
        instructions: recipe.instructions || '',
        prepTime: recipe.prepTime || 0,
        cookTime: recipe.cookTime || 0,
        servings: recipe.servings || 1,
        category: recipe.category || 'BREAKFAST',
        published: recipe.published !== undefined ? recipe.published : true
      }));
      setRecipes(recipesWithFullData);
      setLoading(false);
    } catch (error) {
      console.error('Failed to load admin data:', error);
      setError('Failed to load admin data: ' + (error.response?.data?.message || error.message));
      setLoading(false);
    }
  };

  const handleUserEdit = (user) => {
    setEditingUser({
      ...user,
      firstName: user.firstName || '',
      lastName: user.lastName || '',
      role: user.role || 'USER'
    });
  };

  const handleUserUpdate = async (e) => {
    e.preventDefault();
    try {
      const userData = {
        username: editingUser.username,
        email: editingUser.email,
        firstName: editingUser.firstName || '',
        lastName: editingUser.lastName || '',
        role: editingUser.role
      };

      // Only include password if it's not empty
      if (editingUser.password && editingUser.password.trim()) {
        userData.password = editingUser.password;
      }

      const response = await axios.put(`/api/admin/users/${editingUser.id}`, userData);

      // Check if admin updated their own account and got a new token
      if (response.data.token) {
        // Update the stored token
        localStorage.setItem('token', response.data.token);
        // Update axios default header
        axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;

        // Update the user context if you have access to it
        // You might need to call a function to refresh the user context
        // or trigger a re-fetch of user data

        setMessage({
          type: 'success',
          text: 'User updated successfully! Your session has been refreshed.'
        });
      } else {
        setMessage({ type: 'success', text: 'User updated successfully!' });
      }

      if (response.data.token) {
        updateUser(response.data);
        setMessage({
          type: 'success',
          text: 'User updated successfully! Your session has been refreshed.'
        });
      }

      setEditingUser(null);
      fetchData();
    } catch (error) {
      console.error('Update error:', error);
      setError('Failed to update user: ' + (error.response?.data?.message || error.message));
    }
  };

  const handleDeleteConfirm = (id, type) => {
    setShowDeleteConfirm({ show: true, id, type });
  };

  const handleDeleteCancel = () => {
    setShowDeleteConfirm({ show: false, id: null, type: null });
  };

  const handleDeleteExecute = async () => {
    try {
      if (showDeleteConfirm.type === 'user') {
        await axios.delete(`/api/admin/users/${showDeleteConfirm.id}`);
      } else if (showDeleteConfirm.type === 'recipe') {
        await axios.delete(`/api/admin/recipes/${showDeleteConfirm.id}`);
      }
      setMessage({ type: 'success', text: `${showDeleteConfirm.type === 'user' ? 'User' : 'Recipe'} deleted successfully!` });
      fetchData();
    } catch (error) {
      console.error('Delete error:', error);
      setError(`Failed to delete ${showDeleteConfirm.type}: ` + (error.response?.data?.message || error.message));
    }
    setShowDeleteConfirm({ show: false, id: null, type: null });
  };

  const handleRecipeEdit = (recipe) => {
    // Format ingredients for display
    const formattedIngredients = Array.isArray(recipe.ingredients) 
      ? recipe.ingredients.map(ing => 
          typeof ing === 'string' ? ing : `${ing.name} ${ing.amount} ${ing.unit}`
        ).join('\n')
      : '';

    // Format instructions for display
    const formattedInstructions = Array.isArray(recipe.instructions)
      ? recipe.instructions.join('\n')
      : recipe.instructions || '';

    setEditingRecipe({
      ...recipe,
      ingredients: formattedIngredients,
      instructions: formattedInstructions,
      prepTime: recipe.prepTime || 0,
      cookTime: recipe.cookTime || 0,
      servings: recipe.servings || 1,
      category: recipe.category || 'BREAKFAST',
      published: recipe.published !== undefined ? recipe.published : true
    });
  };

  const handleRecipeUpdate = async (e) => {
    e.preventDefault();
    try {
      // Convert ingredients to the correct format
      const ingredients = Array.isArray(editingRecipe.ingredients) 
        ? editingRecipe.ingredients.map(ing => ({
            name: ing.name || ing,
            amount: ing.amount || 1,
            unit: ing.unit || 'piece'
          }))
        : [{ name: editingRecipe.ingredients, amount: 1, unit: 'piece' }];

      // Convert instructions to array if it's a string
      const instructions = typeof editingRecipe.instructions === 'string'
        ? editingRecipe.instructions.split('\n').filter(line => line.trim())
        : editingRecipe.instructions;

      const recipeData = {
        title: editingRecipe.title,
        description: editingRecipe.description,
        category: editingRecipe.category,
        published: editingRecipe.published,
        ingredients: ingredients,
        instructions: instructions,
        prepTime: parseInt(editingRecipe.prepTime) || 0,
        cookTime: parseInt(editingRecipe.cookTime) || 0,
        servings: parseInt(editingRecipe.servings) || 1,
        // Add nutrition information
        calories: parseFloat(editingRecipe.calories) || 0,
        protein: parseFloat(editingRecipe.protein) || 0,
        carbs: parseFloat(editingRecipe.carbs) || 0,
        fat: parseFloat(editingRecipe.fat) || 0,
        fiber: parseFloat(editingRecipe.fiber) || 0,
        sugar: parseFloat(editingRecipe.sugar) || 0
      };

      await axios.put(`/api/admin/recipes/${editingRecipe.id}`, recipeData);
      
      setMessage({ type: 'success', text: 'Recipe updated successfully!' });
      setEditingRecipe(null);
      fetchData();
    } catch (error) {
      console.error('Update error:', error);
      setError('Failed to update recipe: ' + (error.response?.data?.message || error.message));
    }
  };

  const handleRecipeStatusChange = async (recipeId, published) => {
    try {
      const formData = new FormData();
      const recipeData = {
        published: !published
      };
      formData.append('recipe', new Blob([JSON.stringify(recipeData)], { type: 'application/json' }));

      await axios.put(`/api/recipes/${recipeId}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      setMessage({ type: 'success', text: `Recipe ${published ? 'unpublished' : 'published'} successfully!` });
      fetchData();
    } catch (error) {
      console.error('Status change error:', error);
      setError(`Failed to ${published ? 'unpublish' : 'publish'} recipe: ` + (error.response?.data?.message || error.message));
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Header */}
          <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center mb-12">
            <div className="mb-6 lg:mb-0">
              <div
                  className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl mb-6">
                <i className="fas fa-chart-line text-2xl text-white"></i>
              </div>
              <h1 className="text-4xl lg:text-5xl font-bold text-slate-900 mb-4">Admin Dashboard</h1>
              <p className="text-xl text-slate-600 max-w-2xl">
                Manage users, recipes, and monitor platform performance from your central command center
              </p>
            </div>

            {/* Tab Navigation */}
            <div className="flex flex-wrap gap-2 bg-white rounded-2xl p-2 shadow-lg border border-slate-200">
              {[
                {id: "overview", label: "Overview", icon: "fas fa-chart-pie"},
                {id: "users", label: "Users", icon: "fas fa-users"},
                {id: "recipes", label: "Recipes", icon: "fas fa-utensils"},
              ].map((tab) => (
                  <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex items-center px-6 py-3 rounded-xl font-semibold transition-all duration-200 ${
                          activeTab === tab.id
                              ? "bg-gradient-to-r from-purple-600 to-purple-700 text-white shadow-md"
                              : "text-slate-600 hover:text-purple-600 hover:bg-purple-50"
                      }`}
                  >
                    <i className={`${tab.icon} mr-2`}></i>
                    {tab.label}
                  </button>
              ))}
            </div>
          </div>

          {/* Messages */}
          {(error || (message && message.text)) && (
              <div className="mb-8">
                <div
                    className={`rounded-2xl p-6 border ${
                        error || (message?.type === "error")
                            ? "bg-red-50 border-red-200 text-red-700"
                            : "bg-emerald-50 border-emerald-200 text-emerald-700"
                    }`}
                >
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <i
                          className={`fas ${
                              error || (message?.type === "error")
                                  ? "fa-exclamation-circle text-red-500"
                                  : "fa-check-circle text-emerald-500"
                          } text-xl`}
                      ></i>
                    </div>
                    <div className="ml-4">
                      <p className="font-semibold">{error || message?.text || ""}</p>
                    </div>
                  </div>
                </div>
              </div>
          )}

          {/* Overview Section */}
          {activeTab === "overview" && (
              <div className="space-y-8">
                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div className="bg-white rounded-2xl p-8 shadow-xl border border-slate-200">
                    <div className="flex items-center">
                      <div
                          className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center">
                        <i className="fas fa-users text-2xl text-white"></i>
                      </div>
                      <div className="ml-6">
                        <div className="text-3xl font-bold text-slate-900">{stats.totalUsers.toLocaleString()}</div>
                        <div className="text-sm text-slate-500 font-medium">Total Users</div>
                        <div className="text-xs text-emerald-600 font-semibold mt-1">
                          +{stats.activeUsers} active this month
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-2xl p-8 shadow-xl border border-slate-200">
                    <div className="flex items-center">
                      <div
                          className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl flex items-center justify-center">
                        <i className="fas fa-utensils text-2xl text-white"></i>
                      </div>
                      <div className="ml-6">
                        <div className="text-3xl font-bold text-slate-900">{stats.totalRecipes.toLocaleString()}</div>
                        <div className="text-sm text-slate-500 font-medium">Total Recipes</div>
                        <div className="text-xs text-emerald-600 font-semibold mt-1">
                          {stats.publishedRecipes} published
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-2xl p-8 shadow-xl border border-slate-200">
                    <div className="flex items-center">
                      <div
                          className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center">
                        <i className="fas fa-robot text-2xl text-white"></i>
                      </div>
                      <div className="ml-6">
                        <div
                            className="text-3xl font-bold text-slate-900">{stats.aiGeneratedRecipes.toLocaleString()}</div>
                        <div className="text-sm text-slate-500 font-medium">AI Generated</div>
                        <div className="text-xs text-purple-600 font-semibold mt-1">
                          {Math.round((stats.aiGeneratedRecipes / stats.totalRecipes) * 100)}% of total
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="bg-white rounded-2xl shadow-xl p-8 border border-slate-200">
                  <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center">
                    <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center mr-4">
                      <i className="fas fa-bolt text-orange-600"></i>
                    </div>
                    Quick Actions
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <button
                        className="flex items-center justify-center p-4 bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl hover:from-blue-100 hover:to-blue-200 transition-all duration-200 group">
                      <i className="fas fa-user-plus text-blue-600 mr-3 group-hover:scale-110 transition-transform duration-200"></i>
                      <span className="font-semibold text-blue-700">Add User</span>
                    </button>
                    <button
                        className="flex items-center justify-center p-4 bg-gradient-to-r from-emerald-50 to-emerald-100 rounded-xl hover:from-emerald-100 hover:to-emerald-200 transition-all duration-200 group">
                      <i className="fas fa-plus text-emerald-600 mr-3 group-hover:scale-110 transition-transform duration-200"></i>
                      <span className="font-semibold text-emerald-700">Add Recipe</span>
                    </button>
                    <button
                        className="flex items-center justify-center p-4 bg-gradient-to-r from-purple-50 to-purple-100 rounded-xl hover:from-purple-100 hover:to-purple-200 transition-all duration-200 group">
                      <i className="fas fa-eye text-purple-600 mr-3 group-hover:scale-110 transition-transform duration-200"></i>
                      <span className="font-semibold text-purple-700">Review Queue</span>
                    </button>
                    <button
                        className="flex items-center justify-center p-4 bg-gradient-to-r from-orange-50 to-orange-100 rounded-xl hover:from-orange-100 hover:to-orange-200 transition-all duration-200 group">
                      <i className="fas fa-download text-orange-600 mr-3 group-hover:scale-110 transition-transform duration-200"></i>
                      <span className="font-semibold text-orange-700">Export Data</span>
                    </button>
                  </div>
                </div>

                {/* Recent Activity */}
                <div className="bg-white rounded-2xl shadow-xl p-8 border border-slate-200">
                  <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center">
                    <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center mr-4">
                      <i className="fas fa-clock text-green-600"></i>
                    </div>
                    Recent Activity
                  </h2>
                  <div className="space-y-4">
                    {[
                      {action: "New user registered", user: "johndoe", time: "2 minutes ago", type: "user"},
                      {action: "Recipe published", user: "admin", time: "15 minutes ago", type: "recipe"},
                      {action: "AI recipe generated", user: "system", time: "1 hour ago", type: "ai"},
                      {action: "User profile updated", user: "janedoe", time: "2 hours ago", type: "user"},
                    ].map((activity, index) => (
                        <div key={index} className="flex items-center p-4 bg-slate-50 rounded-xl">
                          <div
                              className={`w-10 h-10 rounded-full flex items-center justify-center mr-4 ${
                                  activity.type === "user"
                                      ? "bg-blue-100 text-blue-600"
                                      : activity.type === "recipe"
                                          ? "bg-emerald-100 text-emerald-600"
                                          : "bg-purple-100 text-purple-600"
                              }`}
                          >
                            <i
                                className={`fas ${
                                    activity.type === "user" ? "fa-user" : activity.type === "recipe" ? "fa-utensils" : "fa-robot"
                                }`}
                            ></i>
                          </div>
                          <div className="flex-1">
                            <p className="font-semibold text-slate-900">{activity.action}</p>
                            <p className="text-sm text-slate-500">by {activity.user}</p>
                          </div>
                          <div className="text-sm text-slate-400">{activity.time}</div>
                        </div>
                    ))}
                  </div>
                </div>
              </div>
          )}

          {/* Users Section */}
          {activeTab === "users" && (
              <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-200">
                <div className="px-8 py-6 border-b border-slate-200">
                  <h2 className="text-2xl font-bold text-slate-900 flex items-center">
                    <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center mr-4">
                      <i className="fas fa-users text-blue-600"></i>
                    </div>
                    User Management
                  </h2>
                </div>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-slate-200">
                    <thead className="bg-slate-50">
                    <tr>
                      <th className="px-8 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                        User
                      </th>
                      <th className="px-8 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                        Contact
                      </th>
                      <th className="px-8 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                        Role
                      </th>
                      <th className="px-8 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-8 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-slate-200">
                    {users.map((user) => (
                        <tr key={user.id} className="hover:bg-slate-50 transition-colors duration-200">
                          <td className="px-8 py-6 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="flex-shrink-0 h-12 w-12">
                                <img
                                    className="h-12 w-12 rounded-full object-cover border-2 border-slate-200"
                                    src={
                                      user.profilePicture
                                          ? `/api/uploads/${user.profilePicture}`
                                          : "/images/default-avatar.png?height=48&width=48"
                                    }
                                    alt=""
                                />
                              </div>
                              <div className="ml-4">
                                <div className="text-base font-semibold text-slate-900">{user.username}</div>
                                <div className="text-sm text-slate-500">
                                  {user.firstName} {user.lastName}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-8 py-6 whitespace-nowrap">
                            <div className="text-sm text-slate-900">{user.email}</div>
                            <div className="text-sm text-slate-500">Joined {user.createdAt}</div>
                          </td>
                          <td className="px-8 py-6 whitespace-nowrap">
                        <span
                            className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                                user.role === "ADMIN" ? "bg-purple-100 text-purple-800" : "bg-emerald-100 text-emerald-800"
                            }`}
                        >
                          <i className={`fas ${user.role === "ADMIN" ? "fa-crown" : "fa-user"} mr-1`}></i>
                          {user.role}
                        </span>
                          </td>
                          <td className="px-8 py-6 whitespace-nowrap">
                        <span
                            className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-800">
                          <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                          Active
                        </span>
                          </td>
                          <td className="px-8 py-6 whitespace-nowrap text-sm font-medium">
                            <div className="flex space-x-2">
                              <button
                                  onClick={() => handleUserEdit(user)}
                                  className="inline-flex items-center px-4 py-2 bg-blue-100 text-blue-700 rounded-xl hover:bg-blue-200 transition-all duration-200 font-semibold"
                              >
                                <i className="fas fa-edit mr-2"></i>
                                Edit
                              </button>
                              <button
                                  onClick={() => handleDeleteConfirm(user.id, "user")}
                                  className="inline-flex items-center px-4 py-2 bg-red-100 text-red-700 rounded-xl hover:bg-red-200 transition-all duration-200 font-semibold"
                              >
                                <i className="fas fa-trash mr-2"></i>
                                Delete
                              </button>
                            </div>
                          </td>
                        </tr>
                    ))}
                    </tbody>
                  </table>
                </div>
              </div>
          )}

          {/* Recipes Section */}
          {activeTab === "recipes" && (
              <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-200">
                <div className="px-8 py-6 border-b border-slate-200">
                  <h2 className="text-2xl font-bold text-slate-900 flex items-center">
                    <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center mr-4">
                      <i className="fas fa-utensils text-emerald-600"></i>
                    </div>
                    Recipe Management
                  </h2>
                </div>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-slate-200">
                    <thead className="bg-slate-50">
                    <tr>
                      <th className="px-8 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                        Recipe
                      </th>
                      <th className="px-8 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                        Author
                      </th>
                      <th className="px-8 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                        Nutrition
                      </th>
                      <th className="px-8 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-8 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-slate-200">
                    {recipes.map((recipe) => (
                        <tr key={recipe.id} className="hover:bg-slate-50 transition-colors duration-200">
                          <td className="px-8 py-6 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="flex-shrink-0 h-12 w-12">
                                <img
                                    className="h-12 w-12 rounded-xl object-cover border-2 border-slate-200"
                                    src={
                                      recipe.imageUrl
                                          ? `/api/uploads/${recipe.imageUrl}`
                                          : "/placeholder.svg?height=48&width=48"
                                    }
                                    alt=""
                                />
                              </div>
                              <div className="ml-4">
                                <div className="text-base font-semibold text-slate-900">{recipe.title}</div>
                                <div className="flex items-center text-sm text-slate-500">
                              <span
                                  className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold mr-2 ${
                                      recipe.category === "BREAKFAST"
                                          ? "bg-yellow-100 text-yellow-800"
                                          : recipe.category === "LUNCH"
                                              ? "bg-blue-100 text-blue-800"
                                              : recipe.category === "DINNER"
                                                  ? "bg-purple-100 text-purple-800"
                                                  : "bg-green-100 text-green-800"
                                  }`}
                              >
                                {recipe.category}
                              </span>
                                  {recipe.generatedByAi && (
                                      <span
                                          className="inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold bg-purple-100 text-purple-800">
                                  <i className="fas fa-robot mr-1"></i>
                                  AI
                                </span>
                                  )}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-8 py-6 whitespace-nowrap">
                            <div className="text-sm text-slate-900 font-semibold">{recipe.author?.username}</div>
                            <div className="text-sm text-slate-500">Created {recipe.createdAt}</div>
                          </td>
                          <td className="px-8 py-6 whitespace-nowrap">
                            <div className="grid grid-cols-2 gap-2 text-xs">
                              <div className="bg-orange-50 px-2 py-1 rounded-lg">
                                <span className="font-semibold text-orange-600">{recipe.calories}</span>
                                <span className="text-orange-500 ml-1">cal</span>
                              </div>
                              <div className="bg-red-50 px-2 py-1 rounded-lg">
                                <span className="font-semibold text-red-600">{recipe.protein}</span>
                                <span className="text-red-500 ml-1">p</span>
                              </div>
                              <div className="bg-yellow-50 px-2 py-1 rounded-lg">
                                <span className="font-semibold text-yellow-600">{recipe.carbs}</span>
                                <span className="text-yellow-500 ml-1">c</span>
                              </div>
                              <div className="bg-purple-50 px-2 py-1 rounded-lg">
                                <span className="font-semibold text-purple-600">{recipe.fat}</span>
                                <span className="text-purple-500 ml-1">f</span>
                              </div>
                            </div>
                          </td>
                          <td className="px-8 py-6 whitespace-nowrap">
                        <span
                            className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                                recipe.published ? "bg-emerald-100 text-emerald-800" : "bg-yellow-100 text-yellow-800"
                            }`}
                        >
                          <div
                              className={`w-2 h-2 rounded-full mr-2 ${
                                  recipe.published ? "bg-emerald-500" : "bg-yellow-500"
                              }`}
                          ></div>
                          {recipe.published ? "Published" : "Draft"}
                        </span>
                          </td>
                          <td className="px-8 py-6 whitespace-nowrap text-sm font-medium">
                            <div className="flex space-x-2">
                              <button
                                  onClick={() => handleRecipeEdit(recipe)}
                                  className="inline-flex items-center px-4 py-2 bg-blue-100 text-blue-700 rounded-xl hover:bg-blue-200 transition-all duration-200 font-semibold"
                              >
                                <i className="fas fa-edit mr-2"></i>
                                Edit
                              </button>
                              <button
                                  onClick={() => handleRecipeStatusChange(recipe.id, recipe.published)}
                                  className={`inline-flex items-center px-4 py-2 rounded-xl transition-all duration-200 font-semibold ${
                                      recipe.published
                                          ? "bg-yellow-100 text-yellow-700 hover:bg-yellow-200"
                                          : "bg-emerald-100 text-emerald-700 hover:bg-emerald-200"
                                  }`}
                              >
                                <i className={`fas ${recipe.published ? "fa-eye-slash" : "fa-eye"} mr-2`}></i>
                                {recipe.published ? "Unpublish" : "Publish"}
                              </button>
                              <button
                                  onClick={() => handleDeleteConfirm(recipe.id, "recipe")}
                                  className="inline-flex items-center px-4 py-2 bg-red-100 text-red-700 rounded-xl hover:bg-red-200 transition-all duration-200 font-semibold"
                              >
                                <i className="fas fa-trash mr-2"></i>
                                Delete
                              </button>
                            </div>
                          </td>
                        </tr>
                    ))}
                    </tbody>
                  </table>
                </div>
              </div>
          )}

          {/* User Edit Modal */}
          {editingUser && (
              <div
                  className="fixed inset-0 bg-black bg-opacity-50 overflow-y-auto h-full w-full z-50 flex items-center justify-center p-4">
                <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                  <div className="p-8">
                    <div className="flex items-center justify-between mb-8">
                      <h3 className="text-2xl font-bold text-slate-900 flex items-center">
                        <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center mr-4">
                          <i className="fas fa-user-edit text-blue-600"></i>
                        </div>
                        Edit User
                      </h3>
                      <button
                          onClick={() => setEditingUser(null)}
                          className="w-10 h-10 bg-slate-100 hover:bg-slate-200 rounded-xl flex items-center justify-center transition-colors duration-200"
                      >
                        <i className="fas fa-times text-slate-600"></i>
                      </button>
                    </div>

                    <form onSubmit={handleUserUpdate} className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <label className="block text-sm font-semibold text-slate-700">Username</label>
                          <input
                              type="text"
                              value={editingUser.username || ""}
                              onChange={(e) => setEditingUser({...editingUser, username: e.target.value})}
                              className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                              required
                          />
                        </div>

                        <div className="space-y-2">
                          <label className="block text-sm font-semibold text-slate-700">Email</label>
                          <input
                              type="email"
                              value={editingUser.email || ""}
                              onChange={(e) => setEditingUser({...editingUser, email: e.target.value})}
                              className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                              required
                          />
                        </div>

                        <div className="space-y-2">
                          <label className="block text-sm font-semibold text-slate-700">First Name</label>
                          <input
                              type="text"
                              value={editingUser.firstName || ""}
                              onChange={(e) => setEditingUser({...editingUser, firstName: e.target.value})}
                              className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                          />
                        </div>

                        <div className="space-y-2">
                          <label className="block text-sm font-semibold text-slate-700">Last Name</label>
                          <input
                              type="text"
                              value={editingUser.lastName || ""}
                              onChange={(e) => setEditingUser({...editingUser, lastName: e.target.value})}
                              className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                          />
                        </div>

                        <div className="space-y-2">
                          <label className="block text-sm font-semibold text-slate-700">Role</label>
                          <select
                              value={editingUser.role || "USER"}
                              onChange={(e) => setEditingUser({...editingUser, role: e.target.value})}
                              className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                              required
                          >
                            <option value="USER">User</option>
                            <option value="ADMIN">Admin</option>
                          </select>
                        </div>

                        <div className="space-y-2">
                          <label className="block text-sm font-semibold text-slate-700">
                            New Password (leave blank to keep current)
                          </label>
                          <input
                              type="password"
                              value={editingUser.password || ""}
                              onChange={(e) => setEditingUser({...editingUser, password: e.target.value})}
                              className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                          />
                        </div>
                      </div>

                      <div className="flex justify-end space-x-4 pt-6">
                        <button
                            type="button"
                            onClick={() => setEditingUser(null)}
                            className="px-8 py-3 bg-slate-100 text-slate-700 rounded-xl hover:bg-slate-200 font-semibold transition-all duration-200"
                        >
                          Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-8 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
                        >
                          Save Changes
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
          )}

          {/* Recipe Edit Modal */}
          {editingRecipe && (
              <div
                  className="fixed inset-0 bg-black bg-opacity-50 overflow-y-auto h-full w-full z-50 flex items-center justify-center p-4">
                <div className="bg-white rounded-3xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                  <div className="p-8">
                    <div className="flex items-center justify-between mb-8">
                      <h3 className="text-2xl font-bold text-slate-900 flex items-center">
                        <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center mr-4">
                          <i className="fas fa-utensils text-emerald-600"></i>
                        </div>
                        Edit Recipe
                      </h3>
                      <button
                          onClick={() => setEditingRecipe(null)}
                          className="w-10 h-10 bg-slate-100 hover:bg-slate-200 rounded-xl flex items-center justify-center transition-colors duration-200"
                      >
                        <i className="fas fa-times text-slate-600"></i>
                      </button>
                    </div>

                    <form onSubmit={handleRecipeUpdate} className="space-y-8">
                      {/* Basic Info */}
                      <div className="space-y-6">
                        <div className="space-y-2">
                          <label className="block text-sm font-semibold text-slate-700">Title</label>
                          <input
                              type="text"
                              value={editingRecipe.title || ""}
                              onChange={(e) => setEditingRecipe({...editingRecipe, title: e.target.value})}
                              className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200"
                              required
                          />
                        </div>

                        <div className="space-y-2">
                          <label className="block text-sm font-semibold text-slate-700">Description</label>
                          <textarea
                              value={editingRecipe.description || ""}
                              onChange={(e) => setEditingRecipe({...editingRecipe, description: e.target.value})}
                              className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200 resize-none"
                              rows={3}
                              required
                          />
                        </div>
                      </div>

                      {/* Time & Category */}
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                        <div className="space-y-2">
                          <label className="block text-sm font-semibold text-slate-700">Prep Time (min)</label>
                          <input
                              type="number"
                              value={editingRecipe.prepTime || 0}
                              onChange={(e) =>
                                  setEditingRecipe({...editingRecipe, prepTime: Number.parseInt(e.target.value) || 0})
                              }
                              className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200"
                              required
                              min="0"
                          />
                        </div>

                        <div className="space-y-2">
                          <label className="block text-sm font-semibold text-slate-700">Cook Time (min)</label>
                          <input
                              type="number"
                              value={editingRecipe.cookTime || 0}
                              onChange={(e) =>
                                  setEditingRecipe({...editingRecipe, cookTime: Number.parseInt(e.target.value) || 0})
                              }
                              className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200"
                              required
                              min="0"
                          />
                        </div>

                        <div className="space-y-2">
                          <label className="block text-sm font-semibold text-slate-700">Servings</label>
                          <input
                              type="number"
                              value={editingRecipe.servings || 1}
                              onChange={(e) =>
                                  setEditingRecipe({...editingRecipe, servings: Number.parseInt(e.target.value) || 1})
                              }
                              className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200"
                              required
                              min="1"
                          />
                        </div>

                        <div className="space-y-2">
                          <label className="block text-sm font-semibold text-slate-700">Category</label>
                          <select
                              value={editingRecipe.category || "BREAKFAST"}
                              onChange={(e) => setEditingRecipe({...editingRecipe, category: e.target.value})}
                              className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200"
                              required
                          >
                            <option value="BREAKFAST">Breakfast</option>
                            <option value="LUNCH">Lunch</option>
                            <option value="DINNER">Dinner</option>
                            <option value="SNACK">Snack</option>
                            <option value="DESSERT">Dessert</option>
                          </select>
                        </div>
                      </div>

                      {/* Nutrition */}
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                        {[
                          {name: "calories", label: "Calories", unit: "kcal"},
                          {name: "protein", label: "Protein", unit: "g"},
                          {name: "carbs", label: "Carbs", unit: "g"},
                          {name: "fat", label: "Fat", unit: "g"},
                          {name: "fiber", label: "Fiber", unit: "g"},
                          {name: "sugar", label: "Sugar", unit: "g"},
                        ].map((field) => (
                            <div key={field.name} className="space-y-2">
                              <label className="block text-sm font-semibold text-slate-700">
                                {field.label} ({field.unit})
                              </label>
                              <input
                                  type="number"
                                  value={editingRecipe[field.name] || 0}
                                  onChange={(e) =>
                                      setEditingRecipe({
                                        ...editingRecipe,
                                        [field.name]: Number.parseFloat(e.target.value) || 0,
                                      })
                                  }
                                  className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200"
                                  min="0"
                                  step="0.1"
                              />
                            </div>
                        ))}
                      </div>

                      {/* Status */}
                      <div className="space-y-2">
                        <label className="block text-sm font-semibold text-slate-700">Status</label>
                        <select
                            value={editingRecipe.published ? "published" : "draft"}
                            onChange={(e) =>
                                setEditingRecipe({...editingRecipe, published: e.target.value === "published"})
                            }
                            className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200"
                            required
                        >
                          <option value="published">Published</option>
                          <option value="draft">Draft</option>
                        </select>
                      </div>

                      <div className="flex justify-end space-x-4 pt-6">
                        <button
                            type="button"
                            onClick={() => setEditingRecipe(null)}
                            className="px-8 py-3 bg-slate-100 text-slate-700 rounded-xl hover:bg-slate-200 font-semibold transition-all duration-200"
                        >
                          Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-8 py-3 bg-gradient-to-r from-emerald-600 to-emerald-700 text-white rounded-xl hover:from-emerald-700 hover:to-emerald-800 font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
                        >
                          Save Changes
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
          )}

          {/* Delete Confirmation Modal */}
          {showDeleteConfirm.show && (
              <div
                  className="fixed inset-0 bg-black bg-opacity-50 overflow-y-auto h-full w-full z-50 flex items-center justify-center p-4">
                <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full">
                  <div className="p-8 text-center">
                    <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                      <i className="fas fa-exclamation-triangle text-2xl text-red-600"></i>
                    </div>
                    <h3 className="text-2xl font-bold text-slate-900 mb-4">Confirm Deletion</h3>
                    <p className="text-slate-600 mb-8">
                      Are you sure you want to delete this {showDeleteConfirm.type}? This action cannot be undone and
                      all
                      associated data will be permanently removed.
                    </p>
                    <div className="flex justify-center space-x-4">
                      <button
                          onClick={handleDeleteCancel}
                          className="px-8 py-3 bg-slate-100 text-slate-700 rounded-xl hover:bg-slate-200 font-semibold transition-all duration-200"
                      >
                        Cancel
                      </button>
                      <button
                          onClick={handleDeleteExecute}
                          className="px-8 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-xl hover:from-red-700 hover:to-red-800 font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
                      >
                        Delete Permanently
                      </button>
                    </div>
                  </div>
                </div>
              </div>
          )}
        </div>
      </div>
  );
};

export default AdminDashboard; 