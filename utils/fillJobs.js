// import { db } from "../config/firebase";
// import { collection, writeBatch, doc } from "firebase/firestore";


// const orgId = "uFePWyA5EJraie2ens4z";


// const jobs = [
//     {
//         jobTitle: "Backend Engineer",
//         description: "Develop scalable APIs using Node.js and Express",
//         experience: "Fresher",
//         jobDurationType: "Full-Time",
//         workLocation: "Remote",
//         NofVacancy: "2",
//     },
//     {
//         jobTitle: "Frontend Developer",
//         description: "Build responsive user interfaces using React",
//         experience: "Beginner",
//         jobDurationType: "Full-Time",
//         workLocation: "Hybrid",
//         NofVacancy: "3",
//     },
//     {
//         jobTitle: "Full Stack Developer",
//         description: "Work on frontend and backend application development",
//         experience: "Intermediate",
//         jobDurationType: "Full-Time",
//         workLocation: "On-Site",
//         NofVacancy: "2",
//     },
//     {
//         jobTitle: "Python Developer",
//         description: "Create backend services using Python and FastAPI",
//         experience: "Fresher",
//         jobDurationType: "Part-Time",
//         workLocation: "Remote",
//         NofVacancy: "1",
//     },
//     {
//         jobTitle: "React Developer",
//         description: "Develop modern React based web applications",
//         experience: "Beginner",
//         jobDurationType: "Full-Time",
//         workLocation: "Remote",
//         NofVacancy: "2",
//     },
//     {
//         jobTitle: "UI/UX Designer",
//         description: "Design intuitive interfaces and user experiences",
//         experience: "Intermediate",
//         jobDurationType: "Part-Time",
//         workLocation: "Hybrid",
//         NofVacancy: "1",
//     },
//     {
//         jobTitle: "Mobile App Developer",
//         description: "Build cross platform mobile applications",
//         experience: "Beginner",
//         jobDurationType: "Full-Time",
//         workLocation: "On-Site",
//         NofVacancy: "2",
//     },
//     {
//         jobTitle: "DevOps Engineer",
//         description: "Manage deployment pipelines and cloud infrastructure",
//         experience: "Expert",
//         jobDurationType: "Full-Time",
//         workLocation: "Remote",
//         NofVacancy: "1",
//     },
//     {
//         jobTitle: "Database Engineer",
//         description: "Design and maintain database systems",
//         experience: "Intermediate",
//         jobDurationType: "Full-Time",
//         workLocation: "On-Site",
//         NofVacancy: "2",
//     },
//     {
//         jobTitle: "Software Engineer",
//         description: "Develop and maintain software solutions",
//         experience: "Fresher",
//         jobDurationType: "Full-Time",
//         workLocation: "Hybrid",
//         NofVacancy: "4",
//     },
//     {
//         jobTitle: "Node.js Developer",
//         description: "Build REST APIs using Node.js technologies",
//         experience: "Beginner",
//         jobDurationType: "Full-Time",
//         workLocation: "Remote",
//         NofVacancy: "3",
//     },
//     {
//         jobTitle: "Angular Developer",
//         description: "Create enterprise web applications using Angular",
//         experience: "Intermediate",
//         jobDurationType: "Full-Time",
//         workLocation: "On-Site",
//         NofVacancy: "2",
//     },
//     {
//         jobTitle: "Cloud Engineer",
//         description: "Work with cloud platforms and infrastructure",
//         experience: "Expert",
//         jobDurationType: "Full-Time",
//         workLocation: "Remote",
//         NofVacancy: "1",
//     },
//     {
//         jobTitle: "Machine Learning Engineer",
//         description: "Develop ML models and data solutions",
//         experience: "Intermediate",
//         jobDurationType: "Full-Time",
//         workLocation: "Hybrid",
//         NofVacancy: "2",
//     },
//     {
//         jobTitle: "Data Analyst",
//         description: "Analyze data and generate business insights",
//         experience: "Beginner",
//         jobDurationType: "Part-Time",
//         workLocation: "Remote",
//         NofVacancy: "2",
//     },
//     {
//         jobTitle: "QA Engineer",
//         description: "Test applications and ensure software quality",
//         experience: "Fresher",
//         jobDurationType: "Full-Time",
//         workLocation: "On-Site",
//         NofVacancy: "3",
//     },
//     {
//         jobTitle: "Cyber Security Analyst",
//         description: "Monitor and improve application security",
//         experience: "Expert",
//         jobDurationType: "Full-Time",
//         workLocation: "Remote",
//         NofVacancy: "1",
//     },
//     {
//         jobTitle: "Technical Support Engineer",
//         description: "Provide technical assistance to customers",
//         experience: "Fresher",
//         jobDurationType: "Part-Time",
//         workLocation: "Hybrid",
//         NofVacancy: "3",
//     },
//     {
//         jobTitle: "System Administrator",
//         description: "Maintain servers and internal systems",
//         experience: "Intermediate",
//         jobDurationType: "Full-Time",
//         workLocation: "On-Site",
//         NofVacancy: "1",
//     },
//     {
//         jobTitle: "Laravel Developer",
//         description: "Develop web applications using Laravel framework",
//         experience: "Beginner",
//         jobDurationType: "Full-Time",
//         workLocation: "Remote",
//         NofVacancy: "2",
//     },
//     {
//         jobTitle: "Spring Boot Developer",
//         description: "Build backend services using Java Spring Boot",
//         experience: "Intermediate",
//         jobDurationType: "Full-Time",
//         workLocation: "Hybrid",
//         NofVacancy: "2",
//     },
//     {
//         jobTitle: "Graphic Designer",
//         description: "Create digital graphics and branding assets",
//         experience: "Beginner",
//         jobDurationType: "Part-Time",
//         workLocation: "Remote",
//         NofVacancy: "1",
//     },
//     {
//         jobTitle: "Product Manager",
//         description: "Manage product planning and execution",
//         experience: "Expert",
//         jobDurationType: "Full-Time",
//         workLocation: "Hybrid",
//         NofVacancy: "1",
//     },
//     {
//         jobTitle: "Blockchain Developer",
//         description: "Develop blockchain based applications",
//         experience: "Intermediate",
//         jobDurationType: "Full-Time",
//         workLocation: "Remote",
//         NofVacancy: "2",
//     },
//     {
//         jobTitle: "Content Writer",
//         description: "Create technical articles and documentation",
//         experience: "Fresher",
//         jobDurationType: "Part-Time",
//         workLocation: "Remote",
//         NofVacancy: "2",
//     },
//     {
//         jobTitle: "Automation Engineer",
//         description: "Create automated testing frameworks",
//         experience: "Intermediate",
//         jobDurationType: "Full-Time",
//         workLocation: "On-Site",
//         NofVacancy: "2",
//     },
//     {
//         jobTitle: "Embedded Engineer",
//         description: "Develop embedded software solutions",
//         experience: "Expert",
//         jobDurationType: "Full-Time",
//         workLocation: "On-Site",
//         NofVacancy: "1",
//     },
//     {
//         jobTitle: "Game Developer",
//         description: "Develop interactive gaming experiences",
//         experience: "Beginner",
//         jobDurationType: "Full-Time",
//         workLocation: "Hybrid",
//         NofVacancy: "2",
//     },
//     {
//         jobTitle: "Research Engineer",
//         description: "Research and develop new technologies",
//         experience: "Expert",
//         jobDurationType: "Full-Time",
//         workLocation: "Remote",
//         NofVacancy: "1",
//     },
//     {
//         jobTitle: "Web Developer",
//         description: "Create and maintain modern websites",
//         experience: "Fresher",
//         jobDurationType: "Part-Time",
//         workLocation: "Hybrid",
//         NofVacancy: "3",
//     },
// ];


// const uploadJobs = async () => {
//     try {
//         const batch = writeBatch(db);

//         const jobsRef = collection(db, "jobListings");

//         jobs.forEach((job) => {
//             const jobDoc = doc(jobsRef);

//             batch.set(jobDoc, {
//                 ...job,
//                 orgId,
//                 createdDate: "2026-07-30",
//                 updatedDate: "2026-07-30",
//                 effectiveDate: "2026-07-30",
//                 endDate: "2026-08-14",
//             });
//         });

//         await batch.commit();

//         console.log("30 jobs uploaded successfully");

//     } catch (error) {
//         console.error("Error uploading jobs:", error);
//     }
// };


// uploadJobs();