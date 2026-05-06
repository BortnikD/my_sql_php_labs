import {AuthToken, Role} from '@/lib/types'

const KEYS = ['token', 'role', 'login_count', 'last_login_at'] as const

function read(key: string): string | null {
    if (typeof window === 'undefined') return null
    return sessionStorage.getItem(key) ?? localStorage.getItem(key)
}

export function storeAuth(data: AuthToken, rememberMe: boolean): void {
    const storage = rememberMe ? localStorage : sessionStorage
    storage.setItem('token', data.token)
    storage.setItem('role', data.role)
    storage.setItem('login_count', String(data.login_count))
    storage.setItem('last_login_at', data.last_login_at ?? '')
}

export function clearAuth(): void {
    KEYS.forEach(key => {
        sessionStorage.removeItem(key)
        localStorage.removeItem(key)
    })
    sessionStorage.removeItem('banner_shown')
}

export const getToken = (): string | null => read('token')
export const getRole = (): Role | null => read('role') as Role | null
export const getLoginCount = (): number => Number(read('login_count') ?? 0)
export const getLastLoginAt = (): string => read('last_login_at') ?? ''
