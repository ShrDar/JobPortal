import { collection, getDocs } from "firebase/firestore";
import React, { Suspense, useEffect, useState } from "react";
import { db } from "../../config/firebase";
import { Await, defer, useLoaderData, useNavigate, useNavigation } from "react-router-dom";
import calenderImg from '/calendar.png'
import teamImg from '/team.png'
import { motion } from "framer-motion";

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
            setJobListings(jobList);
            return;
        }
        const jobs = jobList.filter((job) => {
            if(fullTime) return job.jobDurationType === 'Full-Time';
            if(partTime) return job.jobDurationType === 'Part-Time';

            if(onSite) return job.workLocation === 'On-Site';
            if(hybrid) return job.workLocation === "Hybrid";
            if(remote) return job.workLocation === 'Remote'

            if(fresher) return job.experience === "Fresher";
            if(beginner) return job.experience === "Beginner";
            if(intermediate) return job.experience === "Intermediate";
            if(expert) return job.experience === "Expert";
        })
        setJobListings(jobs)
        

    }
    const handleFilterReset = () => {
        document.querySelectorAll("input[type='checkbox']:checked").forEach((element) => {
            element.click();
        });
    }

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

    useEffect(() => {
        if(!(fullTime || partTime || onSite || remote || hybrid || fresher || beginner || intermediate || expert)) {
            setJobListings(jobList);
            return;
        }
        const jobs = jobList.filter((job) => {
            if(fullTime && partTime) return (job.jobDurationType === "Full-Time" || job.jobDurationType === "Part-Time");
            if(onSite && remote) return (job.workLocation === "On-Site" || job.workLocation === "Remote");
            if(remote && hybrid) return (job.workLocation === "Hybrid" || job.workLocation === "Remote");
            if(onSite && hybrid) return (job.workLocation === "On-Site" || job.workLocation === "Hybrid");
            if(fresher && beginner) return (job.experience === "Fresher" || job.experience === "Beginner");
            if(fresher && intermediate) return (job.experience === "Intermediate" || job.experience === "Fresher");
            if(fresher && expert) return (job.experience === "Fresher" || job.experience === "Expert");
            if(expert && beginner) return (job.experience === "Expert" || job.experience === "Beginner");
            if(expert && intermediate) return (job.experience === "Expert" || job.experience === "Intermediate");
            if(intermediate && beginner) return (job.experience === "Intermediate" || job.experience === "Beginner");

            if(fullTime && onSite) return (job.jobDurationType === "Full-Time" && job.workLocation === "On-Site");
            if(fullTime && remote) return (job.jobDurationType === "Full-Time" && job.workLocation === "Remote");
            if(fullTime && hybrid) return (job.jobDurationType === "Full-Time" && job.workLocation === "Hybrid");
            if(fullTime && fresher) return (job.jobDurationType === "Full-Time" && job.experience === "Fresher");
            if(fullTime && beginner) return (job.jobDurationType === "Full-Time" && job.experience === "Beginner");
            if(fullTime && intermediate) return (job.jobDurationType === "Full-Time" && job.experience === "Intermediate");
            if(fullTime && expert) return (job.jobDurationType === "Full-Time" && job.experience === "Expert");
            

            if(fullTime) return job.jobDurationType === 'Full-Time';
            if(partTime) return job.jobDurationType === 'Part-Time';

            if(onSite) return job.workLocation === 'On-Site';
            if(hybrid) return job.workLocation === "Hybrid";
            if(remote) return job.workLocation === 'Remote'

            if(fresher) return job.experience === "Fresher";
            if(beginner) return job.experience === "Beginner";
            if(intermediate) return job.experience === "Intermediate";
            if(expert) return job.experience === "Expert";
        })
        setJobListings(jobs)
    }, [fullTime, partTime, onSite, remote, hybrid, fresher, beginner, intermediate, expert])

        
    return (
        <div className="relative flex justify-start items-start gap-5 h-fit p-5  w-full font-['Karla',sans-serif]">
            <div className="sticky top-[60px] flex flex-col justify-start items-start bg-white h-full w-[16%] p-5 rounded-[10px] gap-[30px]">
                <div className="flex justify-between w-full items-center">
                    <p className="text-[20px] text-[#070707] font-semibold">Filter</p>
                    <p className="text-[12px] text-[#26A365] font-bold cursor-pointer transition duration-200" onClick={handleFilterReset}>Reset</p>
                </div>
                <div className="w-full border-[1px] border-[#dddddd] m-[-15px_0px]"></div>
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
                <div className="flex flex-col gap-[10px] w-full my-[10px]">
                    <h3 className="text-[16px] font-medium text-[#025d14] mb-[8px]">Job Type</h3>
                    <div className="flex flex-col gap-[8px]">
                        <div className="flex w-full justify-between items-center">
                            <div className="flex gap-[5px] text-[13px]" onClick={() => setFullTime(prevState => !prevState)}>
                                <input type="checkbox" onChange={(e) => setFullTime(e.target.checked)} className="jobDurationType" checked={fullTime} />
                                <label>Full-Time</label>
                            </div>
                            <div className="flex gap-[5px] text-[13px]" onClick={() => setPartTime(prevState => !prevState)}>
                                <input type="checkbox" onChange={(e) => setPartTime(e.target.checked)} className="jobDurationType" checked={partTime} />
                                <label>Part-Time</label>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="line"></div>
                <div className="flex flex-col gap-[10px] w-full my-[10px]">
                    <h3 className="text-[16px] font-medium text-[#025d14] mb-[8px]">Work Location</h3>
                    <div className="flex flex-col gap-[8px]">
                        <div className="flex w-full justify-between items-center" >
                            <div className="flex gap-[5px] text-[13px]" onClick={() => setOnSite(prevState => !prevState)}>
                                <input type="checkbox" onChange={(e) => setOnSite(e.target.checked)} checked={onSite} />
                                <label>On-Site</label>
                            </div>
                            <div className="flex gap-[5px] text-[13px]" onClick={() => setRemote(prevState => !prevState)}>
                                <input type="checkbox" onChange={(e) => setRemote(e.target.checked)} checked={remote} />
                                <label>Remote</label>
                            </div>
                        </div>
                        <div className="flex w-full justify-between items-center">
                            <div className="flex gap-[5px] text-[13px]" onClick={() => setHybrid(prevState => !prevState)}>
                                <input type="checkbox" onChange={(e) => setHybrid(e.target.checked)} checked={hybrid} />
                                <label>Hybrid</label>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="line"></div>
                <div className="flex flex-col gap-[10px] w-full my-[10px]">
                    <h3 className="text-[16px] font-medium text-[#025d14] mb-[8px]">Experience Level</h3>
                    <div className="flex flex-col gap-[8px]">
                        <div className="flex w-full justify-between items-center">
                            <div className="flex gap-[5px] text-[13px]" onClick={() => setFresher(prevState => !prevState)}>
                                <input type="checkbox" onChange={(e) => setFresher(e.target.checked)} checked={fresher} />
                                <label>Fresher</label>
                            </div>
                            <div className="flex gap-[5px] text-[13px]" onClick={() => setBeginner(prevState => !prevState)}>
                                <input type="checkbox" onChange={(e) => setBeginner(e.target.checked)} checked={beginner} />
                                <label>Beginner</label>
                            </div>
                        </div>
                        <div className="flex w-full justify-between items-center">
                            <div className="flex gap-[5px] text-[13px]" onClick={() => setIntermediate(prevState => !prevState)}>
                                <input type="checkbox" onChange={(e) => setIntermediate(e.target.checked)} checked={intermediate} />
                                <label>Intermediate</label>
                            </div>
                            <div className="flex gap-[5px] text-[13px]" onClick={() => setExpert(prevState => !prevState)}>
                                <input type="checkbox" onChange={(e) => setExpert(e.target.checked)} checked={expert} />
                                <label>Expert</label>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="line"></div>
                <button className="w-full bg-[#26A365] text-white p-[6px] rounded-[10px] my-[20px] transition duration-200 hover:drop-shadow-[1px_1px_5px_#26A365]" onClick={handleFilterApply}>Apply</button>
            </div>
            <div className="self-start w-[84%] flex flex-col gap-5">
                <div className="w-full h-fit flex flex-col justify-center items-start self-start m-0 bg-white rounded-[10px] py-5 px-5 gap-2.5">
                    <h1 className="text-[20px] font-bold text-[#025d14]" >Find your dream job</h1>
                    <p className="text-xs text-[#B8B8B8] -mt-2">Explore the newest job opportunities to discover and apply for the best positions</p>
                    <div className="applicantJobs-searchBar w-full">
                        <div className="flex justify-start items-center w-full">
                            <div className="flex w-[85%]">
                                <input className="border border-[#6b6b6b] rounded-l-[5px] py-3 px-2 text-[14px] w-full" placeholder="Search Job Title here" onChange={(e) => setJobTitle(e.target.value)} value={jobTitle} />
                                <input className="border border-[#6b6b6b] rounded-r-[5px] py-3 px-2 text-[14px] w-full" placeholder="Search Organization here" onChange={(e) => setJobOrg(e.target.value)} value={jobOrg} />
                            </div>
                            <button className="flex justify-center items-center w-[15%] bg-[#119856] text-white py-2 px-5 rounded-[10px] ml-[15px] transition-all duration-200" >Search</button>
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
                    }).map((job, index) => {
                        const org = orgs.find(org => org.id === job.orgId);
                        
                        return (
                            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.1, delay: index * 0.04, ease: "easeOut", }} whileTap={{scale: 0.8}} style={!dateValidation(job.endDate) ? {border: '2px solid #6ce0a6'} : {border: '2px solid #faacb4'}} className="job" key={job.id} onClick={() => navigate(`/applicantDashboard/jobDetails/${job.id}`)}>
                                <div className="job1">
                                    <img className="jobOrgLogo" src={org.imgUrl} alt="" />
                                    <div className="job1-1">
                                        <h2>{job.jobTitle.length > 13
                                            ? `${job.jobTitle.slice(0, 13)}...`
                                            : job.jobTitle}</h2>
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
                                <div className="job4 flex gap-3 items-center">
                                    <img src={calenderImg} style={{width: '20px', height: '20px'}} />
                                    {/* <p>Apply Before <strong>{job.endDate}</strong> </p> */}
                                    <p style={dateValidation(job.endDate) ? {textDecoration: 'line-through'} : {}}>Apply Before <strong>{job.endDate}</strong> </p>

                                </div>
                                <motion.div style={dateValidation(job.endDate) ? {border: "2px solid #FAACB4"} : {border: "2px solid #6ce0a6"}} className="jobStatus" >
                                    {dateValidation(job.endDate) ? 'Closed' : 'Open'}
                                </motion.div>
                            </motion.div>
                        )
                    })}
                </div>
            </div>
        </div>
    )
}

export { ApplicantJobs }