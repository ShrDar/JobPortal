import { collection, doc, onSnapshot, updateDoc } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { db } from "../../config/firebase";
import changeBtn from '/change.png'
import { motion } from "framer-motion";

function OrgProfile() {
    const orgId = useParams('orgId').orgId;

    const [orgs, setOrgs] = useState();
    const [orgInfo, setOrgInfo] = useState();

    useEffect(() => {
        try {
            const orgRef = doc(db, "organizationPrivate", orgId);
            const unsub = onSnapshot(orgRef, (doc) => {
                setOrgInfo(doc.data())
                setOrgName(doc.data().name)
                setOrgEmail(doc.data().email)
                setOrgAddress(doc.data().address)
                setOrgPassword(doc.data().pass);
            })
            return unsub;
        } catch(err) {
            console.error(err);
        }
    }, [])
    useEffect(() => {
        try {
            const orgCollectionRef = collection(db, 'organization');
            onSnapshot(orgCollectionRef, (data) => {
                setOrgs(data.docs.map((doc) => ({
                    ...doc.data(),
                    id: doc.id
                })))
            })
        } catch ( err ) {
            console.error(err);
        }
    }, [])

    const [orgName, setOrgName] = useState('');
    const [orgAddress, setOrgAddress] = useState('');
    const [orgEmail, setOrgEmail] = useState('');
    const [orgPassword, setOrgPassword] = useState('');
    const [isPassVisible, setIsPassVisible] = useState(false);

    const letters = /[a-zA-Z]/g;
    const handleNameChange = async () => {
        if(orgInfo.name === orgName) {
            alert("Name not Changed (Old name given)")
            return;
        }
        if(orgName === "") {
            alert('Empty Field');
            return;
        }
        if(orgName.match(letters)) {
            
        } else {
            alert('Name should contain letters (Dont try to break my sh*t)')
            return;
        }
        try {
            const nameRef = doc(db, 'organization', orgId);
            await updateDoc(nameRef, {name: orgName})
        } catch (err) {
            console.error(err);
        }
    }
    
    const handleEmailChange = async() => {
        if(orgEmail === orgInfo.email) {
            alert("Email not changed (Old Email Given)");
            return;
        }
        if(orgEmail === "") {
            alert("Empty Field");
            return;
        }
        if(orgEmail.match(letters)) {}
        else {
            alert('Email should contain letters');
            return;
        }
        const regex = /^([a-z]||[A-Z]||[0-9])+[@]([a-z]||[A-Z])+[.]([a-z]||[A-Z]||[0-9])+[.]*([a-z]||[A-Z]||[0-9])*$/gm; //regex pattern for email validation
        if(!regex.test(orgEmail)) { //checking if the entered email matches the given regex pattern
            alert("Invalid Email");
            return;
        }

        try {
            const emailRef = doc(db, 'organization', orgId);
            await updateDoc(emailRef, {email: orgEmail})
        } catch (err) {
            console.error(err);
        }
    }

    const handlePasswordChange = () => {
        if(orgPassword === orgInfo.pass) {
            alert("Password not changed (Old password given)");
            return;
        }
        if(orgPassword === "") {
            alert("Empty Field");
            return;
        }
        if(orgPassword.length <= 6) {
            alert("Password Length should be greater than 6");
        }
        if(orgPassword.match(letters)) {}
        else {
            alert('Password should contain letters');
            return;
        }

        try {
            const passRef = doc(db, 'organization', orgId);
            updateDoc(passRef, {pass: orgPassword})
        } catch( err ) {
            console.error(err);
        }
    }

    const handleAddressChange = async () => {
        if(orgAddress === orgInfo.address) {
            alert("Address not Changed (Old Address Given)");
            return;
        }
        if(orgAddress === "") {
            alert('Empty Field');
            return;
        }
        if(orgAddress.match(letters)) {}
        else {
            alert('Address should contain letters');
            return;
        }
        try {
            const addressRef = doc(db, 'organization', orgId);
            await updateDoc(addressRef, {address: orgAddress})
        } catch(err) {
            console.error(err)
        }
    }

    const handleChangeAll = async () => {
        if((orgInfo.name === orgName || orgInfo.email === orgEmail || orgAddress === orgInfo.address)) {
            alert('Same Name or Email or Address Given (Make Changes in All Fields before clicking Save)');
        } else {
            handleNameChange();
            handleEmailChange();
            handleAddressChange();
        }
    }

    return (
        <>
        {orgInfo ? (
            <motion.div className="flex flex-col items-center justify-center my-5 w-full" initial={{x: 500}} animate={{x: 0}}>
                <div className="flex w-[80%] lg:w-[45%] flex-col items-center justify-start gap-[30px] bg-white rounded-[20px] py-[20px] pb-[50px] drop-shadow-[1px_1px_1px_#b6b6b6]">
                    <h1 style={{fontSize: '20px', fontWeight: '800', letterSpacing: '2px'}}>{orgInfo.name}</h1>
                    <div className="bg-[#d3d3d3] rounded-[20px] overflow-hidden p-2 w-[20%]">
                        <img className="rounded-[10px] aspect-square object-cover drop-shadow-[1px_1px_1px_#848484]" src={orgInfo.imgUrl} alt="" />
                    </div>
                    <div className="organizationInfo">
                        <p className="" style={{justifySelf: 'center', alignSelf: 'center'}}>Member Since - <span className="font-extrabold">{orgInfo.createdDate}</span></p>
                    </div>
                    <div className="organizationInfo">
                        <p>Name - {orgInfo.name}</p>
                        <div className="organizationInfoInputChange">
                            <input maxLength={25} type="text" onChange={(e) => setOrgName(e.target.value)} value={orgName} />
                            <div className="changeContainer">
                                <img src={changeBtn} onClick={() => handleNameChange()} alt="" />
                                <p>Change Name</p>
                            </div>
                        </div>
                    </div>
                    <div className="organizationInfo">
                        <p>Email - {orgInfo.email}</p>
                        <div className="organizationInfoInputChange">    
                            <input type="text" onChange={(e) => setOrgEmail(e.target.value)} value={orgEmail} />
                            <div className="changeContainer">
                                <img src={changeBtn} onClick={() => handleEmailChange()} alt="" />
                                <p>Change Email</p>
                            </div>
                        </div>
                    </div>
                    <div className="organizationInfo">
                        <p>Password -{'>'} {isPassVisible ? orgInfo.pass: '•••••••'}</p>
                        <div className="organizationInfoInputChange">    
                            <input type={isPassVisible ? 'text' : 'password'} onChange={(e) => setOrgPassword(e.target.value)} value={orgPassword} onMouseEnter={() => setIsPassVisible(true)} onMouseLeave={() => setIsPassVisible(false)} />
                            <div className="changeContainer">
                                <img src={changeBtn} onClick={() => handlePasswordChange()} alt="" onMouseEnter={() => setIsPassVisible(true)} onMouseLeave={() => setIsPassVisible(false)} />
                                <p>Change Password</p>
                            </div>
                        </div>
                    </div>
                    <div className="organizationInfo">
                        <p>Address - {orgInfo.address}</p>
                        <div className="organizationInfoInputChange">    
                            <input maxLength={30} type="text" onChange={(e) => setOrgAddress(e.target.value)} value={orgAddress} />
                            <div className="changeContainer">
                                <img src={changeBtn} onClick={() => handleAddressChange()} alt="" />
                                <p>Change Address</p>
                            </div>
                        </div>
                    </div>
                    <button className="changeAllBtn" onClick={() => handleChangeAll()}>Save All</button>
                    
                </div>
            </motion.div>
        ):'Loading...'}
            
        </>
    )
}

export { OrgProfile }