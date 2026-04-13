'use client'

import DataTable from '@/app/components/DataTable'
import employeeClient from '@/lib/webclients/EmployeeClient'
import {Employee} from '@/lib/types'
import {CreateEmployeeDto, UpdateEmployeeDto} from '@/lib/dto'
import {FieldDef} from '@/lib/FieldDef'
import categoryClient from "@/lib/webclients/CategoryClient";

const fields: FieldDef<Employee>[] = [
    {key: 'id', label: 'ID', readonly: true},
    {
        key: 'category_id', label: 'Category ID', type: 'number', validations: [
            {predicate: v => v !== '' && v !== null && v !== undefined, message: 'Поле обязательно'},
            {predicate: v => Number.isInteger(Number(v)) && Number(v) > 0, message: 'Должно быть целым числом > 0'},
            {predicate: v => categoryClient.existsById(Number(v)), message: 'Указанной категории не существует'},
        ]
    },
    {
        key: 'first_name', label: 'Имя', validations: [
            {predicate: v => !!v && String(v).trim().length > 0, message: 'Поле обязательно'},
            {predicate: v => String(v).length <= 32, message: 'Максимум 32 символа'},
        ]
    },
    {
        key: 'last_name', label: 'Фамилия', validations: [
            {predicate: v => !!v && String(v).trim().length > 0, message: 'Поле обязательно'},
            {predicate: v => String(v).length <= 32, message: 'Максимум 32 символа'},
        ]
    },
    {
        key: 'middle_name', label: 'Отчество', validations: [
            {predicate: v => !v || String(v).length <= 32, message: 'Максимум 32 символа'},
        ]
    },
    {
        key: 'birth_date', label: 'Дата рождения', type: 'date', validations: [
            {predicate: v => !!v && String(v).trim().length > 0, message: 'Поле обязательно'},
        ]
    },
    {key: 'created_at', label: 'Создан', readonly: true},
    {key: 'updated_at', label: 'Обновлён', readonly: true},
]

export default function Employees() {
    return (
        <div className="p-6">
            <DataTable<Employee, CreateEmployeeDto, UpdateEmployeeDto>
                title="Работники"
                client={employeeClient}
                fields={fields}
            />
        </div>
    )
}
