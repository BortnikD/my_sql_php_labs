'use client'

import DataTable from '@/app/components/DataTable'
import timesheetClient from '@/lib/webclients/TimesheetClient'
import employeeClient from '@/lib/webclients/EmployeeClient'
import jobClient from '@/lib/webclients/JobClient'
import {Timesheet} from '@/lib/types'
import {CreateTimesheetDto, UpdateTimesheetDto} from '@/lib/dto'
import {FieldDef} from '@/lib/FieldDef'

const fields: FieldDef<Timesheet>[] = [
    {key: 'id', label: 'ID', readonly: true},
    {
        key: 'employee_id', label: 'Сотрудник',
        relation: {
            fetchOptions: () => employeeClient.getAll().then(r => r.data.map(e => ({
                id: e.id,
                title: `${e.last_name} ${e.first_name}${e.middle_name ? ' ' + e.middle_name : ''}`
            })))
        },
        validations: [
            {predicate: v => !!v && v !== '', message: 'Выберите сотрудника'},
        ]
    },
    {
        key: 'job_id', label: 'Работа',
        relation: {
            fetchOptions: () => jobClient.getAll().then(r => r.data.map(j => ({id: j.id, title: j.name})))
        },
        validations: [
            {predicate: v => !!v && v !== '', message: 'Выберите работу'},
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
