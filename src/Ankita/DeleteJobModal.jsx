import { deleteDoc, doc } from "firebase/firestore";
import React from "react";
import { createPortal } from "react-dom";
import { db } from "../../config/firebase";
import dustbin from '/delete.png'
import { motion } from "framer-motion";

function DeleteJobModal( {isDeleteJobModalOpen, setIsDeleteJobModalOpened, id} ) {
    if(!isDeleteJobModalOpen) {
        return;
    }
    const handleDeleteJob = async(id) => {
        try {
            const jobRef = doc(db, "jobListings", id);
            await deleteDoc(jobRef);
            setIsDeleteJobModalOpened(false);
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
            <div className="overlay" onClick={() => setIsDeleteJobModalOpened(false)}></div>
            <motion.div initial='hidden' animate='visible' exit='exit' variants={dropIn} className="deleteJobModal modal">
                <div className="dustbinContainer">
                    <img className="dustBin" src={dustbin} alt="" />
                </div>
                <p>Are you sure you want delete the Job ?</p>
                <div className="yesNoBtnContainer">
                    <button className="noBtn" onClick={() => setIsDeleteJobModalOpened(false)}>No</button>
                    <button className="yesBtn" onClick={() => handleDeleteJob(id)}>Yes</button>
                </div>
            </motion.div>
        </>,
        document.getElementById('modal')
    )
}

export { DeleteJobModal }