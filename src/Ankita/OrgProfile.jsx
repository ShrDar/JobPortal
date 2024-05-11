import { doc, onSnapshot, updateDoc } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { db } from "../../config/firebase";
import changeBtn from '/change.png'

function OrgProfile() {
    const orgId = useParams('orgId').orgId;
    const [orgInfo, setOrgInfo] = useState();
    useEffect(() => {
        try {
            const orgRef = doc(db, "organization", orgId);
            const unsub = onSnapshot(orgRef, (doc) => {
                setOrgInfo(doc.data())
                setOrgName(doc.data().name)
                setOrgEmail(doc.data().email)
                setOrgAddress(doc.data().address)
            })
            return unsub;
        } catch(err) {
            console.error(err);
        }
    }, [])

    const [orgName, setOrgName] = useState('');
    const [orgAddress, setOrgAddress] = useState('');
    const [orgEmail, setOrgEmail] = useState('');

    const letters = /[a-zA-Z]/g;
    const handleNameChange = async () => {
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
            console.log(orgName)
            await updateDoc(nameRef, {name: orgName})
        } catch (err) {
            console.error(err);
        }
    }
    
    const handleEmailChange = async() => {
        if(orgEmail === "") {
            alert("Empty Field");
            return;
        }
        if(orgEmail.match(letters)) {}
        else {
            alert('Email should contain letters');
            return;
        }
        try {
            const emailRef = doc(db, 'organization', orgId);
            await updateDoc(emailRef, {email: orgEmail})
        } catch (err) {
            console.error(err);
        }
    }

    const handleAddressChange = async () => {
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

    return (
        <>
        {orgInfo ? (
            <div className="organizationProfile">
                <div className="organizationDetailsContainer">
                    <h1 style={{fontSize: '20px', fontWeight: '800', letterSpacing: '2px'}}>{orgInfo.name}</h1>
                    <div className="organizationLogoContainer">
                        <img src={orgInfo.imgUrl} alt="" />
                    </div>
                    <div className="organizationInfo">
                        <p className="" style={{justifySelf: 'center', alignSelf: 'center'}}>Member Since {orgInfo.createdDate}</p>
                    </div>
                    <div className="organizationInfo">
                        <p>Name - {orgInfo.name}</p>
                        <div className="organizationInfoInputChange">
                            <input type="text" onChange={(e) => setOrgName(e.target.value)} value={orgName} />
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
                        <p>Address - {orgInfo.address}</p>
                        <div className="organizationInfoInputChange">    
                            <input type="text" onChange={(e) => setOrgAddress(e.target.value)} value={orgAddress} />
                            <div className="changeContainer">
                                <img src={changeBtn} onClick={() => handleAddressChange()} alt="" />
                                <p>Change Address</p>
                            </div>
                        </div>
                    </div>
                    <button className="changeAllBtn">Change All</button>
                    
                </div>
            </div>
        ):''}
            
        </>
    )
}

export { OrgProfile }