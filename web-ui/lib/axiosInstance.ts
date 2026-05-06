import axios from 'axios'
import BASE_URL from '@/lib/constants'
import {clearAuth, getToken} from '@/lib/auth'

const axiosInstance = axios.create({
    baseURL: BASE_URL,
    headers: {'Content-Type': 'application/json'},
})

axiosInstance.interceptors.request.use((config) => {
    const token = getToken()
    if (token) config.headers.Authorization = `Bearer ${token}`
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
            clearAuth()
            window.location.href = '/auth'
        }
        return Promise.reject(error)
    }
)

export default axiosInstance
