'use client'

import {useState} from 'react'
import {FieldDef} from '@/lib/FieldDef'

interface Props<T, Dto> {
    title: string
    fields: FieldDef<T>[]
    initialValues: Partial<T>
    onConfirm: (dto: Dto) => void
    onCancel: () => void
}

export default function EntityModal<T, Dto>({title, fields, initialValues, onConfirm, onCancel}: Props<T, Dto>) {

    const editableFields = fields.filter(f => !f.readonly)

    const [form, setForm] = useState<Record<string, string | number>>(() => {
        const init: Record<string, string | number> = {}
        editableFields.forEach(f => {
            const val = initialValues[f.key]
            init[String(f.key)] = val !== undefined && val !== null ? (val as string | number) : (f.type === 'number' ? 0 : '')
        })
        return init
    })

    const set = (key: string, value: string | number) => {
        setForm(prev => ({...prev, [key]: value}))
    }

    return (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
            <div className="bg-bg-surface border border-border rounded-xl p-6 w-96 flex flex-col gap-5 shadow-xl">
                <h2 className="text-primary font-semibold">{title}</h2>

                <div className="flex flex-col gap-3">
                    {editableFields.map(f => (
                        <label key={String(f.key)} className="flex flex-col gap-1">
                            <span className="text-xs text-muted uppercase tracking-wide">{f.label}</span>
                            <input
                                className="modal-input"
                                type={f.type ?? 'text'}
                                value={form[String(f.key)]}
                                onChange={e => set(String(f.key), f.type === 'number' ? Number(e.target.value) : e.target.value)}
                            />
                        </label>
                    ))}
                </div>

                <div className="flex justify-end gap-2">
                    <button
                        onClick={onCancel}
                        className="px-4 py-2 rounded-lg text-sm text-muted hover:bg-bg-elevated hover:text-primary transition"
                    >
                        Отмена
                    </button>
                    <button
                        onClick={() => onConfirm(form as Dto)}
                        className="px-4 py-2 rounded-lg text-sm bg-accent text-white hover:bg-accent-hover transition"
                    >
                        Сохранить
                    </button>
                </div>
            </div>
        </div>
    )
}
