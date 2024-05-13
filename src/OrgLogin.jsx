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

    useEffect(() => {
        const fromApplicant = localStorage.getItem('fromApplicant')
        console.log(fromApplicant)
        if(fromApplicant === "false") {
            navigate('/applicantDashboard/applicantJobs')
        }
    }, [])

    return (
        <div className="loginContainer">
            <AnimatePresence> 
                {/* AnimatePresence allows components to animate out when they're removed from the React tree. */}
                {/* motion is a feature provided by the framer motion library which helps us in adding animations to our website */}
                <motion.div className="loginContainer1" initial={{opacity: 0, x: -1000}} animate={{opacity: 1, x: 0}}>
                    <motion.div className="login" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                        <div className="loginHeading">
                            <h2 style={{fontWeight: "bold", fontSize: "24px"}}>Welcome Back Org</h2>
                            {errorMessage && <h3 style={{fontSize: '14px', paddingTop: '8px', color: '#fc5f5f', fontWeight: '500'}}>{errorMessage}</h3>}
                        </div>
                        {/* Form is a component which is a wrapper around HTML form tag which is used for client side routing and data mutations */}
                        <Form className="loginForm" method="post">
                            <div className="login-EP">
                                <label>Email address</label>
                                <input autoComplete='off' name="email" className="loginInput" type="email" />
                            </div>
                            <div className="login-EP">
                                <label>Password</label>
                                <div className="login-EP-password">
                                    <input style={{width: '100%'}} name="password" className="loginInput" type={checkPass ? "text" : "password"} autoComplete="hidden" />
                                    <img style={{filter: checkPass ? 'grayscale(0) contrast(1.3) brightness(1.1)' : 'grayscale(1)'}} src={passEyeImg} alt="" className="showPass" onClick={() => setCheckPass(prevCheck => !prevCheck)} />
                                </div>
                            </div>
                            <button 
                                disabled={navigation.state === "submitting"} 
                                className="signIn" >
                                    {navigation.state === "submitting"? "Signing In": "Sign In"}
                            </button>
                        </Form>
                        <motion.p whileTap={{scale: 1.1}} style={{margin: '10px', fontSize: '14px'}}>Don't have an account? <Link style={{color: "#FCB44D", fontWeight: '500'}} to={'registration'} className="login-createOne">Create one</Link></motion.p>
                        
                    </motion.div>
                    <div className="login1">
                        <h2 style={{fontSize: '25px', fontWeight: '500', width: '200px'}}>What our Jobseekers Said.</h2>
                        <p style={{fontSize: '20px', fontWeight: '500'}}>"<span style={{width: '300px', fontSize: "13px", fontWeight: "300"}}>Searching and finding your dream job is now easier than ever. Just browse a job in Stealth and apply to see the magic. "</span></p>
                        <div className="login1-rocket" style={{display: 'flex', justifyContent: 'space-around', alignItems: 'center', width: '100%'}}>   
                            <p style={{fontSize: '18px', fontWeight: '500'}}>Anonymous<span style={{fontSize: '13px', fontWeight: '200'}}><br/>Works in Mars</span></p>
                            <div className="rocketImg">
                                <motion.img style={{width: '90px', marginRight: '0px', transition: '0.2s'}} src={rocketImg} alt="" initial={{y: 1000, scale: 2}} animate={{y: 0, scale: 1}} transition={{duration: 2, ease: 'backInOut'}} />
                            </div>
                        </div>
                        <motion.div className="login1-getJob cursor-pointer" onClick={() => navigate('/applicantDashboard/applicantJobs')} whileTap={{scale: 0.8}} >
                            <div className="getJob0">
                                <p>Click Here To Find the Best Jobs</p>
                            </div>
                            <img src={jobImg} alt="" className="getJobImg" />
                        </motion.div>
                    </div>
                </motion.div>
            </AnimatePresence>
        </div>
    )
}

export { OrgLogin }