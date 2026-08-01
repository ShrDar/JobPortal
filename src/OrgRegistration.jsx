import React, { useState } from 'react'
import { getOrgTypes, getOrgs } from '../fetchCred.jsx'
import { useLoaderData, useNavigate } from 'react-router-dom';
import { addDoc, collection, doc, setDoc } from 'firebase/firestore';
import { db, auth } from '../config/firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { storage, BUCKET_ID } from '../config/appwrite';
import earthImg from '/earth.png'
import passEyeImg from '/eyes.png'
import { ID } from 'appwrite';
import { motion } from 'framer-motion';
import { toast } from 'sonner';

export async function loader() {
    // Optimized loader function - only fetches organization types
    // This is called before component renders in DOM
    try {
        const orgTypes = await getOrgTypes(); // Only fetch organization types
        return { orgTypes };
    } catch (error) {
        console.error('Error loading organization types:', error);
        // Return empty array as fallback to prevent crashes
        return { orgTypes: [] };
    }
}


function OrgRegistration() {
    const {orgTypes} = useLoaderData(); //de-structuring the data returned from the loader function and storing it in orgTypes variable
    
    const navigate = useNavigate(); //used for routing user to another route
    const [signInStatus, setSignInStatus] = useState("idle"); //useState hook used for setting the text in the sign in button according to the status of the registration
    const [isCheckingAvailability, setIsCheckingAvailability] = useState(false); //loading state for checking email/phone availability
    const [checkPass, setCheckPass] = useState(false); //used for changing the input field from password to text if the use clicks in the eye icon

    const [name, setName] = useState(''); //used to store the value of name input field
    const [email, setEmail] = useState(''); //used to store the value of the email input field
    const [pass, setPass] = useState(''); //used to store the value of the password input field
    const [phone, setPhone] = useState(''); //used to store the value of phone input field
    const [address, setAddress] = useState(''); //used to store the value of address input field
    const [passwordStrength, setPasswordStrength] = useState(0); //track password strength
    const [errors, setErrors] = useState({}); //store validation errors
    const [isSubmitting, setIsSubmitting] = useState(false); //better state management for submission
    const [type, setType] = useState(orgTypes?.[0]?.typeId || ''); //used to store the value of type input field
    
    // Memoize validation regex for performance
    const emailRegex = React.useMemo(() => /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, []);
    const lettersRegex = React.useMemo(() => /[a-zA-Z]/g, []);
    const [imgUpload, setImgUpload] = useState(null); //used to get the image file
    let formData;

    const letters = /[a-zA-Z]/g; //used for regex to validate if the there are any input fields with only whitespaces

    const handleSignUp = async() => {
        //function is used to perform actions after the user hits the sign up button
        setSignInStatus("submitting"); //setting the states value to 'submitting'
        setIsSubmitting(true)
        
        // Validate form fields
        const validationErrors = {};
        if(!name.trim()) validationErrors.name = "Name is required";
        if(!email.trim()) validationErrors.email = "Email is required";
        if(!pass) validationErrors.pass = "Password is required";
        if(!phone) validationErrors.phone = "Phone is required";
        if(!address.trim()) validationErrors.address = "Address is required";
        if(!type) validationErrors.type = "Type is required";
        if(!imgUpload) validationErrors.imgUpload = "Logo is required";
        
        if(Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            setSignInStatus("idle");
            setIsSubmitting(false);
            return;
        } 
        
        // Validate field formats
        if(!name.trim().match(lettersRegex)) {
            validationErrors.name = "Name should contain letters";
        }
        if(!pass.match(lettersRegex)) {
            validationErrors.pass = "Password should contain letters";
        }
        if(!address.trim().match(lettersRegex)) {
            validationErrors.address = "Address should contain letters";
        }
        
        if(phone.toString().length !== 10) {
            validationErrors.phone = "Phone number must be 10 digits";
        }
        
        if(pass.length < 6) {
            validationErrors.pass = "Password must be at least 6 characters";
        }
        
        // Password strength validation
        const hasUpperCase = /[A-Z]/.test(pass);
        const hasLowerCase = /[a-z]/.test(pass);
        const hasNumbers = /\d/.test(pass);
        const hasSpecialChars = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(pass);
        
        let strength = 0;
        if(hasUpperCase) strength++;
        if(hasLowerCase) strength++;
        if(hasNumbers) strength++;
        if(hasSpecialChars) strength++;
        setPasswordStrength(strength);
        
        if(strength < 2) {
            validationErrors.pass = "Password is too weak. Add uppercase, numbers, or special characters.";
        }
        
        if(!emailRegex.test(email)) {
            validationErrors.email = "Invalid email format";
        }
        
        if(Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            setSignInStatus("idle");
            setIsSubmitting(false);
            return;
        }

        // Check if email or phone already exists by fetching only when needed
        setIsCheckingAvailability(true);
        try {
            const orgs = await getOrgs(); // Fetch organizations only at submission time
            const isOrg = orgs.find((org) => org.email === email || org.phone === phone); //checking if the email or phone number is already used in the database
            if(isOrg) { //if it is taken the function gets terminated
                setErrors({...errors, email: 'Email or Phone number already taken'});
                setSignInStatus("idle");
                setIsSubmitting(false);
                return;
            }
        } catch (error) {
            console.error('Error checking organization availability:', error);
            toast.error('Error checking availability. Please try again.');
            setSignInStatus("idle");
            setIsSubmitting(false);
            return;
        } finally {
            setIsCheckingAvailability(false);
        }
        
        // Additional security validation
        if (!isPasswordValid()) {
            setErrors({...errors, pass: 'Password does not meet security requirements'});
            setSignInStatus("idle");
            setIsSubmitting(false);
            return;
        }

        let currentDate = new Date().toJSON().slice(0, 10); //getting the current date and slicing it to get essential information

        const url = await handleUpload(); //handleUpload function used to store the organization logo in the Appwrite bucket
        if(!url) {
            setErrors({...errors, imgUpload: 'Logo upload failed. Please try again.'});
            toast.error('Logo upload failed. Please try again.');
            setSignInStatus("idle");
            setIsSubmitting(false);
            return;
        }
        
        // Create organization data object - EXCLUDING password for security (stored only in Firebase Auth)
        const orgData = {
            name,
            email,
            phone,
            address,
            type,
            createdDate: currentDate,
            updatedDate: currentDate,
            isVisible: true,
            imgUrl: url
        };

        // Create user with Firebase Authentication first
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, pass);
            const user = userCredential.user;
            
            // Add additional user data to Firestore using Firebase UID as document ID (Google recommended approach)
            const orgDocRef = doc(collection(db, "organization"), user.uid);
            const finalOrgData = {
                ...orgData,
                emailVerified: user.emailVerified
                // userId field removed since the document ID is now the Firebase UID
            };
            
            await setDoc(orgDocRef, finalOrgData);
            
            // Send email verification (recommended by Google)
            if (auth.currentUser) {
                try {
                    await auth.currentUser.sendEmailVerification();
                    toast.success('Registration successful! Please check your email for verification. Redirecting to login...', {
                      style: {
                        background: '#26A365',
                        color: '#FFFFFF',
                        border: '1px solid #09924D',
                        borderRadius: '10px'
                      }
                    });
                } catch (emailErr) {
                    console.error('Email verification error:', emailErr);
                    // Continue even if email verification fails
                    toast.success('Registration successful! Redirecting to login...', {
                      style: {
                        background: '#26A365',
                        color: '#FFFFFF',
                        border: '1px solid #09924D',
                        borderRadius: '10px'
                      }
                    });
                }
            }
            
            setSignInStatus("idle");
            setIsSubmitting(false);
            
            // Show success message for 2 seconds before redirecting
            setTimeout(() => {
                return navigate('/', {replace: true});
            }, 2000);
        } catch(err) {
            console.error('Registration error:', err);
            
            // Handle specific Firebase authentication errors
            let errorMessage = 'Registration failed. Please try again';
            if (err.code === 'auth/email-already-in-use') {
                errorMessage = 'Email is already in use';
            } else if (err.code === 'auth/invalid-email') {
                errorMessage = 'Invalid email address';
            } else if (err.code === 'auth/weak-password') {
                errorMessage = 'Password is too weak. Please use a stronger password';
            } else if (err.code === 'auth/operation-not-allowed') {
                errorMessage = 'Email/password accounts are not enabled';
            }
            
            toast.error(errorMessage, {
              style: {
                background: '#FF7979',
                color: '#FFFFFF',
                border: '1px solid #FF7979',
                borderRadius: '10px'
              }
            });
            setSignInStatus("idle");
            setIsSubmitting(false);
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
            setErrors({...errors, imgUpload: 'Only .png, .jpg, .jpeg formats allowed'});
        }
    }
    
    // Security: Validate password strength before allowing submission
    const isPasswordValid = () => {
        return passwordStrength >= 2 && pass.length >= 6;
    }
    
    // Industry best practice: Check if email is already in use before form submission
    const checkEmailAvailability = async () => {
        if (!email || !emailRegex.test(email)) return false;
        
        try {
            // This is a simplified check - in production, you might want to use Firebase Admin SDK
            // or implement a more robust solution
            const orgs = await getOrgs();
            return !orgs.some(org => org.email === email);
        } catch (error) {
            console.error('Error checking email availability:', error);
            return false;
        }
    }
    

    return (
        <div className="flex min-h-screen items-start justify-center bg-[#285956] bg-[url('/loginBg.png')] bg-cover bg-center px-4 py-8 text-white">
            <motion.div className="flex w-full max-w-4xl flex-col overflow-hidden rounded-3xl bg-black/55 backdrop-blur-sm lg:flex-row" initial={{opacity: 0}} animate={{opacity: 1}} transition={{ duration: 1}}>
                <div className="flex w-full flex-col gap-6 p-6 lg:w-[65%] lg:p-10">
                    <h2 className="my-4 w-full text-center text-2xl font-bold">Register Your Organization</h2>

                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 md:gap-8">
                        <div className="flex flex-col gap-2 text-sm font-medium">
                            <div className="flex justify-between items-center">
                                <label>Name</label>
                                {errors.name && <span className="text-xs text-red-400">{errors.name}</span>}
                            </div>
                            <input autoComplete='hidden' type="text" name='orgName' onChange={(e) => {
                                setName(e.target.value);
                                // Clear name error when user starts typing
                                if(errors.name) {
                                    const newErrors = {...errors};
                                    delete newErrors.name;
                                    setErrors(newErrors);
                                }
                            }} value={name} maxLength={50} className={`h-10 rounded-md border ${errors.name ? 'border-red-500' : 'border-[#bfbfbf]'} bg-white px-3 text-black transition hover:shadow-[0_0_10px_#43B27F] focus:outline-none focus:ring-2 focus:ring-[#43B27F]`} />
                        </div>
                        <div className="flex flex-col gap-2 text-sm font-medium">
                            <div className="flex justify-between items-center">
                                <label>Email</label>
                                {errors.email && <span className="text-xs text-red-400">{errors.email}</span>}
                            </div>
                            <input autoComplete='hidden' type="email" name='orgEmail' onChange={(e) => {
                                setEmail(e.target.value);
                                // Clear email error when user starts typing (consistent with other fields)
                                if(errors.email) {
                                    const newErrors = {...errors};
                                    delete newErrors.email;
                                    setErrors(newErrors);
                                }
                            }} value={email} className={`h-10 rounded-md border ${errors.email ? 'border-red-500' : 'border-[#bfbfbf]'} bg-white px-3 text-black transition hover:shadow-[0_0_10px_#43B27F] focus:outline-none focus:ring-2 focus:ring-[#43B27F]`} />
                        </div>
                        <div className="flex flex-col gap-2 text-sm font-medium">
                            <div className="flex justify-between items-center">
                                <label>Password</label>
                                {errors.pass && <span className="text-xs text-red-400">{errors.pass}</span>}
                            </div>
                            <div className="flex items-center gap-3">
                                <input type={checkPass ? "text" : 'password'} name='orgPass' onChange={(e) => {
                                    setPass(e.target.value);
                                    // Clear password error when user starts typing
                                    if(errors.pass) {
                                        const newErrors = {...errors};
                                        delete newErrors.pass;
                                        setErrors(newErrors);
                                    }
                                    // Real-time password strength calculation
                                    const pass = e.target.value;
                                    const hasUpperCase = /[A-Z]/.test(pass);
                                    const hasLowerCase = /[a-z]/.test(pass);
                                    const hasNumbers = /\d/.test(pass);
                                    const hasSpecialChars = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(pass);
                                    let strength = 0;
                                    if(hasUpperCase) strength++;
                                    if(hasLowerCase) strength++;
                                    if(hasNumbers) strength++;
                                    if(hasSpecialChars) strength++;
                                    setPasswordStrength(strength);
                                }} value={pass} className={`h-10 w-full rounded-md border ${errors.pass ? 'border-red-500' : 'border-[#bfbfbf]'} bg-white px-3 text-black transition hover:shadow-[0_0_10px_#43B27F] focus:outline-none focus:ring-2 focus:ring-[#43B27F]`} />
                                <img src={passEyeImg} alt="Toggle password visibility" className="w-6 cursor-pointer transition hover:scale-110" style={{filter: checkPass ? 'grayscale(0) contrast(1.3)' : 'grayscale(1)'}} onClick={() => setCheckPass(prevCheck => !prevCheck)} />
                            </div>
                            {pass && (
                                <div className="mt-1 flex items-center gap-1">
                                    <div className="flex w-full gap-1">
                                        <div className={`h-1 flex-1 rounded ${passwordStrength >= 1 ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                                        <div className={`h-1 flex-1 rounded ${passwordStrength >= 2 ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                                        <div className={`h-1 flex-1 rounded ${passwordStrength >= 3 ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                                        <div className={`h-1 flex-1 rounded ${passwordStrength >= 4 ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                                    </div>
                                    <span className="text-xs text-gray-400">{passwordStrength === 4 ? 'Great' : passwordStrength === 3? 'Nice' : passwordStrength >= 2 ? 'Fine' : 'Weak'}</span>
                                </div>
                            )}
                        </div>
                        <div className="flex flex-col gap-2 text-sm font-medium">
                            <div className="flex justify-between items-center">
                                <label>Phone</label>
                                {errors.phone && <span className="text-xs text-red-400">{errors.phone}</span>}
                            </div>
                            <input type='number' name='orgPhone' onChange={(e) => {
                                setPhone(e.target.value);
                                // Clear phone error when user starts typing
                                if(errors.phone) {
                                    const newErrors = {...errors};
                                    delete newErrors.phone;
                                    setErrors(newErrors);
                                }
                            }} value={phone} className={`h-10 rounded-md border ${errors.phone ? 'border-red-500' : 'border-[#bfbfbf]'} bg-white px-3 text-black transition hover:shadow-[0_0_10px_#43B27F] focus:outline-none focus:ring-2 focus:ring-[#43B27F]`} />
                        </div>
                        <div className="flex flex-col gap-2 text-sm font-medium">
                            <div className="flex justify-between items-center">
                                <label>Address</label>
                                {errors.address && <span className="text-xs text-red-400">{errors.address}</span>}
                            </div>
                            <input autoComplete='hidden' type='text' name='orgAddress' onChange={(e) => {
                                setAddress(e.target.value);
                                // Clear address error when user starts typing
                                if(errors.address) {
                                    const newErrors = {...errors};
                                    delete newErrors.address;
                                    setErrors(newErrors);
                                }
                            }} value={address} maxLength={50} className={`h-10 rounded-md border ${errors.address ? 'border-red-500' : 'border-[#bfbfbf]'} bg-white px-3 text-black transition hover:shadow-[0_0_10px_#43B27F] focus:outline-none focus:ring-2 focus:ring-[#43B27F]`} />
                        </div>
                        <div className="flex flex-col gap-2 text-sm font-medium">
                            <div className="flex justify-between items-center">
                                <label>Type</label>
                                {errors.type && <span className="text-xs text-red-400">{errors.type}</span>}
                            </div>
                            <select name='orgType' onChange={(e) => {
                                setType(e.target.value);
                                // Clear type error when user selects an option
                                if(errors.type) {
                                    const newErrors = {...errors};
                                    delete newErrors.type;
                                    setErrors(newErrors);
                                }
                            }} className={`h-10 rounded-md border ${errors.type ? 'border-red-500' : 'border-[#bfbfbf]'} bg-white px-3 text-black transition hover:shadow-[0_0_10px_#43B27F] focus:outline-none focus:ring-2 focus:ring-[#43B27F]`}>
                                {orgTypes.map((type) => <option key={type.typeId} value={type.typeId}>{type.type}</option>)}
                            </select>
                        </div>
                        <div className="flex flex-col gap-2 text-sm font-medium md:col-span-2">
                            <div className="flex justify-between items-center">
                                <label>Logo</label>
                                {errors.imgUpload && <span className="text-xs text-red-400">{errors.imgUpload}</span>}
                            </div>
                            <input type='file' accept='.png, .jpg, .jpeg' name='orgImg' className={`block cursor-pointer rounded-md border ${errors.imgUpload ? 'border-red-500' : 'border-dashed border-white/40'} bg-white/10 px-3 py-2 text-sm text-white file:mr-4 file:rounded-md file:border-0 file:px-3 file:py-2 file:text-white hover:file:bg-[#2c7251]`} id='inputFile' onChange={(e) => {
                                setImgUpload(e.target.files[0]);
                                // Clear logo error when user selects a file
                                if(errors.imgUpload) {
                                    const newErrors = {...errors};
                                    delete newErrors.imgUpload;
                                    setErrors(newErrors);
                                }
                                checkFileType(e);
                            }} />
                        </div>
                    </div>
                    <button className={`w-full rounded-xl px-4 py-3 font-semibold text-white transition ${(signInStatus === "submitting" || isCheckingAvailability || isSubmitting) ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#43B27F] hover:bg-[#285956]'}`} onClick={handleSignUp} disabled={signInStatus === "submitting" || isCheckingAvailability || isSubmitting}>{
                        isCheckingAvailability ? "Checking Availability..." : 
                        signInStatus === "submitting" ? "Signing Up" : 
                        "Sign Up"
                    }</button>
                    <div className="flex w-full justify-center text-center">
                        <p className="w-fit cursor-pointer text-xs font-bold text-[#b1b1b1] transition hover:text-white" onClick={() => navigate('/', {replace: true})}>Back to Sign In</p>
                    </div>
                </div>
                <div className="hidden lg:flex w-full flex-col items-center justify-center gap-10 bg-[#43B27F] p-8 text-center lg:w-[35%] lg:rounded-[10px_60px_10px_10px] lg:m-5">
                    <p className="xl:w-[80%] text-xl">Help People Get their Dream Job</p>
                    <img src={earthImg} alt="Earth" className="xl:w-[65%] transition hover:scale-110" />
                    <p className="xl:w-[85%] leading-9"><span className="text-xl font-medium">Globally,</span><br/>Millions of People are Actively Searching for Job Right Now !</p>
                </div>
            </motion.div>
        </div>
    )
}

export { OrgRegistration }