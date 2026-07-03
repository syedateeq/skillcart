import api from './axios'

export const getMyCertificates = () => api.get(`/api/certificates`).then(r => r.data)
export const getCertificateByCode = (code) => api.get(`/api/certificates/${code}`).then(r => r.data)
export const getMyCertificate = (courseId) => api.get(`/api/certificates/course/${courseId}`).then(r => r.data)
