import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import crossImg from '../../public/cross.png'
import { useNavigate } from "react-router-dom";
import { addDoc, collection, getDocs } from "firebase/firestore";
import { db, storage } from "../../config/firebase";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import checkImg from "/check.png"
import { motion } from "framer-motion";

function ApplyJobModal({ isOpened, setIsOpened, job }) {
    if(!isOpened) {
        return null;
    }
    const navigate = useNavigate();
    const [applyStatus, setApplyStatus] = useState("idle");
    const [applyCompleteStatus, setApplyCompleteStatus] = useState(false);

    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [address, setAddress] = useState('');
    const [email, setEmail] = useState('');
    const [cvRef, setCvRef] = useState('');

    const dropIn = {
        hidden: {
            opacity: 0,
            y: '100%',
            x: '-50%'
        }, visible: {
            y: '-50%',
            x: '-50%',
            opacity: 1,
            transition: { duration: 0.1, type: 'spring', damping: 25, stiffness: 500}
        }, exit: {
            opacity: 0
        }
    }
    
    const handleApply = async() => {
        setApplyStatus("submitting");
        if(name == "" || phone == "" || address == "" || email == "" || cvRef == '') {
            alert("Empty fields");
            setApplyStatus("idle");
            return;
        }
        const letters = /[a-zA-Z]/g;
        if(name.match(letters) && address.match(letters)) {
            // console.log('contains')
        } else { //name contains characters other than the alphabets
            alert('Name and Address need to contain letters (Dont try to break my thing))') //alert messages displayed
            setApplyStatus('idle')
            return;
        }
        if(phone.length !== 10) { //if the phone number length is not equal to 10 
            alert("Phone Number Length -> 10"); //alert message displayed
            setApplyStatus("idle");
            return;
        }
        if(email.includes(" ")) { //if email contains any whitespace
            alert('Email do not contain spaces'); //alert message is shown to the user
            setApplyStatus('idle');
            return;
        }
        const regex = /^([a-z]||[A-Z]||[0-9])+[@]([a-z]||[A-Z])+[.]([a-z]||[A-Z]||[0-9])+[.]*([a-z]||[A-Z]||[0-9])*$/gm; //regex pattern for email validation
        if(!regex.test(email)) { //if the validation fails
            alert("Invalid Email"); //shows alert message
            setApplyStatus('idle'); //sets the state of the Send button to idle 
            return; //termination of the function
        }
        const applicants = await findApplicants();
        
        const isApp = applicants.find((applicant) => applicant.email === email || applicant.phone === phone) //checking if the email or phone number is already used in the database
        if(isApp) { //if it is taken the function gets terminated
            alert('Email or Phone no already taken')
                setApplyStatus("idle")
                return;
        }

        // applicants.forEach((applicant) => {
        //     if(applicant.email === email || applicant.phone === phone) {
        //         alert('Email or Phone no already taken')
        //         setApplyStatus("idle")
        //         return;
        //     }
        // })

        let currentDate = new Date().toJSON().slice(0, 10);
        
        let formData = {name, email, address, phone, appliedDate: currentDate, jobListingId: job.id, applicantState: 'Pending'}
        let cv_ref = await handleCvUpload();
        formData = {...formData, cv_ref}

        try {
            const applicantRef = collection(db, 'applicant');
            await addDoc(applicantRef, formData);
            setApplyCompleteStatus(true);
            setApplyStatus("idle");
            setName('')
            setEmail('')
            setAddress('')
            setPhone('')
            setCvRef(null)
        } catch( err ) {
            console.error(err);
        }
    }

    const handleCvUpload = async() => {
        if(!cvRef) return;
        const filesFolderRef = ref(storage, `applicantCv/${cvRef.name}`);

        try {
            let file = await uploadBytes(filesFolderRef, cvRef)
            let url = await getDownloadURL(file.ref);
            return url;
        } catch(err) {
            console.error(err);
            alert("Failed to Send Data")
        }
    }

    const findApplicants = async() => {
        try {
            const applicantRef = collection(db, "applicant");
            const data = await getDocs(applicantRef);
            const filteredData = data.docs.map(applicant => ({
                ...applicant.data(),
                id: applicant.id
            }))
            return filteredData;
        } catch( err ) {
            console.error(err);
        }
    }

    const checkFileType = (e) => {
        if(e.target.value.includes('.pdf')) {
        } else {
            e.target.value = '';
            alert("Only .pdf format allowed");
        }
    }
    
    return createPortal(
        <>
        <div className="applyJobModalContainer" onClick={() => setIsOpened(false)}>
        </div>
        {applyCompleteStatus && (
            <div className="applySuccess">
                <div className="applyTopDesign">
                    <img src={checkImg} alt=""  />
                </div>
                <h2>Application Sent</h2>
                <p>Your Details Have been successfully delivered to the hiring organization</p>
                <button className="applyOkayBtn" onClick={() => {
                    setApplyCompleteStatus(false)
                    setIsOpened(false)
                    }}>Okay</button>
            </div>
        )}
        
        <motion.div initial='hidden' animate='visible' exit='exit' variants={dropIn} className="applyJob">
            <div className="applyJob1 flex gap-3">
                <h2 style={{fontSize: '20px', width: '100%', textAlign: 'center'}}>Apply Form</h2>
            </div>
            <div className="applyForm">
                <div className="applyJob-name">
                    <label>Name</label>
                    <input type="text" onChange={(e) => setName(e.target.value)} value={name} maxLength={50}/>
                </div>
                <div className="applyJob-name">
                    <label>Phone No</label>
                    <input type="number" onChange={(e) => setPhone(e.target.value)} value={phone} />
                </div>
                <div className="applyJob-name">
                    <label>Address </label>
                    <input type="text" onChange={(e) => setAddress(e.target.value)} value={address} maxLength={50}></input>
                </div>
                <div className="applyJob-name">
                    <label>E-mail </label>
                    <input type="email" onChange={(e) => setEmail(e.target.value)} value={email} />
                </div>
                <div className="applyJob-name">
                    <label>Attach CV</label>
                    <input type="file" accept=".pdf" onChange={(e) => {
                        setCvRef(e.target.files[0]);
                        checkFileType(e);
                        }} id="cv"/>
                </div>
                <button className="applySendBtn" onClick={handleApply}>{applyStatus == "submitting" ? "Sending..." : "Send"}</button>

            </div>
        </motion.div>
        
        </>,
        document.getElementById("modal")
    )
}

export { ApplyJobModal }