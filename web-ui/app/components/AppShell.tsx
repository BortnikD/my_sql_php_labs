'use client'
import React, {useEffect, useState} from 'react'
import {usePathname, useRouter} from 'next/navigation'
import Aside from '@/app/Aside'
import {Role} from '@/lib/types'
import {getRole, getLoginCount, getLastLoginAt, getToken} from '@/lib/auth'

const ALLOWED_PATHS: Record<Role, string[]> = {
    USER: ['/'],
    OPERATOR: ['/', '/charges'],
    ADMIN: ['/', '/employees', '/categories', '/jobs', '/timesheets', '/charges', '/admin', '/users'],
}

function WelcomeBanner({onClose}: { onClose: () => void }) {
    const loginCount = getLoginCount()
    const lastLoginAt = getLastLoginAt()

    return (
        <div
            className="fixed top-4 right-4 z-50 flex items-center gap-4 rounded-xl border border-border bg-bg-elevated px-5 py-3 text-sm shadow-lg"
        >
            {loginCount === 1 ? (
                <span className="text-primary">Добро пожаловать!</span>
            ) : (
                <div className="flex flex-col gap-0.5">
                    <span className="text-primary">Вы зашли {loginCount} раз</span>
                    <span className="text-muted">Последнее посещение: {lastLoginAt}</span>
                </div>
            )}
            <button onClick={onClose} className="text-muted hover:text-primary transition">✕</button>
        </div>
    )
}

export default function AppShell({children}: { children: React.ReactNode }) {
    const pathname = usePathname()
    const router = useRouter()
    const isAuthPage = pathname === '/auth'

    const [ready, setReady] = useState(false)
    const [role, setRole] = useState<Role | null>(null)
    const [showBanner, setShowBanner] = useState(false)
    const [accessDenied, setAccessDenied] = useState(false)

    useEffect(() => {
        if (isAuthPage) {
            setReady(true);
            return
        }

        if (!getToken()) {
            router.replace('/auth');
            return
        }

        const storedRole = getRole() ?? 'USER'
        setRole(storedRole)

        const allowed = ALLOWED_PATHS[storedRole] ?? ['/']
        if (!allowed.includes(pathname)) {
            setAccessDenied(true)
            setReady(true)
            return
        }

        // Баннер только для OPERATOR
        if (storedRole === 'OPERATOR') {
            const bannerShown = sessionStorage.getItem('banner_shown')
            if (!bannerShown) {
                setShowBanner(true)
                sessionStorage.setItem('banner_shown', '1')
            }
        }

        setReady(true)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [pathname])

    if (isAuthPage) return <>{children}</>
    if (!ready) return null

    if (accessDenied) {
        return (
            <div className="flex-1 flex items-center justify-center min-h-screen">
                <div className="text-center flex flex-col gap-4">
                    <p className="text-lg text-danger">Недостаточно прав для доступа к данному разделу</p>
                    <button
                        onClick={() => router.push('/')}
                        className="text-sm text-muted hover:text-primary transition"
                    >
                        ← На главную
                    </button>
                </div>
            </div>
        )
    }

    return (
        <>
            {showBanner && <WelcomeBanner onClose={() => setShowBanner(false)}/>}
            <Aside role={role}/>
            <main className="flex-1 min-w-0 px-8 py-6">
                {children}
            </main>
        </>
    )
}
