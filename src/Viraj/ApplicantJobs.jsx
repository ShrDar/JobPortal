import { collection, getDocs } from "firebase/firestore";
import React, { Suspense, useState } from "react";
import { db } from "../../config/firebase";
import { Await, defer, useLoaderData, useNavigate, useNavigation } from "react-router-dom";
import calenderImg from '../../public/calendar.png'
import teamImg from '../../public/team.png'

export async function loader() {
    const applicantJobCollectionRef = collection(db, 'jobListings')
    const orgCollectionRef = collection(db, 'organization')
    try {

        const data = await getDocs(applicantJobCollectionRef);
        const filteredData = data.docs.map((doc) => ({
            ...doc.data(),
            id: doc.id
        }))
        const data1 = await getDocs(orgCollectionRef);
        const filteredData1 = data1.docs.map((doc) => ({
            ...doc.data(),
            id: doc.id
        }))

        return {jobListings: filteredData, orgs: filteredData1};
    } catch(err) {
        console.error(err);
    }

}

function ApplicantJobs() {
    const navigation = useNavigation();
    
    const navigate = useNavigate();
    const {jobListings, orgs} = useLoaderData();

    const [jobTitle, setJobTitle] = useState('');
    const [jobOrg, setJobOrg] = useState(''); 
    return (
        <div className="applicantJobs">
            <div className="jobFilterBar">
                <div className="jobFilterBar-title ">
                    <p className="filter">Filter</p>
                    <p className="reset">Reset</p>
                </div>
                <div className="line"></div>
                {/* <div className="jobFilterBar-names">
                    <h3 className="jobFilterBar-heading">Sort By</h3>
                    <div className="sortBy-checkBox">
                        <div className="checkBox-wrapper">
                            <div className="checkBox">
                                <input type="checkbox" />
                                <label>Recently</label>
                            </div>
                            <div className="checkBox">
                                <input type="checkbox" />
                                <label>A-Z</label>
                            </div>
                        </div>
                        <div className="checkBox-wrapper">
                            <div className="checkBox">
                                <input type="checkbox" />
                                <label>Top Salary</label>
                            </div>
                            <div className="checkBox">
                                <input type="checkbox" />
                                <label>Rating</label>
                            </div>
                        </div>
                    </div>
                </div> */}
                <div className="jobFilterBar-names">
                    <h3 className="jobFilterBar-heading">Job Type</h3>
                    <div className="sortBy-checkBox">
                        <div className="checkBox-wrapper">
                            <div className="checkBox">
                                <input type="checkbox" />
                                <label>Full-Time</label>
                            </div>
                            <div className="checkBox">
                                <input type="checkbox" />
                                <label>Part-Time</label>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="line"></div>
                <div className="jobFilterBar-names">
                    <h3 className="jobFilterBar-heading">Work Location</h3>
                    <div className="sortBy-checkBox">
                        <div className="checkBox-wrapper">
                            <div className="checkBox">
                                <input type="checkbox" />
                                <label>On-Site</label>
                            </div>
                            <div className="checkBox">
                                <input type="checkbox" />
                                <label>Remote</label>
                            </div>
                        </div>
                        <div className="checkBox-wrapper">
                            <div className="checkBox">
                                <input type="checkbox" />
                                <label>Hybrid</label>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="line"></div>
                <div className="jobFilterBar-names">
                    <h3 className="jobFilterBar-heading">Experience Level</h3>
                    <div className="sortBy-checkBox">
                        <div className="checkBox-wrapper">
                            <div className="checkBox">
                                <input type="checkbox" />
                                <label>Fresher</label>
                            </div>
                            <div className="checkBox">
                                <input type="checkbox" />
                                <label>Beginner</label>
                            </div>
                        </div>
                        <div className="checkBox-wrapper">
                            <div className="checkBox">
                                <input type="checkbox" />
                                <label>Intermediate</label>
                            </div>
                            <div className="checkBox">
                                <input type="checkbox" />
                                <label>Expert</label>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="line"></div>
                <button className="jobFilterBarApplyBtn">Apply</button>
            </div>
            <div className="jobSearchAndJobsWrapper">
                <div className="applicantJobs-searchBarContainer">
                    <h1 style={{fontSize: '20px', fontWeight: '700', color: '#025d14'}}>Find your dream job</h1>
                    <p style={{fontSize: '13px', color: '#B8B8B8', marginTop: '-10px'}}>Explore the newest job opportunities to discover and apply for the best positions</p>
                    <div className="applicantJobs-searchBar">
                        <div className="jobSearchInputWrapper">
                            <input className="jobSearchInput1" placeholder="Search Job Title here" onChange={(e) => setJobTitle(e.target.value)} value={jobTitle} />
                            <input className="jobSearchInput2" placeholder="Search Organization here" onChange={(e) => setJobOrg(e.target.value)} value={jobOrg} />
                            <button className="jobSearchInputBtn">Search</button>
                        </div>
                    </div>
                </div>
                <div className="jobListings">
                    {jobListings.map(job => {
                        const org = orgs.find(org => org.id === job.orgId);
                        
                        return (
                            <div className="job" key={job.id} onClick={() => navigate(`/applicantDashboard/jobDetails/${job.id}`)}>
                                <div className="job1">
                                    <img className="jobOrgLogo" src={org.imgUrl} alt="" />
                                    <div className="job1-1">
                                        <h2>{job.jobTitle}</h2>
                                        <p>{org.name}</p>
                                    </div>
                                </div>
                                <div className="job2">
                                    <p className="jobDuration">{job.jobDurationType}</p>
                                    <p className="jobWorkLocation">{job.workLocation}</p>
                                    <p className="jobExperience">{job.experience}</p>
                                </div>
                                <div className="job3 flex gap-3">
                                    <img src={teamImg} alt="" style={{width: '20px'}} />
                                    <p>Vacancies: <strong>{job.NofVacancy}</strong></p>
                                </div>
                                <div className="job4 flex gap-3">
                                    <img src={calenderImg} style={{width: '20px'}} />
                                    <p>Apply Before <strong>{job.endDate}</strong> </p>

                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>
        </div>
    )
}

export { ApplicantJobs }