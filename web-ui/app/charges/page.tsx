'use client'

import {useEffect, useState} from 'react'
import chargesClient from '@/lib/webclients/ChargesClient'
import jobClient from '@/lib/webclients/JobClient'
import {ChargeItem, ChargesTotal} from '@/lib/types'

export default function Charges() {

    const [companies, setCompanies] = useState<string[]>([])
    const [companyName, setCompanyName] = useState<string>('')
    const [year, setYear] = useState<number>(new Date().getFullYear())

    const [charges, setCharges] = useState<ChargeItem[]>([])
    const [total, setTotal] = useState<ChargesTotal | null>(null)
    const [grandTotal, setGrandTotal] = useState<ChargesTotal[]>([])

    useEffect(() => {
        jobClient.getAll().then(res => {
            const unique = [...new Set(
                res.data
                    .filter(j => j.company_name)
                    .map(j => j.company_name as string)
            )]
            setCompanies(unique)
            if (unique.length > 0) setCompanyName(unique[0])
        })
    }, [])

    const handleSearch = () => {
        if (!companyName || !year) return
        Promise.all([
            chargesClient.getAll(companyName, year),
            chargesClient.getTotal(companyName, year),
            chargesClient.getTotalByYear(year),
        ]).then(([detailRes, totalRes, grandRes]) => {
            setCharges(detailRes.data)
            setTotal(totalRes.data[0] ?? null)
            setGrandTotal(Array.isArray(grandRes.data) ? grandRes.data : [])
        })
    }

    const currentYear = new Date().getFullYear()
    const years = Array.from({length: 10}, (_, i) => currentYear - i)

    return (
        <div className="p-6 flex flex-col gap-6">
            <h1 className="text-2xl font-bold">Ведомость начислений</h1>

            <div className="flex items-end gap-4">
                <label className="flex flex-col gap-1">
                    <span className="text-xs text-muted uppercase tracking-wide">Предприятие</span>
                    <select
                        className="modal-input w-64"
                        value={companyName}
                        onChange={e => setCompanyName(e.target.value)}
                    >
                        {companies.map(name => (
                            <option key={name} value={name}>{name}</option>
                        ))}
                    </select>
                </label>
                <label className="flex flex-col gap-1">
                    <span className="text-xs text-muted uppercase tracking-wide">Год</span>
                    <select
                        className="modal-input w-32"
                        value={year}
                        onChange={e => setYear(Number(e.target.value))}
                    >
                        {years.map(y => (
                            <option key={y} value={y}>{y}</option>
                        ))}
                    </select>
                </label>
                <button
                    onClick={handleSearch}
                    className="px-4 py-2 rounded-lg text-sm bg-accent text-white hover:bg-accent-hover transition"
                >
                    Сформировать
                </button>
            </div>

            {charges.length > 0 && (
                <div className="overflow-x-auto rounded-xl shadow">
                    <table>
                        <thead>
                        <tr>
                            <th>Ф.И.О.</th>
                            <th>Категория</th>
                            <th>Ставка ₽/ч.</th>
                            <th>Дата выполнения</th>
                            <th>Часов</th>
                            <th>Начислено ₽</th>
                        </tr>
                        </thead>
                        <tbody>
                        {charges.map((item, i) => (
                            <tr key={i}>
                                <td>{item.full_name}</td>
                                <td>{item.category_name}</td>
                                <td>{item.rate}</td>
                                <td>{item.completed_at}</td>
                                <td>{item.hours}</td>
                                <td className="font-semibold">{item.paid_out}</td>
                            </tr>
                        ))}
                        </tbody>
                        <tfoot>
                        {total && (
                            <tr>
                                <td colSpan={4} className="text-right text-muted italic">
                                    Предприятие: {total.company_name}. Итого по предприятию:
                                </td>
                                <td className="font-semibold">{total.total_hours}</td>
                                <td className="font-semibold">{total.total_sum}</td>
                            </tr>
                        )}
                        {grandTotal.map((row, i) => (
                            <tr key={i} className="font-bold">
                                <td colSpan={4} className="text-right">
                                    Итого: {row.company_name}
                                </td>
                                <td>{row.total_hours}</td>
                                <td>{row.total_sum}</td>
                            </tr>
                        ))}
                        </tfoot>
                    </table>
                </div>
            )}
        </div>
    )
}
