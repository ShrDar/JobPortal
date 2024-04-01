import React from "react";
import { useLoaderData, defer, Outlet, NavLink, Link } from "react-router-dom";
import stealthLogo from "../../public/stealthLogo.svg"
import "./applicant.css"

export async function loader() { //name of loader function doesn't matter

    return "The data is here";
}

function ApplicantDashboard() {
    const data = useLoaderData();
    console.log(data);
    return (
        <div className="applicantDashboard">
            <div className="applicant-navBar">
                <Link to={''}>
                    <div className="applicantNavLogo">
                        <img className="stealthLogo" src={stealthLogo} />
                        <h3>Talent Link</h3>
                    </div>
                </Link>
                <div className="applicantLinks">
                    
                    <NavLink to={'applicantJobs'} style={({isActive}) => isActive ? {color: "#07914C", textDecoration: 'underline', textUnderlineOffset: '5px'} : {color: "#000"}}>Jobs</NavLink>
                    <NavLink to={'aboutUs'} style={({isActive}) => isActive ? {color: "#07914C", textDecoration: 'underline', textUnderlineOffset: '5px'} : {color: "#000"}}>About Us</NavLink>
                </div>
            </div>
            <Outlet />
        </div>
    )
}

export { ApplicantDashboard }