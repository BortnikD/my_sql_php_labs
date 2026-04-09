'use client'

import {useEffect, useState} from "react";
import employeeClient from "@/lib/webclients/EmpoyeeClient";
import {Employee} from "@/lib/types";
import EmployeeTable from "@/app/employees/EmployeeTable";

export default function Employees() {

    const [employees, setEmployees] = useState<Employee[]>([])

    useEffect(() => {
        employeeClient.getAll()
            .then(it => setEmployees(it.data));
    }, []);

    const handleDeleted = (id: number) => {
        setEmployees(prev => prev.filter(e => e.id !== id))
    }

    return (
        <div className="p-6">
            <EmployeeTable employees={employees} onDeleted={handleDeleted}/>
        </div>
    );
}
