import React from "react";
import happyEmployeesImg from '/happyEmployees.png'
import { useNavigate } from 'react-router-dom'

function OrgHome() {
    const navigate = useNavigate();
    return (
        <div className="orgHome">
            <div className="orgHomeWrapper">
                <div className="orgHomeDesign"></div>
                <div className="orgHomeTitle">
                    <h1>You're Making People's Lives !</h1> 
                    <button className="orgHomeBtn" onClick={() => navigate('orgJobListings')}>Jobs Listed - By You</button>
                </div>

                <div className="happyEmployeeImg">
                    <img src={happyEmployeesImg} alt="" />
                </div>
            </div>
        </div>
    )
}

export { OrgHome }