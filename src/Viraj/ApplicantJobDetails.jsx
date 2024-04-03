import { doc, getDoc } from "firebase/firestore";
import React from "react";
import { db } from "../../config/firebase";

export async function loader({ params }) {
    const jobId = params.jobId;
    const jobRef = doc(db, "jobListings", jobId);
    try {
        const data = await getDoc(jobRef);
        const job = data.data();
        console.log(job);
        const orgRef = doc(db, "organization", job.orgId);
        const data1 = await getDoc(orgRef);
        const org = data1.data();
        console.log(org);
    } catch( err ) {
        console.error(err)
    }
    return 'loader data';
}

function ApplicantJobDetails() {
    return (
        <div className="applicantJobDetails">

        </div>
    )
}

export {ApplicantJobDetails}