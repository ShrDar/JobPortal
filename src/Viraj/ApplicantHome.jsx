import React from "react";
import applicantHomeManImg from '/applicantHomeMan.gif'
import { useNavigate } from "react-router-dom";

function ApplicantHome() {

    const navigate = useNavigate();

    return (
        <div className="applicantHome">
            <div className="applicantHome1">
                <div className="applicantHomeDesign1"></div> 
                <div className="applicantHomeDesign2"></div> 
                <div className="applicantHomeMainText">
                    <h1>You'll get the right JOB Broski!</h1>
                    <p>Don't Stress pfft...</p>
                    <button className="findYourJobBtn" onClick={() => navigate('applicantJobs')}>Find Your Job</button>
                </div>
                <div className="applicantHomeManImg">
                    <img src={applicantHomeManImg} alt="" />    
                </div>
            </div>
        </div>
    )
}

export { ApplicantHome }