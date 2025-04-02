// import axios from 'axios';

// // Configure axios instance with base URL and default headers
// const api = axios.create({
//   baseURL: 'http://localhost:5000/api/auth', // Replace with your actual API base URL
//   headers: {
//     'Content-Type': 'application/json',
//   },
// });

// // Add request interceptor to include auth token if available
// api.interceptors.request.use(
//   (config) => {
//     const token = localStorage.getItem('token');
//     if (token) {
//       config.headers.Authorization = `Bearer ${token}`;
//     }
//     return config;
//   },
//   (error) => {
//     return Promise.reject(error);
//   }
// );

// // Add response interceptor to handle errors globally
// api.interceptors.response.use(
//   (response) => response,
//   (error) => {
//     if (error.response?.status === 401) {
//       // Handle unauthorized access (token expired, invalid, etc.)
//       localStorage.removeItem('token');
//       localStorage.removeItem('user');
//       window.location.href = '/login'; // Redirect to login page
//     }
//     return Promise.reject(error.response?.data || error.message);
//   }
// );

// // Authentication Service
// const AuthService = {
//   /**
//    * Login user with email and password
//    * @param {string} email 
//    * @param {string} password 
//    * @returns {Promise<Object>} User data and token
//    */
//   async login(email, password) {
//     try {
//       const response = await api.post('/login', { email, password });
      
//       // Store token and user data in localStorage
//       if (response.data.token) {
//         localStorage.setItem('token', response.data.token);
//         localStorage.setItem('user', JSON.stringify(response.data.user));
//       }
      
//       return response.data;
//     } catch (error) {
//       console.error('Login error:', error);
//       throw error;
//     }
//   },

//   /**
//    * Register a new user
//    * @param {Object} userData - User registration data
//    * @param {File} [cv] - Optional CV file
//    * @returns {Promise<Object>} User data and token
//    */
//   async register(userData, cv = null) {
//     const formData = new FormData();
    
//     // Append all user data to formData
//     Object.keys(userData).forEach(key => {
//       formData.append(key, userData[key]);
//     });

//     // Append CV file if provided
//     if (cv) {
//       formData.append('cv', cv);
//     }

//     try {
//       const response = await api.post('/register', formData, {
//         headers: { 'Content-Type': 'multipart/form-data' },
//       });

//       // Store token and user data in localStorage
//       if (response.data.token) {
//         localStorage.setItem('token', response.data.token);
//         localStorage.setItem('user', JSON.stringify(response.data.user));
//       }

//       return response.data;
//     } catch (error) {
//       console.error('Registration error:', error);
//       throw error;
//     }
//   },

//   /**
//    * Logout the current user
//    */
//   logout() {
//     localStorage.removeItem('token');
//     localStorage.removeItem('user');
//     // You might want to call your backend logout endpoint here if needed
//     // await api.post('/logout');
//   },

//   /**
//    * Get the current authenticated user
//    * @returns {Object|null} User object or null if not authenticated
//    */
//   getCurrentUser() {
//     const user = localStorage.getItem('user');
//     return user ? JSON.parse(user) : null;
//   },

//   /**
//    * Check if user is authenticated
//    * @returns {boolean} True if authenticated
//    */
//   isAuthenticated() {
//     return !!localStorage.getItem('token');
//   },

//   /**
//    * Verify email with token
//    * @param {string} token - Verification token
//    * @returns {Promise<Object>} Verification response
//    */
//   async verifyEmail(token) {
//     try {
//       const response = await api.post('/verify-email', { token });
//       return response.data;
//     } catch (error) {
//       console.error('Email verification error:', error);
//       throw error;
//     }
//   },

//   /**
//    * Request password reset
//    * @param {string} email - User email
//    * @returns {Promise<Object>} Reset request response
//    */
//   async forgotPassword(email) {
//     try {
//       const response = await api.post('/forgot-password', { email });
//       return response.data;
//     } catch (error) {
//       console.error('Forgot password error:', error);
//       throw error;
//     }
//   },

//   /**
//    * Reset password with token
//    * @param {string} token - Reset token
//    * @param {string} newPassword - New password
//    * @returns {Promise<Object>} Reset response
//    */
//   async resetPassword(token, newPassword) {
//     try {
//       const response = await api.post('/reset-password', { token, newPassword });
//       return response.data;
//     } catch (error) {
//       console.error('Reset password error:', error);
//       throw error;
//     }
//   }
// };

