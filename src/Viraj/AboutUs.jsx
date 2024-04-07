import React from "react";
import teamImg from '/aboutUsTeam.png'
import happyImg from '/aboutUsHappy.png'
import downArrowImg from '/downArrow.png'
import connectionImg from '/connection.png'
import { useNavigate } from 'react-router-dom';

function AboutUs() {
    const navigate = useNavigate();
    return (
        <div className="aboutUs">
            <div className="aboutUs1">
                <div className="aboutUs-text">
                    <h2>Conquering the AI World,</h2>
                    <h3>Bringing the Best Together</h3>
                    <a href = "#aboutUs2"><img src={downArrowImg} alt="" /></a>
                    
                </div>
                <div className="aboutUsTeamImg">
                    <img src={teamImg} />
                </div>
            </div>
            <div className="aboutUs2" id="aboutUs2">
                <div className="happyImg">
                    <img src={happyImg} />  
                </div>
                <div className="aboutUs-text1">
                    <h3>What We Do</h3>
                    <p style={{width: '350px', textAlign: 'justify'}}>At Talent Link, we specialize in connecting top-tier talent with leading organizations across diverse industries. Through innovative recruitment strategies and personalized matchmaking, we facilitate seamless collaborations that drive mutual success. Our comprehensive services encompass talent acquisition, staffing solutions, and career development support, ensuring every partnership is built for long-term prosperity</p>
                </div>
            </div>
            <div className="aboutUs3">
                <div className="aboutUs-text2">
                    <h2>Welcome to the Family</h2>
                    <p>At Talent Link, we are continuously looking ahead, driven by our commitment to innovation and excellence. As we forge into the future, our vision is clear: to pioneer groundbreaking solutions that revolutionize the way talent is sourced, matched, and managed. We envision a world where our cutting-edge technologies and forward-thinking strategies empower individuals to unlock their full potential and organizations to achieve unparalleled success. With an unwavering dedication to staying ahead of the curve, we embrace emerging trends and technologies, anticipating the needs of tomorrow's workforce.</p>
                    <button className="getStartedBtn" onClick={() => navigate('/applicantDashboard/applicantJobs')}>Enjoy Hunting...</button>
                </div>
                <div className="connectionImg">
                    <img src={connectionImg} alt="" />
                </div>
            </div>
        </div>
    )
}
export { AboutUs }