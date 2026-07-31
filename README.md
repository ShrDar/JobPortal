# Job Portal

A modern job portal application built with React and Vite, featuring separate dashboards for organizations and applicants.

## Features

### For Organizations
- User registration and login
- Job posting and management
- Applicant tracking and management
- Organization profile management
- Dashboard with job listings and applicant tracking

### For Applicants
- Job browsing and searching
- Job application functionality
- Application status tracking
- User-friendly dashboard interface
- About Us section with company information

## Technology Stack

- **Frontend**: React 18 with Vite
- **Routing**: React Router DOM v6
- **Styling**: Tailwind CSS with PostCSS
- **Backend Services**: Firebase (Firestore, Storage) and Appwrite (Storage)
- **State Management**: React Context API
- **Animations**: Framer Motion
- **Icons**: Iconify React


## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/ShrDar/JobPortal.git
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   Create a `.env` file in the root directory with the following variables:
   ```
   VITE_FIREBASE_API_KEY=your_firebase_api_key
   VITE_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
   VITE_FIREBASE_PROJECT_ID=your_firebase_project_id
   VITE_FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_firebase_messaging_sender_id
   VITE_FIREBASE_APP_ID=your_firebase_app_id
   VITE_FIREBASE_MEASUREMENT_ID=your_firebase_measurement_id
   VITE_APPWRITE_PROJECT_ID=your_appwrite_project_id
   VITE_APPWRITE_BUCKET_ID=your_appwrite_bucket_id
   ```

## Running the Application

### Development Mode
```bash
npm run dev
```

### Production Build
```bash
npm run build
npm run preview
```