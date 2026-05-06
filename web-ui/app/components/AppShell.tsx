'use client'
import React, { useEffect, useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import Aside from '@/app/Aside'

export default function AppShell({ children }: { children: React.ReactNode }) {
    const pathname = usePathname()
    const router = useRouter()
    const isAuthPage = pathname === '/auth'
    const [ready, setReady] = useState(false)

    useEffect(() => {
        if (isAuthPage) {
            setReady(true)
            return
        }
        const token = localStorage.getItem('token')
        if (!token) {
            router.replace('/auth')
        } else {
            setReady(true)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    if (isAuthPage) return <>{children}</>
    if (!ready) return null

    return (
        <>
            <Aside />
            <main className="flex-1 min-w-0 px-8 py-6">
                {children}
            </main>
        </>
    )
}
