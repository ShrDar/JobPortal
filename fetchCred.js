import { db } from "./config/firebase";
import { getDocs, collection } from "firebase/firestore";

export const getInfo = async(email, password) => {
        const orgs = await getOrgs();
        const org = orgs.find(org => org.email === email && org.pass === password)
        if(org) {
            return org;
        }
        else {
            throw {
                message: 'No user with such credentials'
            }
        }
}

const orgCollectionRef = collection(db, "organization"); //reference of the collection in the firestore
export const getOrgs = async() => {
    try {
        const data = await getDocs(orgCollectionRef);
        const filteredData = data.docs.map((doc) => (
            {
                ...doc.data(), 
                id: doc.id
            }));
        return filteredData;
    } catch(err) {
        console.error(err);
    }
}

const orgTypeCollectionRef = collection(db, "orgType");
export const getOrgTypes = async() => {
    try {
        const data = await getDocs(orgTypeCollectionRef);
        const filteredData = data.docs.map((doc) => (
            {
                ...doc.data(),
                typeId: doc.id
            }))
        return filteredData;    
    } catch(err) {
        console.error(err);
    }
}