'use client'

import DataTable from '@/app/components/DataTable'
import categoryClient from '@/lib/webclients/CategoryClient'
import {Category} from '@/lib/types'
import {CreateCategoryDto, UpdateCategoryDto} from '@/lib/dto'
import {FieldDef} from '@/lib/FieldDef'

const fields: FieldDef<Category>[] = [
    {key: 'id', label: 'ID', readonly: true},
    {
        key: 'name', label: 'Название', validations: [
            {predicate: v => !!v && String(v).trim().length > 0, message: 'Поле обязательно'},
            {predicate: v => String(v).length <= 64, message: 'Максимум 64 символа'},
        ]
    },
    {
        key: 'rate', label: 'Ставка', type: 'number', validations: [
            {predicate: v => v !== '' && v !== null && v !== undefined, message: 'Поле обязательно'},
            {predicate: v => Number(v) > 0, message: 'Ставка должна быть больше 0'},
        ]
    },
    {key: 'created_at', label: 'Создан', readonly: true},
    {key: 'updated_at', label: 'Обновлён', readonly: true},
]

export default function Categories() {
    return (
        <div className="p-6">
            <DataTable<Category, CreateCategoryDto, UpdateCategoryDto>
                title="Категории"
                client={categoryClient}
                fields={fields}
            />
        </div>
    )
}
