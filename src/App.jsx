import React from "react";
import { createBrowserRouter,
        createRoutesFromElements,
        Route, 
        RouterProvider} from "react-router-dom";
import '../index.css'
import { OrgDashboard } from "./OrgDashboard";
import { ApplicantDashboard, loader as applicationDashLoader } from "./ApplicantDashboard";
import { OrgLogin, action as orgLoginAction } from "./OrgLogin";
import { OrgRegistration, loader as orgRegLoader } from "./OrgRegistration";
import { NotFound } from "./NotFound";
import { Error } from "./Error";

const router = createBrowserRouter(createRoutesFromElements(
    <Route path="/" >
        <Route index element = {<OrgLogin />} action={orgLoginAction} />
        <Route path="registration" 
            element = {<OrgRegistration />}
            loader={orgRegLoader}
        />
        <Route path="orgDashboard" element = {<OrgDashboard />} />
        <Route path="applicantDashboard"  
            element = {<ApplicantDashboard />} 
            loader={applicationDashLoader}
        />
        <Route path="*" element = {<NotFound />} />
    </Route>
))

function App() {
    return (
        <RouterProvider router = {router} />
    )
}

export { App }