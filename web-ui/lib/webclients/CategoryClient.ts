import axiosInstance from '@/lib/axiosInstance'
import { Category } from '@/lib/types'
import { CreateCategoryDto, UpdateCategoryDto } from '@/lib/dto'
import { CrudClient } from '@/lib/CrudClient'
import { AxiosResponse } from 'axios'

class CategoryClient implements CrudClient<Category, CreateCategoryDto, UpdateCategoryDto> {

    private static URL = '/categories'

    getAll(): Promise<AxiosResponse<Category[]>> {
        return axiosInstance.get(CategoryClient.URL)
    }

    getById(id: number): Promise<AxiosResponse<Category>> {
        return axiosInstance.get(`${CategoryClient.URL}/${id}`)
    }

    async existsById(id: number): Promise<boolean> {
        try {
            const res = await this.getById(id)
            return res.data !== null
        } catch {
            return false
        }
    }

    create(dto: CreateCategoryDto): Promise<AxiosResponse<{ id: number }>> {
        return axiosInstance.post(CategoryClient.URL, dto)
    }

    update(id: number, dto: UpdateCategoryDto): Promise<AxiosResponse<{ updated: boolean }>> {
        return axiosInstance.put(`${CategoryClient.URL}/${id}`, dto)
    }

    delete(id: number): Promise<AxiosResponse<{ deleted: boolean }>> {
        return axiosInstance.delete(`${CategoryClient.URL}/${id}`)
    }
}

// eslint-disable-next-line import/no-anonymous-default-export
export default new CategoryClient()
