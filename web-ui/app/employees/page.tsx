'use client'

import DataTable from '@/app/components/DataTable'
import employeeClient from '@/lib/webclients/EmpoyeeClient'
import {Employee} from '@/lib/types'
import {CreateEmployeeDto, UpdateEmployeeDto} from '@/lib/dto'
import {FieldDef} from '@/lib/FieldDef'

const fields: FieldDef<Employee>[] = [
    {key: 'id', label: 'ID', readonly: true},
    {key: 'category_id', label: 'Category ID', type: 'number'},
    {key: 'first_name', label: 'Имя'},
    {key: 'last_name', label: 'Фамилия'},
    {key: 'middle_name', label: 'Отчество'},
    {key: 'birth_date', label: 'Дата рождения', type: 'date'},
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
