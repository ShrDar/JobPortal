import { collection, deleteDoc, doc, getDocs, onSnapshot, query, where } from 'firebase/firestore'
import React, { useEffect, useState } from 'react'
import { db } from '../../config/firebase'
import { useLoaderData, useParams } from 'react-router-dom'
import teamImg from '/team.png'
import calenderImg from '/calendar.png'
import editBtnImg from '/edit.png'
import addBtn from '/addJob.png'
import deleteBtn from '/delete.png'
import { AddJobModal } from './AddJobModal'
import { EditJobModal } from './EditJobModal'
import { DeleteJobModal } from './DeleteJobModal'
import { motion, AnimatePresence } from 'framer-motion'

export async function loader({ params }) {
    // const orgId = params.orgId;
    // const q = query(collection(db, "jobListings"), where("orgId", "==", orgId));
    // try {
    //     const data = await getDocs(q);
    //     const jobs = data.docs.map((job) => ({
    //         ...job.data(), id: job.id
    //     }))
        
    //     return jobs
    // } catch(err) {
    //     console.error(err);
    // }
    return 'No Data Fetched'
}

function OrgJobListings() {
    const orgId1 = useParams().orgId;
    const q = query(collection(db, "jobListings"), where("orgId", "==", orgId1));
    const [jobListings, setJobListings] = useState([]);
    useEffect(() => {
        const unsub = onSnapshot(q, (data) => {
            setJobListings(data.docs.map((doc) => ({
                ...doc.data(), 
                id: doc.id
            })))
        })
        return unsub;
    }, [])
    const [isAddModalOpen, setIsAddModalOpened] = useState(false);
    const [isEditModalOpen, setIsEditModalOpened] = useState(false);
    
    const [cJobName, setcJobName] = useState('');
    const [cJobTime, setcJobTime] = useState('');
    const [cJobSite, setcJobSite] = useState('');
    const [cJobLevel, setcJobLevel] = useState('');
    const [cVacancies, setcVacancies] = useState('');
    const [cJobExpiryDate, setcJobExpiryDate] = useState('');
    const [cJobDescription, setcJobDescription] = useState('');
    const [cJobId, setcJobId] = useState('');

    const [jobTitle, setJobTitle] = useState('');

    const orgId = useParams('orgId');

    const [isDeleteJobModalOpen, setIsDeleteJobModalOpened] = useState(false);

    const dateValidation = (jobDate) => {
        const todaysDate = new Date().toLocaleDateString('en-CA');

        const date = new Date(todaysDate);
        const jobEndDate = new Date(jobDate);
        if(date >= jobEndDate) {
            return true;
        } else if(date < jobEndDate) {
            return false;
        }
    }

    return (
        <motion.div className="orgJobListingsContainer" initial={{y: -500}} animate={{y: 0}}>
            <h1 style={{fontSize: '25px', alignSelf: 'center'}} className='orgJobListingsTitle'>Your Job Listings:</h1>
            <div className="orgJobListingsSearch">
                <input type='text' className='jobSearchInput' placeholder='Search Your Job Title' onChange={(e) => setJobTitle(e.target.value)} value={jobTitle}/>
                <motion.button whileTap={{scale: 0.9}} className='orgAddJobBtn' onClick={() => setIsAddModalOpened(true)}><img style={{width: '20px'}} src={addBtn} ></img>Add Job</motion.button>
            </div>
            <div className="orgJobListings">
                {jobListings?.filter(job => {
                    if(jobTitle.toLowerCase() === "") {
                        return job;
                    }
                    else {
                        return job.jobTitle.toLowerCase().includes(jobTitle.toLowerCase());
                    }
                }).map((job, index) => {
                    return (
                        <div style={!dateValidation(job.endDate) ? {border: '2px solid #6ce0a6'} : {border: '2px solid #faacb4'}} key={job.id} className="orgJobListing">
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
                            <div className="job3 flex gap-3 items-center">
                                <img src={calenderImg} style={{width: '20px', height: '20px'}} />
                                <p>Apply Before <strong>{job.endDate}</strong> </p>                            
                            </div>
                            <div className="job3 flex gap-3 items-center">
                                <p>Status: <strong style={dateValidation(job.endDate) ? {color: '#ED4E4E'} : {color: '#06753E'}}>{dateValidation(job.endDate) ? "Closed" : "Active"}</strong> </p>                            
                            </div>
                            <div className="editBtn flex" onClick={() => {
                                setIsEditModalOpened(true);
                                setcJobName(job.jobTitle);
                                setcJobTime(job.jobDurationType);
                                setcJobSite(job.workLocation);
                                setcJobLevel(job.experience);
                                setcVacancies(job.NofVacancy);
                                setcJobExpiryDate(job.endDate);
                                setcJobDescription(job.description);
                                setcJobId(job.id);
                                }}>
                                <p>Edit</p>
                                <img src={editBtnImg} alt="" />
                            </div>
                            <div className="deleteBtnContainer" onClick={() => {
                                    setIsDeleteJobModalOpened(true);
                                    setcJobId(job.id)
                                }}>
                                <p>Delete Job</p>
                                <img className='jobDeleteBtn' src={deleteBtn} alt="" />
                            </div>
                        </div>
                    )
                })}
            </div>
            {jobListings.length === 0 && <h1 className='noData'>No Jobs Added Yet...</h1>}
            <AddJobModal isAddModalOpen={isAddModalOpen} setIsAddModalOpened={setIsAddModalOpened} orgId={orgId.orgId} />
            <EditJobModal isEditModalOpen={isEditModalOpen} setIsEditModalOpened={setIsEditModalOpened}
                name={cJobName} time={cJobTime} site={cJobSite} level={cJobLevel} vacancy={cVacancies} expiryDate={cJobExpiryDate} description={cJobDescription} id={cJobId}
            />
            <DeleteJobModal isDeleteJobModalOpen={isDeleteJobModalOpen} setIsDeleteJobModalOpened={setIsDeleteJobModalOpened} id={cJobId} />
        </motion.div>
    )
}

export { OrgJobListings }