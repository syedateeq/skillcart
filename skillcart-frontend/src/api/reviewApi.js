import api from './axios'

export const getReviews = (courseId) => api.get(`/api/courses/${courseId}/reviews`).then(r => r.data)
export const addReview = (courseId, data) => api.post(`/api/courses/${courseId}/reviews`, data).then(r => r.data)
