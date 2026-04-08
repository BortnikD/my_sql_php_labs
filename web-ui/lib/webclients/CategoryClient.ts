import axiosInstance from '@/lib/axiosInstance'
import { Category } from '@/lib/types'
import { CreateCategoryDto, UpdateCategoryDto } from '@/lib/dto'
import { AxiosResponse } from 'axios'

class CategoryClient {

    private static URL = '/categories'

    getAll(): Promise<AxiosResponse<Category[]>> {
        return axiosInstance.get(CategoryClient.URL)
    }

    getById(id: number): Promise<AxiosResponse<Category>> {
        return axiosInstance.get(`${CategoryClient.URL}/${id}`)
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

export default new CategoryClient()
