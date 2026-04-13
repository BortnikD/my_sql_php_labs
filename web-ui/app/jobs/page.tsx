'use client'

import DataTable from '@/app/components/DataTable'
import jobClient from '@/lib/webclients/JobClient'
import {Job} from '@/lib/types'
import {CreateJobDto, UpdateJobDto} from '@/lib/dto'
import {FieldDef} from '@/lib/FieldDef'

const fields: FieldDef<Job>[] = [
    {key: 'id', label: 'ID', readonly: true},
    {
        key: 'name', label: 'Название', validations: [
            {predicate: v => !!v && String(v).trim().length > 0, message: 'Поле обязательно'},
            {predicate: v => String(v).length <= 255, message: 'Максимум 255 символов'},
        ]
    },
    {
        key: 'company_name', label: 'Название компании', validations: [
            {predicate: v => !!v && String(v).trim().length > 0, message: 'Поле обязательно'},
            {predicate: v => String(v).length <= 255, message: 'Максимум 255 символов'},
        ]
    },
    {
        key: 'start_at', label: 'Дата начала', type: 'date', validations: [
            {predicate: v => !!v && String(v).trim().length > 0, message: 'Поле обязательно'},
        ]
    },
    {key: 'is_completed', label: 'Выполнено'},
    {key: 'completed_at', label: 'Дата выполнения', type: 'date'},
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
