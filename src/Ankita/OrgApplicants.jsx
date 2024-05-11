import { collection, onSnapshot, query, where } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { db } from "../../config/firebase";
import { useParams } from "react-router-dom";
import viewCv from '/cv.png'
import locationPic from '/earth.png'
import phonePic from '/phone.png'
import emailPic from '/email.png'
import namePic from '/name.png'
import calendarPic from '/calendar.png'
import deleteBtn from '/delete.png'
import { DeleteApplicantModal } from "./DeleteApplicantModal";


function OrgApplicants() {
    const orgId = useParams('orgId').orgId;
    const [allApplicants, setAllApplicants] = useState([]);
    const [jobListings, setJobListings] = useState([])
    const [myApplicants, setMyApplicants] = useState([]);
    
    const q = query(collection(db, "jobListings"), where("orgId", "==", orgId));
    useEffect(() => {
        const unsub = onSnapshot(q, (data) => {
            setJobListings(data.docs.map((doc) => ({
                ...doc.data(), 
                jobId: doc.id
            })))
        })
        return unsub;
    }, [])
    useEffect(() => {
        const unsub2 = onSnapshot(collection(db, 'applicant'), data => {
            setAllApplicants(data.docs.map(doc => ({
                ...doc.data(),
                applicantId: doc.id
            })))
        })
        return unsub2;
    }, [])
    
    let tempApplicants = [];
    allApplicants.filter((applicant) => {
        jobListings.forEach(job => {
            if(job.jobId === applicant.jobListingId) {
                tempApplicants.push({...applicant, ...job})
            }
        })
    })
    // console.log(tempApplicants);

    const [isDeleteApplicantModalOpen, setIsDeleteApplicantModalOpened] = useState(false);
    const [cApplicantId, setcApplicantId] = useState('')

    return (
        <>
            <h1 style={{fontSize: '25px', alignSelf: 'center', margin: '50px 0px 10px 0px'}} className='orgJobListingsTitle'>Job Applicants:</h1>
            <div className="orgApplicants">
                {tempApplicants.map(applicant => {
                    return (
                        <div className="orgApplicantContainer" key={applicant.applicantId}>
                            <div className="orgApplicantContainer1">
                                <div className="orgApplicant">
                                    <p className="applicantJobTitle" style={{fontSize: '20px', justifySelf: '', alignSelf: ''}}># {applicant.jobTitle}</p>
                                    <p className="flex items-center gap-2"><img src={namePic} style={{width: '20px'}}></img>Name - {applicant.name}</p>
                                    <p className="flex items-center gap-2"><img src={emailPic} style={{width: '20px', filter: 'drop-shadow(1px 1px 1px #8b8b8b)'}} alt="" />{applicant.email}</p>
                                    <p className="flex items-center gap-2"><img src={phonePic} style={{width: '20px', filter: 'brightness(0.6)'}} alt="" />{applicant.phone}</p>
                                    <p className="flex items-center gap-2"><img src={locationPic} style={{width: '20px'}} alt="" />{applicant.address}</p>
                                    <p className="flex items-center gap-2"><img src={calendarPic} style={{width: '20px'}} alt="" />Applied On - {applicant.appliedDate}</p>
                                </div>
                                <div className="viewCv">
                                    <a href={applicant.cv_ref} target="_blank">
                                        <button>View C.V <img src={viewCv} alt="" /></button>
                                    </a>
                                </div>
                            </div>
                            <div className="orgApplicantDelete">
                                <button><img src={deleteBtn} alt="" onClick={() => {
                                    setIsDeleteApplicantModalOpened(true)
                                    setcApplicantId(applicant.applicantId)
                                }
                                } /></button>
                            </div>
                        </div>
                    )
                })}
            </div>
            <DeleteApplicantModal isDeleteApplicantModalOpen={isDeleteApplicantModalOpen} setIsDeleteApplicantModalOpened={setIsDeleteApplicantModalOpened} id={cApplicantId} />
        </>
    )
}

export { OrgApplicants }