import axios from 'axios';

const API_URL = '/api/recipes';

export const recipeService = {
  getAllRecipes: async (page = 0, size = 10) => {
    try {
      const response = await axios.get(`${API_URL}?page=${page}&size=${size}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching recipes:", error);
      return { content: [], last: true };
    }

  },

  getUserRecipes: async (page = 0, size = 10) => {
    const response = await axios.get(`${API_URL}/my-recipes?page=${page}&size=${size}`);
    return response.data;
  },

  getRecipeById: async (id) => {
    if (!id) {
      console.error("No recipe ID provided to getRecipeById");
      throw new Error("Recipe ID is required");
    }
    const response = await axios.get(`${API_URL}/${id}`);
    return response.data;
  },

  createRecipe: async (recipeData, image) => {
    const formData = new FormData();
    formData.append('recipe', new Blob([JSON.stringify(recipeData)], { type: 'application/json' }));
    if (image) {
      formData.append('image', image);
    }

    const response = await axios.post(API_URL, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  updateRecipe: async (id, recipeData, image) => {
    const formData = new FormData();
    formData.append('recipe', new Blob([JSON.stringify(recipeData)], { type: 'application/json' }));
    if (image) {
      formData.append('image', image);
    }

    const response = await axios.put(`${API_URL}/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  deleteRecipe: async (id) => {
    await axios.delete(`${API_URL}/${id}`);
  },

  searchRecipes: async (query, page = 0, size = 10) => {
    try {
      const response = await axios.get(`${API_URL}/search?query=${encodeURIComponent(query)}&page=${page}&size=${size}`);
      return response.data;
    } catch (error) {
      console.error("Error searching recipes:", error);
      return { content: [], last: true }; // Return an empty array with pagination info on error
    }
  },
}; 