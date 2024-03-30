import React from "react";
import { useLoaderData, defer } from "react-router-dom";

export function loader() { //name of loader function doesn't matter
    return "The data is here";
}

function ApplicantDashboard() {
    const data = useLoaderData();
    console.log(data);
    return (
        <div>
            <h2>This is Applicant Dashboard</h2>
            {data}
        </div>
    )
}

export { ApplicantDashboard }