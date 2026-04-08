import axiosInstance from '@/lib/axiosInstance'
import { Job } from '@/lib/types'
import { CreateJobDto, UpdateJobDto } from '@/lib/dto'
import { AxiosResponse } from 'axios'

class JobClient {

    private static URL = '/jobs'

    getAll(): Promise<AxiosResponse<Job[]>> {
        return axiosInstance.get(JobClient.URL)
    }

    getById(id: number): Promise<AxiosResponse<Job>> {
        return axiosInstance.get(`${JobClient.URL}/${id}`)
    }

    create(dto: CreateJobDto): Promise<AxiosResponse<{ id: number }>> {
        return axiosInstance.post(JobClient.URL, dto)
    }

    update(id: number, dto: UpdateJobDto): Promise<AxiosResponse<{ updated: boolean }>> {
        return axiosInstance.put(`${JobClient.URL}/${id}`, dto)
    }

    delete(id: number): Promise<AxiosResponse<{ deleted: boolean }>> {
        return axiosInstance.delete(`${JobClient.URL}/${id}`)
    }
}

export default new JobClient()
