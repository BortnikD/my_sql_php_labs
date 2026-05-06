'use client'
import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Role, RoleRequest } from '@/lib/types'
import { getRole, getToken } from '@/lib/auth'
import userClient from '@/lib/webclients/UserClient'

export default function Home() {
    const router = useRouter()
    const [role, setRole] = useState<Role | null>(null)
    const [roleRequest, setRoleRequest] = useState<RoleRequest | null | undefined>(undefined)
    const [ready, setReady] = useState(false)

    useEffect(() => {
        if (getToken()) {
            const storedRole = getRole() ?? 'USER'
            setRole(storedRole)
            if (storedRole === 'ADMIN')    { router.replace('/employees'); return }
            if (storedRole === 'OPERATOR') { router.replace('/charges');   return }
            if (storedRole === 'USER') {
                userClient.getMyRoleRequest()
                    .then(req => setRoleRequest(req))
                    .catch(() => setRoleRequest(null))
                    .finally(() => setReady(true))
                return
            }
        }
        setReady(true)
    }, [router])

    if (!ready) return null

    return (
        <div className="flex-1 flex items-center justify-center min-h-screen px-4">
            <div className="max-w-lg w-full flex flex-col gap-8">

                <div className="flex flex-col gap-2 text-center">
                    <h1 className="text-4xl font-bold text-primary">Audit</h1>
                    <p className="text-muted text-sm">Система учёта начислений сотрудников</p>
                </div>

                <div className="rounded-xl border border-border bg-bg-elevated p-6 flex flex-col gap-3 text-sm text-muted">
                    <div className="flex justify-between">
                        <span>Версия</span>
                        <span className="text-primary">1.0.0</span>
                    </div>
                    <div className="flex justify-between">
                        <span>Разработчик</span>
                        <span className="text-primary">BortnikD</span>
                    </div>
                    <div className="flex justify-between">
                        <span>Технологии</span>
                        <span className="text-primary">PHP · MySQL · Next.js</span>
                    </div>
                    <div className="flex justify-between">
                        <span>Описание</span>
                        <span className="text-primary text-right">Формирование ведомостей<br/>и CRUD-управление данными</span>
                    </div>
                </div>

                {!role && (
                    <div className="flex flex-col gap-3">
                        <Link
                            href="/auth"
                            className="rounded-lg py-2 text-center text-sm font-medium text-white transition"
                            style={{ background: 'var(--accent)' }}
                        >
                            Войти / Зарегистрироваться
                        </Link>
                    </div>
                )}

                {role === 'USER' && roleRequest !== undefined && (
                    <div className="rounded-xl border border-border bg-bg-elevated p-5 text-center flex flex-col gap-2">
                        {roleRequest?.status === 'DENIED' ? (
                            <>
                                <p className="text-danger font-medium">Заявка отклонена</p>
                                <p className="text-sm text-muted">
                                    Администратор отклонил вашу заявку на роль оператора. Обратитесь к нему напрямую для уточнения причины.
                                </p>
                            </>
                        ) : (
                            <>
                                <p className="text-primary font-medium">Заявка на рассмотрении</p>
                                <p className="text-sm text-muted">
                                    Ваша заявка передана администратору. После одобрения вам будут доступны функции оператора.
                                </p>
                            </>
                        )}
                    </div>
                )}
            </div>
        </div>
    )
}
