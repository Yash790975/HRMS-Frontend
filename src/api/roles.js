import { API_ENDPOINTS } from './api-config';
import { apiCall } from './fetchHelper';


export const RolesAPI = {
  // Add a new role
  add: async (data) => {
    try {
      const response = await fetch(API_ENDPOINTS.EMPLOYEE_ROELS.ADD, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      return await response.json();
    } catch (error) {
      console.error('Error adding role:', error);
      throw error;
    }
  },

  // Update an existing role
  update: async (data) => {
    try {
      const response = await fetch(API_ENDPOINTS.EMPLOYEE_ROELS.UPDATE, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      return await response.json();
    } catch (error) {
      console.error('Error updating role:', error);
      throw error;
    }
  },

  // Get all roles
  getAll: async () => {
    try {
      const response = await fetch(API_ENDPOINTS.EMPLOYEE_ROELS.GET_ALL, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      return await response.json();
    } catch (error) {
      console.error('Error fetching roles:', error);
      throw error;
    }
  },

  // Get role by ID
  getById: async (id) => {
    try {
      const response = await fetch(API_ENDPOINTS.EMPLOYEE_ROELS.GET_BY_ID(id), {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      return await response.json();
    } catch (error) {
      console.error('Error fetching role by ID:', error);
      throw error;
    }
  },

  // Delete a role
  delete: async (id) => {
    try {
      const response = await fetch(API_ENDPOINTS.EMPLOYEE_ROELS.DELETE(id), {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      return await response.json();
    } catch (error) {
      console.error('Error deleting role:', error);
      throw error;
    }
  },
};