const API_BASE_URL = 'http://localhost:5001/api';

// Get token from localStorage
const getAuthToken = () => {
  return localStorage.getItem('authToken');
};

// Set token in localStorage
const setAuthToken = (token) => {
  localStorage.setItem('authToken', token);
};

// Remove token from localStorage
const removeAuthToken = () => {
  localStorage.removeItem('authToken');
  localStorage.removeItem('user');
};

// API utility function
const apiRequest = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const defaultOptions = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  // Add auth token if available
  const token = getAuthToken();
  if (token) {
    defaultOptions.headers['Authorization'] = `Bearer ${token}`;
  }

  const config = {
    ...defaultOptions,
    ...options,
    headers: {
      ...defaultOptions.headers,
      ...options.headers,
    },
  };

  try {
    console.log('Making API request to:', url);
    console.log('Request config:', config);
    
    const response = await fetch(url, config);
    
    console.log('Response status:', response.status);
    console.log('Response ok:', response.ok);
    
    const data = await response.json();
    console.log('Response data:', data);

    // Handle unauthorized responses
    if (response.status === 401) {
      removeAuthToken();
      window.location.href = '/login';
      throw new Error('Session expired. Please login again.');
    }

    if (!response.ok) {
      throw new Error(data.message || `HTTP error! status: ${response.status}`);
    }

    return data;
  } catch (error) {
    console.error('API Request Error:', error);
    
    // Provide more specific error messages
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      throw new Error('Unable to connect to server. Please check if the backend is running.');
    }
    
    throw error;
  }
};

// Authentication API functions
export const authAPI = {
  // Register new user
  register: async (userData) => {
    const response = await apiRequest('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
    
    if (response.success && response.data.token) {
      setAuthToken(response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    
    return response;
  },

  // Login user
  login: async (credentials) => {
    const response = await apiRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
    
    if (response.success && response.data.token) {
      setAuthToken(response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    
    return response;
  },

  // Logout user
  logout: async () => {
    try {
      await apiRequest('/auth/logout', {
        method: 'POST',
      });
    } catch {
      // Ignore errors on logout
    } finally {
      removeAuthToken();
    }
  },

  // Get current user profile
  getProfile: async () => {
    return apiRequest('/auth/profile');
  },

  // Update user profile
  updateProfile: async (profileData) => {
    return apiRequest('/auth/profile', {
      method: 'PUT',
      body: JSON.stringify(profileData),
    });
  },

  // Change password
  changePassword: async (passwordData) => {
    return apiRequest('/auth/change-password', {
      method: 'PUT',
      body: JSON.stringify(passwordData),
    });
  },

  // Check if user is authenticated
  isAuthenticated: () => {
    const token = getAuthToken();
    const user = localStorage.getItem('user');
    return !!(token && user);
  },

  // Get current user from localStorage
  getCurrentUser: () => {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  },
};

// Booking API functions
export const bookingAPI = {
  // Get user's own bookings
  getMyBookings: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return apiRequest(`/bookings/my-bookings${queryString ? `?${queryString}` : ''}`);
  },

  // Get all bookings (admin/faculty only)
  getAll: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return apiRequest(`/bookings${queryString ? `?${queryString}` : ''}`);
  },

  // Get booking by ID
  getById: async (id) => {
    return apiRequest(`/bookings/${id}`);
  },

  // Create new booking (include personal information for form submission)
  create: async (bookingData) => {
    return apiRequest('/bookings', {
      method: 'POST',
      body: JSON.stringify(bookingData),
    });
  },

  // Update booking status (admin/faculty only)
  updateStatus: async (id, statusData) => {
    // Remove reviewedBy as it comes from auth
    // eslint-disable-next-line no-unused-vars
    const { reviewedBy, ...cleanStatusData } = statusData;
    return apiRequest(`/bookings/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify(cleanStatusData),
    });
  },

  // Delete booking
  delete: async (id) => {
    return apiRequest(`/bookings/${id}`, {
      method: 'DELETE',
    });
  },

  // Check availability
  checkAvailability: async (building, room, date) => {
    return apiRequest(`/bookings/availability/${building}/${room}?date=${date}`);
  },
};

// Room API functions
export const roomAPI = {
  // Get all rooms
  getAll: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return apiRequest(`/rooms${queryString ? `?${queryString}` : ''}`);
  },

  // Get rooms by building
  getByBuilding: async (building) => {
    return apiRequest(`/rooms/building/${encodeURIComponent(building)}`);
  },

  // Get room by ID
  getById: async (id) => {
    return apiRequest(`/rooms/${id}`);
  },

  // Create new room (admin only)
  create: async (roomData) => {
    return apiRequest('/rooms', {
      method: 'POST',
      body: JSON.stringify(roomData),
    });
  },

  // Update room
  update: async (id, roomData) => {
    return apiRequest(`/rooms/${id}`, {
      method: 'PUT',
      body: JSON.stringify(roomData),
    });
  },

  // Delete room
  delete: async (id) => {
    return apiRequest(`/rooms/${id}`, {
      method: 'DELETE',
    });
  },
};

// User management API functions (admin only)
export const userAPI = {
  // Get all users
  getAll: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return apiRequest(`/users${queryString ? `?${queryString}` : ''}`);
  },

  // Get user by ID
  getById: async (id) => {
    return apiRequest(`/users/${id}`);
  },

  // Update user role
  updateRole: async (id, role) => {
    return apiRequest(`/users/${id}/role`, {
      method: 'PATCH',
      body: JSON.stringify({ role }),
    });
  },

  // Deactivate user
  deactivate: async (id) => {
    return apiRequest(`/users/${id}/deactivate`, {
      method: 'PATCH',
    });
  },

  // Activate user
  activate: async (id) => {
    return apiRequest(`/users/${id}/activate`, {
      method: 'PATCH',
    });
  },

  // Get user statistics
  getStats: async () => {
    return apiRequest('/users/stats/overview');
  },
};

// API health check
export const healthCheck = async () => {
  return apiRequest('/health');
};

export default { authAPI, bookingAPI, roomAPI, userAPI, healthCheck };
