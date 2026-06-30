import api from './axios'
export const getMyCourses = () => api.get('/api/learning/my-courses').then(r => r.data)
export const getLearningCourse = (courseId) => api.get(`/api/learning/course/${courseId}`).then(r => r.data)
export const markLessonComplete = (lessonId) => api.post(`/api/learning/progress/${lessonId}`).then(r => r.data)
