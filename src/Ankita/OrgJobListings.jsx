import { collection, getDocs, query, where } from 'firebase/firestore'
import React, { useState } from 'react'
import { db } from '../../config/firebase'
import { useLoaderData } from 'react-router-dom'
import teamImg from '/team.png'
import calenderImg from '/calendar.png'
import editBtnImg from '/edit.png'
import addBtn from '/addJob.png'
import { AddJobModal } from './AddJobModal'
import { EditJobModal } from './EditJobModal'

export async function loader({ params }) {
    const orgId = params.orgId;
    const q = query(collection(db, "jobListings"), where("orgId", "==", orgId));
    try {
        const data = await getDocs(q);
        const jobs = data.docs.map((job) => ({
            ...job.data(), id: job.id
        }))
        return jobs
    } catch(err) {
        console.error(err);
    }
    return 'No Data Fetched'
}

function OrgJobListings() {
    const [isAddModalOpen, setIsAddModalOpened] = useState(false);
    const [isEditModalOpen, setIsEditModalOpened] = useState(false);
    const jobListings = useLoaderData();
    console.log(jobListings);
    const [jobTitle, setJobTitle] = useState('');
    return (
        <div className="orgJobListingsContainer">
            <h1 style={{fontSize: '25px', alignSelf: 'center'}} className='orgJobListingsTitle'>Your Job Listings:</h1>
            <div className="orgJobListingsSearch">
                <input type='text' className='jobSearchInput' placeholder='Search Your Job Title' onChange={(e) => setJobTitle(e.target.value)} value={jobTitle}/>
                <button className='orgAddJobBtn'><img style={{width: '20px'}} src={addBtn} ></img>Add Job</button>
            </div>
            <div className="orgJobListings">
                {jobListings.filter(job => {
                    if(jobTitle.toLowerCase() === "") {
                        return job;
                    }
                    else {
                        return job.jobTitle.toLowerCase().includes(jobTitle.toLowerCase());
                    }
                }).map((job, index) => {
                    return (
                        <div key={job.id} className="orgJobListing">
                            <h2 style={{fontWeight: 'bold'}}>{index+1}. {")"} {job.jobTitle}</h2>
                            <div className="job2">
                                <p className='jobDuration'>{job.jobDurationType}</p>
                                <p className='jobWorkLocation'>{job.workLocation}</p>
                                <p className='jobExperience'>{job.experience}</p>
                            </div>
                            <div className="job3 flex gap-3">
                                <img src={teamImg} alt="" style={{width: '20px'}} />
                                <p>Vacancies: <strong>{job.NofVacancy}</strong></p>
                            </div>
                            <div className="job3 flex gap-3">
                                <img src={calenderImg} style={{width: '20px'}} />
                                <p>Apply Before <strong>{job.endDate}</strong> </p>                            
                            </div>
                            <div className="editBtn flex">
                                <p>Edit</p>
                                <img src={editBtnImg} alt="" />
                            </div>
                        </div>
                    )
                })}
            </div>
            <AddJobModal isAddModalOpen={isAddModalOpen} setIsAddModalOpened={setIsAddModalOpened} />
            <EditJobModal isEditModalOpen={isEditModalOpen} setIsEditModalOpened={setIsEditModalOpened} />
        </div>
    )
}

export { OrgJobListings }