export interface Employee {
    id: number
    category_id: number
    first_name: string
    last_name: string
    middle_name: string | null
    birth_date: string
    is_deleted: boolean
    created_at: string
    updated_at: string
    deleted_at: string | null
}

export interface Category {
    id: number
    name: string
    is_deleted: boolean
    created_at: string
    updated_at: string
    deleted_at: string | null
}

export interface Job {
    id: number
    name: string
    is_deleted: boolean
    created_at: string
    updated_at: string
    deleted_at: string | null
}

export interface Timesheet {
    id: number
    employee_id: number
    job_id: number
    hours: number
    is_deleted: boolean
    created_at: string
    updated_at: string
    deleted_at: string | null
}
