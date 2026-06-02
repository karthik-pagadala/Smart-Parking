import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { User, Mail, Phone, ShieldCheck, KeyRound } from 'lucide-react';
import { motion } from 'framer-motion';
// import api from '../../services/api';

const Profile = () => {
  const { user } = useAuth();
  
  // To handle editing, you would add state here and API put requests
  // For this implementation, we will keep it read-only to match the typical dashboard spec
  
  if (!user) return null;

  return (
    <div className="max-w-3xl mx-auto h-full pb-10">
      <header className="mb-8">
        <h1 className="text-2xl font-bold text-white">My Profile</h1>
        <p className="text-gray-400">Manage your account information and preferences</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Profile Card */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="md:col-span-1 bg-gray-900 border border-gray-800 rounded-2xl p-6 flex flex-col items-center text-center shadow-lg"
        >
          <div className="w-32 h-32 bg-blue-500/20 rounded-full flex items-center justify-center border-4 border-gray-800 mb-4 shadow-inner relative">
            <span className="text-5xl font-bold text-blue-500">{user.name.charAt(0)}</span>
            {user.role === 'admin' || user.role === 'superadmin' ? (
              <div className="absolute bottom-0 right-0 bg-red-500 p-2 rounded-full border-4 border-gray-900">
                <ShieldCheck className="w-4 h-4 text-white" />
              </div>
            ) : null}
          </div>
          <h2 className="text-xl font-bold text-white mb-1">{user.name}</h2>
          <p className="text-blue-500 font-medium text-sm capitalize bg-blue-500/10 px-3 py-1 rounded-full">{user.role}</p>
          
          <div className="w-full mt-6 pt-6 border-t border-gray-800">
            <div className="flex justify-between items-center mb-4">
              <span className="text-gray-400 text-sm">Status</span>
              <span className="bg-green-500/20 text-green-500 text-xs font-bold px-2 py-1 rounded-md capitalize">
                {user.status || 'Active'}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-400 text-sm">Member Since</span>
              <span className="text-white font-medium text-sm">2026</span>
            </div>
          </div>
        </motion.div>

        {/* Details Card */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="md:col-span-2 bg-gray-900 border border-gray-800 rounded-2xl p-6 shadow-lg"
        >
          <h3 className="text-lg font-bold text-white mb-6 flex items-center">
            <User className="w-5 h-5 mr-2 text-blue-500" /> Personal Information
          </h3>
          
          <div className="space-y-6">
            <div>
              <label className="block text-gray-500 text-xs uppercase tracking-wider mb-2">Full Name</label>
              <div className="bg-gray-800/50 border border-gray-800 rounded-xl px-4 py-3 flex items-center">
                <User className="w-5 h-5 text-gray-500 mr-3" />
                <span className="text-white font-medium">{user.name}</span>
              </div>
            </div>
            
            <div>
              <label className="block text-gray-500 text-xs uppercase tracking-wider mb-2">Email Address</label>
              <div className="bg-gray-800/50 border border-gray-800 rounded-xl px-4 py-3 flex items-center">
                <Mail className="w-5 h-5 text-gray-500 mr-3" />
                <span className="text-white font-medium">{user.email}</span>
              </div>
            </div>

            <div>
              <label className="block text-gray-500 text-xs uppercase tracking-wider mb-2">Phone Number</label>
              <div className="bg-gray-800/50 border border-gray-800 rounded-xl px-4 py-3 flex items-center">
                <Phone className="w-5 h-5 text-gray-500 mr-3" />
                <span className="text-white font-medium">{user.phone || 'Not provided'}</span>
              </div>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-gray-800">
            <h3 className="text-lg font-bold text-white mb-6 flex items-center">
              <KeyRound className="w-5 h-5 mr-2 text-blue-500" /> Security
            </h3>
            <button className="bg-gray-800 hover:bg-gray-700 text-white border border-gray-700 px-5 py-2.5 rounded-xl font-medium transition-colors text-sm w-full sm:w-auto">
              Change Password
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Profile;
