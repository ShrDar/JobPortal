import { collection, getDocs } from "firebase/firestore";
import React, { Suspense, useState } from "react";
import { db } from "../../config/firebase";
import { Await, defer, useLoaderData, useNavigate, useNavigation } from "react-router-dom";
import calenderImg from '/calendar.png'
import teamImg from '/team.png'

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

        return {jobList: filteredData, orgList: filteredData1};
    } catch(err) {
        console.error(err);
    }

}

function ApplicantJobs() {
    const navigation = useNavigation();
    
    const navigate = useNavigate();
    let {jobList, orgList} = useLoaderData();
    const [jobListings, setJobListings] = useState(jobList)
    const [orgs, setOrgs] = useState(orgList)

    const [fullTime, setFullTime] = useState(false);
    const [partTime, setPartTime] = useState(false);
    const [onSite, setOnSite] = useState(false);
    const [remote, setRemote] = useState(false);
    const [hybrid, setHybrid] = useState(false);
    const [fresher, setFresher] = useState(false);
    const [beginner, setBeginner] = useState(false);
    const [intermediate, setIntermediate] = useState(false);
    const [expert, setExpert] = useState(false);

    const [jobTitle, setJobTitle] = useState('');
    const [jobOrg, setJobOrg] = useState(''); 

    const handleFilterApply = () => {
        if(!(fullTime || partTime || onSite || remote || hybrid || fresher || beginner || intermediate || expert)) {
            alert("Nothing Selected");
            return;
        }
        const jobs = jobList.filter((job) => {
            if(fullTime) {
                if(job.jobDurationType == "Full-Time") {
                    return true;
                }
            }
            if(partTime) {
                if(job.jobDurationType == "Part-Time")
                return true;
            }
            if(onSite) {
                if(job.workLocation == "On-Site")
                return true;
            }
            if(remote) {
                if(job.workLocation == "Remote")
                return true;
            }
            if(hybrid) {
                if(job.workLocation == "Hybrid")
                return true;
            }
            if(fresher) {
                if(job.experience == "Fresher")
                return true;
            }
            if(beginner) {
                if(job.experience == "Beginner")
                return true;
            }
            if(intermediate) {
                if(job.experience == "Intermediate")
                return true;
            }
            if(expert) {
                if(job.experience == 'Expert')
                return true
            }
        })
        setJobListings(jobs)
        

    }
    const handleFilterReset = () => {
        document.querySelectorAll("input[type='checkbox']:checked").forEach((element) => {
            element.click();
        });
    }

        
    return (
        <div className="applicantJobs">
            <div className="jobFilterBar">
                <div className="jobFilterBar-title ">
                    <p className="filter">Filter</p>
                    <p className="reset" onClick={handleFilterReset}>Reset</p>
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
                                <input type="checkbox" onChange={(e) => setFullTime(e.target.checked)} className="jobDurationType" />
                                <label>Full-Time</label>
                            </div>
                            <div className="checkBox">
                                <input type="checkbox" onChange={(e) => setPartTime(e.target.checked)} className="jobDurationType" />
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
                                <input type="checkbox" onChange={(e) => setOnSite(e.target.checked)} />
                                <label>On-Site</label>
                            </div>
                            <div className="checkBox">
                                <input type="checkbox" onChange={(e) => setRemote(e.target.checked)} />
                                <label>Remote</label>
                            </div>
                        </div>
                        <div className="checkBox-wrapper">
                            <div className="checkBox">
                                <input type="checkbox" onChange={(e) => setHybrid(e.target.checked)} />
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
                                <input type="checkbox" onChange={(e) => setFresher(e.target.checked)} />
                                <label>Fresher</label>
                            </div>
                            <div className="checkBox">
                                <input type="checkbox" onChange={(e) => setBeginner(e.target.checked)} />
                                <label>Beginner</label>
                            </div>
                        </div>
                        <div className="checkBox-wrapper">
                            <div className="checkBox">
                                <input type="checkbox" onChange={(e) => setIntermediate(e.target.checked)} />
                                <label>Intermediate</label>
                            </div>
                            <div className="checkBox">
                                <input type="checkbox" onChange={(e) => setExpert(e.target.checked)} />
                                <label>Expert</label>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="line"></div>
                <button className="jobFilterBarApplyBtn" onClick={handleFilterApply}>Apply</button>
            </div>
            <div className="jobSearchAndJobsWrapper">
                <div className="applicantJobs-searchBarContainer">
                    <h1 style={{fontSize: '20px', fontWeight: '700', color: '#025d14'}}>Find your dream job</h1>
                    <p style={{fontSize: '13px', color: '#B8B8B8', marginTop: '-10px'}}>Explore the newest job opportunities to discover and apply for the best positions</p>
                    <div className="applicantJobs-searchBar">
                        <div className="jobSearchInputWrapper">
                            <input className="jobSearchInput1" placeholder="Search Job Title here" onChange={(e) => setJobTitle(e.target.value)} value={jobTitle} />
                            <input className="jobSearchInput2" placeholder="Search Organization here" onChange={(e) => setJobOrg(e.target.value)} value={jobOrg} />
                            <button className="jobSearchInputBtn" >Search</button>
                        </div>
                    </div>
                </div>
                <div className="jobListings">
                    {jobListings.filter((item) => {
                        //return jobTitle.toLowerCase() === '' ? item : item.jobTitle.includes(jobTitle)
                        if(jobTitle.toLowerCase() === "" && jobOrg.toLowerCase === "") {
                            return item;
                        }
                        else{
                            const org = orgs.find(org => org.id === item.orgId);
                            return item.jobTitle.toLowerCase().includes(jobTitle.toLowerCase()) && org.name.toLowerCase().includes(jobOrg.toLowerCase());
                        }
                    }).map(job => {
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