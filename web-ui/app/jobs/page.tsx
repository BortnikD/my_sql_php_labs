'use client'

import DataTable from '@/app/components/DataTable'
import jobClient from '@/lib/webclients/JobClient'
import {Job} from '@/lib/types'
import {CreateJobDto, UpdateJobDto} from '@/lib/dto'
import {FieldDef} from '@/lib/FieldDef'

const fields: FieldDef<Job>[] = [
    {key: 'id', label: 'ID', readonly: true},
    {key: 'name', label: 'Название'},
    {key: 'created_at', label: 'Создан', readonly: true},
    {key: 'updated_at', label: 'Обновлён', readonly: true},
]

export default function Jobs() {
    return (
        <div className="p-6">
            <DataTable<Job, CreateJobDto, UpdateJobDto>
                title="Работы"
                client={jobClient}
                fields={fields}
            />
        </div>
    )
}
