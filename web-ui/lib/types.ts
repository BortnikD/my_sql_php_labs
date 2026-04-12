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
    rate: number
    is_deleted: boolean
    created_at: string
    updated_at: string
    deleted_at: string | null
}

export interface Job {
    id: number
    name: string
    company_name: string | null
    is_completed: boolean
    start_at: string | null
    completed_at: string | null
    is_deleted: boolean
    created_at: string
    updated_at: string
    deleted_at: string | null
}

export interface ChargeItem {
    full_name: string
    category_name: string
    rate: number
    hours: number
    completed_at: string
    paid_out: number
}

export interface ChargesTotal {
    company_name: string
    total_hours: number
    total_sum: number
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
