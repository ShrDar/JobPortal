import { Client, Storage } from "appwrite"

const client = new Client()
    .setEndpoint('https://sgp.cloud.appwrite.io/v1')  
    .setProject(import.meta.env.VITE_APPWRITE_PROJECT_ID)      

export const storage = new Storage(client)

export const BUCKET_ID = import.meta.env.VITE_APPWRITE_BUCKET_ID