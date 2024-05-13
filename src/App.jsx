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
import { OrgApplicants } from "./Ankita/OrgApplicants";
import { OrgProfile } from "./Ankita/OrgProfile";

//creating a router variable to use the createBrowserRouter and createRoutesFromElements function
//createBrowserRouter creates Browser routes for client side routing and createRoutesFromElements creates routes from Route Components
localStorage.setItem("fromApplicant", false);
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
            <Route path="orgApplicants" element={<OrgApplicants />} />
            <Route path="orgProfile" element={<OrgProfile />} />
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
//Here the main route is '/' whose index path is OrgLogin (the landing page of the website)
//The organizationDashboard/:orgId route is a parent route which consists of child routes which is used to create a shared web layout
//Similarly applicantDashboard route is a parent route consisting of child routes the ApplicatDashboard component is the parent component and other route components are rendered in the parent component

function App() {
    //This is the App component or a function that returns JSX element. JSX is an object which is transformed in to HTML DOM elements by React library
    return (
        <RouterProvider router = {router} />
    )
    //RouteProvider is a in-built react-router-dom component use for rendering the App
}

export { App }