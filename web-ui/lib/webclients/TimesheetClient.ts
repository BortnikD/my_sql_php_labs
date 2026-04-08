import axiosInstance from '@/lib/axiosInstance'
import { Timesheet } from '@/lib/types'
import { CreateTimesheetDto, UpdateTimesheetDto } from '@/lib/dto'
import { AxiosResponse } from 'axios'

class TimesheetClient {

    private static URL = '/timesheets'

    getAll(): Promise<AxiosResponse<Timesheet[]>> {
        return axiosInstance.get(TimesheetClient.URL)
    }

    getByEmployeeId(employeeId: number): Promise<AxiosResponse<Timesheet[]>> {
        return axiosInstance.get(TimesheetClient.URL, { params: { employee_id: employeeId } })
    }

    getByJobId(jobId: number): Promise<AxiosResponse<Timesheet[]>> {
        return axiosInstance.get(TimesheetClient.URL, { params: { job_id: jobId } })
    }

    getById(id: number): Promise<AxiosResponse<Timesheet>> {
        return axiosInstance.get(`${TimesheetClient.URL}/${id}`)
    }

    create(dto: CreateTimesheetDto): Promise<AxiosResponse<{ id: number }>> {
        return axiosInstance.post(TimesheetClient.URL, dto)
    }

    update(id: number, dto: UpdateTimesheetDto): Promise<AxiosResponse<{ updated: boolean }>> {
        return axiosInstance.put(`${TimesheetClient.URL}/${id}`, dto)
    }

    delete(id: number): Promise<AxiosResponse<{ deleted: boolean }>> {
        return axiosInstance.delete(`${TimesheetClient.URL}/${id}`)
    }
}

export default new TimesheetClient()
