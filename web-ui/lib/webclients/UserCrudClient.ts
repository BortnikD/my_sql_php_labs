import { AxiosResponse } from 'axios'
import axiosInstance from '@/lib/axiosInstance'
import { CrudClient } from '@/lib/CrudClient'
import { UserRecord, Role } from '@/lib/types'

export type UserUpdateDto = { role: Role }

class UserCrudClient implements CrudClient<UserRecord, never, UserUpdateDto> {
    getAll(): Promise<AxiosResponse<UserRecord[]>> {
        return axiosInstance.get<UserRecord[]>('/users')
    }

    create(): Promise<AxiosResponse<{ id: number }>> {
        return Promise.reject(new Error('Not supported'))
    }

    update(id: number, dto: UserUpdateDto): Promise<AxiosResponse<{ updated: boolean }>> {
        return axiosInstance.put(`/users/${id}/role`, { role: dto.role })
    }

    delete(id: number): Promise<AxiosResponse<{ deleted: boolean }>> {
        return axiosInstance.delete(`/users/${id}`)
    }
}

export default new UserCrudClient()
