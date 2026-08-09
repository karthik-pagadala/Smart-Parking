```jsx
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { motion } from 'framer-motion';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';
import toast from 'react-hot-toast';
import axios from 'axios';

const UserLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const { updateContextUser } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const trimmedEmail = email.trim();

    if (!trimmedEmail || !password) {
      toast.error('Please enter your email and password');
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post(
        'http://localhost:5001/api/auth/login',
        {
          email: trimmedEmail,
          password,
          role: 'user',
        },
        {
          withCredentials: true,
        }
      );

      const user = response.data;

      if (updateContextUser) {
        updateContextUser(user);
      }

      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('token', 'cookie-session');

      toast.success('Login successful!');
      navigate('/user/home');
    } catch (error) {
      toast.error(
        error.response?.data?.message || 'Login failed. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gray-900 p-8 rounded-2xl shadow-2xl w-full max-w-md border border-gray-800"
    >
      <h2 className="text-2xl font-bold text-white text-center mb-6">
        User Login
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="email"
            className="block text-gray-400 mb-1 text-sm"
          >
            Email
          </label>

          <div className="relative">
            <Mail className="absolute left-3 top-3 text-gray-500 w-5 h-5" />

            <input
              id="email"
              type="email"
              required
              autoComplete="email"
              className="w-full bg-gray-800 border border-gray-700 rounded-lg py-2.5 pl-10 pr-4 text-white focus:outline-none focus:border-blue-500"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
        </div>

        <div>
          <label
            htmlFor="password"
            className="block text-gray-400 mb-1 text-sm"
          >
            Password
          </label>

          <div className="relative">
            <Lock className="absolute left-3 top-3 text-gray-500 w-5 h-5" />

            <input
              id="password"
              type={showPassword ? 'text' : 'password'}
              required
              autoComplete="current-password"
              className="w-full bg-gray-800 border border-gray-700 rounded-lg py-2.5 pl-10 pr-12 text-white focus:outline-none focus:border-blue-500"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-2.5 text-gray-500 hover:text-white transition-colors"
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? (
                <EyeOff className="w-5 h-5" />
              ) : (
                <Eye className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition-colors mt-6 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>

      <p className="text-gray-400 text-center mt-6 text-sm">
        Don't have an account?{' '}
        <Link
          to="/signup"
          className="text-blue-500 hover:underline"
        >
          Sign up
        </Link>
      </p>

      <div className="mt-4 pt-4 border-t border-gray-800 text-center">
        <Link
          to="/admin/login"
          className="text-gray-500 text-sm hover:text-white transition-colors"
        >
          Admin Login
        </Link>
      </div>
    </motion.div>
  );
};

export default UserLogin;
```
