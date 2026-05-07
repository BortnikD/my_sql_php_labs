'use client'
import React from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Role } from '@/lib/types'
import { clearAuth } from '@/lib/auth'

const ALL_LINKS = [
    {
        href: '/employees', label: 'Сотрудники', roles: ['ADMIN'] as Role[],
        icon: <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
    },
    {
        href: '/categories', label: 'Категории', roles: ['ADMIN'] as Role[],
        icon: <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>,
    },
    {
        href: '/jobs', label: 'Работы', roles: ['ADMIN'] as Role[],
        icon: <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/><line x1="12" y1="12" x2="12" y2="16"/><line x1="10" y1="14" x2="14" y2="14"/></svg>,
    },
    {
        href: '/timesheets', label: 'Табель', roles: ['ADMIN'] as Role[],
        icon: <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/><line x1="8" y1="14" x2="16" y2="14"/></svg>,
    },
    {
        href: '/charges', label: 'Ведомость', roles: ['OPERATOR', 'ADMIN'] as Role[],
        icon: <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>,
    },
    {
        href: '/users', label: 'Пользователи', roles: ['ADMIN'] as Role[],
        icon: <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/><line x1="19" y1="11" x2="19" y2="17"/><line x1="22" y1="14" x2="16" y2="14"/></svg>,
    },
    {
        href: '/admin', label: 'Заявки', roles: ['ADMIN'] as Role[],
        icon: <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><line x1="19" y1="8" x2="19" y2="14"/><line x1="22" y1="11" x2="16" y2="11"/></svg>,
    },
]

export default function Aside({ role }: { role: Role | null }): React.JSX.Element {
    const router = useRouter()

    const visibleLinks = role
        ? ALL_LINKS.filter(l => l.roles.includes(role))
        : []

    const logout = () => {
        clearAuth()
        router.push('/auth')
    }

    return (
        <aside className="flex flex-col bg-bg-surface border-r border-border w-52 h-screen sticky top-0 p-4 gap-6">
            <h2 className="text-primary font-bold text-lg">Audit</h2>
            <ul className="flex flex-col gap-1 flex-1">
                {visibleLinks.map(link => (
                    <li key={link.href}>
                        <Link
                            href={link.href}
                            className="flex items-center gap-3 px-3 py-2 rounded-lg text-muted hover:bg-bg-elevated hover:text-primary transition"
                        >
                            {link.icon}
                            {link.label}
                        </Link>
                    </li>
                ))}
            </ul>
            <button
                onClick={logout}
                className="flex items-center gap-3 px-3 py-2 rounded-lg text-muted hover:bg-bg-elevated hover:text-danger transition"
            >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
                    <polyline points="16 17 21 12 16 7"/>
                    <line x1="21" y1="12" x2="9" y2="12"/>
                </svg>
                Выйти
            </button>
        </aside>
    )
}
