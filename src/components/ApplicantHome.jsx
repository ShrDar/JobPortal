import React from "react";
import applicantHomeManImg from '/applicantHomeMan.gif'
import { useNavigate } from "react-router-dom";

function ApplicantHome() {

    const navigate = useNavigate();

    return (
        <div className="relative flex h-[85%] w-full flex-col items-center justify-center">
            <div className="relative flex items-center justify-center w-[90%] md:w-[70%] h-full gap-[10%] bg-[#fdfdfd] text-black drop-shadow-[1px_1px_2px_#a9a9a9] m-[30px] py-[90px] rounded-[40px] overflow-hidden">
                <div className="absolute -top-[30px] -left-[100px] h-[110%] w-[60%] md:w-[35%] rounded-full bg-[#22a9685f]"></div> 
                <div className="absolute -bottom-[80px] -right-[80px] h-[30%] md:h-[55%] w-[60%] md:w-[30%] rounded-full bg-[#9edbffad]"></div> 
                <div className="mt-[70px] flex w-[40%] flex-col items-center gap-[30px] text-center font-['Karla',sans-serif]">
                    <h1 className="text-xl md:text-3xl tracking-[4px] font-bold">You'll get the right JOB Mate!</h1>
                    <div className="flex xl:hidden justify-center items-center w-full bg-white rounded-[65%_35%_53%_45%_/_51%_50%_50%_49%] overflow-hidden drop-shadow-[1px_1px_5px_#a9a9a9]">
                        <img className="" src={applicantHomeManImg} alt="" />    
                    </div>
                    <p className="text-xs tracking-[2px]">Don't Stress pfft...</p>
                    <button className="bg-[#17b96b] text-white p-5 rounded-[20px] transition-all duration-200 translate-y-5 hover:drop-shadow-[1px_1px_5px_#26A365] hover:tracking-[5px]" onClick={() => navigate('applicantJobs')}>Find Your Job</button>
                </div>
                <div className="hidden xl:flex justify-center items-center w-[35%] xl:h-full bg-white rounded-[65%_35%_53%_45%_/_51%_50%_50%_49%] overflow-hidden drop-shadow-[1px_1px_5px_#a9a9a9]">
                    <img className="" src={applicantHomeManImg} alt="" />    
                </div>
            </div>
        </div>
    )
}

export { ApplicantHome }