import React from "react";
import { createPortal } from "react-dom";
import crossImg from '../../public/cross.png'

function ApplyJobModal({ isOpened, setIsOpened }) {
    if(!isOpened) {
        return null;
    }
    return createPortal(
        <>
        <div className="applyJobModalContainer" onClick={() => setIsOpened(false)}>
        </div>
        
        <div className="applyJob">
            <div className="applyJob1 flex gap-3">
                <img className="cross" src={crossImg} alt="" onClick={() => setIsOpened(false)} />
                <h2 style={{fontSize: '20px', width: '100%', textAlign: 'center'}}>Apply Form</h2>
            </div>
            <div className="applyForm">
                <div className="applyJob-name">
                    <label>Name</label>
                    <input type="text"/>
                </div>
                <div className="applyJob-name">
                    <label>Phone No</label>
                    <input type="number" />
                </div>
                <div className="applyJob-name">
                    <label>Address </label>
                    <input type="text"></input>
                </div>
                <div className="applyJob-name">
                    <label>E-mail </label>
                    <input type="email" />
                </div>
                <div className="applyJob-name">
                    <label>Attach CV</label>
                    <input type="file" />
                </div>
                <button className="applySendBtn">Send</button>

            </div>
        </div>
        
        </>,
        document.getElementById("applyJobModal")
    )
}

export { ApplyJobModal }