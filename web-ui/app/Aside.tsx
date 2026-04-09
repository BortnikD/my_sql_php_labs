import React from "react";
import Link from "next/link";

const links = [
    {
        href: '/employees',
        label: 'Employees',
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                <circle cx="9" cy="7" r="4"/>
                <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
                <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
            </svg>
        ),
    },
    {
        href: '/categories',
        label: 'Categories',
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="7" height="7"/>
                <rect x="14" y="3" width="7" height="7"/>
                <rect x="14" y="14" width="7" height="7"/>
                <rect x="3" y="14" width="7" height="7"/>
            </svg>
        ),
    },
    {
        href: '/jobs',
        label: 'Jobs',
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="7" width="20" height="14" rx="2"/>
                <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/>
                <line x1="12" y1="12" x2="12" y2="16"/>
                <line x1="10" y1="14" x2="14" y2="14"/>
            </svg>
        ),
    },
    {
        href: '/timesheets',
        label: 'Timesheets',
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="4" width="18" height="18" rx="2"/>
                <line x1="16" y1="2" x2="16" y2="6"/>
                <line x1="8" y1="2" x2="8" y2="6"/>
                <line x1="3" y1="10" x2="21" y2="10"/>
                <line x1="8" y1="14" x2="16" y2="14"/>
            </svg>
        ),
    },
]

export default function Aside(): React.JSX.Element {
    return (
        <aside className="flex flex-col bg-bg-surface border-r border-border w-52 min-h-screen p-4 gap-6">
            <h2 className="text-primary font-bold text-lg">Audit</h2>
            <ul className="flex flex-col gap-1">
                {links.map(link => (
                    <li key={link.href}>
                        <Link
                            href={link.href}
                            className="flex items-center gap-3 px-3 py-2 rounded-lg text-muted hover:bg-bg-elevated hover:text-primary transition"
                        >
                            {link.icon}
                            {link.label}
                        </Link>
                    </li>
                ))}
            </ul>
        </aside>
    )
}
