import { Client, Storage } from "appwrite"

const client = new Client()
    .setEndpoint('https://sgp.cloud.appwrite.io/v1')  
    .setProject('6a6b05be00369ce71f6e')      

export const storage = new Storage(client)

export const BUCKET_ID = '6a6b07e9002e4a57f152'