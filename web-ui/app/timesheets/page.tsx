'use client'

import DataTable from '@/app/components/DataTable'
import timesheetClient from '@/lib/webclients/TimesheetClient'
import {Timesheet} from '@/lib/types'
import {CreateTimesheetDto, UpdateTimesheetDto} from '@/lib/dto'
import {FieldDef} from '@/lib/FieldDef'

const fields: FieldDef<Timesheet>[] = [
    {key: 'id', label: 'ID', readonly: true},
    {key: 'employee_id', label: 'Employee ID', type: 'number'},
    {key: 'job_id', label: 'Job ID', type: 'number'},
    {key: 'hours', label: 'Часы', type: 'number'},
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
