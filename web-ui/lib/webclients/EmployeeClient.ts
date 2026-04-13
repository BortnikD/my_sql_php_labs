import axiosInstance from '@/lib/axiosInstance'
import { Employee } from '@/lib/types'
import { CreateEmployeeDto, UpdateEmployeeDto } from '@/lib/dto'
import { CrudClient } from '@/lib/CrudClient'
import { AxiosResponse } from 'axios'

class EmployeeClient implements CrudClient<Employee, CreateEmployeeDto, UpdateEmployeeDto> {

    private static URL = '/employees'

    getAll(): Promise<AxiosResponse<Employee[]>> {
        return axiosInstance.get(EmployeeClient.URL)
    }

    getById(id: number): Promise<AxiosResponse<Employee>> {
        return axiosInstance.get(`${EmployeeClient.URL}/${id}`)
    }

    async existsById(id: number): Promise<boolean> {
        try {
            const result = await this.getById(id)
            return result !== null
        } catch {
            return false
        }
    }

    create(dto: CreateEmployeeDto): Promise<AxiosResponse<{ id: number }>> {
        return axiosInstance.post(EmployeeClient.URL, dto)
    }

    update(id: number, dto: UpdateEmployeeDto): Promise<AxiosResponse<{ updated: boolean }>> {
        return axiosInstance.put(`${EmployeeClient.URL}/${id}`, dto)
    }

    delete(id: number): Promise<AxiosResponse<{ deleted: boolean }>> {
        return axiosInstance.delete(`${EmployeeClient.URL}/${id}`)
    }
}

// eslint-disable-next-line import/no-anonymous-default-export
export default new EmployeeClient()
