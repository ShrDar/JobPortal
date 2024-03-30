import React, { useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import jobImg from '../public/job.png'
import rocketImg from '../public/rocket.png'
import passEyeImg from '../public/eyes.png'
import marsImg from '../public/mars.png'
import { Link, 
    useNavigate, 
    Form, 
    redirect, 
    useActionData,
    useNavigation } from "react-router-dom";
import { db } from "../config/firebase";
import { getInfo } from "../fetchCred";

export async function action({ request }) {
    const loginData = await request.formData();
    const email = loginData.get("email");
    const password = loginData.get("password");
    try {

        const logStatus = await getInfo(email, password);
        // console.log(logStatus);
        return redirect('/orgDashboard');

    }catch(err) {
        return err.message;
    }

}

function OrgLogin() {
    

    const errorMessage = useActionData();
    const navigation = useNavigation();
    const navigate = useNavigate();

    const [checkPass, setCheckPass] = useState(false);

    return (
        <div className="loginContainer">
            <div className="loginContainer1">
                <div className="login">
                    <div className="loginHeading">
                        <h2 style={{fontWeight: "bold", fontSize: "24px"}}>Welcome Back Org</h2>
                        {errorMessage && <h3 style={{fontSize: '14px', paddingTop: '8px', color: '#fc5f5f', fontWeight: '500'}}>{errorMessage}</h3>}
                    </div>
                    <Form className="loginForm" method="post">
                        <div className="login-EP">
                            <label>Email address</label>
                            <input autoComplete='off' name="email" className="loginInput" type="email" />
                        </div>
                        <div className="login-EP">
                            <label>Password</label>
                            <div className="login-EP-password">
                                <input style={{width: '100%'}} name="password" className="loginInput" type={checkPass ? "text" : "password"} autoComplete="hidden" />
                                <img style={{filter: checkPass ? 'grayscale(0) contrast(1.3)' : 'grayscale(1)'}} src={passEyeImg} alt="" className="showPass" onClick={() => setCheckPass(prevCheck => !prevCheck)} />
                            </div>
                        </div>
                        <button 
                            disabled={navigation.state === "submitting"} 
                            className="signIn" >
                                {navigation.state === "submitting"? "Signing In": "Sign In"}
                        </button>
                    </Form>
                    <p style={{margin: '10px', fontSize: '14px'}}>Don't have an account? <Link style={{color: "#FCB44D", fontWeight: '500'}} to={'registration'} className="login-createOne">Create one</Link></p>
                    
                </div>
                <div className="login1">
                    <h2 style={{fontSize: '25px', fontWeight: '500', width: '200px'}}>What our Jobseekers Said.</h2>
                    <p style={{fontSize: '20px', fontWeight: '500'}}>"<span style={{width: '300px', fontSize: "13px", fontWeight: "300"}}>Searching and finding your dream job is now easier than ever. Just browse a job in Stealth and apply to see the magic. "</span></p>
                    <div className="login1-rocket" style={{display: 'flex', justifyContent: 'space-around', alignItems: 'center', width: '100%'}}>   
                        <p style={{fontSize: '18px', fontWeight: '500'}}>Anonymous<span style={{fontSize: '13px', fontWeight: '200'}}><br/>Works in Mars</span></p>
                        <div className="rocketImg">
                            <img style={{width: '90px', marginRight: '0px', transition: '0.2s'}} src={rocketImg} alt="" />
                        </div>
                    </div>
                    <div className="login1-getJob cursor-pointer" onClick={() => navigate('/applicantDashboard')} >
                        <div className="getJob0">
                            <p className="getJob1">Get the right job for you and apply ASAP!</p>
                            <p className="getJob2">Be among the top 80 million people who can conquer the AI World</p>
                        </div>
                        <img src={jobImg} alt="" className="getJobImg" />
                    </div>
                </div>
            </div>
        </div>
    )
}

export { OrgLogin }