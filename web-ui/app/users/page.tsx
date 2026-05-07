'use client'
import DataTable from '@/app/components/DataTable'
import userCrudClient, {UserUpdateDto} from '@/lib/webclients/UserCrudClient'
import {UserRecord} from '@/lib/types'
import {FieldDef} from '@/lib/FieldDef'

const fields: FieldDef<UserRecord>[] = [
    {key: 'id', label: 'ID', readonly: true},
    {key: 'username', label: 'Имя пользователя', readonly: true},
    {key: 'email', label: 'Email', readonly: true},
    {key: 'role', label: 'Роль', options: ['USER', 'OPERATOR', 'ADMIN']},
    {key: 'login_count', label: 'Входов', readonly: true},
    {key: 'last_login_at', label: 'Последний вход', readonly: true},
]

export default function UsersPage() {
    return (
        <DataTable<UserRecord, never, UserUpdateDto>
            title="Пользователи"
            client={userCrudClient}
            fields={fields}
            disableCreate
        />
    )
}
