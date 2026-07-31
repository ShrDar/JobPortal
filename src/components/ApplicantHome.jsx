import React from "react";
import applicantHomeManImg from '/applicantHomeMan.gif'
import { useNavigate } from "react-router-dom";

function ApplicantHome() {

    const navigate = useNavigate();

    return (
        <div className="relative flex h-[85%] w-full flex-col items-center justify-center">
            <div className="relative flex items-center justify-center w-[70%] h-full gap-[10%] bg-[#fdfdfd] text-black drop-shadow-[1px_1px_2px_#a9a9a9] m-[30px] py-[90px] rounded-[40px] overflow-hidden">
                <div className="absolute -top-[30px] -left-[100px] h-[110%] w-[35%] rounded-full bg-[#22a9685f]"></div> 
                <div className="absolute -bottom-[80px] -right-[80px] h-[55%] w-[30%] rounded-full bg-[#9edbffad]"></div> 
                <div className="mt-[70px] flex w-[450px] flex-col items-center gap-[30px] text-center font-['Karla',sans-serif]">
                    <h1 className="text-[30px] tracking-[4px] font-bold">You'll get the right JOB Mate!</h1>
                    <p className="tracking-[2px]">Don't Stress pfft...</p>
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