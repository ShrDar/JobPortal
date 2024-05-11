import React, { useEffect, useState } from 'react'
import { getOrgTypes, getOrgs } from '../fetchCred.jsx'
import { Form, redirect, useActionData, useLoaderData, useNavigate, useNavigation } from 'react-router-dom';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { db, storage } from '../config/firebase';
import { addDoc, collection, getDocs } from 'firebase/firestore';
import earthImg from '/earth.png'
import passEyeImg from '/eyes.png'
import { motion } from 'framer-motion';

export async function loader() {
    //loader function is a in-built react-router-dom function which is initiated before a component gets rendered in the DOM
    const orgs = await getOrgs() //fetching the organization collection
    const orgTypes = await getOrgTypes(); //fetching the organization type collection
    return {orgs, orgTypes}; //returning orgs and orgTypes
}


function OrgRegistration() {
    const {orgs, orgTypes} = useLoaderData(); //de-structuring the data returned from the loader function and storing them in orgs and orgTypes variable
    
    const navigate = useNavigate(); //used for routing user to another route
    const [signInStatus, setSignInStatus] = useState("idle"); //useState hook used for setting the text in the sign in button according to the status of the registration
    const [checkPass, setCheckPass] = useState(false); //used for changing the input field from password to text if the use clicks in the eye icon

    const [name, setName] = useState(''); //used to store the value of name input field
    const [email, setEmail] = useState(''); //used to store the value of the email input field
    const [pass, setPass] = useState(''); //used to store the value of the password input field
    const [phone, setPhone] = useState(''); //used to store the value of phone input field
    const [address, setAddress] = useState(''); //used to store the value of address input field
    const [type, setType] = useState(orgTypes[0].typeId); //used to store the value of type input field
    const [imgUpload, setImgUpload] = useState(null); //used to get the image file
    let formData;

    const letters = /[a-zA-Z]/g; //used for regex to validate if the there are any input fields with only whitespaces

    const handleSignUp = async() => {
        //function is used to perform actions after the user hits the sign up button
        setSignInStatus("submitting"); //setting the states value to 'submitting'
        if(name === "" || email === "" || pass === "" || phone === "" || address === "" || type === ""  || imgUpload === null) {
            //checking if any input field is missing
            alert("Missing Fields"); //showing an alert message
            setSignInStatus("idle") //setting the status to 'idle'
            return; //terminating the function
        } 
        if(name.match(letters) || pass.match(letters) || address.match(letters)) {
            
        } else {
            alert('Name, Password and Address should contain letters (Dont try to break my sh*t)')
            return;
        }
        if(phone.length !== 10) { //checking if the phone number length is equals to 10 or not
            alert("Phone Number Length -> 10");
            setSignInStatus("idle")
            return;
        }
        if(pass.length < 6) { //checking if the length of the password is less than six or not
            alert("Password consist atleast 6 letter");
            setSignInStatus("idle");
            return;
        }
        
        const regex = /^([a-z]||[A-Z]||[0-9])+[@]([a-z]||[A-Z])+[.]([a-z]||[A-Z]||[0-9])+[.]*([a-z]||[A-Z]||[0-9])*$/gm; //regex pattern for email validation
        if(!regex.test(email)) { //checking if the entered email matches the given regex pattern
            alert("Invalid Email");
            setSignInStatus("idle")
            return;
        }

        const isOrg = orgs.find((org) => org.email === email || org.phone === phone) //checking if the email or phone number is already used in the database
        if(isOrg) { //if it is taken the function gets terminated
            alert('Email or Phone no already taken')
                setSignInStatus("idle")
                return;
        }

        let currentDate = new Date().toJSON().slice(0, 10); //getting the current date and slicing it to get essential information
        console.log(currentDate);

        formData = {name, email, pass, phone, address, type, createdDate: currentDate, updatedDate: currentDate, isVisible: true}; //storing the values of the input fields in an object
        const url = await handleUpload(); //handleUpload function used to store the organization logo in the firestore storage
        formData = {...formData, imgUrl: url} //adding an attribute in the object
        console.log(formData);

        //adding organization info in the database

        try {
            const orgCollectionRef = collection(db, "organization"); //reference of the organization collection
            await addDoc(orgCollectionRef, formData) //adding the object to the organization collection in firestore
            setSignInStatus("idle"); 
            alert('Sign in Successful') //create a pop up in the next sprint*****************************************
            return navigate('/', {replace: true}); //navigating the user the login page
        } catch(err) {
            console.error(err);
        }

    }

    const handleUpload = async() => {
        //handleUpload function is used to upload the organization logo in the firebase storage and to gain the url where the img is stored
        if(!imgUpload) return; //is there is no image selected the function gets terminated
        const filesFolderRef = ref(storage, `organizationImg/${imgUpload.name}`); //reference of the firebase storage
        try {
            let file = await uploadBytes(filesFolderRef, imgUpload); //uploading the image to the storage
            let url = await getDownloadURL(file.ref); //getting the url where the image is stored
            return url; //returning the url
        } catch(err) { //catching errs
            console.error(err);
        }
    }
    
    const checkFileType = (e) => {
        const fileName = e.target.value;
        if(!(fileName.includes('.png') || fileName.includes('.jpg') || fileName.includes('.jpeg'))) {
            e.target.value = '';
            alert('Only .png, .jpg, .jpeg formats allowed')
        }
    }

    return (
        <div className='orgRegContainer loginContainer'>
            <motion.div className="orgReg" initial={{opacity: 0, x: -1000}} animate={{opacity: 1, x: 0}}>
                <div className="orgReg1">

                    <h2 style={{textAlign:"center", width: '100%', fontSize: "24px", fontWeight: "bold", margin: '20px 0px'}}>Register Your Organization</h2>
                        <div className="orgRegGrid">

                            <div className="reg-orgName regIn">
                                <label>Name</label>
                                <input autoComplete='hidden' type="text" name='orgName' onChange={(e) => setName(e.target.value)} value={name} maxLength={50}/>
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
                                <input autoComplete='hidden' type='text' name='orgAddress' onChange={(e) => setAddress(e.target.value)} value={address} maxLength={50} />
                            </div>
                            <div className="reg-orgType regIn">
                                <label>Type</label>
                                <select name='orgType' onChange={(e) => setType(e.target.value)} >
                                    {orgTypes.map((type) => <option key={type.typeId} value={type.typeId}>{type.type}</option>)}
                                </select>
                            </div>
                            <div className="reg-orgImg regIn">
                                <label>Logo</label>
                                <input type='file' accept='.png, .jpg, .jpeg' name='orgImg' className='orgImg' id='inputFile' onChange={(e) => {
                                    setImgUpload(e.target.files[0])
                                    checkFileType(e);
                                    }} />
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
            </motion.div>
        </div>
    )
}

export { OrgRegistration }