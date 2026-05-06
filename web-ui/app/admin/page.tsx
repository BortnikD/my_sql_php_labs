'use client'
import React, { useEffect, useState, useCallback } from 'react'
import userClient from '@/lib/webclients/UserClient'
import { RoleRequest } from '@/lib/types'
import axios from 'axios'

export default function AdminPage() {
    const [requests, setRequests] = useState<RoleRequest[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')

    const load = useCallback(async () => {
        setLoading(true)
        setError('')
        try {
            setRequests(await userClient.getRoleRequests())
        } catch {
            setError('Не удалось загрузить заявки')
        } finally {
            setLoading(false)
        }
    }, [])

    useEffect(() => { load() }, [load])

    const handleAction = async (id: number, action: 'approve' | 'deny') => {
        try {
            if (action === 'approve') await userClient.approveRoleRequest(id)
            else await userClient.denyRoleRequest(id)
            await load()
        } catch (err) {
            if (axios.isAxiosError(err)) {
                setError(err.response?.data?.error ?? 'Ошибка')
            }
        }
    }

    return (
        <div className="flex flex-col gap-6">
            <h1 className="text-2xl font-bold text-primary">Заявки на роль Оператора</h1>

            {error && <p className="text-sm text-danger">{error}</p>}

            {loading ? (
                <p className="text-muted text-sm">Загрузка...</p>
            ) : requests.length === 0 ? (
                <p className="text-muted text-sm">Нет ожидающих заявок</p>
            ) : (
                <div className="flex flex-col gap-3">
                    {requests.map(req => (
                        <div
                            key={req.id}
                            className="flex items-center justify-between rounded-xl border border-border bg-bg-elevated px-5 py-4"
                        >
                            <div className="flex flex-col gap-1">
                                <span className="text-primary font-medium">{req.username}</span>
                                <span className="text-xs text-muted">
                                    Заявка от {new Date(req.created_at).toLocaleString('ru-RU')}
                                </span>
                            </div>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => handleAction(req.id, 'approve')}
                                    className="rounded-lg px-4 py-1.5 text-sm text-white transition"
                                    style={{ background: 'var(--accent)' }}
                                >
                                    Одобрить
                                </button>
                                <button
                                    onClick={() => handleAction(req.id, 'deny')}
                                    className="rounded-lg px-4 py-1.5 text-sm text-danger border border-danger transition hover:bg-danger hover:text-white"
                                >
                                    Отклонить
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}
