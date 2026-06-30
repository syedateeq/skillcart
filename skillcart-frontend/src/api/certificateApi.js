import api from './axios'

export const getCertificateByHash = (hash) => api.get(`/api/certificates/${hash}`).then(r => r.data)
export const getMyCertificate = (courseId) => api.get(`/api/certificates/course/${courseId}`).then(r => r.data)
