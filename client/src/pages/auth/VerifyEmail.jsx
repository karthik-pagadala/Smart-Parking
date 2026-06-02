import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { motion } from 'framer-motion';
import { KeyRound } from 'lucide-react';
import toast from 'react-hot-toast';

const VerifyEmail = () => {
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  // We don't necessarily need context here since the API call sets the cookie,
  // but we can trigger a re-fetch of the user. For simplicity, just api call and redirect.
  
  const email = location.state?.email || '';
  const role = location.state?.role || 'user';

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) {
      toast.error('Email missing. Please sign up again.');
      return;
    }
    
    setLoading(true);
    try {
      await api.post('/auth/verify-email', { email, otp, role });
      toast.success('Email verified successfully! Please log in.');
      navigate(role === 'admin' ? '/admin/login' : '/login');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Verification failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0F2C] flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gray-900 p-8 rounded-2xl shadow-2xl w-full max-w-md border border-gray-800 text-center"
      >
        <div className="flex justify-center mb-6">
          <div className="bg-yellow-500/20 p-4 rounded-full">
            <KeyRound className="text-yellow-500 w-8 h-8" />
          </div>
        </div>
        
        <h2 className="text-2xl font-bold text-white mb-2">Verify Email</h2>
        <p className="text-gray-400 mb-6 text-sm">
          We sent a 6-digit OTP to <span className="text-white">{email || 'your email'}</span>.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input 
              type="text" 
              required
              maxLength="6"
              className="w-full bg-gray-800 border border-gray-700 rounded-lg py-3 px-4 text-white text-center text-2xl tracking-[0.5em] focus:outline-none focus:border-blue-500"
              placeholder="------"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
            />
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition-colors mt-6 disabled:opacity-50"
          >
            {loading ? 'Verifying...' : 'Verify OTP'}
          </button>
        </form>
        
        <div className="mt-6 text-sm">
          <Link to="/login" className="text-gray-500 hover:text-white transition-colors">Back to Login</Link>
        </div>
      </motion.div>
    </div>
  );
};

export default VerifyEmail;
