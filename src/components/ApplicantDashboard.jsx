import React from "react";
import { useLoaderData, Outlet, NavLink, Link } from "react-router-dom";
import stealthLogo from "/stealthLogo.svg"
import "./applicant.css"
import { useNavigate } from 'react-router-dom'
import { motion } from "framer-motion";

export async function loader() { //name of loader function doesn't matter

    return "The data is here";
}

function ApplicantDashboard() {
    const navigate = useNavigate();
    const data = useLoaderData();
    localStorage.setItem('fromApplicant', true);
    return (
        <div className="relative flex flex-col h-screen max-w-full bg-[#EDEDED] text-black font-['Karla',sans-serif]">
            <div className="relative flex h-[10%] w-full items-center justify-between bg-white p-[15px] drop-shadow-[1px_1px_1px_#d1d1d1] transition-all duration-200r">
                <Link to={''}>
                    <div className="flex items-center justify-around text-[25px] font-bold text-[#09924D]">
                        <img className="stealthLogo" src={stealthLogo} />
                        <h3>Stealth</h3>
                    </div>
                </Link>
                <div className="absolute inset-x-0 flex self-center justify-self-center gap-[50px] transition-all duration-200">
                    
                    <NavLink to={'applicantJobs'} style={({isActive}) => isActive ? {color: "#07914C", textDecoration: 'underline', textUnderlineOffset: '5px'} : {color: "#000"}}>Jobs</NavLink>
                    <NavLink to={'aboutUs'} style={({isActive}) => isActive ? {color: "#07914C", textDecoration: 'underline', textUnderlineOffset: '5px'} : {color: "#000"}}>About Us</NavLink>
                </div>
                <motion.button whileTap={{opacity: 0}} className="applicantExit" onClick={() => navigate('/')}>Org Login</motion.button>
            </div>
            <Outlet />
        </div>
    )
}

export { ApplicantDashboard }