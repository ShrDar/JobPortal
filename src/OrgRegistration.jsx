import React, { useEffect, useState } from 'react'
import { getOrgTypes, getOrgs } from '../fetchCred.jsx'
import { Form, redirect, useActionData, useLoaderData, useNavigate, useNavigation } from 'react-router-dom';
import { addDoc, collection, getDocs } from 'firebase/firestore';
import { db } from '../config/firebase';
import { storage, BUCKET_ID } from '../config/appwrite';
import earthImg from '/earth.png'
import passEyeImg from '/eyes.png'
import { ID } from 'appwrite';
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
        if(name.match(letters) && pass.match(letters) && address.match(letters)) {
            
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

        formData = {name, email, pass, phone, address, type, createdDate: currentDate, updatedDate: currentDate, isVisible: true}; //storing the values of the input fields in an object
        const url = await handleUpload(); //handleUpload function used to store the organization logo in the Appwrite bucket
        if(!url) {
            alert('Logo upload failed. Please try again.');
            setSignInStatus("idle");
            return;
        }
        formData = {...formData, imgUrl: url} //adding an attribute in the object

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

    const handleUpload = async () => {
        if (!imgUpload) return null;

        try {
            const file = await storage.createFile({
                bucketId: BUCKET_ID,
                fileId: ID.unique(),
                file: imgUpload,
            });

            const url = storage.getFileView({
                bucketId: BUCKET_ID,
                fileId: file.$id,
            }).toString();

            return url;
        } catch (err) {
            console.error("Upload failed:", err);
            return null;
        }
    };
    
    const checkFileType = (e) => {
        const fileName = e.target.value;
        if(!(fileName.includes('.png') || fileName.includes('.jpg') || fileName.includes('.jpeg'))) {
            e.target.value = '';
            alert('Only .png, .jpg, .jpeg formats allowed')
        }
    }

    return (
        <div className="flex min-h-screen items-start justify-center bg-[#285956] bg-[url('/loginBg.png')] bg-cover bg-center px-4 py-8 text-white">
            <motion.div className="flex w-full max-w-4xl flex-col overflow-hidden rounded-3xl bg-black/55 backdrop-blur-sm lg:flex-row" initial={{opacity: 0, x: -1000}} animate={{opacity: 1, x: 0}}>
                <div className="flex w-full flex-col gap-6 p-6 lg:w-[65%] lg:p-10">
                    <h2 className="my-4 w-full text-center text-2xl font-bold">Register Your Organization</h2>
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 md:gap-8">
                        <div className="flex flex-col gap-2 text-sm font-medium">
                            <label>Name</label>
                            <input autoComplete='hidden' type="text" name='orgName' onChange={(e) => setName(e.target.value)} value={name} maxLength={50} className="h-10 rounded-md border border-[#bfbfbf] bg-white px-3 text-black transition hover:shadow-[0_0_10px_#43B27F] focus:outline-none focus:ring-2 focus:ring-[#43B27F]" />
                        </div>
                        <div className="flex flex-col gap-2 text-sm font-medium">
                            <label>Email</label>
                            <input autoComplete='hidden' type="email" name='orgEmail' onChange={(e) => setEmail(e.target.value)} value={email} className="h-10 rounded-md border border-[#bfbfbf] bg-white px-3 text-black transition hover:shadow-[0_0_10px_#43B27F] focus:outline-none focus:ring-2 focus:ring-[#43B27F]" />
                        </div>
                        <div className="flex flex-col gap-2 text-sm font-medium">
                            <label>Password</label>
                            <div className="flex items-center gap-3">
                                <input type={checkPass ? "text" : 'password'} name='orgPass' onChange={(e) => setPass(e.target.value)} value={pass} className="h-10 w-full rounded-md border border-[#bfbfbf] bg-white px-3 text-black transition hover:shadow-[0_0_10px_#43B27F] focus:outline-none focus:ring-2 focus:ring-[#43B27F]" />
                                <img src={passEyeImg} alt="Toggle password visibility" className="w-6 cursor-pointer transition hover:scale-110" style={{filter: checkPass ? 'grayscale(0) contrast(1.3)' : 'grayscale(1)'}} onClick={() => setCheckPass(prevCheck => !prevCheck)} />
                            </div>
                        </div>
                        <div className="flex flex-col gap-2 text-sm font-medium">
                            <label>Phone</label>
                            <input type='number' name='orgPhone' onChange={(e) => setPhone(e.target.value)} value={phone} className="h-10 rounded-md border border-[#bfbfbf] bg-white px-3 text-black transition hover:shadow-[0_0_10px_#43B27F] focus:outline-none focus:ring-2 focus:ring-[#43B27F]" />
                        </div>
                        <div className="flex flex-col gap-2 text-sm font-medium">
                            <label>Address</label>
                            <input autoComplete='hidden' type='text' name='orgAddress' onChange={(e) => setAddress(e.target.value)} value={address} maxLength={50} className="h-10 rounded-md border border-[#bfbfbf] bg-white px-3 text-black transition hover:shadow-[0_0_10px_#43B27F] focus:outline-none focus:ring-2 focus:ring-[#43B27F]" />
                        </div>
                        <div className="flex flex-col gap-2 text-sm font-medium">
                            <label>Type</label>
                            <select name='orgType' onChange={(e) => setType(e.target.value)} className="h-10 rounded-md border border-[#bfbfbf] bg-white px-3 text-black transition hover:shadow-[0_0_10px_#43B27F] focus:outline-none focus:ring-2 focus:ring-[#43B27F]">
                                {orgTypes.map((type) => <option key={type.typeId} value={type.typeId}>{type.type}</option>)}
                            </select>
                        </div>
                        <div className="flex flex-col gap-2 text-sm font-medium md:col-span-2">
                            <label>Logo</label>
                            <input type='file' accept='.png, .jpg, .jpeg' name='orgImg' className="block w-full cursor-pointer rounded-md border border-dashed border-white/40 bg-white/10 px-3 py-2 text-sm text-white file:mr-4 file:rounded-md file:border-0 file:bg-[#008CDF] file:px-3 file:py-2 file:text-white hover:file:bg-[#2c7251]" id='inputFile' onChange={(e) => {
                                setImgUpload(e.target.files[0])
                                checkFileType(e);
                            }} />
                        </div>
                    </div>
                    <button className="w-full rounded-xl bg-[#43B27F] px-4 py-3 font-semibold text-white transition hover:bg-[#285956]" onClick={handleSignUp}>{signInStatus === "submitting" ? "Signing Up" : "Sign Up"}</button>
                    <div className="flex w-full justify-center text-center">
                        <p className="w-fit cursor-pointer text-xs font-bold text-[#b1b1b1] transition hover:text-white" onClick={() => navigate('/', {replace: true})}>Back to Sign In</p>
                    </div>
                </div>
                <div className="flex w-full flex-col items-center justify-center gap-10 bg-[#43B27F] p-8 text-center lg:w-[35%] lg:rounded-[10px_60px_10px_10px] lg:m-5">
                    <p className="w-[150px] text-xl">Help People Get their Dream Job</p>
                    <img src={earthImg} alt="Earth" className="w-[150px] transition hover:scale-110" />
                    <p className="w-[200px] leading-9"><span className="text-xl font-medium">Globally,</span><br/>Millions of People are Actively Searching for Job Right Now !</p>
                </div>
            </motion.div>
        </div>
    )
}

export { OrgRegistration }