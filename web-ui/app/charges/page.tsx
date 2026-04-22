'use client'

import {useState} from 'react'
import chargesClient from '@/lib/webclients/ChargesClient'
import {ChargesStatement} from '@/lib/types'

export default function Charges() {
    const [year, setYear] = useState<number>(new Date().getFullYear())
    const [statement, setStatement] = useState<ChargesStatement | null>(null)
    const [loading, setLoading] = useState(false)

    const currentYear = new Date().getFullYear()
    const years = Array.from({length: 10}, (_, i) => currentYear - i)

    const handleSearch = () => {
        setLoading(true)
        chargesClient.getStatement(year)
            .then(res => setStatement(res.data))
            .finally(() => setLoading(false))
    }

    const formatDate = (raw: string) => raw?.slice(0, 10) ?? '—'

    return (
        <div className="p-6 flex flex-col gap-6">
            <h1 className="text-2xl font-bold">Ведомость начислений</h1>

            <div className="flex items-end gap-4">
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
                    disabled={loading}
                    className="px-4 py-2 rounded-lg text-sm bg-accent text-white hover:bg-accent-hover transition disabled:opacity-50"
                >
                    {loading ? 'Загрузка...' : 'Сформировать'}
                </button>
            </div>

            {statement && (
                statement.companies.length === 0
                    ? <p className="text-muted">Нет данных за {year} год.</p>
                    : (
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
                                {statement.companies.flatMap((company, ci) => [

                                    ...company.charges.map((item, ri) => (
                                        <tr key={`charge-${ci}-${ri}`}>
                                            <td>{item.full_name}</td>
                                            <td>{item.category_name}</td>
                                            <td>{item.rate}</td>
                                            <td>{formatDate(item.completed_at)}</td>
                                            <td>{item.hours}</td>
                                            <td className="font-semibold">{item.paid_out}</td>
                                        </tr>
                                    )),

                                    <tr key={`company-${ci}`} className="bg-slate-800">
                                        <td colSpan={6} className="text-left italic text-sm pr-4 py-2">
                                            Предприятие {company.company_name}
                                        </td>
                                    </tr>,

                                    <tr key={`subtotal-${ci}`}
                                        className="border-t border-dashed border-muted bg-slate-800">
                                        <td colSpan={4} className="text-left italic text-sm pr-4 py-2">
                                            Итого по предприятию:
                                        </td>
                                        <td className="font-semibold">{company.total_hours}</td>
                                        <td className="font-semibold">{company.total_sum}</td>
                                    </tr>,

                                    ci < statement.companies.length - 1
                                        ? <tr key={`sep-${ci}`}>
                                            <td colSpan={6} className="p-0">
                                                <div
                                                    className="border-t border-dashed border-muted opacity-30 mx-4"/>
                                            </td>
                                        </tr>
                                        : null,
                                ].filter(Boolean))}
                                </tbody>
                                <tfoot>
                                <tr className="font-bold">
                                    <td colSpan={4} className="text-left pr-4">Итого:</td>
                                    <td>{statement.total_hours}</td>
                                    <td>{statement.total_sum}</td>
                                </tr>
                                </tfoot>
                            </table>
                        </div>
                    )
            )}
        </div>
    )
}
