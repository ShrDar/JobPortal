import { db } from "./config/firebase";
import { getDocs, collection } from "firebase/firestore";

//getInfo function is used to find if the email and password available matches any user in our database
export const getInfo = async(email, password) => {
        const orgs = await getOrgs(); //asyncronously calling the getOrgs function which is returning the collection of orgs in the database
        const org = orgs.find(org => org.email === email && org.pass === password) //using .find function to search for a matching user the function checks if any element of the array satisfies the condition and if it does the first element to do so gets returned and the function ends 
        if(org) { //if any organization is found
            return org;
        }
        else { //if nothing is found
            throw { //throwing an error which gets handled in the OrgLogin component
                message: 'No user with such credentials'
            }
        }
}

const orgCollectionRef = collection(db, "organization"); //reference of the collection in the firestore
//getOrgs function is used to get the collection of organization available in the database
export const getOrgs = async() => {
    try {
        const data = await getDocs(orgCollectionRef); //getting the collection from firestore
        const filteredData = data.docs.map((doc) => ( //iterating through each element in the array/collection
            {
                ...doc.data(), 
                id: doc.id
            }));
        return filteredData; //returning the collection
    } catch(err) { //catching errors
        console.error(err);
    }
}

const orgTypeCollectionRef = collection(db, "orgType"); //reference of orgType collection in the firestore
//getOrgTypes function is used to get the types of organization stored in the database
export const getOrgTypes = async() => {
    try {
        const data = await getDocs(orgTypeCollectionRef); //getting the collection from database
        const filteredData = data.docs.map((doc) => ( //iterating through each element in the collection
            {
                ...doc.data(),
                typeId: doc.id
            }))
        return filteredData; //returning the collection with additional id object(id of the document)
    } catch(err) {
        console.error(err); 
    }
}