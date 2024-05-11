import React, { useState } from "react";
import { db } from "../../config/firebase";
import { doc, getDoc } from "firebase/firestore";
import { NavLink, useLoaderData, useNavigate } from 'react-router-dom'
import stealthLogo from '/stealthLogo.svg'
import { Link, Outlet } from "react-router-dom";
import logOutBtn from '/logout.png'
import './org.css'
import { useScroll } from "framer-motion";

export async function loader( {params} ) {
    const orgId = params.orgId;
    const orgRef = doc(db, "organization", orgId);
    try {
        const data = await getDoc(orgRef);
        const org = data.data();
        return org;
    } catch(err) {
        console.error(err);
    }
    return 'OrgDash loader';
}

function OrgDashboard() {
    const org = useLoaderData();
    const navigate = useNavigate();
    const [isDropDownOpen, setIsDropDownOpened] = useState(false);
    console.log(isDropDownOpen)
    return (
        <div className="orgDashboard">
            <div className="org-navBar">
                <Link to={""}>
                    <div className="orgNavLogo">
                        <img className="stealthLogo" src={stealthLogo} alt="" />
                        <h2>Talent Link</h2>
                    </div>
                </Link>
                <div className="orgLinks">
                    <NavLink to={'orgJobListings'} replace={true} style={({isActive}) => isActive ? {color: "#07914C", textDecoration: 'underline', textUnderlineOffset: '5px'} : {color: "#000"}}>Job-Listings</NavLink>
                    <NavLink to={'orgApplicants'} replace={true} style={({isActive}) => isActive ? {color: "#07914C", textDecoration: 'underline', textUnderlineOffset: '5px'} : {color: "#000"}}>Applicants</NavLink>
                </div>
                <div className="orgProfile" onMouseEnter={() => setIsDropDownOpened(true)} onClick={() => setIsDropDownOpened(prevState => !prevState)}  >
                    <img src={org.imgUrl} alt="" />
                    <div className="dropDown" style={isDropDownOpen ? {opacity: 1} : {opacity: 0, transform:'translateX(500px)'}} onMouseLeave={() => setIsDropDownOpened(false)}>
                        <div className="dropDownItem" onClick={() => {
                                navigate('orgProfile', {replace: true});
                                setIsDropDownOpened(false)
                        }}>
                            <img style={{filter: 'brightness(10)'}} src={org.imgUrl} alt="" />
                            <p>My Profile</p>
                        </div>
                        <div className="dropDownItem" onClick={() => navigate('/', {replace: true})}>
                            <img src={logOutBtn} alt="" />
                            <p>Log-Out</p>
                        </div>
                    </div>
                </div>
            </div>
            <Outlet />
        </div>
    )
}

export { OrgDashboard }