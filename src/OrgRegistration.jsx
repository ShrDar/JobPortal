import React, { useEffect, useState } from 'react'
import { getOrgTypes, getOrgs } from '../fetchCred'
import { Form, redirect, useActionData, useLoaderData, useNavigate, useNavigation } from 'react-router-dom';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { db, storage } from '../config/firebase';
import { addDoc, collection, getDocs } from 'firebase/firestore';
import earthImg from '../public/earth.png'
import passEyeImg from '../public/eyes.png'

export async function loader() {
    const orgs = await getOrgs()
    const orgTypes = await getOrgTypes();
    return {orgs, orgTypes};
}


function OrgRegistration() {
    const {orgs, orgTypes} = useLoaderData();
    
    const navigate = useNavigate();
    const [signInStatus, setSignInStatus] = useState("idle");
    const [checkPass, setCheckPass] = useState(false);

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [pass, setPass] = useState('');
    const [phone, setPhone] = useState('');
    const [address, setAddress] = useState('');
    const [type, setType] = useState(orgTypes[0].typeId);
    const [imgUpload, setImgUpload] = useState(null);
    let formData;

    const handleSignUp = async() => {
        setSignInStatus("submitting");
        if(name === "" || email === "" || pass === "" || phone === "" || address === "" || type === ""  || imgUpload === null) {
            alert("Missing Fields");
            setSignInStatus("idle")
            return;
        } 
        if(phone.length !== 10) {
            alert("Phone Number Length -> 10");
            setSignInStatus("idle")
            return;
        }
        if(pass.length < 6) {
            alert("Password consist atleast 6 letter");
            setSignInStatus("idle");
            return;
        }
        
        const regex = /^([a-z]||[A-Z]||[0-9])+[@]([a-z]||[A-Z])+[.]([a-z]||[A-Z]||[0-9])+[.]*([a-z]||[A-Z]||[0-9])*$/gm;
        if(!regex.test(email)) {
            alert("Invalid Email");
            return;
        }

        
        orgs.forEach((org) => {
            if(org.email === email || org.phone === phone) {
                alert('Email or Phone no already taken')
                return;
            }
        })

        let currentDate = new Date().toJSON().slice(0, 10);
        console.log(currentDate);

        formData = {name, email, pass, phone, address, type, createdDate: currentDate, updatedDate: currentDate, isVisible: true};
        const url = await handleUpload();
        formData = {...formData, imgUrl: url}
        console.log(formData);

        //adding organization info in the database

        try {
            const orgCollectionRef = collection(db, "organization");
            await addDoc(orgCollectionRef, formData)
            setSignInStatus("idle");
            return navigate('/', {replace: true});
        } catch(err) {
            console.error(err);
        }

    }

    const handleUpload = async() => {
        if(!imgUpload) return;
        const filesFolderRef = ref(storage, `organizationImg/${imgUpload.name}`);
        try {
            let file = await uploadBytes(filesFolderRef, imgUpload);
            let url = await getDownloadURL(file.ref);
            return url;
        } catch(err) {
            console.error(err);
        }
    }
    

    return (
        <div className='orgRegContainer loginContainer'>
            <div className="orgReg">
                <div className="orgReg1">

                    <h2 style={{textAlign:"center", width: '100%', fontSize: "24px", fontWeight: "bold", margin: '20px 0px'}}>Register Your Organization</h2>
                        <div className="orgRegGrid">

                            <div className="reg-orgName regIn">
                                <label>Name</label>
                                <input autoComplete='hidden' type="text" name='orgName' onChange={(e) => setName(e.target.value)} value={name}/>
                            </div>
                            <div className="reg-orgEmail regIn">
                                <label>Email </label>
                                <input autoComplete='hidden' type="email" name='orgEmail' onChange={(e) => setEmail(e.target.value)} value={email}/>
                            </div>
                            <div className="reg-orgPass regIn">
                                <label>Password</label>
                                <div className="reg-password" style={{display: 'flex', alignItems: 'center', gap: "10px"}}>
                                    <input type={checkPass ? "text" : 'password'} name='orgPass' onChange={(e) => setPass(e.target.value)} value = {pass} />
                                    <img style={{filter: checkPass ? 'grayscale(0) contrast(1.3)' : 'grayscale(1)'}} src={passEyeImg} alt="" className="showPass" onClick={() => setCheckPass(prevCheck => !prevCheck)} />
                                </div>
                            </div>
                            <div className="reg-orgPhone regIn">
                                <label>Phone</label>
                                <input type='number' name='orgPhone' onChange={(e) => setPhone(e.target.value)} value={phone} />
                            </div>
                            <div className="reg-orgAddress regIn" >
                                <label>Address</label>
                                <input autoComplete='hidden' type='text' name='orgAddress' onChange={(e) => setAddress(e.target.value)} value={address} />
                            </div>
                            <div className="reg-orgType regIn">
                                <label>Type</label>
                                <select name='orgType' onChange={(e) => setType(e.target.value)} >
                                    {orgTypes.map((type) => <option key={type.typeId} value={type.typeId}>{type.type}</option>)}
                                </select>
                            </div>
                            <div className="reg-orgImg regIn">
                                <label>Logo</label>
                                <input type='file' name='orgImg' className='orgImg' id='inputFile' onChange={(e) => setImgUpload(e.target.files[0])} />
                            </div>
                        </div>

                        <button className='registerBtn' onClick={handleSignUp}>{signInStatus === "submitting"? "Signing Up" : "Sign Up"}</button>
                        <div className="backToSignIn">
                            <p style={{width: 'fit-content', textAlign: 'center', fontSize: '12px', fontWeight: 'bold'}} className='backToSignIn' onClick={() => navigate('/', {replace: true})}>Back to Sign In</p>
                        </div>
                </div>
                <div className="orgReg2">
                    <p style={{fontSize: '20px', width: '150px'}}>Help People Get their Dream Job</p>
                    <img src={earthImg} alt="" className='globeImg' />
                    
                    <p style={{width: '200px', lineHeight: '35px'}}><span style={{fontSize: "20px", fontWeight: '500'}}>Globally,</span><br/>Millions of People are Actively Searching for Job Right Now !</p>
                </div>
            </div>
        </div>
    )
}

export { OrgRegistration }