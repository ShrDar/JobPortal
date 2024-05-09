import React, { useState } from "react";
import { createPortal } from "react-dom";
import './org.css'

function AddJobModal({ isAddModalOpen, setIsAddModalOpened}) {
    if(!isAddModalOpen) {
        return;
    }

    const [jobName, setJobName] = useState('');
    const [jobTime, setJobTime] = useState('');
    const [jobSite, setJobSite] = useState('');
    const [jobLevel, setJobLevel] = useState('')
    const [jobVacancies, setJobVacancies] = useState('');
    const [jobAddDate, setJobAddDate] = useState('');
    const [jobExpiryDate, setJobExpiryDate] = useState('')

    return createPortal(
        <>
        <div className="overlay" onClick={() => setIsAddModalOpened(false)}></div>
        <div className="addJobModal">
            <p className="addJobTitle">Add Job</p>
            <div className="jobDetails1">

                <div className="jobDetail">
                <p>Title</p>
                        <input className="detailText" type="text" onChange={(e) => {setJobName(e.target.value)}} value={jobName} />
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
                    <input type="date" onChange={(e) => setJobExpiryDate(e.target.value)} />
                </div>
            </div>
            <button className="addJobModalBtn">Add</button>
        </div>
        </>
        , document.getElementById('modal')
    )
}

export { AddJobModal } 