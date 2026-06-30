import api from './axios'
export const getCourses = (params = {}) => api.get('/api/courses', { params }).then(r => r.data)
export const getCourseDetail = (id) => api.get(`/api/courses/${id}`).then(r => r.data)
export const getLessons = (id) => api.get(`/api/courses/${id}/lessons`).then(r => r.data)
export const getCurriculum = (id) => api.get(`/api/courses/${id}/curriculum`).then(r => r.data)
