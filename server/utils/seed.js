import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import bcrypt from 'bcryptjs';

import User from '../models/User.js';
import Admin from '../models/Admin.js';
import Parking from '../models/Parking.js';
import Booking from '../models/Booking.js';
import Review from '../models/Review.js';
import Notification from '../models/Notification.js';
import SlotLock from '../models/SlotLock.js';
import connectDB from '../config/db.js';

// ======================================================
// FIX __dirname FOR ES MODULES
// ======================================================

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ======================================================
// LOAD ENV VARIABLES
// ======================================================

dotenv.config({
  path: path.resolve(__dirname, '../.env')
});

// ======================================================
// DEBUG ENV
// ======================================================

console.log(
  'Mongo URI:',
  process.env.MONGODB_URI ? 'Loaded ✅' : 'Missing ❌'
);

// ======================================================
// VIJAYAWADA SAMPLE LOCATIONS
// ======================================================

const locations = [
  {
    lat: 16.5062,
    lng: 80.6480,
    name: 'PVP Mall Parking',
    address: 'MG Road, Vijayawada'
  },
  {
    lat: 16.5150,
    lng: 80.6300,
    name: 'Benz Circle Multi-level',
    address: 'Benz Circle, Vijayawada'
  },
  {
    lat: 16.5100,
    lng: 80.6100,
    name: 'Bhavanipuram Safe Park',
    address: 'Bhavanipuram, Vijayawada'
  }
];

// ======================================================
// SEED FUNCTION
// ======================================================

const seedData = async () => {
  try {
    // ======================================================
    // CHECK MONGODB URI
    // ======================================================

    if (!process.env.MONGODB_URI) {
      throw new Error(
        'MONGODB_URI is not defined. Check your .env file path.'
      );
    }

    // ======================================================
    // CONNECT DATABASE
    // ======================================================

    await connectDB();

    console.log('✅ MongoDB Connected');

    // ======================================================
    // HASH PASSWORD
    // ======================================================

    const hashedPassword = await bcrypt.hash('password123', 10);

    // ======================================================
    // CLEAR OLD DATA
    // ======================================================

    console.log('🗑️ Clearing old data...');

    await Promise.all([
      User.deleteMany({}),
      Admin.deleteMany({}),
      Parking.deleteMany({}),
      Booking.deleteMany({}),
      Review.deleteMany({}),
      Notification.deleteMany({}),
      SlotLock.deleteMany({})
    ]);

    // ======================================================
    // CREATE USERS
    // ======================================================

    console.log('👤 Creating Users...');

    const users = await User.insertMany([
      {
        name: 'Rahul Kumar',
        email: 'rahul@example.com',
        password: hashedPassword,
        phone: '9876543210',
        role: 'user',
        isVerified: true
      },
      {
        name: 'Sneha Reddy',
        email: 'sneha@example.com',
        password: hashedPassword,
        phone: '9876543211',
        role: 'user',
        isVerified: true
      },
      {
        name: 'Vikram Singh',
        email: 'vikram@example.com',
        password: hashedPassword,
        phone: '9876543212',
        role: 'user',
        isVerified: true
      },
      {
        name: 'John Doe',
        email: 'john@example.com',
        password: hashedPassword,
        phone: '9876543213',
        role: 'user',
        isVerified: true
      }
    ]);

    // ======================================================
    // CREATE ADMINS
    // ======================================================

    console.log('🛡️ Creating Admins...');

    const admins = await Admin.insertMany([
      {
        name: 'Admin One',
        email: 'admin1@example.com',
        password: hashedPassword,
        phone: '9000000001',
        role: 'admin',
        status: 'approved',
        businessName: 'PVP Parking Services',
        isVerified: true
      },
      {
        name: 'Admin Two',
        email: 'admin2@example.com',
        password: hashedPassword,
        phone: '9000000002',
        role: 'admin',
        status: 'approved',
        businessName: 'Benz Secure Parking',
        isVerified: true
      },
      {
        name: 'Admin Three',
        email: 'admin3@example.com',
        password: hashedPassword,
        phone: '9000000003',
        role: 'admin',
        status: 'approved',
        businessName: 'Bhavani Parks',
        isVerified: true
      },
      {
        name: 'Super Admin',
        email: 'superadmin@smartparking.com',
        password: hashedPassword,
        phone: '9000000000',
        role: 'superadmin',
        status: 'approved',
        businessName: 'Smart Parking HQ',
        isVerified: true
      }
    ]);

    // ======================================================
    // CREATE PARKINGS
    // ======================================================

    console.log('🅿️ Creating Parking Locations...');

    const parkings = await Parking.insertMany([
      {
        adminId: admins[0]._id,
        name: locations[0].name,
        address: locations[0].address,
        location: {
          lat: locations[0].lat,
          lng: locations[0].lng
        },
        totalSlots: 50,
        activeSlots: 50,
        pricing: {
          car: 40,
          bike: 15,
          heavy: 100
        },
        timings: {
          open: '06:00',
          close: '23:00'
        },
        rating: 4.5,
        reviewCount: 12
      },
      {
        adminId: admins[1]._id,
        name: locations[1].name,
        address: locations[1].address,
        location: {
          lat: locations[1].lat,
          lng: locations[1].lng
        },
        totalSlots: 30,
        activeSlots: 25,
        pricing: {
          car: 50,
          bike: 20,
          heavy: 120
        },
        timings: {
          open: '00:00',
          close: '23:59'
        },
        hasEVCharging: true,
        rating: 4.8,
        reviewCount: 30
      },
      {
        adminId: admins[2]._id,
        name: locations[2].name,
        address: locations[2].address,
        location: {
          lat: locations[2].lat,
          lng: locations[2].lng
        },
        totalSlots: 100,
        activeSlots: 100,
        pricing: {
          car: 30,
          bike: 10,
          heavy: 80
        },
        timings: {
          open: '08:00',
          close: '22:00'
        },
        rating: 4.0,
        reviewCount: 5
      }
    ]);

    // ======================================================
    // CREATE BOOKINGS
    // ======================================================

    console.log('📅 Creating Bookings...');

    const bookings = [];

    for (let i = 0; i < 10; i++) {
      const user = users[i % 4];
      const parking = parkings[i % 3];

      bookings.push({
        userId: user._id,
        parkingId: parking._id,
        adminId: parking.adminId,
        slotNumber: `A-${i + 1}`,
        date: new Date(),
        startTime: '10:00',
        endTime: '12:00',
        vehicleType: 'car',
        vehicleNumber: `AP16AB${1000 + i}`,
        totalPrice: parking.pricing.car * 2,
        bookingStatus:
          i % 2 === 0 ? 'Completed' : 'Approved',
        paymentStatus: 'Paid'
      });
    }

    await Booking.insertMany(bookings);

    // ======================================================
    // CREATE REVIEWS
    // ======================================================

    console.log('⭐ Creating Reviews...');

    await Review.insertMany([
      {
        userId: users[0]._id,
        parkingId: parkings[0]._id,
        rating: 5,
        comment: 'Great parking spot!'
      },
      {
        userId: users[1]._id,
        parkingId: parkings[1]._id,
        rating: 4,
        comment: 'Good, but slightly expensive.'
      },
      {
        userId: users[2]._id,
        parkingId: parkings[2]._id,
        rating: 4,
        comment: 'Spacious slots.'
      }
    ]);

    // ======================================================
    // CREATE NOTIFICATIONS
    // ======================================================

    console.log('🔔 Creating Notifications...');

    await Notification.insertMany([
      {
        recipientId: users[0]._id,
        recipientModel: 'User',
        title: 'Welcome',
        message: 'Welcome to Smart Parking!'
      },
      {
        recipientId: admins[0]._id,
        recipientModel: 'Admin',
        title: 'Account Approved',
        message: 'Your admin account is approved.'
      }
    ]);

    // ======================================================
    // SUCCESS LOGS
    // ======================================================

    console.log('\n===================================');
    console.log('✅ Dummy Data Seeded Successfully!');
    console.log('===================================');

    console.log('\n🔐 TEST CREDENTIALS\n');

    console.log('👤 USER');
    console.log('Email: john@example.com');
    console.log('Password: password123\n');

    console.log('🛡️ ADMIN');
    console.log('Email: admin1@example.com');
    console.log('Password: password123\n');

    console.log('⚡ SUPER ADMIN');
    console.log('Email: superadmin@smartparking.com');
    console.log('Password: password123\n');

    console.log('===================================\n');

    process.exit(0);
  } catch (error) {
    console.error('\n❌ Error seeding data:\n');
    console.error(error);

    process.exit(1);
  }
};

// ======================================================
// RUN SEED
// ======================================================

seedData();