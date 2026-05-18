# Carbon Emission Monitoring & Sustainability Tracking Platform

**Prepared For:** Rajasthan State Pollution Control Board  
**Developed By:** Digital Hammerr / Manav Bhati  

## 🚀 Overview
An enterprise-grade government environmental intelligence platform built with the MERN Stack. It tracks electricity and vehicle-based CO2 savings, provides cinematic visual analytics, and manages factory submissions.

## 🏗️ Architecture

### Frontend (Client)
- **Framework:** React + Vite
- **Styling:** Tailwind CSS + Framer Motion + Glassmorphism
- **Routing:** React Router DOM
- **Charts:** Recharts
- **Icons:** Lucide React
- **Location:** `/client`

### Backend (Server)
- **Framework:** Node.js + Express.js
- **Database:** MongoDB + Mongoose
- **Security:** Helmet.js, Express Rate Limit, bcrypt, JWT
- **Location:** `/backend`

## ⚙️ Installation & Running

### 1. Backend Setup
```bash
cd backend
npm install
# Set up your .env file with MONGO_URI and JWT_SECRET
npm start
```
*Backend will run on http://localhost:5000*

### 2. Frontend Setup
```bash
cd client
npm install
npm run dev
```
*Frontend will run on http://localhost:5173*

## 🌟 Key Features Developed
- **Cinematic Landing Page:** Apple-level premium UI with scroll animations and glassmorphism.
- **Calculators:** Electricity and Vehicle Carbon Saving Calculators.
- **Database Schema:** Full MongoDB Mongoose schemas for Users, Factories, and Records.
- **Enterprise Backend:** Security middleware, clean routes, and scalable architecture.
- **Government Branding:** Tailored for Rajasthan State Pollution Control Board.

## 📈 Future Scaling
- Integrate GridFS for file uploads (PDFs, Excel).
- Implement fully-functional Twilio SMS OTP.
- Build out the admin panel analytics using MongoDB Aggregation pipelines.
- Deploy frontend to Vercel and backend to Render.
