import React, { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import jobImg from '/job.png'
import rocketImg from '/rocket.png'
import passEyeImg from '/eyes.png'
import marsImg from '/mars.png'
import { motion, transform } from 'framer-motion'
import { AnimatePresence } from 'framer-motion'
import { Link, 
    useNavigate, 
    Form, 
    redirect, 
    useActionData,
    useNavigation } from "react-router-dom";
import { db } from "../config/firebase";
import { getInfo } from "../fetchCred.jsx";

export async function action({ request }) {
    //action function is an inbuilt react-router function which gets initiated immediately after a form is submitted

    const loginData = await request.formData(); //loginData variable is storing the formData
    const email = loginData.get("email"); //email variable storing the value of the email input field
    const password = loginData.get("password"); //password variable storing the value of the password input field
    try {
        const logStatus = await getInfo(email, password);  //using getInfo function from another js file to check if any matching user/organization is found in the database
        return redirect(`/orgDashboard/${logStatus.id}/orgJobListings`); //routing the user to another url using the id of the organization

    }catch(err) { //if there are no matching organizations found error is catched
        return err.message; 
    }

}

function OrgLogin() {

    const errorMessage = useActionData(); //errorMessage variable stores the data returned from the action function
    const navigation = useNavigation(); //navigation variable is used for gaining formData and other information but in our app it is not currently used
    const navigate = useNavigate(); //navigate variable is used for utilizing the useNavigate() function which is used to route users to another route

    const [checkPass, setCheckPass] = useState(false); // useState hook is used to change the password field to text field if the user hits the eye icon

    // useEffect(() => {
    //     const fromApplicant = localStorage.getItem('fromApplicant')
    //     if(fromApplicant === "false") {
    //         navigate('/applicantDashboard/applicantJobs')
    //     }
    // }, [])

    return (
        <div className="flex min-h-screen items-center justify-center overflow-hidden bg-[#285956] bg-[url('/loginBg.png')] bg-cover bg-center px-4 text-white">
            <AnimatePresence>
                <motion.div className="flex justify-center items-center w-[70%] lg:w-full max-w-4xl flex-col gap-8 rounded-2xl bg-black/60 p-6 backdrop-blur-sm lg:flex-row lg:items-center lg:gap-16 lg:p-16" initial={{opacity: 0, x: -100}} animate={{opacity: 1, x: 0}}>
                    <motion.div className="flex w-full max-w-md flex-col gap-6 text-center lg:text-left" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                        <div className="space-y-2 px-1">
                            <h2 className="text-2xl font-bold">Welcome Back Org</h2>
                            {errorMessage && <h3 className="pt-2 text-sm font-medium text-[#fc5f5f]">{errorMessage}</h3>}
                        </div>
                        <Form className="flex w-full flex-col gap-8" method="post">
                            <div className="flex flex-col gap-2 text-left text-sm">
                                <label>Email address</label>
                                <input autoComplete='off' name="email" type="email" className="h-10 rounded-md bg-white px-3 text-black shadow-[0_0_8px_#2c7251] transition hover:shadow-[0_0_12px_#43B27F] focus:outline-none focus:ring-2 focus:ring-[#43B27F]" />
                            </div>
                            <div className="flex flex-col gap-2 text-left text-sm">
                                <label>Password</label>
                                <div className="flex items-center gap-3">
                                    <input name="password" type={checkPass ? "text" : "password"} autoComplete="hidden" className="h-10 w-full rounded-md bg-white px-3 text-black shadow-[0_0_8px_#2c7251] transition hover:shadow-[0_0_12px_#43B27F] focus:outline-none focus:ring-2 focus:ring-[#43B27F]" />
                                    <img src={passEyeImg} alt="Toggle password visibility" className="w-6 cursor-pointer transition hover:scale-110" style={{filter: checkPass ? 'grayscale(0) contrast(1.3) brightness(1.1)' : 'grayscale(1)'}} onClick={() => setCheckPass(prevCheck => !prevCheck)} />
                                </div>
                            </div>
                            <button disabled={navigation.state === "submitting"} className="w-full rounded-md bg-[#43B27F] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#285956] disabled:cursor-not-allowed disabled:opacity-70">
                                {navigation.state === "submitting" ? "Signing In" : "Sign In"}
                            </button>
                        </Form>
                        <motion.p whileTap={{scale: 1.1}} className="m-2 text-sm">Don't have an account? <Link to={'registration'} className="font-medium text-[#FCB44D] transition hover:text-[#e2cdad]">Create one</Link></motion.p>
                    </motion.div>
                    <div className="hidden lg:flex w-full max-w-md flex-col gap-8 rounded-[10px_60px_10px_10px] border border-[#43B27F] bg-[#43B27F] p-6 text-left">
                        <h2 className="w-[200px] text-[25px] font-medium">What our Jobseekers Said.</h2>
                        <p className="text-xl font-medium">"<span className="text-[13px] font-light">Searching and finding your dream job is now easier than ever. Just browse a job in Stealth and apply to see the magic. "</span></p>
                        <div className="flex w-full items-center justify-around">
                            <p className="text-lg font-medium">Anonymous<span className="block text-[13px] font-extralight">Works in Mars</span></p>
                            <div className="relative rounded-full bg-[#0F2221]">
                                <motion.img src={rocketImg} alt="Rocket" className="w-[90px] transition hover:scale-110" />
                            </div>
                        </div>
                        <motion.div className="flex cursor-pointer items-center justify-around gap-3 rounded-[10px_60px_10px_10px] border-[3px] border-[#056337] bg-white p-3 text-black transition hover:scale-95" onClick={() => navigate('/applicantDashboard/applicantJobs')} whileTap={{scale: 0.8}}>
                            <div className="flex h-[90px] w-[60%] items-center justify-center text-center text-[17px] font-black tracking-wide drop-shadow-[1px_10px_4px_#5c5c5c]">
                                <p>Click Here To Find the Best Jobs</p>
                            </div>
                            <img src={jobImg} alt="Job" className="h-10" />
                        </motion.div>
                    </div>
                </motion.div>
            </AnimatePresence>
        </div>
    )
}

export { OrgLogin }