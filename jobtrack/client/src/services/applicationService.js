import api from './api';

export const fetchApplications = (params) => api.get('/applications', { params });
export const fetchStats = () => api.get('/applications/stats');
export const fetchApplication = (id) => api.get(`/applications/${id}`);
export const createApplication = (data) => api.post('/applications', data);
export const updateApplication = (id, data) => api.put(`/applications/${id}`, data);
export const deleteApplication = (id) => api.delete(`/applications/${id}`);
