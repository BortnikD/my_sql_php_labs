'use client'

import { useState } from 'react'
import { Employee } from '@/lib/types'
import { UpdateEmployeeDto } from '@/lib/dto'

interface Props {
    employee: Employee
    onConfirm: (dto: UpdateEmployeeDto) => void
    onCancel: () => void
}

export default function UpdateEmployeeModal({ employee, onConfirm, onCancel }: Props) {

    const [form, setForm] = useState<UpdateEmployeeDto>({
        category_id: employee.category_id,
        first_name: employee.first_name,
        last_name: employee.last_name,
        middle_name: employee.middle_name ?? '',
        birth_date: employee.birth_date,
    })

    const set = (field: keyof UpdateEmployeeDto, value: string | number) => {
        setForm(prev => ({ ...prev, [field]: value }))
    }

    return (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
            <div className="bg-bg-surface border border-border rounded-xl p-6 w-96 flex flex-col gap-5 shadow-xl">
                <h2 className="text-primary font-semibold">Редактировать сотрудника #{employee.id}</h2>

                <div className="flex flex-col gap-3">
                    <label className="flex flex-col gap-1">
                        <span className="text-xs text-muted uppercase tracking-wide">Имя</span>
                        <input className="modal-input" value={form.first_name} onChange={e => set('first_name', e.target.value)}/>
                    </label>
                    <label className="flex flex-col gap-1">
                        <span className="text-xs text-muted uppercase tracking-wide">Фамилия</span>
                        <input className="modal-input" value={form.last_name} onChange={e => set('last_name', e.target.value)}/>
                    </label>
                    <label className="flex flex-col gap-1">
                        <span className="text-xs text-muted uppercase tracking-wide">Отчество</span>
                        <input className="modal-input" value={form.middle_name ?? ''} onChange={e => set('middle_name', e.target.value)}/>
                    </label>
                    <label className="flex flex-col gap-1">
                        <span className="text-xs text-muted uppercase tracking-wide">Дата рождения</span>
                        <input className="modal-input" type="date" value={form.birth_date} onChange={e => set('birth_date', e.target.value)}/>
                    </label>
                    <label className="flex flex-col gap-1">
                        <span className="text-xs text-muted uppercase tracking-wide">ID категории</span>
                        <input className="modal-input" type="number" value={form.category_id} onChange={e => set('category_id', Number(e.target.value))}/>
                    </label>
                </div>

                <div className="flex justify-end gap-2">
                    <button
                        onClick={onCancel}
                        className="px-4 py-2 rounded-lg text-sm text-muted hover:bg-bg-elevated hover:text-primary transition"
                    >
                        Отмена
                    </button>
                    <button
                        onClick={() => onConfirm(form)}
                        className="px-4 py-2 rounded-lg text-sm bg-accent text-white hover:bg-accent-hover transition"
                    >
                        Сохранить
                    </button>
                </div>
            </div>
        </div>
    )
}
