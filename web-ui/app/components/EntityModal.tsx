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
            init[String(f.key)] = val !== undefined && val !== null
                ? (val as string | number)
                : (f.type === 'number' ? 0 : '')
        })
        return init
    })

    const [errors, setErrors] = useState<Record<string, string>>({})

    const set = (key: string, value: string | number) => {
        setForm(prev => ({...prev, [key]: value}))
        setErrors(prev => ({...prev, [key]: ''}))
    }

    const validate = async (): Promise<boolean> => {
        const newErrors: Record<string, string> = {}
        for (const field of editableFields) {
            const key = String(field.key)
            for (const rule of field.validations ?? []) {
                const isValid = await rule.predicate(form[key])
                if (!isValid) {
                    newErrors[key] = rule.message
                    break
                }
            }
        }
        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleConfirm = async () => {
        if (await validate()) onConfirm(form as Dto)
    }

    return (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
            <div className="bg-bg-surface border border-border rounded-xl p-6 w-96 flex flex-col gap-5 shadow-xl">
                <h2 className="text-primary font-semibold">{title}</h2>

                <div className="flex flex-col gap-3">
                    {editableFields.map(f => {
                        const key = String(f.key)
                        return (
                            <label key={key} className="flex flex-col gap-1">
                                <span className="text-xs text-muted uppercase tracking-wide">{f.label}</span>
                                <input
                                    className={`modal-input ${errors[key] ? 'border-red-500' : ''}`}
                                    type={f.type ?? 'text'}
                                    value={form[key]}
                                    onChange={e => set(key, f.type === 'number'
                                        ? Number(e.target.value)
                                        : e.target.value)}
                                />
                                {errors[key] && (
                                    <span className="text-xs text-red-400">{errors[key]}</span>
                                )}
                            </label>
                        )
                    })}
                </div>

                <div className="flex justify-end gap-2">
                    <button
                        onClick={onCancel}
                        className="px-4 py-2 rounded-lg text-sm text-muted hover:bg-bg-elevated hover:text-primary transition"
                    >
                        Отмена
                    </button>
                    <button
                        onClick={handleConfirm}
                        className="px-4 py-2 rounded-lg text-sm bg-accent text-white hover:bg-accent-hover transition"
                    >
                        Сохранить
                    </button>
                </div>
            </div>
        </div>
    )
}
