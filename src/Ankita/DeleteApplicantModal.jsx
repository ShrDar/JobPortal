import { deleteDoc, doc } from "firebase/firestore";
import React from "react";
import { createPortal } from "react-dom";
import { db } from "../../config/firebase";
import dustbin from '/delete.png'
import { motion } from "framer-motion";

function DeleteApplicantModal( {isDeleteApplicantModalOpen, setIsDeleteApplicantModalOpened, id} ) {
    if(!isDeleteApplicantModalOpen) {
        return;
    }
    const handleDeleteApplicant = async(id) => {
        try {
            const appRef = doc(db, "applicant", id);
            await deleteDoc(appRef);
            setIsDeleteApplicantModalOpened(false);
        } catch (err) {
            console.log(err);
        }
    }
    const dropIn = {
        hidden: {
            y: '-100vh',
            opacity: 1,
        }, visible: {
            y: '-50%',
            x: '-50%',
            opacity: 1,
            transition: { duration: 0.1, type: 'spring', damping: 25, stiffness: 500}
        }, exit: {
            y: '100vh',
            opacity: 0
        }
    }

    return createPortal(
        <>
            <div className="overlay" onClick={() => setIsDeleteApplicantModalOpened(false)}></div>
            <motion.div initial='hidden' animate='visible' exit='exit' variants={dropIn} className="deleteJobModal modal">
                <div className="dustbinContainer">
                    <img className="dustBin" src={dustbin} alt="" />
                </div>
                <p>Remove Applicant ?</p>
                <div className="yesNoBtnContainer">
                    <button className="noBtn" onClick={() => setIsDeleteApplicantModalOpened(false)}>No</button>
                    <button className="yesBtn" onClick={() => handleDeleteApplicant(id)}>Yes</button>
                </div>
            </motion.div>
        </>,
        document.getElementById('modal')
    )
}

export { DeleteApplicantModal }