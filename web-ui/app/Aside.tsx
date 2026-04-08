import React from "react";


export default function Aside (): React.JSX.Element {


    return (
        <aside className="flex flex-col bg-cyan-900 gap-5">
            <div>
                <h2>Audit</h2>
            </div>
            <div>
                <ul className="flex flex-col gap-1">
                    <li>Employees</li>
                    <li>Categories</li>
                    <li>Jobs</li>
                    <li>Timesheets</li>
                </ul>
            </div>
        </aside>
    )
}