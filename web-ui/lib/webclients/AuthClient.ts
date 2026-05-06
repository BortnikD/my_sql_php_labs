import axiosInstance from '@/lib/axiosInstance'
import {AuthToken} from '@/lib/types'

class AuthClient {
    async login(username: string, password: string): Promise<AuthToken> {
        const res = await axiosInstance.post<AuthToken>('/auth/login', {username, password})
        return res.data
    }

    async register(username: string, email: string, password: string): Promise<number> {
        const res = await axiosInstance.post<{ id: number }>('/auth/register', {
            username,
            email,
            password,
        })
        return res.data.id
    }
}

export default new AuthClient()
