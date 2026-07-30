import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyC5NsVg8e3JoqJo3Ktcz8J7tUREeXduXI4",
  authDomain: "job-portal-37943.firebaseapp.com",
  projectId: "job-portal-37943",
  storageBucket: "job-portal-37943.firebasestorage.app",
  messagingSenderId: "262407103082",
  appId: "1:262407103082:web:5a4f66302d3a887099a013",
  measurementId: "G-GMRPHNWN1T"
};
//const analytics = getAnalytics(app);

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const storage = getStorage(app);