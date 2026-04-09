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

// Admin
export const getAdminStats = () => axiosInstance.get('/admin/stats');
export const getAdminContacts = (params) => axiosInstance.get('/admin/contacts', { params });
export const updateAdminContact = (id, data) => axiosInstance.patch(`/admin/contacts/${id}`, data);
export const deleteAdminContact = (id) => axiosInstance.delete(`/admin/contacts/${id}`);
export const getAdminUsers = () => axiosInstance.get('/admin/users');
export const updateAdminUserRole = (id, role) => axiosInstance.patch(`/admin/users/${id}/role`, { role });
export const deleteAdminUser = (id) => axiosInstance.delete(`/admin/users/${id}`);
export const getAdminSuggestions = (params) => axiosInstance.get('/admin/suggestions', { params });
export const updateAdminSuggestion = (id, status) => axiosInstance.patch(`/admin/suggestions/${id}`, { status });
export const deleteAdminSuggestion = (id) => axiosInstance.delete(`/admin/suggestions/${id}`);
