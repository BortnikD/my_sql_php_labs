'use client'

import {useState} from 'react'
import {Employee} from '@/lib/types'
import {UpdateEmployeeDto} from '@/lib/dto'
import employeeClient from '@/lib/webclients/EmpoyeeClient'
import ConfirmModal from '@/app/components/ConfirmModal'
import UpdateEmployeeModal from "@/app/employees/UpdateEmployeeModal";
import CreateEmployeeModal from "@/app/employees/CreateEmployeeModal";
import {CreateEmployeeDto} from "@/lib/dto";

interface Props {
    employees: Employee[]
    onDeleted: (id: number) => void
    onUpdated: () => void
    onCreated: () => void
}

export default function EmployeeTable({employees, onDeleted, onUpdated, onCreated}: Props) {

    const [deletePendingId, setDeletePendingId] = useState<number | null>(null)
    const [editEmployee, setEditEmployee] = useState<Employee | null>(null)
    const [showCreate, setShowCreate] = useState(false)

    const handleCreate = (dto: CreateEmployeeDto) => {
        employeeClient.create(dto).then(() => {
            onCreated()
            setShowCreate(false)
        })
    }

    const handleDelete = () => {
        if (deletePendingId === null) return
        employeeClient.delete(deletePendingId).then(() => {
            onDeleted(deletePendingId)
            setDeletePendingId(null)
        })
    }

    const handleUpdate = (dto: UpdateEmployeeDto) => {
        if (editEmployee === null) return
        employeeClient.update(editEmployee.id, dto).then(() => {
            onUpdated()
            setEditEmployee(null)
        })
    }

    return (
        <div>
            <div className="flex items-center justify-between mb-4">
                <h1 className="text-2xl font-bold">Работники</h1>
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
                        <th>id</th>
                        <th>category_id</th>
                        <th>first_name</th>
                        <th>last_name</th>
                        <th>middle_name</th>
                        <th>birth_date</th>
                        <th>created_at</th>
                        <th>updated_at</th>
                        <th className="sticky right-0 bg-bg-elevated w-16"></th>
                    </tr>
                    </thead>
                    <tbody>
                    {employees.map(emp => (
                        <tr key={emp.id} className="group">
                            <td>{emp.id}</td>
                            <td>{emp.category_id}</td>
                            <td>{emp.first_name}</td>
                            <td>{emp.last_name}</td>
                            <td>{emp.middle_name ?? '—'}</td>
                            <td>{emp.birth_date}</td>
                            <td>{emp.created_at}</td>
                            <td>{emp.updated_at}</td>
                            <td className="sticky right-0 bg-bg-surface group-hover:bg-bg-elevated">
                                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition">
                                    <button
                                        onClick={() => setEditEmployee(emp)}
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
                                        onClick={() => setDeletePendingId(emp.id)}
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
                    message={`Удалить сотрудника #${deletePendingId}?`}
                    onConfirm={handleDelete}
                    onCancel={() => setDeletePendingId(null)}
                />
            )}

            {showCreate && (
                <CreateEmployeeModal
                    onConfirm={handleCreate}
                    onCancel={() => setShowCreate(false)}
                />
            )}

            {editEmployee !== null && (
                <UpdateEmployeeModal
                    employee={editEmployee}
                    onConfirm={handleUpdate}
                    onCancel={() => setEditEmployee(null)}
                />
            )}
        </div>
    )
}
