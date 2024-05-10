import { collection, doc, updateDoc } from "firebase/firestore";
import React, { useState } from "react";
import { createPortal } from "react-dom";
import { db } from "../../config/firebase";
import { motion } from "framer-motion";

function EditJobModal({ isEditModalOpen, setIsEditModalOpened, name, time, site, level, vacancy, expiryDate, description, id }) {
    if(!isEditModalOpen) {
        return;
    }

    const date = new Date().toLocaleDateString('en-CA');

    const [jobName, setJobName] = useState(name);
    const [jobTime, setJobTime] = useState(time);
    const [jobSite, setJobSite] = useState(site);
    const [jobLevel, setJobLevel] = useState(level)
    const [jobVacancies, setJobVacancies] = useState(vacancy);
    const [jobAddDate, setJobAddDate] = useState('');
    const [jobExpiryDate, setJobExpiryDate] = useState(expiryDate)
    const [jobDescription, setJobDescription] = useState(description);

    const handleEdit = async() => {
        if(jobName == "" || jobDescription == "" || jobVacancies == "" || jobExpiryDate == "") {
            alert("Missing Fields: Title or Desc or Vacancies or Available Till");
            return;
        }
        const letters = /[a-zA-Z]/g;
        if(jobName.match(letters) && jobDescription.match(letters)) {
            console.log('contains')
        } else {
            alert('Title and Description should contain letters (Dont try to break my sh*t)')
            return;
        }

        try {
            const jobRef = doc(db, 'jobListings', id)
            const updatedJob = {NofVacancy: jobVacancies, description: jobDescription, endDate: jobExpiryDate, experience: jobLevel, jobDurationType: jobTime, jobTitle: jobName, updatedDate: date, workLocation: jobSite }
            console.log(updatedJob)
            await updateDoc(jobRef, updatedJob)
            setIsEditModalOpened(false);
        } catch(err) {
            console.error(err)
        }
    }

    const dropIn = {
        hidden: {
            opacity: 0,
            y: '-100%',
            x: '-50%'
        }, visible: {
            y: '-50%',
            x: '-50%',
            opacity: 1,
            transition: { duration: 0.2, type: 'spring', damping: 25, stiffness: 500}
        }, exit: {
            opacity: 0
        }
    }

    return createPortal(
        <>
        <div className="overlay" onClick={() => setIsEditModalOpened(false)}></div>
        <motion.div initial='hidden' animate='visible' exit='exit' variants={dropIn} className="addJobModal">
            <p className="addJobTitle">Edit Job</p>
            <div className="jobDetails1">

                <div className="jobDetail">
                <p>Title</p>
                        <input className="detailText" type="text" onChange={(e) => {setJobName(e.target.value)}} value={jobName} />
                </div>
                <div className="jobDetail">
                <p>Description</p>
                <textarea onChange={(e) => setJobDescription(e.target.value)} style={{height: '120px'}} className="form-control detailTextArea" id="exampleFormControlTextarea1" rows="3" maxLength={'500'} value={jobDescription}></textarea>
                </div>
                <div className="jobDetail">
                    <p>Job Time</p>
                    <select name='jobTime' onChange={(e) => setJobTime(e.target.value)} value={jobTime} >
                        <option>Full-Time</option>
                        <option>Part-Time</option>
                    </select>
                </div>
                <div className="jobDetail">
                    <p>Job Site</p>
                    <select name='jobSite' onChange={(e) => setJobSite(e.target.value)} value={jobSite}>
                            <option>On-Site</option>
                            <option>Remote</option>
                            <option>Hybrid</option>
                    </select>
                </div>
                <div className="jobDetail">
                    <p>Job Level</p>
                    <select name="jobLevel" onChange={(e) => setJobLevel(e.target.value)} value={jobLevel} >
                        <option>Fresher</option>
                        <option>Beginner</option>
                        <option>Intermediate</option>
                        <option>Expert</option>
                    </select>
                </div>
                <div className="jobDetail">
                    <p>Vacancies</p>
                    <input type="number" className="detailText" onChange={(e) => setJobVacancies(e.target.value)} value={jobVacancies}/>
                </div>
                <div className="jobDetail">
                    <p>Available Till</p>
                    <input type="date" onChange={(e) => setJobExpiryDate(e.target.value)} value={jobExpiryDate} />
                </div>
            </div>
            <button className="addJobModalBtn" onClick={() => handleEdit()}>Apply</button>
        </motion.div>
        </>
        , document.getElementById('modal')
    )
}

export { EditJobModal }