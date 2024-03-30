import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyCFB31IxRsWFzTXbrYoBSl8mAI8M5nBe3I",
  authDomain: "jobportal-1ce6b.firebaseapp.com",
  projectId: "jobportal-1ce6b",
  storageBucket: "jobportal-1ce6b.appspot.com",
  messagingSenderId: "1033673434622",
  appId: "1:1033673434622:web:c1ec49394d06a55e604caf",
  measurementId: "G-Y7BNX7TM6J"
};
//const analytics = getAnalytics(app);

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const storage = getStorage(app);