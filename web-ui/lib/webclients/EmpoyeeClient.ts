import axiosInstance from '@/lib/axiosInstance'
import { Employee } from '@/lib/types'
import { CreateEmployeeDto, UpdateEmployeeDto } from '@/lib/dto'
import { AxiosResponse } from 'axios'

class EmployeeClient {

    private static URL = '/employees'

    getAll(): Promise<AxiosResponse<Employee[]>> {
        return axiosInstance.get(EmployeeClient.URL)
    }

    getById(id: number): Promise<AxiosResponse<Employee>> {
        return axiosInstance.get(`${EmployeeClient.URL}/${id}`)
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

export default new EmployeeClient()
