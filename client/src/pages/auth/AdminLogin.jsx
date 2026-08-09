import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { motion } from 'framer-motion';
import { ShieldCheck, Mail, Lock } from 'lucide-react';
import toast from 'react-hot-toast';

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // We pass 'admin' to the login function so the backend checks the Admin model
      const data = await login(email, password, 'admin');
      toast.success('Admin Login successful!');

      if (data.role === 'superadmin') {
        navigate('/superadmin/analytics');
      } else {
        navigate('/admin/dashboard');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0F2C] flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gray-900 p-8 rounded-2xl shadow-2xl w-full max-w-md border border-gray-800 hover:border-red-500/40 transition-all duration-300"
      >
        <div className="flex justify-center mb-8">
          <div className="bg-red-500/20 p-4 rounded-full">
            <ShieldCheck className="text-red-500 w-8 h-8" />
          </div>
        </div>

        <h2 className="text-3xl font-bold text-white text-center mb-2">
          Admin &amp; Super Admin Login
        </h2>

        <p className="text-center text-gray-400 text-sm mb-6">
          Secure access for administrators
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-400 mb-1 text-sm">Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 text-gray-500 w-5 h-5" />
              <input
                type="email"
                required
                className="w-full bg-gray-800 border border-gray-700 rounded-lg py-2.5 pl-10 pr-4 text-white transition-all duration-200 focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/20"
                placeholder="Enter admin email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          <div>
            <label className="block text-gray-400 mb-1 text-sm">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 text-gray-500 w-5 h-5" />
              <input
                type="password"
                required
                className="w-full bg-gray-800 border border-gray-700 rounded-lg py-2.5 pl-10 pr-4 text-white transition-all duration-200 focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/20"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-red-600 hover:bg-red-700 hover:shadow-lg hover:shadow-red-500/20 text-white font-semibold py-3 rounded-lg transition-all duration-300 mt-6 disabled:opacity-50"
          >
            {loading ? 'Logging in...' : 'Login to Dashboard'}
          </button>
        </form>

        <div className="mt-6 text-center text-sm">
          <Link
            to="/login"
            className="text-gray-500 hover:text-red-400 transition-colors duration-200"
          >
            Back to User Login
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default AdminLogin;