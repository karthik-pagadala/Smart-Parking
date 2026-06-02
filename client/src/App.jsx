import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

// Public Pages
import Landing from './pages/public/Landing';
import UserLogin from './pages/auth/UserLogin';
import UserSignup from './pages/auth/UserSignup';
import AdminLogin from './pages/auth/AdminLogin';
import AdminSignup from './pages/auth/AdminSignup';
import VerifyEmail from './pages/auth/VerifyEmail';
import Home from './pages/user/Home';
import BookingPage from './pages/user/BookingPage';
import MyBookings from './pages/user/MyBookings';
import History from './pages/user/History';
import Notifications from './pages/user/Notifications';
import Profile from './pages/user/Profile';

import Dashboard from './pages/admin/Dashboard';
import AddParking from './pages/admin/AddParking';
import ManageSlots from './pages/admin/ManageSlots';
import BookingRequests from './pages/admin/BookingRequests';
import Earnings from './pages/admin/Earnings';

import Analytics from './pages/superadmin/Analytics';
import VerifyParkings from './pages/superadmin/VerifyParkings';
import ManageUsers from './pages/superadmin/ManageUsers';

// Layouts
import UserLayout from './components/layouts/UserLayout';
import AdminLayout from './components/layouts/AdminLayout';
import SuperAdminLayout from './components/layouts/SuperAdminLayout';

// Placeholder for future pages until implemented
const Placeholder = ({ title }) => <div className="p-8 text-white"><h2>{title}</h2><p>Coming soon...</p></div>;

function App() {
  return (
    <AuthProvider>
      <Router>
        <Toaster position="top-right" toastOptions={{
          style: {
            background: '#1F2937',
            color: '#fff',
          },
        }} />
        
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<UserLogin />} />
          <Route path="/signup" element={<UserSignup />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin/signup" element={<AdminSignup />} />
          <Route path="/verify-email" element={<VerifyEmail />} />

          {/* User Routes */}
          <Route path="/user" element={<ProtectedRoute allowedRoles={['user']}><UserLayout /></ProtectedRoute>}>
            <Route path="home" element={<Home />} />
            <Route path="booking/:id" element={<BookingPage />} />
            <Route path="my-bookings" element={<MyBookings />} />
            <Route path="history" element={<History />} />
            <Route path="notifications" element={<Notifications />} />
            <Route path="profile" element={<Profile />} />
          </Route>

          {/* Admin Routes */}
          <Route element={<ProtectedRoute allowedRoles={['admin', 'superadmin']}><AdminLayout /></ProtectedRoute>}>
            <Route path="/admin/dashboard" element={<Dashboard />} />
            <Route path="/admin/add-parking" element={<AddParking />} />
            <Route path="/admin/manage-slots" element={<ManageSlots />} />
            <Route path="/admin/booking-requests" element={<BookingRequests />} />
            <Route path="/admin/earnings" element={<Earnings />} />
            <Route path="/admin/profile" element={<Profile />} />
          </Route>
          
          {/* Super Admin Routes */}
          <Route element={<ProtectedRoute allowedRoles={['superadmin']}><SuperAdminLayout /></ProtectedRoute>}>
            <Route path="/superadmin/analytics" element={<Analytics />} />
            <Route path="/superadmin/verify-parkings" element={<VerifyParkings />} />
            <Route path="/superadmin/manage-users" element={<ManageUsers />} />
          </Route>

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
