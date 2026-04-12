'use client'

import { useEffect, useState } from 'react'
import chargesClient from '@/lib/webclients/ChargesClient'
import { ChargeItem } from '@/lib/types'

export default function Charges() {

    const [charges, setCharges] = useState<ChargeItem[]>([])

    useEffect(() => {
        chargesClient.getAll().then(res => setCharges(res.data))
    }, [])

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">Ведомость начислений</h1>
            <div className="overflow-x-auto rounded-xl shadow">
                <table>
                    <thead>
                        <tr>
                            <th>ФИО</th>
                            <th>Категория</th>
                            <th>Ставка ₽/ч.</th>
                            <th>Часы</th>
                            <th>Дата завершения</th>
                            <th>Итого ₽</th>
                        </tr>
                    </thead>
                    <tbody>
                        {charges.map((item, i) => (
                            <tr key={i}>
                                <td>{item.full_name}</td>
                                <td>{item.category_name}</td>
                                <td>{item.rate}</td>
                                <td>{item.hours}</td>
                                <td>{item.completed_at}</td>
                                <td className="font-semibold">{item.paid_out}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}
