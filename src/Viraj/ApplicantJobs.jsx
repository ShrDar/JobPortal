import { collection, getDocs } from "firebase/firestore";
import React, { Suspense, useState } from "react";
import { db } from "../../config/firebase";
import { Await, defer, useLoaderData } from "react-router-dom";

export async function loader() {
    const applicantJobCollectionRef = collection(db, 'jobListings')
    try {

        const data = await getDocs(applicantJobCollectionRef);
        const filteredData = data.docs.map((doc) => ({
            ...doc.data(),
            id: doc.id
        }))
        
        return filteredData;
    } catch(err) {
        console.error(err);
    }

}

function ApplicantJobs() {
    const jobs = useLoaderData();
    console.log(jobs)

    const [jobTitle, setJobTitle] = useState('');
    const [jobOrg, setJobOrg] = useState(''); 
    return (
        <div className="applicantJobs">
            <div className="applicantJobs-searchBarContainer">
                <h1>Find your dream job</h1>
                <p>Explore the newest job opportunities to discover and apply for the best positions</p>
                <div className="applicantJobs-searchBar">
                    <input placeholder="Search Job Title here" onChange={(e) => setJobTitle(e.target.value)} value={jobTitle} />
                    <input placeholder="Search Organization here" onChange={(e) => setJobOrg(e.target.value)} value={jobOrg} />
                    <button>Search</button>
                </div>
                {jobs.map(job => {
                    return (
                        <div className="jobs">
                            {job.jobTitle}
                        </div>
                    )
                })}
            </div>
        </div>
    )
}

export { ApplicantJobs }