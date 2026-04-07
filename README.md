# 🚀 JobConnect - Full-Stack MERN Job Portal

JobConnect is a professional web application built using the MERN stack. It provides a robust platform for **Employers** to post jobs and manage applications, and for **Job Seekers** to browse and apply for opportunities with a cloud-stored resume.

---

## 🏗️ System Architecture

- **Frontend**: React.js (Vite), Tailwind CSS, Axios
- **Backend**: Node.js, Express.js
- **Database**: MongoDB (Mongoose ODM)
- **Security**: JWT (JSON Web Tokens) & Bcrypt Password Hashing
- **Cloud Storage**: Cloudinary (for Resumes and Images)

---

## ✨ Key Features

### 👤 User Authentication
- Secure **Register/Login** for two distinct roles: `Employer` and `Job Seeker`.
- Role-based Access Control (RBAC) to protect sensitive routes.

### 💼 Job Management (Employers)
- **Post Jobs**: Integrated form for detailed job descriptions, categories, and salary ranges.
- **My Jobs**: Dashboard to edit or delete existing job postings.
- **Application Tracking**: View all applicants for a specific job, including their cover letters and resumes.

### 🔍 Search & Apply (Job Seekers)
- **Browse Jobs**: Search by title, location, or category.
- **Cloud Resume Upload**: Direct integration with Cloudinary to store and serve PDF/Image resumes.
- **Apply Flow**: Real-time application submission with "Already Applied" status tracking.

---

## 🛠️ Installation & Setup

### Prerequisites
- Node.js (v18+)
- MongoDB Atlas Account
- Cloudinary Account

### 1. Backend Setup
1. Navigate to the `server` directory:
   ```bash
   cd server
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Configure your environment in `config/config.env`.

### 2. Frontend Setup
1. Navigate to the `client` directory:
   ```bash
   cd client
   ```
2. Install dependencies:
   ```bash
   npm install
   ```

### 3. Run the Application
Start both servers simultaneously:
- **Backend**: `npm run dev` (Runs on Port 4000)
- **Frontend**: `npm run dev` (Runs on Port 5173)

---

## 🔒 Backend 
- **Middleware**: Custom `isAuthenticated` middleware for session security.
- **Error Handling**: Centralized error middleware using a custom `ErrorHandler` class.
- **Cloud Integration**: Smooth handling of multi-part form data for file uploads via `cloudinary`.

---


## 👤 Project Developed By
- **Kunal Prasad**

© 2026 JobConnect Project.
