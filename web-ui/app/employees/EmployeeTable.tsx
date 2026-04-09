'use client'

import { Employee } from '@/lib/types'
import employeeClient from '@/lib/webclients/EmpoyeeClient'

interface Props {
    employees: Employee[]
    onDeleted: (id: number) => void
}

export default function EmployeeTable({ employees, onDeleted }: Props) {

    const handleDelete = (id: number) => {
        employeeClient.delete(id).then(() => onDeleted(id))
    }

    return (
        <div>
            <h1 className="text-2xl font-bold mb-4">Работники</h1>
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
                            <th></th>
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
                                <td>
                                    <button
                                        onClick={() => handleDelete(emp.id)}
                                        className="text-danger opacity-0 group-hover:opacity-100 hover:text-red-400 transition"
                                        title="Удалить"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <polyline points="3 6 5 6 21 6"/>
                                            <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
                                            <path d="M10 11v6"/>
                                            <path d="M14 11v6"/>
                                            <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
                                        </svg>
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}
