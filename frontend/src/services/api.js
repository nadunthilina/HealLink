const API_BASE_URL = 'http://localhost:4000/api';

// Helper function to handle API requests
const apiRequest = async (endpoint, options = {}) => {
  const token = localStorage.getItem('accessToken');
  
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });

    const data = await response.json();

    if (!response.ok) {
      // Handle token expiration
      if (response.status === 401 && data.message === 'Token expired') {
        const refreshed = await authAPI.refreshToken();
        if (refreshed) {
          // Retry the original request with new token
          return apiRequest(endpoint, options);
        } else {
          // Refresh failed, redirect to login
          window.location.href = '/login';
          throw new Error('Session expired. Please login again.');
        }
      }
      throw new Error(data.message || 'API request failed');
    }

    return data;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};

// Authentication API
export const authAPI = {
  login: async (email, password) => {
    const data = await apiRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    
    if (data.accessToken) {
      localStorage.setItem('accessToken', data.accessToken);
      localStorage.setItem('refreshToken', data.refreshToken);
      localStorage.setItem('user', JSON.stringify(data.user));
    }
    
    return data;
  },

  register: async (userData) => {
    const data = await apiRequest('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
    
    if (data.accessToken) {
      localStorage.setItem('accessToken', data.accessToken);
      localStorage.setItem('refreshToken', data.refreshToken);
      localStorage.setItem('user', JSON.stringify(data.user));
    }
    
    return data;
  },

  logout: async () => {
    try {
      await apiRequest('/auth/logout', {
        method: 'POST',
      });
    } finally {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
    }
  },

  refreshToken: async () => {
    try {
      const refreshToken = localStorage.getItem('refreshToken');
      if (!refreshToken) return false;

      const data = await apiRequest('/auth/refresh', {
        method: 'POST',
        body: JSON.stringify({ refreshToken }),
      });

      if (data.accessToken) {
        localStorage.setItem('accessToken', data.accessToken);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Token refresh failed:', error);
      return false;
    }
  },
};

// Dashboard API
export const dashboardAPI = {
  getPatientDashboard: async () => {
    return await apiRequest('/dashboard/patient');
  },

  getCaretakerDashboard: async () => {
    return await apiRequest('/dashboard/caretaker');
  },
};

// Booking API
export const bookingAPI = {
  create: async (bookingData) => {
    return await apiRequest('/bookings', {
      method: 'POST',
      body: JSON.stringify(bookingData),
    });
  },

  getAll: async (filters = {}) => {
    const queryParams = new URLSearchParams(filters).toString();
    const endpoint = queryParams ? `/bookings?${queryParams}` : '/bookings';
    return await apiRequest(endpoint);
  },

  getById: async (id) => {
    return await apiRequest(`/bookings/${id}`);
  },

  cancel: async (id, reason) => {
    return await apiRequest(`/bookings/${id}/cancel`, {
      method: 'PATCH',
      body: JSON.stringify({ reason }),
    });
  },
};

// Notification API
export const notificationAPI = {
  getAll: async (filters = {}) => {
    const queryParams = new URLSearchParams(filters).toString();
    const endpoint = queryParams ? `/notifications?${queryParams}` : '/notifications';
    return await apiRequest(endpoint);
  },

  markAsRead: async (id) => {
    return await apiRequest(`/notifications/${id}/read`, {
      method: 'PATCH',
    });
  },

  markAllAsRead: async () => {
    return await apiRequest('/notifications/read-all', {
      method: 'PATCH',
    });
  },
};

// User API
export const userAPI = {
  getProfile: async () => {
    return await apiRequest('/users/me');
  },

  getCaretakers: async (page = 1, limit = 10) => {
    return await apiRequest(`/users/caretakers?page=${page}&limit=${limit}`);
  },
};

export default {
  auth: authAPI,
  dashboard: dashboardAPI,
  booking: bookingAPI,
  notification: notificationAPI,
  user: userAPI,
};
