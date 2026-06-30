import api from './axios'

export const getWishlist = () => api.get('/api/wishlist').then(r => r.data)
export const addToWishlist = (courseId) => api.post(`/api/wishlist/${courseId}`).then(r => r.data)
export const removeFromWishlist = (courseId) => api.delete(`/api/wishlist/${courseId}`).then(r => r.data)
