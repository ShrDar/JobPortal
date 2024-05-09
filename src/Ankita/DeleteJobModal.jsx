import { deleteDoc, doc } from "firebase/firestore";
import React from "react";
import { createPortal } from "react-dom";
import { db } from "../../config/firebase";
import dustbin from '/delete.png'

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

    return createPortal(
        <>
            <div className="overlay" onClick={() => setIsDeleteJobModalOpened(false)}></div>
            <div className="deleteJobModal">
                <div className="dustbinContainer">
                    <img className="dustBin" src={dustbin} alt="" />
                </div>
                <p>Are you sure you want delete the Job ?</p>
                <div className="yesNoBtnContainer">
                    <button className="noBtn" onClick={() => setIsDeleteJobModalOpened(false)}>No</button>
                    <button className="yesBtn" onClick={() => handleDeleteJob(id)}>Yes</button>
                </div>

            </div>
        </>,
        document.getElementById('modal')
    )
}

export { DeleteJobModal }