'use client'
import React, {useState} from 'react'
import {useRouter} from 'next/navigation'
import axios from 'axios'
import authClient from '@/lib/webclients/AuthClient'
import {storeAuth} from '@/lib/auth'

type Tab = 'login' | 'register'

export default function AuthPage() {
    const router = useRouter()
    const [tab, setTab] = useState<Tab>('login')
    const [username, setUsername] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [rememberMe, setRememberMe] = useState(false)
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)

    const switchTab = (next: Tab) => {
        setTab(next)
        setError('')
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError('')
        setLoading(true)
        try {
            if (tab === 'login') {
                const authToken = await authClient.login(username, password)
                storeAuth(authToken, rememberMe)
                redirectByRole(authToken.role)
            } else {
                await authClient.register(username, email, password)
                const authToken = await authClient.login(username, password)
                storeAuth(authToken, rememberMe)
                redirectByRole(authToken.role)
            }
        } catch (err: unknown) {
            if (axios.isAxiosError(err)) {
                setError(err.response?.data?.error ?? 'Ошибка запроса')
            } else {
                setError('Неизвестная ошибка')
            }
        } finally {
            setLoading(false)
        }
    }

    const redirectByRole = (role: string) => {
        if (role === 'ADMIN') router.push('/employees')
        else if (role === 'OPERATOR') router.push('/charges')
        else router.push('/')
    }

    return (
        <div className="flex-1 flex items-center justify-center min-h-screen">
            <div
                className="w-full max-w-sm flex flex-col gap-6 rounded-xl border border-border bg-bg-elevated p-8"
                style={{boxShadow: '0 8px 32px rgba(0,0,0,0.4)'}}
            >
                <h1 className="text-center text-2xl font-bold text-primary">Audit</h1>

                <div className="flex overflow-hidden rounded-lg border border-border">
                    <button
                        type="button"
                        onClick={() => switchTab('login')}
                        className="flex-1 py-2 text-sm transition"
                        style={{
                            background: tab === 'login' ? 'var(--accent)' : 'transparent',
                            color: tab === 'login' ? '#fff' : 'var(--text-muted)',
                        }}
                    >
                        Войти
                    </button>
                    <button
                        type="button"
                        onClick={() => switchTab('register')}
                        className="flex-1 py-2 text-sm transition"
                        style={{
                            background: tab === 'register' ? 'var(--accent)' : 'transparent',
                            color: tab === 'register' ? '#fff' : 'var(--text-muted)',
                        }}
                    >
                        Регистрация
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <div className="flex flex-col gap-1">
                        <label className="text-sm text-muted">Имя пользователя</label>
                        <input
                            type="text"
                            value={username}
                            onChange={e => setUsername(e.target.value)}
                            required
                            minLength={3}
                            className="modal-input"
                            autoComplete="username"
                        />
                    </div>

                    {tab === 'register' && (
                        <div className="flex flex-col gap-1">
                            <label className="text-sm text-muted">Email</label>
                            <input
                                type="email"
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                                required
                                className="modal-input"
                                autoComplete="email"
                            />
                        </div>
                    )}

                    <div className="flex flex-col gap-1">
                        <label className="text-sm text-muted">Пароль</label>
                        <input
                            type="password"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            required
                            minLength={6}
                            className="modal-input"
                            autoComplete={tab === 'login' ? 'current-password' : 'new-password'}
                        />
                    </div>

                    <label className="flex items-center gap-2 text-sm text-muted cursor-pointer select-none">
                        <input
                            type="checkbox"
                            checked={rememberMe}
                            onChange={e => setRememberMe(e.target.checked)}
                            className="rounded"
                        />
                        Запомнить меня
                    </label>

                    {error && <p className="text-sm text-danger">{error}</p>}

                    <button
                        type="submit"
                        disabled={loading}
                        className="rounded-lg py-2 text-sm font-medium text-white transition disabled:opacity-50"
                        style={{background: loading ? 'var(--accent-hover)' : 'var(--accent)'}}
                    >
                        {loading
                            ? 'Загрузка...'
                            : tab === 'login' ? 'Войти' : 'Зарегистрироваться'}
                    </button>
                </form>
            </div>
        </div>
    )
}
