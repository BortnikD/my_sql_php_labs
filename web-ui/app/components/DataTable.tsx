'use client'

import {useEffect, useState} from 'react'
import {CrudClient} from '@/lib/CrudClient'
import {FieldDef} from '@/lib/FieldDef'
import ConfirmModal from './ConfirmModal'
import EntityModal from './EntityModal'

interface Props<T extends { id: number }, CreateDto, UpdateDto> {
    title: string
    client: CrudClient<T, CreateDto, UpdateDto>
    fields: FieldDef<T>[]
}

export default function DataTable<T extends { id: number }, CreateDto, UpdateDto>({
                                                                                      title,
                                                                                      client,
                                                                                      fields,
                                                                                  }: Props<T, CreateDto, UpdateDto>) {

    const [data, setData] = useState<T[]>([])
    const [deletePendingId, setDeletePendingId] = useState<number | null>(null)
    const [editItem, setEditItem] = useState<T | null>(null)
    const [showCreate, setShowCreate] = useState(false)

    const fetchAll = () => {
        client.getAll().then(res => setData(res.data))
    }

    useEffect(() => {
        fetchAll()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const handleDelete = () => {
        if (deletePendingId === null) return
        client.delete(deletePendingId).then(() => {
            setData(prev => prev.filter(item => item.id !== deletePendingId))
            setDeletePendingId(null)
        })
    }

    const handleUpdate = (dto: UpdateDto) => {
        if (editItem === null) return
        client.update(editItem.id, dto).then(() => {
            fetchAll()
            setEditItem(null)
        })
    }

    const handleCreate = (dto: CreateDto) => {
        client.create(dto).then(() => {
            fetchAll()
            setShowCreate(false)
        })
    }

    return (
        <div>
            <div className="flex items-center justify-between mb-4">
                <h1 className="text-2xl font-bold">{title}</h1>
                <button
                    onClick={() => setShowCreate(true)}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm bg-accent text-white hover:bg-accent-hover transition"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none"
                         stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="12" y1="5" x2="12" y2="19"/>
                        <line x1="5" y1="12" x2="19" y2="12"/>
                    </svg>
                    Добавить
                </button>
            </div>

            <div className="overflow-x-auto rounded-xl shadow">
                <table>
                    <thead>
                    <tr>
                        {fields.map(f => <th key={String(f.key)}>{f.label}</th>)}
                        <th className="sticky right-0 bg-bg-elevated w-16"></th>
                    </tr>
                    </thead>
                    <tbody>
                    {data.map(item => (
                        <tr key={item.id} className="group">
                            {fields.map(f => (
                                <td key={String(f.key)}>{String(item[f.key] ?? '-')}</td>
                            ))}
                            <td className="sticky right-0 bg-bg-surface group-hover:bg-bg-elevated">
                                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition">
                                    <button
                                        onClick={() => setEditItem(item)}
                                        className="text-accent hover:text-accent-hover transition"
                                        title="Редактировать"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16"
                                             viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                                             strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                                            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                                        </svg>
                                    </button>
                                    <button
                                        onClick={() => setDeletePendingId(item.id)}
                                        className="text-danger hover:text-red-400 transition"
                                        title="Удалить"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16"
                                             viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                                             strokeLinecap="round" strokeLinejoin="round">
                                            <polyline points="3 6 5 6 21 6"/>
                                            <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
                                            <path d="M10 11v6"/>
                                            <path d="M14 11v6"/>
                                            <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
                                        </svg>
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>

            {deletePendingId !== null && (
                <ConfirmModal
                    message={`Удалить запись #${deletePendingId}?`}
                    onConfirm={handleDelete}
                    onCancel={() => setDeletePendingId(null)}
                />
            )}

            {showCreate && (
                <EntityModal<T, CreateDto>
                    title="Создать"
                    fields={fields}
                    initialValues={{}}
                    onConfirm={handleCreate}
                    onCancel={() => setShowCreate(false)}
                />
            )}

            {editItem !== null && (
                <EntityModal<T, UpdateDto>
                    title={`Редактировать #${editItem.id}`}
                    fields={fields}
                    initialValues={editItem}
                    onConfirm={handleUpdate}
                    onCancel={() => setEditItem(null)}
                />
            )}
        </div>
    )
}
