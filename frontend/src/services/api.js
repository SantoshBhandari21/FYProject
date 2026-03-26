// src/services/api.js
const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

// Helper function to get auth token
const getToken = () => {
  return localStorage.getItem("token");
};

// Helper function to make API calls
const apiCall = async (endpoint, options = {}) => {
  const token = getToken();

  const config = {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
  };

  // Add token if available
  if (token) {
    config.headers["Authorization"] = `Bearer ${token}`;
  }

  // Add body if present
  if (options.body && !(options.body instanceof FormData)) {
    config.body = JSON.stringify(options.body);
  } else if (options.body instanceof FormData) {
    // Remove Content-Type for FormData (browser will set it)
    delete config.headers["Content-Type"];
    config.body = options.body;
  }

  const response = await fetch(`${API_BASE}${endpoint}`, config);

  // Safely parse JSON (even if server returns empty)
  let data = null;
  try {
    data = await response.json();
  } catch (e) {
    data = null;
  }

  if (!response.ok) {
    // Handle token expiration
    if (response.status === 401) {
      console.warn("Token expired or invalid, redirecting to login");
      // Clear stored auth data
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      // Redirect to login
      if (typeof window !== "undefined") {
        window.location.href = "/login";
      }
    }
    const msg = data?.message || `Request failed (${response.status})`;
    console.error(`API Error [${response.status}]:`, endpoint, msg, data);
    throw new Error(msg);
  }

  return data;
};

// ==================== AUTH API ====================

export const authAPI = {
  register: async (userData) => {
    return apiCall("/auth/register", {
      method: "POST",
      body: userData,
    });
  },

  login: async (credentials) => {
    return apiCall("/auth/login", {
      method: "POST",
      body: credentials,
    });
  },

  getMe: async () => {
    return apiCall("/auth/me");
  },

  updateProfile: async (profileData) => {
    return apiCall("/auth/profile", {
      method: "PUT",
      body: profileData,
    });
  },

  updatePassword: async (passwordData) => {
    return apiCall("/auth/password", {
      method: "PUT",
      body: passwordData,
    });
  },

  uploadProfilePhoto: async (formData) => {
    const token = getToken();
    const config = {
      method: "POST",
      headers: {},
    };

    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }

    config.body = formData;

    const response = await fetch(`${API_BASE}/auth/profile-photo`, config);

    let data = null;
    try {
      data = await response.json();
    } catch (e) {
      data = null;
    }

    if (!response.ok) {
      if (response.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        if (typeof window !== "undefined") {
          window.location.href = "/login";
        }
      }
      const msg = data?.message || `Upload failed (${response.status})`;
      console.error(
        `API Error [${response.status}]:`,
        "/auth/profile-photo",
        msg,
        data,
      );
      throw new Error(msg);
    }

    return data;
  },

  logout: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  },
};

// ==================== ROOMS API ====================

export const roomsAPI = {
  getRooms: async (filters = {}) => {
    const queryParams = new URLSearchParams();

    Object.keys(filters).forEach((key) => {
      if (filters[key]) queryParams.append(key, filters[key]);
    });

    const queryString = queryParams.toString();
    return apiCall(`/rooms${queryString ? `?${queryString}` : ""}`);
  },

  getRoomById: async (id) => {
    return apiCall(`/rooms/${id}`);
  },

  createRoom: async (roomData) => {
    // If already FormData, use it directly
    if (roomData instanceof FormData) {
      return apiCall("/rooms", {
        method: "POST",
        body: roomData,
      });
    }

    // Otherwise, create FormData from object
    const formData = new FormData();

    Object.keys(roomData).forEach((key) => {
      if (key === "amenities") {
        formData.append(key, JSON.stringify(roomData[key]));
      } else if (key === "mainImage" && roomData[key]) {
        formData.append(key, roomData[key]);
      } else if (roomData[key] !== null && roomData[key] !== undefined) {
        formData.append(key, roomData[key]);
      }
    });

    return apiCall("/rooms", {
      method: "POST",
      body: formData,
    });
  },

  getMyRooms: async () => {
    return apiCall("/rooms/owner/my-rooms");
  },

  updateRoom: async (id, roomData) => {
    // If already FormData, use it directly
    if (roomData instanceof FormData) {
      return apiCall(`/rooms/${id}`, {
        method: "PUT",
        body: roomData,
      });
    }

    // Otherwise, create FormData from object
    const formData = new FormData();

    Object.keys(roomData).forEach((key) => {
      if (key === "amenities") {
        formData.append(key, JSON.stringify(roomData[key]));
      } else if (key === "mainImage" && roomData[key]) {
        formData.append(key, roomData[key]);
      } else if (roomData[key] !== null && roomData[key] !== undefined) {
        formData.append(key, roomData[key]);
      }
    });

    return apiCall(`/rooms/${id}`, {
      method: "PUT",
      body: formData,
    });
  },

  deleteRoom: async (id) => {
    return apiCall(`/rooms/${id}`, {
      method: "DELETE",
    });
  },

  getFavorites: async () => {
    return apiCall("/rooms/user/favorites");
  },

  addToFavorites: async (roomId) => {
    return apiCall(`/rooms/${roomId}/favorite`, {
      method: "POST",
    });
  },

  removeFromFavorites: async (roomId) => {
    return apiCall(`/rooms/${roomId}/favorite`, {
      method: "DELETE",
    });
  },
};

// ==================== BOOKINGS API ====================

export const bookingsAPI = {
  createBooking: async (bookingData) => {
    return apiCall("/bookings", {
      method: "POST",
      body: bookingData,
    });
  },

  getMyBookings: async (status = null) => {
    const queryString = status ? `?status=${status}` : "";
    return apiCall(`/bookings/my-bookings${queryString}`);
  },

  getBookingRequests: async (status = null) => {
    const queryString = status ? `?status=${status}` : "";
    return apiCall(`/bookings/requests${queryString}`);
  },

  getBookingById: async (id) => {
    return apiCall(`/bookings/${id}`);
  },

  updateBookingStatus: async (id, status) => {
    return apiCall(`/bookings/${id}/status`, {
      method: "PUT",
      body: { status },
    });
  },

  cancelBooking: async (id) => {
    return apiCall(`/bookings/${id}/cancel`, {
      method: "PUT",
    });
  },

  completeBooking: async (id) => {
    return apiCall(`/bookings/${id}/complete`, {
      method: "PUT",
    });
  },

  addReview: async (bookingId, reviewData) => {
    return apiCall(`/bookings/${bookingId}/review`, {
      method: "POST",
      body: reviewData,
    });
  },

  getOwnerStats: async () => {
    return apiCall("/bookings/stats/dashboard");
  },
};

// ==================== USERS API (Admin Only) ====================
// ✅ IMPORTANT: your backend mounts admin endpoints at /api/admin/...

export const usersAPI = {
  getAllUsers: async (filters = {}) => {
    const queryParams = new URLSearchParams();

    Object.keys(filters).forEach((key) => {
      if (filters[key]) queryParams.append(key, filters[key]);
    });

    const queryString = queryParams.toString();
    return apiCall(`/admin/users${queryString ? `?${queryString}` : ""}`);
  },

  getUserById: async (id) => {
    return apiCall(`/admin/users/${id}`);
  },

  createUser: async (userData) => {
    return apiCall(`/admin/users`, {
      method: "POST",
      body: userData,
    });
  },

  updateUser: async (id, userData) => {
    return apiCall(`/admin/users/${id}`, {
      method: "PUT",
      body: userData,
    });
  },

  deleteUser: async (id) => {
    return apiCall(`/admin/users/${id}`, {
      method: "DELETE",
    });
  },

  toggleUserStatus: async (id) => {
    return apiCall(`/admin/users/${id}/toggle-status`, {
      method: "PUT",
    });
  },

  getAdminStats: async () => {
    return apiCall(`/admin/stats/dashboard`);
  },

  getAllRooms: async (page = 1, limit = 20) => {
    return apiCall(`/admin/rooms/all?page=${page}&limit=${limit}`);
  },

  getAllBookings: async (filters = {}) => {
    const queryParams = new URLSearchParams();

    Object.keys(filters).forEach((key) => {
      if (filters[key]) queryParams.append(key, filters[key]);
    });

    const queryString = queryParams.toString();
    return apiCall(
      `/admin/bookings/all${queryString ? `?${queryString}` : ""}`,
    );
  },
};

// ==================== NOTIFICATIONS API ====================

export const notificationsAPI = {
  getNotifications: async (status = null) => {
    const queryString = status ? `?status=${status}` : "";
    return apiCall(`/notifications${queryString}`);
  },

  markAsRead: async (notificationId) => {
    return apiCall(`/notifications/${notificationId}/read`, {
      method: "PUT",
    });
  },

  markAllAsRead: async () => {
    return apiCall(`/notifications/all/read-all`, {
      method: "PUT",
    });
  },

  deleteNotification: async (notificationId) => {
    return apiCall(`/notifications/${notificationId}`, {
      method: "DELETE",
    });
  },
};

// ==================== HELPER FUNCTIONS ====================

export const saveAuthData = (token, user) => {
  localStorage.setItem("token", token);
  localStorage.setItem("user", JSON.stringify(user));
};

export const getStoredUser = () => {
  const userStr = localStorage.getItem("user");
  return userStr ? JSON.parse(userStr) : null;
};

export const isAuthenticated = () => {
  return !!getToken();
};

export const hasRole = (role) => {
  const user = getStoredUser();
  return user && user.role === role;
};

// Export roomAPI as alias for roomsAPI
export const roomAPI = roomsAPI;

export default {
  auth: authAPI,
  rooms: roomsAPI,
  bookings: bookingsAPI,
  users: usersAPI,
  notifications: notificationsAPI,
  saveAuthData,
  getStoredUser,
  isAuthenticated,
  hasRole,
};
