import axiosInstance from '@/lib/axiosInstance'
import {RoleRequest, UserRecord} from '@/lib/types'

class UserClient {
    async getMyRoleRequest(): Promise<RoleRequest | null> {
        const res = await axiosInstance.get<RoleRequest | { status: null }>('/users/role-request')
        return (res.data as RoleRequest).status != null ? (res.data as RoleRequest) : null
    }

    async getUsers(): Promise<UserRecord[]> {
        const res = await axiosInstance.get<UserRecord[]>('/users')
        return res.data
    }

    async getRoleRequests(): Promise<RoleRequest[]> {
        const res = await axiosInstance.get<RoleRequest[]>('/users/role-requests')
        return res.data
    }

    async approveRoleRequest(id: number): Promise<void> {
        await axiosInstance.put(`/users/role-requests/${id}/approve`)
    }

    async denyRoleRequest(id: number): Promise<void> {
        await axiosInstance.put(`/users/role-requests/${id}/deny`)
    }
}

export default new UserClient()
