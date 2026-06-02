import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { motion } from 'framer-motion';
import { User, Mail, Lock, Phone, Building } from 'lucide-react';
import toast from 'react-hot-toast';

const AdminSignup = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '', phone: '', businessName: '' });
  const [loading, setLoading] = useState(false);
  const { registerAdmin } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await registerAdmin(formData);
      toast.success('Registration successful! Check your email for OTP.');
      navigate('/verify-email', { state: { email: formData.email, role: 'admin' } });
    } catch (error) {
      toast.error(error.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  return (
    <div className="min-h-screen bg-[#0A0F2C] flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gray-900 p-8 rounded-2xl shadow-2xl w-full max-w-md border border-gray-800"
      >
        <h2 className="text-2xl font-bold text-white text-center mb-6">Business Registration</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-400 mb-1 text-sm">Full Name</label>
            <div className="relative">
              <User className="absolute left-3 top-3 text-gray-500 w-5 h-5" />
              <input 
                type="text" 
                name="name"
                required
                className="w-full bg-gray-800 border border-gray-700 rounded-lg py-2.5 pl-10 pr-4 text-white focus:outline-none focus:border-blue-500"
                placeholder="Enter your name"
                value={formData.name}
                onChange={handleChange}
              />
            </div>
          </div>

          <div>
            <label className="block text-gray-400 mb-1 text-sm">Business Name</label>
            <div className="relative">
              <Building className="absolute left-3 top-3 text-gray-500 w-5 h-5" />
              <input 
                type="text" 
                name="businessName"
                required
                className="w-full bg-gray-800 border border-gray-700 rounded-lg py-2.5 pl-10 pr-4 text-white focus:outline-none focus:border-blue-500"
                placeholder="e.g. City Center Parking"
                value={formData.businessName}
                onChange={handleChange}
              />
            </div>
          </div>

          <div>
            <label className="block text-gray-400 mb-1 text-sm">Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 text-gray-500 w-5 h-5" />
              <input 
                type="email" 
                name="email"
                required
                className="w-full bg-gray-800 border border-gray-700 rounded-lg py-2.5 pl-10 pr-4 text-white focus:outline-none focus:border-blue-500"
                placeholder="Business email"
                value={formData.email}
                onChange={handleChange}
              />
            </div>
          </div>

          <div>
            <label className="block text-gray-400 mb-1 text-sm">Phone Number</label>
            <div className="relative">
              <Phone className="absolute left-3 top-3 text-gray-500 w-5 h-5" />
              <input 
                type="tel" 
                name="phone"
                className="w-full bg-gray-800 border border-gray-700 rounded-lg py-2.5 pl-10 pr-4 text-white focus:outline-none focus:border-blue-500"
                placeholder="Contact number"
                value={formData.phone}
                onChange={handleChange}
              />
            </div>
          </div>
          
          <div>
            <label className="block text-gray-400 mb-1 text-sm">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 text-gray-500 w-5 h-5" />
              <input 
                type="password" 
                name="password"
                required
                minLength="6"
                className="w-full bg-gray-800 border border-gray-700 rounded-lg py-2.5 pl-10 pr-4 text-white focus:outline-none focus:border-blue-500"
                placeholder="Create a password"
                value={formData.password}
                onChange={handleChange}
              />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition-colors mt-6 disabled:opacity-50"
          >
            {loading ? 'Submitting Application...' : 'Apply for Business Account'}
          </button>
        </form>

        <p className="text-gray-400 text-center mt-6 text-sm">
          Already registered? <Link to="/admin/login" className="text-blue-500 hover:underline">Admin Login</Link>
        </p>
      </motion.div>
    </div>
  );
};

export default AdminSignup;
