import api from './axios'
export const createOrder = (courseId) => api.post(`/api/payments/create-order/${courseId}`).then(r => r.data)
export const verifyPayment = (data) => api.post('/api/payments/verify', data).then(r => r.data)
export const mockBuy = (courseId) => api.post(`/api/payments/mock-buy/${courseId}`).then(r => r.data)
