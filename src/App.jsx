import React from "react";
import { createBrowserRouter,
        createRoutesFromElements,
        Route, 
        RouterProvider} from "react-router-dom";
import '../index.css'
import { OrgDashboard, loader as orgLoader } from "./Ankita/OrgDashboard";
import { ApplicantDashboard, loader as applicantDashLoader } from "./Viraj/ApplicantDashboard";
import { OrgLogin, action as orgLoginAction } from "./OrgLogin";
import { OrgRegistration, loader as orgRegLoader } from "./OrgRegistration";
import { NotFound } from "./NotFound";
import { Error } from "./Error";
import { ApplicantHome } from "./Viraj/ApplicantHome";
import { ApplicantJobs, loader as applicantJobsLoader } from "./Viraj/ApplicantJobs";
import { AboutUs } from "./Viraj/AboutUs";
import { ApplicantJobDetails, loader as applicantJobDetailsLoader } from "./Viraj/ApplicantJobDetails";
import { OrgHome } from "./Ankita/OrgHome";
import { OrgJobListings, loader as orgJobListingsLoader } from "./Ankita/OrgJobListings";

const router = createBrowserRouter(createRoutesFromElements(
    <Route path="/" >
        <Route index element = {<OrgLogin />} action={orgLoginAction} />
        <Route path="registration" 
            element = {<OrgRegistration />}
            loader={orgRegLoader}
        />
        <Route path="orgDashboard/:orgId" 
            element = {<OrgDashboard />} 
            loader={orgLoader} 
        >
            <Route index element={<OrgHome />} />
            <Route path="orgJobListings" element={<OrgJobListings />} loader={ orgJobListingsLoader } />
        </Route>
        <Route path="applicantDashboard"  
            element = {<ApplicantDashboard />} 
            loader={applicantDashLoader}
        >
            <Route index element={<ApplicantHome />} />
            <Route path="applicantJobs" element ={<ApplicantJobs />} loader={applicantJobsLoader} />
            <Route path="aboutUs" element={<AboutUs />} />
            <Route path="jobDetails/:jobId" element={<ApplicantJobDetails />} loader={applicantJobDetailsLoader} />
        </Route>
        <Route path="*" element = {<NotFound />} />
    </Route>
))

function App() {
    return (
        <RouterProvider router = {router} />
    )
}

export { App }