'use client'

import DataTable from '@/app/components/DataTable'
import categoryClient from '@/lib/webclients/CategoryClient'
import {Category} from '@/lib/types'
import {CreateCategoryDto, UpdateCategoryDto} from '@/lib/dto'
import {FieldDef} from '@/lib/FieldDef'

const fields: FieldDef<Category>[] = [
    {key: 'id', label: 'ID', readonly: true},
    {key: 'name', label: 'Название'},
    {key: "rate", label: 'Ставка', type: 'number'},
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
