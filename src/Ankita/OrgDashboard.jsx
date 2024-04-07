import React from "react";
import { db } from "../../config/firebase";
import { doc, getDoc } from "firebase/firestore";
import { NavLink, useLoaderData } from 'react-router-dom'
import stealthLogo from '/stealthLogo.svg'
import { Link, Outlet } from "react-router-dom";
import './org.css'

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
                    <NavLink to={'orgJobListings'} style={({isActive}) => isActive ? {color: "#07914C", textDecoration: 'underline', textUnderlineOffset: '5px'} : {color: "#000"}}>Job-Listings</NavLink>
                </div>
                <div className="orgProfile">
                    <img src={org.imgUrl} alt="" />
                </div>
            </div>
            <Outlet />
        </div>
    )
}

export { OrgDashboard }