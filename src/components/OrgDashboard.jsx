import React, { useState } from "react";
import { db, auth } from "../../config/firebase";
import { doc, getDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { NavLink, useLoaderData, useNavigate, redirect, Link, Outlet } from 'react-router-dom'
import stealthLogo from '/stealthLogo.svg'
import logOutBtn from '/logout.png'
import './org.css'

const getCurrentUser = () => {
    return new Promise((resolve) => {
        const unsub = onAuthStateChanged(auth, (user) => {
            unsub();
            resolve(user);
        }, () => {
            unsub();
            resolve(null);
        });
    });
}

export async function loader( {params} ) {
    const orgId = params.orgId;

    const user = await getCurrentUser();
    if (!user || user.uid !== orgId) {
        return redirect('/');
    }

    const orgRef = doc(db, "organizationPublic", orgId);
    try {
        const data = await getDoc(orgRef);
        if (!data.exists()) {
            return redirect('/');
        }
        return data.data();
    } catch(err) {
        console.error(err);
        return redirect('/');
    }
}

function OrgDashboard() {
    const org = useLoaderData();
    const navigate = useNavigate();
    const [isDropDownOpen, setIsDropDownOpened] = useState(false);
    return (
        <div className="orgDashboard">
            <div className="org-navBar">
                <Link to={""}>
                    <div className="orgNavLogo">
                        <img className="stealthLogo" src={stealthLogo} alt="" />
                        <h2>Stealth</h2>
                    </div>
                </Link>
                <div className="orgLinks">
                    <NavLink to={'orgJobListings'} replace={true} style={({isActive}) => isActive ? {color: "#07914C", textDecoration: 'underline', textUnderlineOffset: '5px'} : {color: "#000"}}>Job-Listings</NavLink>
                    <NavLink to={'orgApplicants'} replace={true} style={({isActive}) => isActive ? {color: "#07914C", textDecoration: 'underline', textUnderlineOffset: '5px'} : {color: "#000"}}>Applicants</NavLink>
                </div>
                <div className="orgProfile" onMouseEnter={() => setIsDropDownOpened(true)} onClick={() => setIsDropDownOpened(prevState => !prevState)}  >
                    <img className="rounded-full aspect-square object-cover w-[40px]" src={org.imgUrl} alt="" />
                    <div className="dropDown" style={isDropDownOpen ? {opacity: 1} : {opacity: 0, transform:'translateX(500px)'}} onMouseLeave={() => setIsDropDownOpened(false)}>
                        <div className="flex w-full h-[70px] hover:bg-[#17ae65] items-center justify-center gap-3 p-3 cursor-default text-center transition-all duration-200 z-[100]" onClick={() => {
                                navigate('orgProfile', {replace: true});
                                setIsDropDownOpened(false)
                        }}>
                            <img className="aspect-square object-cover rounded-full w-[25%] p-1 bg-white" src={org.imgUrl} alt="" />
                            <p>Profile</p>
                        </div>
                        <div className="flex w-full h-[70px] hover:bg-[#17ae65] items-center justify-center gap-3 p-3 cursor-default text-center transition-all duration-200 z-[100]" onClick={() => navigate('/', {replace: true})}>
                            <img className="brightness-0 invert w-[15%]" src={logOutBtn} alt="" />
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