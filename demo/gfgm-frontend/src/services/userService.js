import axios from '../config/axios';

const API_URL = '/api/users';

export const userService = {
  updateProfile: async (profileData) => {
    try {
      const response = await axios.put(`${API_URL}/profile`, profileData);
      return response.data;
    } catch (error) {
      console.error("Error updating profile:", error);
      throw error;
    }
  },

  updatePassword: async (passwordData) => {
    try {
      const response = await axios.put('/api/users/profile/password', passwordData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  updateProfilePicture: async (image) => {
    try {
      const formData = new FormData();
      formData.append('image', image);

      const response = await axios.put(`${API_URL}/profile/picture`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return response.data;
    } catch (error) {
      console.error("Error updating profile picture:", error);
      throw error;
    }
  }
}; 