import { doc, getDoc } from "firebase/firestore";
import React, { useState } from "react";
import { db } from "../../config/firebase";
import { useLoaderData, useNavigate } from "react-router-dom";
import calenderImg from '/calendar.png'
import teamImg from '/team.png'
import earthImg from '/earth.png'
import backImg from '/cross.png'
import { ApplyJobModal } from "./ApplyJobModal";
import { motion } from "framer-motion";

export async function loader({ params }) {
    const jobId = params.jobId;
    const jobRef = doc(db, "jobListings", jobId);
    try {
        const data = await getDoc(jobRef);
        const job = {...data.data(), id: jobId};
        const orgRef = doc(db, "organization", job.orgId);
        const data1 = await getDoc(orgRef);
        const org = data1.data();
        return {job, org}
    } catch( err ) {
        console.error(err)
    }
    
}

function ApplicantJobDetails() {
    const navigate = useNavigate();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const { job, org } = useLoaderData(); 

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

    const dateCheck = dateValidation(job.endDate);

    return (
        <motion.div initial={{y: -500}} animate={{y: 0}} className="applicantJobDetails" >
            <div className="jobDetails" style={!dateCheck ? {border: '2px solid #6ce0a6'} : {border: '2px solid #faacb4'}}>
                <div className="jobTitle flex justify-between">
                    <div className="jobTitleWapper flex gap-2">
                        <img src={org.imgUrl} style={{width: '50px', borderRadius: '10px'}} />
                        <div className="jobTitle-1">    
                            <h1 style={{fontSize: '20px', fontWeight: '500'}}>{job.jobTitle}</h1>
                            <p>{org.name}</p>
                        </div>
                    </div>
                    <motion.img whileTap={{scale: [2, 1]}} className="cross" style={{alignSelf: 'flex-start'}} src={backImg} onClick={() => navigate('/applicantDashboard/applicantJobs')} />
                </div>
                <div className="jobTypes job2">
                    <p className="jobDuration">{job.jobDurationType}</p>
                    <p className="jobWorkLocation">{job.workLocation}</p>
                    <p className="jobExperience">{job.experience}</p>
                </div>
                <div className="jobDescription" style={{textAlign: "justify"}}>
                    <p style={{marginBottom: '8px'}}>Description:</p>
                    <p className="description" style={{fontSize: '12px', color: '#4b4b4b'}}>{job.description}</p>
                </div>
                <div className="jobVacancies flex gap-3">
                    <img src={teamImg} alt="" style={{width: '25px'}} />
                    <p style={{fontSize: '14px'}}>Vacancies: {job.NofVacancy}</p>
                </div>
                <div className="jobEnd flex gap-3">
                    <img src={calenderImg} style={{width: '20px'}} />
                    <p style={dateCheck ? {textDecoration: 'line-through', fontSize: '14px'} : {fontSize: '14px'}}>Apply Before: {job.endDate} </p>
                </div>
                <div className="jobOfficeLocation flex gap-3">
                    <img src={earthImg} style={{width: '20px'}} />
                    <p>Location: 📍 {org.address}</p>
                </div>
                <button style={dateCheck ? {background: '#FF7979', pointerEvents: 'none', cursor: 'not-allowed'} : {}} className="applicantApplyBtn" onClick={() => setIsModalOpen(true)}>{dateCheck ? "Closed" : "Apply"}</button>
                <ApplyJobModal isOpened={isModalOpen} setIsOpened={setIsModalOpen} job={job}></ApplyJobModal>
            </div>
        </motion.div>
    )
}

export {ApplicantJobDetails}