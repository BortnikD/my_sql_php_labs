export interface CreateEmployeeDto {
    category_id: number
    first_name: string
    last_name: string
    middle_name?: string
    birth_date: string
}

export type UpdateEmployeeDto = CreateEmployeeDto

export interface CreateCategoryDto {
    name: string
}

export type UpdateCategoryDto = CreateCategoryDto

export interface CreateJobDto {
    name: string
}

export type UpdateJobDto = CreateJobDto

export interface CreateTimesheetDto {
    employee_id: number
    job_id: number
    hours: number
}

export type UpdateTimesheetDto = CreateTimesheetDto
