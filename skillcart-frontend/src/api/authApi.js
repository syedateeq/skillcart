import api from './axios'
export const registerUser = (data) => api.post('/api/auth/register', data).then(r => r.data)
export const loginUser = (data) => api.post('/api/auth/login', data).then(r => r.data)
export const getCurrentUser = () => api.get('/api/auth/me').then(r => r.data)
