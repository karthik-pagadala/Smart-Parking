# Smart Parking System 🚗

A full-stack Smart Parking Management System designed to help users discover, book, and manage parking spaces efficiently. The platform provides real-time parking availability, secure authentication, booking management, QR verification, notifications, and administrative controls.

## Project Overview

The Smart Parking System reduces the time spent searching for parking spaces by providing a centralized platform for users, parking owners, administrators, and super administrators. The system includes role-based access control, location-based parking discovery, booking management, analytics, and secure payment integration.

## Team Members & Roles

### Tharun Vasu Sai – Frontend Developer & UI/UX Designer

* Designed user interfaces and user experience flows.
* Developed React-based frontend components.
* Implemented responsive layouts and navigation.

### Karthik Pagadala – Backend Developer & Database Engineer

* Developed REST APIs using Node.js and Express.js.
* Designed MongoDB database schemas.
* Implemented booking, parking, and notification services.

### Dharshan – QA Engineer & Deployment Specialist

* Performed testing and debugging.
* Assisted with deployment and environment configuration.
* Maintained project documentation.

## Tech Stack

### Frontend

* React.js
* Vite
* Tailwind CSS
* React Router

### Backend

* Node.js
* Express.js

### Database

* MongoDB Atlas

### Additional Services

* JWT Authentication
* Email Verification
* QR Code Verification
* Cloudinary
* Razorpay

## Project Structure

```text
Smart-Parking/
│
├── client/      # Frontend (React + Vite)
├── server/      # Backend (Node.js + Express)
├── .env.example
├── README.md
└── .gitignore
```

## Installation

### Clone the Repository

```bash
git clone https://github.com/karthik-pagadala/Smart-Parking.git
cd Smart-Parking
```

### Install Frontend Dependencies

```bash
cd client
npm install
```

### Install Backend Dependencies

```bash
cd ../server
npm install
```

## Environment Variables

Create a `.env` file inside the `server` directory:

```env
MONGODB_URI=
JWT_SECRET=
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
EMAIL_USER=
EMAIL_PASS=
RAZORPAY_KEY_ID=
RAZORPAY_KEY_SECRET=
FRONTEND_URL=http://localhost:5173
PORT=5000
```

## Running the Project

### Start Backend

```bash
cd server
npm run dev
```

Backend:

```text
http://localhost:5000
```

### Start Frontend

Open a new terminal:

```bash
cd client
npm run dev
```

Frontend:

```text
http://localhost:5173
```

## Key Features

* User Authentication
* Admin Dashboard
* Super Admin Dashboard
* Parking Slot Management
* Real-Time Booking System
* QR Code Verification
* Notification Management
* Booking History
* Analytics Dashboard
* Secure JWT Authentication

## Deployment

### Frontend

Vercel

### Backend

Render

### Database

MongoDB Atlas

## Contributors

This project was collaboratively developed by all team members as part of a Smart Parking Management solution.
