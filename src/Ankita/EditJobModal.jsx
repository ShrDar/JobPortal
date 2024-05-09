import React, { useState } from "react";
import { createPortal } from "react-dom";

function EditJobModal({ isEditModalOpen, setIsEditModalOpened, name, time, site, level, vacancy, expiryDate, description }) {
    
    if(!isEditModalOpen) {
        return;
    }

    const [jobName, setJobName] = useState(name);
    const [jobTime, setJobTime] = useState(time);
    const [jobSite, setJobSite] = useState(site);
    const [jobLevel, setJobLevel] = useState(level)
    const [jobVacancies, setJobVacancies] = useState(vacancy);
    const [jobAddDate, setJobAddDate] = useState('');
    const [jobExpiryDate, setJobExpiryDate] = useState(expiryDate)
    const [jobDescription, setJobDescription] = useState(description);
    return createPortal(
        <>
        <div className="overlay" onClick={() => setIsEditModalOpened(false)}></div>
        <div className="addJobModal">
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
            <button className="addJobModalBtn">Apply</button>
        </div>
        </>
        , document.getElementById('modal')
    )
}

export { EditJobModal }