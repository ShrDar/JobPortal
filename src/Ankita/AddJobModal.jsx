import React, { useState } from "react";
import { createPortal } from "react-dom";
import './org.css'
import { addDoc, collection, updateDoc } from "firebase/firestore";
import { db } from "../../config/firebase";
import { motion } from "framer-motion";

function AddJobModal({ isAddModalOpen, setIsAddModalOpened, orgId }) {
    if(!isAddModalOpen) { //checking if the modal's state is open or closed
        return; //is the modal's state is false then the function gets terminated
    }

    const date = new Date().toLocaleDateString('en-CA'); //used to find the current data of the system

    //initializing states
    const [jobName, setJobName] = useState('');
    const [jobTime, setJobTime] = useState('Full-Time');
    const [jobSite, setJobSite] = useState('On-Site');
    const [jobLevel, setJobLevel] = useState('Fresher')
    const [jobVacancies, setJobVacancies] = useState('');
    const [jobAddDate, setJobAddDate] = useState('');
    const [jobEffectiveDate, setJobEffectiveDate] = useState('');
    const [jobExpiryDate, setJobExpiryDate] = useState('');
    const [jobDescription, setJobDescription] = useState('');

    const handleAddJob = async() => {
        if(jobName == "" || jobDescription == "" || jobVacancies == "" || jobExpiryDate == "") {
            alert("Missing Fields: Title or Desc or Vacancies or Available Till");
            return;
        }
        const letters = /[a-zA-Z]/g;
        if(jobName.match(letters) && jobDescription.match(letters)) {
            
        } else {
            alert('Title and Description should contain letters (Dont try to break my sh*t)')
            return;
        }
        try {
            const jobListRef = collection(db, 'jobListings');
            const newJob = {jobTitle: jobName, jobDurationType: jobTime, workLocation: jobSite, experience: jobLevel, NofVacancy: jobVacancies, description: jobDescription, effectiveDate: date, endDate: jobExpiryDate, createdDate: date, updatedDate: date, orgId: orgId}
            //console.log(newJob);
            await addDoc(jobListRef, newJob);
            setIsAddModalOpened(false)
        }
        catch(err) {
            console.error(err)
        }

    }
    const dropIn = {
        hidden: {
            opacity: 0,
            y: '100%',
            x: '-50%'
        }, visible: {
            y: '-50%',
            x: '-50%',
            opacity: 1,
            transition: { duration: 0.1, type: 'spring', damping: 25, stiffness: 500}
        }, exit: {
            opacity: 0
        }
    }

    return createPortal(
        <>
        <div className="overlay" onClick={() => setIsAddModalOpened(false)}></div>
        <motion.div initial='hidden' animate='visible' exit='exit' variants={dropIn} className="addJobModal modal">
            <p className="addJobTitle">Add Job</p>
            <div className="jobDetails1">

                <div className="jobDetail">
                <p>Title</p>
                        <input className="detailText" type="text" onChange={(e) => {setJobName(e.target.value)}} value={jobName} maxLength={50} />
                </div>
                <div className="jobDetail">
                <p>Description</p>
                <textarea onChange={(e) => setJobDescription(e.target.value)} className="form-control detailTextArea" id="exampleFormControlTextarea1" rows="3" maxLength={'500'} value={jobDescription}></textarea>
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
                    <input type="number" min={1} className="detailText" onChange={(e) => setJobVacancies(e.target.value)} value={jobVacancies}/>
                </div>
                <div className="jobDetail">
                    <p>Available Till</p>
                    <input type="date" min={date} max={'2025-01-01'} onChange={(e) => setJobExpiryDate(e.target.value)} />
                </div>
            </div>
            <motion.button whileHover={{scale: 1.1}} whileTap={{scale: 0.9}} className="addJobModalBtn" onClick={() => handleAddJob()}>Add</motion.button>
        </motion.div>
        </>
        , document.getElementById('modal')
    )
}

export { AddJobModal } 