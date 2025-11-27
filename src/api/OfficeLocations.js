import { API_ENDPOINTS } from './api-config';
import { apiCall } from './fetchHelper';

export const OfficeLocationsAPI = { 

  // Add new office location 
  add: async (data) => {
    return apiCall(API_ENDPOINTS.OFFICE_LOCATIONS.ADD, {
      method: 'POST',
      body: {
        name: data.name,
        city: data.city,
        state: data.state,
        country: data.country,
        full_address: data.full_address,
        pincode: data.pincode,
        latitude: data.latitude,
        longitude: data.longitude
      }
    });
  },

  // Update existing office location
  update: async (data) => {
    if (!data.id) throw new Error("Office location ID is required for update");

    return apiCall(API_ENDPOINTS.OFFICE_LOCATIONS.UPDATE, {
      method: 'POST',
      body: {
        id: data.id,
        name: data.name,
        city: data.city,
        state: data.state,
        country: data.country,
        full_address: data.full_address,
        pincode: data.pincode,
        latitude: data.latitude,
        longitude: data.longitude
      }
    });
  },

  // Get all office locations
  getAll: () =>
    apiCall(API_ENDPOINTS.OFFICE_LOCATIONS.GET_ALL, { method: 'GET' }),

  // Get office location by ID
  getById: (id) =>
    apiCall(API_ENDPOINTS.OFFICE_LOCATIONS.GET_BY_ID(id), { method: 'GET' }),

  // Delete office location by ID
  delete: (id) =>
    apiCall(API_ENDPOINTS.OFFICE_LOCATIONS.DELETE(id), { method: 'DELETE' }),
};