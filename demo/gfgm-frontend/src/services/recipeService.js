import axios from '../config/axios';

const API_URL = '/api/recipes';

export const recipeService = {
  getAllRecipes: async (page = 0, size = 10) => {
    try {
      const response = await axios.get(`${API_URL}`, {
        params: { page, size }
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching recipes:", error);
      return { content: [], last: true };
    }
  },

  getUserRecipes: async (page = 0, size = 10) => {
    try {
      const response = await axios.get(`${API_URL}/my-recipes`, {
        params: { page, size }
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching user recipes:", error);
      return { content: [], last: true };
    }
  },

  getRecipeById: async (id) => {
    if (!id) {
      throw new Error("Recipe ID is required");
    }
    try {
      const response = await axios.get(`${API_URL}/${id}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching recipe:", error);
      throw error;
    }
  },

  createRecipe: async (recipeData, image) => {
    try {
      const formData = new FormData();
      formData.append('recipe', new Blob([JSON.stringify(recipeData)], { type: 'application/json' }));
      if (image) {
        formData.append('image', image);
      }

      const response = await axios.post(API_URL, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return response.data;
    } catch (error) {
      console.error("Error creating recipe:", error);
      throw error;
    }
  },

  updateRecipe: async (id, recipeData, image) => {
    try {
      const formData = new FormData();
      formData.append('recipe', new Blob([JSON.stringify(recipeData)], { type: 'application/json' }));
      if (image) {
        formData.append('image', image);
      }

      const response = await axios.put(`${API_URL}/${id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return response.data;
    } catch (error) {
      console.error("Error updating recipe:", error);
      throw error;
    }
  },

  deleteRecipe: async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
    } catch (error) {
      console.error("Error deleting recipe:", error);
      throw error;
    }
  },

  searchRecipes: async (query, page = 0, size = 10) => {
    try {
      const response = await axios.get(`${API_URL}/search`, {
        params: {
          query: encodeURIComponent(query),
          page,
          size
        }
      });
      return response.data;
    } catch (error) {
      console.error("Error searching recipes:", error);
      return { content: [], last: true };
    }
  },
}; 