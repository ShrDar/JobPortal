import React from "react";
import { createPortal } from "react-dom";

function AddJobModal() {
    return createPortal(
        <div className="addJobModal">
            
        </div>
        , document.getElementById('modal')
    )
}

export { AddJobModal } 