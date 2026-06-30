import api from './axios'

export const getCart = () => api.get('/api/cart').then(r => r.data)
export const addToCart = (courseId) => api.post(`/api/cart/${courseId}`).then(r => r.data)
export const removeFromCart = (courseId) => api.delete(`/api/cart/${courseId}`).then(r => r.data)
export const clearCart = () => api.delete('/api/cart/clear').then(r => r.data)
