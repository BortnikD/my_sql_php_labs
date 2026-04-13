'use client'

import DataTable from '@/app/components/DataTable'
import timesheetClient from '@/lib/webclients/TimesheetClient'
import {Timesheet} from '@/lib/types'
import {CreateTimesheetDto, UpdateTimesheetDto} from '@/lib/dto'
import {FieldDef} from '@/lib/FieldDef'
import employeeClient from "@/lib/webclients/EmployeeClient";
import jobClient from "@/lib/webclients/JobClient";

const fields: FieldDef<Timesheet>[] = [
    {key: 'id', label: 'ID', readonly: true},
    {
        key: 'employee_id', label: 'Employee ID', type: 'number', validations: [
            {predicate: v => v !== '' && v !== null && v !== undefined, message: 'Поле обязательно'},
            {predicate: v => Number.isInteger(Number(v)) && Number(v) > 0, message: 'Должно быть целым числом > 0'},
            {predicate: v => employeeClient.existsById(Number(v)), message: 'Сотрудника с таким id не существует'},
        ]
    },
    {
        key: 'job_id', label: 'Job ID', type: 'number', validations: [
            {predicate: v => v !== '' && v !== null && v !== undefined, message: 'Поле обязательно'},
            {predicate: v => Number.isInteger(Number(v)) && Number(v) > 0, message: 'Должно быть целым числом > 0'},
            {predicate: v => jobClient.existsById(Number(v)), message: 'Работы с таким id не существует'},
        ]
    },
    {
        key: 'hours', label: 'Часы', type: 'number', validations: [
            {predicate: v => v !== '' && v !== null && v !== undefined, message: 'Поле обязательно'},
            {predicate: v => Number(v) > 0, message: 'Часы должны быть больше 0'},
        ]
    },
    {key: 'created_at', label: 'Создан', readonly: true},
    {key: 'updated_at', label: 'Обновлён', readonly: true},
]

export default function Timesheets() {
    return (
        <div className="p-6">
            <DataTable<Timesheet, CreateTimesheetDto, UpdateTimesheetDto>
                title="Табель"
                client={timesheetClient}
                fields={fields}
            />
        </div>
    )
}
