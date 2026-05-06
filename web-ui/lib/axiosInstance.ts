import axios from 'axios'
import BASE_URL from '@/lib/constants'

const axiosInstance = axios.create({
    baseURL: BASE_URL,
    headers: { 'Content-Type': 'application/json' },
})

axiosInstance.interceptors.request.use((config) => {
    if (typeof window !== 'undefined') {
        const token = localStorage.getItem('token')
        if (token) {
            config.headers.Authorization = `Bearer ${token}`
        }
    }
    return config
})

axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
        if (
            error.response?.status === 401 &&
            typeof window !== 'undefined' &&
            window.location.pathname !== '/auth'
        ) {
            localStorage.removeItem('token')
            window.location.href = '/auth'
        }
        return Promise.reject(error)
    }
)

export default axiosInstance
