# Smart Parking Platform

A complete full-stack web application designed for modern urban parking management. This platform features a User Dashboard to find and book parking spots, an Admin Dashboard to manage slots and earnings, and a Super Admin Dashboard for platform-wide analytics and verification.

## Core Features
* **Real-time Availability:** Live slot tracking using Socket.io and React-Leaflet maps.
* **Geospatial Search:** OpenStreetMap (Nominatim) integration for location discovery.
* **Secure Payments:** Integrated with Razorpay.
* **Smart Access:** QR Code generation (`qrcode.react`) and admin scanning for entry/exit.
* **Automated Notifications:** Email reminders via Nodemailer and `node-cron`.
* **Rich UI:** Built with React, Vite, Tailwind CSS, and Framer Motion.
* **PDF Receipts:** Automated invoice generation using `jspdf`.

## Environment Variables

To run this project locally, you will need to add the following environment variables to your `.env` file in the root directory:

* `MONGODB_URI`: Your MongoDB connection string (e.g., MongoDB Atlas or local).
* `JWT_SECRET`: A secure random string for signing JSON Web Tokens.
* `CLOUDINARY_CLOUD_NAME`: Your Cloudinary cloud name for image uploads.
* `CLOUDINARY_API_KEY`: Cloudinary API Key.
* `CLOUDINARY_API_SECRET`: Cloudinary API Secret.
* `EMAIL_USER`: Gmail address for Nodemailer.
* `EMAIL_PASS`: Gmail App Password for Nodemailer.
* `RAZORPAY_KEY_ID`: Your Razorpay Key ID for payments.
* `RAZORPAY_KEY_SECRET`: Your Razorpay Key Secret.
* `FRONTEND_URL`: URL of the frontend (default: `http://localhost:3000`).
* `PORT`: Backend port (default: `5000`).

## Setup Instructions

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd smart-parking
   ```

2. **Install Dependencies:**
   ```bash
   # Install backend dependencies
   cd server
   npm install

   # Install frontend dependencies
   cd ../client
   npm install --legacy-peer-deps
   ```

3. **Database Seeding (Optional):**
   To populate the database with dummy users, admins, and parkings located in Vijayawada:
   ```bash
   cd server
   node utils/seed.js
   ```

4. **Run the Application:**
   ```bash
   # Terminal 1: Run the backend server
   cd server
   npm run dev

   # Terminal 2: Run the frontend client
   cd client
   npm run dev
   ```

## Deployment Steps

### Frontend (Vercel)
1. Push your code to GitHub.
2. Import the project into Vercel.
3. Set the Root Directory to `client`.
4. Framework Preset will be automatically detected as Vite.
5. Add the `VITE_API_URL` environment variable pointing to your deployed Render backend URL.
6. A `vercel.json` file is already included to handle React Router fallbacks.

### Backend (Render)
1. Create a new Web Service on Render and connect your GitHub repository.
2. Set the Root Directory to `server`.
3. Build Command: `npm install`
4. Start Command: `npm start`
5. Add all the environment variables listed above in the Render dashboard. Make sure `FRONTEND_URL` is set to your deployed Vercel URL to prevent CORS errors.

## API Documentation Structure

* **Auth Routes (`/api/auth`)**: Register, Login, Email Verification.
* **Parking Routes (`/api/parking`)**: CRUD operations with Cloudinary image uploads and Geospatial search.
* **Booking Routes (`/api/booking`)**: Create, Approve, Reject, Cancel, and History fetch.
* **Slot Routes (`/api/slots`)**: Socket-driven locking (`/lock`, `/release`) with 5-minute auto-expiration.
* **Payment Routes (`/api/payment`)**: Razorpay Order Creation and Signature Verification.
* **Super Admin (`/api/superadmin`)**: Platform analytics and business verification routes.
