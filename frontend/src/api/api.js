import axiosInstance from './axiosInstance';

// Auth
export const registerUser = (data) => axiosInstance.post('/auth/register', data);
export const loginUser = (data) => axiosInstance.post('/auth/login', data);
export const getMe = () => axiosInstance.get('/auth/me');

// Users
export const getAllUsers = () => axiosInstance.get('/users');
export const getUserById = (id) => axiosInstance.get(`/users/${id}`);
export const updateUser = (id, data) => axiosInstance.put(`/users/${id}`, data);
export const deleteUser = (id) => axiosInstance.delete(`/users/${id}`);

// Suggestions
export const createSuggestion = (data) => axiosInstance.post('/suggestions', data);
export const getAllSuggestions = () => axiosInstance.get('/suggestions');
export const updateSuggestionStatus = (id, status) =>
  axiosInstance.patch(`/suggestions/${id}`, { status });
export const deleteSuggestion = (id) => axiosInstance.delete(`/suggestions/${id}`);

// Contact
export const submitContact = (data) => axiosInstance.post('/contact', data);
