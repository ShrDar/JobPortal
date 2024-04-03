import React from "react";

export function loader({ params }) {
    const jobId = params.jobId
    console.log(jobId)
    return 'loader data';
}

function ApplicantJobDetails() {
    return (
        <div className="applicantJobDetails">

        </div>
    )
}

export {ApplicantJobDetails}