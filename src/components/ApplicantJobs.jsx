import { collection, getDocs } from "firebase/firestore";
import React, { useMemo, useState } from "react";
import { db } from "../../config/firebase";
import { useLoaderData, useNavigate, useNavigation } from "react-router-dom";
import calenderImg from '/calendar.png'
import teamImg from '/team.png'
import { motion, AnimatePresence } from "framer-motion";
import { Icon } from '@iconify/react';

export async function loader() {
    const applicantJobCollectionRef = collection(db, 'jobListings')
    const orgCollectionRef = collection(db, 'organizationPublic')
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
    
    const navigate = useNavigate();
    let {jobList, orgList} = useLoaderData();

    const [selectedFilters, setSelectedFilters] = useState({
        jobDurationType: [],
        workLocation: [],
        experience: []
    });

    const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
    const [jobTitle, setJobTitle] = useState('');
    const [jobOrg, setJobOrg] = useState(''); 

    const handleFilterToggle = (category, value) => {
        setSelectedFilters((prev) => {
            const currentValues = prev[category] || [];
            const updatedValues = currentValues.includes(value)
                ? currentValues.filter((v) => v !== value)
                : [...currentValues, value];

            return {
                ...prev,
                [category]: updatedValues
            };
        });
    };

    const isChecked = (category, value) => {
        return (selectedFilters[category] || []).includes(value);
    };

    const handleFilterReset = () => {
        setSelectedFilters({
            jobDurationType: [],
            workLocation: [],
            experience: []
        });
        setJobTitle('');
        setJobOrg('');
    };


    const dateValidation = (jobDate) => {
        if (!jobDate) return false;
        const todaysDate = new Date().toLocaleDateString('en-CA');
        const date = new Date(todaysDate);
        const jobEndDate = new Date(jobDate);
        return date >= jobEndDate;
    };

    const filteredJobs = useMemo(() => {
        return (jobList || []).filter((job) => {
            if (jobTitle.trim()) {
                const matchesTitle = job.jobTitle
                    ?.toLowerCase()
                    .includes(jobTitle.toLowerCase().trim());
                if (!matchesTitle) return false;
            }

            if (jobOrg.trim()) {
                const org = (orgList || []).find((o) => o.id === job.orgId);
                const matchesOrg = org?.name
                    ?.toLowerCase()
                    .includes(jobOrg.toLowerCase().trim());
                if (!matchesOrg) return false;
            }

            for (const [category, selectedValues] of Object.entries(selectedFilters)) {
                if (selectedValues.length > 0) {
                    const jobValue = job[category];
                    if (!selectedValues.includes(jobValue)) {
                        return false;
                    }
                }
            }

            return true;
        });
    }, [jobList, orgList, selectedFilters, jobTitle, jobOrg]);

        
    const filterContent = (
        <>
            <div className="flex justify-between w-full items-center">
                <p className="text-[20px] text-[#070707] font-semibold">Filter</p>
                <div className="flex items-center gap-3">
                    <p className="text-[12px] text-[#26A365] font-bold cursor-pointer transition duration-200" onClick={handleFilterReset}>Reset</p>
                </div>
            </div>
            <div className="w-full border-[1px] border-[#dddddd] m-[-15px_0px]"></div>
            
            <input className="border-[3px] border-[#dddddd] rounded-[5px] py-2 px-2 text-[14px] w-full" placeholder="Job Title..." onChange={(e) => setJobTitle(e.target.value)} value={jobTitle} />
            
            <div className="w-full border-[1px] border-[#dddddd] m-[-15px_0px]"></div>

            <div className="flex flex-col gap-[10px] w-full mb-[10px]">
                <h3 className="text-[16px] font-medium text-[#025d14] mb-[8px]">Job Type</h3>
                <div className="flex flex-col gap-[8px]">
                    <div className="flex w-full justify-between items-center">
                        <label className="flex gap-[5px] text-[13px] cursor-pointer items-center">
                            <input type="checkbox" onChange={() => handleFilterToggle('jobDurationType', 'Full-Time')} className="jobDurationType" checked={isChecked('jobDurationType', 'Full-Time')} />
                            <span>Full-Time</span>
                        </label>
                        <label className="flex gap-[5px] text-[13px] cursor-pointer items-center">
                            <input type="checkbox" onChange={() => handleFilterToggle('jobDurationType', 'Part-Time')} className="jobDurationType" checked={isChecked('jobDurationType', 'Part-Time')} />
                            <span>Part-Time</span>
                        </label>
                    </div>
                </div>
            </div>
            <div className="line"></div>
            <div className="flex flex-col gap-[10px] w-full my-[10px]">
                <h3 className="text-[16px] font-medium text-[#025d14] mb-[8px]">Work Location</h3>
                <div className="flex flex-col gap-[8px]">
                    <div className="flex w-full justify-between items-center" >
                        <label className="flex gap-[5px] text-[13px] cursor-pointer items-center">
                            <input type="checkbox" onChange={() => handleFilterToggle('workLocation', 'On-Site')} checked={isChecked('workLocation', 'On-Site')} />
                            <span>On-Site</span>
                        </label>
                        <label className="flex gap-[5px] text-[13px] cursor-pointer items-center">
                            <input type="checkbox" onChange={() => handleFilterToggle('workLocation', 'Remote')} checked={isChecked('workLocation', 'Remote')} />
                            <span>Remote</span>
                        </label>
                    </div>
                    <div className="flex w-full justify-between items-center">
                        <label className="flex gap-[5px] text-[13px] cursor-pointer items-center">
                            <input type="checkbox" onChange={() => handleFilterToggle('workLocation', 'Hybrid')} checked={isChecked('workLocation', 'Hybrid')} />
                            <span>Hybrid</span>
                        </label>
                    </div>
                </div>
            </div>
            <div className="line"></div>
            <div className="flex flex-col gap-[10px] w-full my-[10px]">
                <h3 className="text-[16px] font-medium text-[#025d14] mb-[8px]">Experience Level</h3>
                <div className="flex flex-col gap-[8px]">
                    <div className="flex w-full justify-between items-center">
                        <label className="flex gap-[5px] text-[13px] cursor-pointer items-center">
                            <input type="checkbox" onChange={() => handleFilterToggle('experience', 'Fresher')} checked={isChecked('experience', 'Fresher')} />
                            <span>Fresher</span>
                        </label>
                        <label className="flex gap-[5px] text-[13px] cursor-pointer items-center">
                            <input type="checkbox" onChange={() => handleFilterToggle('experience', 'Beginner')} checked={isChecked('experience', 'Beginner')} />
                            <span>Beginner</span>
                        </label>
                    </div>
                    <div className="flex w-full justify-between items-center">
                        <label className="flex gap-[5px] text-[13px] cursor-pointer items-center">
                            <input type="checkbox" onChange={() => handleFilterToggle('experience', 'Intermediate')} checked={isChecked('experience', 'Intermediate')} />
                            <span>Intermediate</span>
                        </label>
                        <label className="flex gap-[5px] text-[13px] cursor-pointer items-center">
                            <input type="checkbox" onChange={() => handleFilterToggle('experience', 'Expert')} checked={isChecked('experience', 'Expert')} />
                            <span>Expert</span>
                        </label>
                    </div>
                </div>
            </div>
        </>
    );

    return (
        <div className="relative flex flex-col lg:flex-row justify-start items-start gap-5 h-fit p-5 w-full font-['Karla',sans-serif]">
            <div className="hidden lg:flex sticky top-[10%] flex-col justify-start items-start bg-white h-fit w-[22%] xl:w-[15%] p-5 rounded-[10px] gap-[30px]">
                {filterContent}
            </div>

            <AnimatePresence>
                {isMobileFilterOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 0.5 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsMobileFilterOpen(false)}
                            className="fixed inset-0 bg-black z-40 lg:hidden"
                        />

                        <motion.div
                            initial={{ x: "-100%" }}
                            animate={{ x: 0 }}
                            exit={{ x: "-100%" }}
                            transition={{ type: "spring", damping: 25, stiffness: 200 }}
                            className="fixed top-[15%] -translate-y-1/2 left-4 z-50 w-[55%] py-8 bg-white p-5 rounded-[10px] flex flex-col gap-[30px] shadow-2xl lg:hidden"
                        >
                            {filterContent}
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

            <motion.button
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.92 }}
                onClick={() => setIsMobileFilterOpen(prev => !prev)}
                className="fixed bottom-6 left-6 z-40 lg:hidden flex items-center justify-center w-14 h-14 bg-[#119856] text-white rounded-full shadow-lg hover:bg-[#025d14] focus:outline-none transition-colors duration-200"
                aria-label="Toggle Filters"
            >
                <Icon icon="mdi:filter" className="w-6 h-6" />
                {Object.values(selectedFilters).some(arr => arr.length > 0) && (
                    <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full border-2 border-white"></span>
                )}
            </motion.button>

            <div className="self-start w-full lg:w-[78%] xl:w-[82%] flex flex-col gap-5">
                <div className="w-full h-fit flex flex-col justify-center items-start self-start m-0 bg-white rounded-[10px] py-5 px-5 gap-2.5">
                    <h1 className="text-[20px] font-bold text-[#025d14]" >Find your dream job</h1>
                    <p className="text-xs text-[#B8B8B8] -mt-2">Explore the newest job opportunities to discover and apply for the best positions</p>
                    <div className="applicantJobs-searchBar w-full">
                        <div className="flex flex-col sm:flex-row justify-start items-center w-full gap-3 sm:gap-0">
                            <div className="flex w-full sm:w-[85%]">
                                <input className="border border-[#6b6b6b] rounded-l-[5px] py-3 px-2 text-[14px] w-full" placeholder="Search Job Title here" onChange={(e) => setJobTitle(e.target.value)} value={jobTitle} />
                                <input className="border border-[#6b6b6b] rounded-r-[5px] py-3 px-2 text-[14px] w-full" placeholder="Search Organization here" onChange={(e) => setJobOrg(e.target.value)} value={jobOrg} />
                            </div>
                            <div className="flex w-full sm:w-[15%] items-center gap-2 sm:ml-[15px]">
                                <button className="flex-1 justify-center items-center bg-[#119856] text-white py-3 sm:py-2 px-5 rounded-[10px] transition-all duration-200">Search</button>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="grid w-full grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
                    {filteredJobs.map((job, index) => {
                        const org = (orgList || []).find(org => org.id === job.orgId) || {};
                        
                        return (
                            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.1, delay: index * 0.04, ease: "easeOut", }} whileTap={{scale: 0.8}} style={!dateValidation(job.endDate) ? {border: '2px solid #6ce0a6'} : {border: '2px solid #faacb4'}} className="job" key={job.id} onClick={() => navigate(`/applicantDashboard/jobDetails/${job.id}`)}>
                                <div className="job1">
                                    <img className="aspect-square object-cover rounded-full w-[15%] border-2 border-[#8d8d8d]" src={org.imgUrl} alt="" />
                                    <div className="job1-1">
                                        <h2>{job.jobTitle?.length > 13
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