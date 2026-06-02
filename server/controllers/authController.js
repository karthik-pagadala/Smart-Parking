import User from '../models/User.js';
import Admin from '../models/Admin.js';
import generateToken from '../utils/generateToken.js';
import { sendOTPVerificationEmail } from '../utils/emailService.js';
import crypto from 'crypto';

const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

// @desc    Register a new user
// @route   POST /api/auth/register/user
export const registerUser = async (req, res) => {
  const { name, email, password, phone } = req.body;

  try {
    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ message: 'User already exists' });

    const otp = generateOTP();
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000);

    const user = await User.create({
      name, email, password, phone, otp, otpExpires
    });

    if (user) {
      try {
        await sendOTPVerificationEmail(user.email, otp);
      } catch (emailErr) {
        console.log('Email sending failed, but user created:', emailErr.message);
      }
      res.status(201).json({
        message: 'Registration successful. Please verify OTP sent to email.'
      });
    } else {
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error) {
    console.log('REGISTRATION ERROR:', error.message);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Register a new admin
// @route   POST /api/auth/register/admin
export const registerAdmin = async (req, res) => {
  const { name, email, password, phone, businessName } = req.body;

  try {
    const adminExists = await Admin.findOne({ email });
    if (adminExists) return res.status(400).json({ message: 'Admin already exists' });

    const otp = generateOTP();
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000);

    const admin = await Admin.create({
      name, email, password, phone, businessName,
      otp, otpExpires, role: 'admin', status: 'pending'
    });

    if (admin) {
      try {
        await sendOTPVerificationEmail(admin.email, otp);
      } catch (emailErr) {
        console.log('Email sending failed, but admin created:', emailErr.message);
      }
      res.status(201).json({
        message: 'Registration successful. Please verify OTP sent to email.'
      });
    } else {
      res.status(400).json({ message: 'Invalid admin data' });
    }
  } catch (error) {
    console.log('ADMIN REGISTRATION ERROR:', error.message);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Verify Email via OTP
// @route   POST /api/auth/verify-email
export const verifyEmail = async (req, res) => {
  const { email, otp, role } = req.body;

  try {
    const Model = role === 'admin' ? Admin : User;
    const account = await Model.findOne({ email });

    if (!account) return res.status(404).json({ message: 'Account not found' });
    if (account.isVerified) return res.status(400).json({ message: 'Account already verified' });
    if (account.otp !== otp) return res.status(400).json({ message: 'Invalid OTP' });
    if (account.otpExpires < new Date()) return res.status(400).json({ message: 'OTP Expired' });

    account.isVerified = true;
    account.otp = undefined;
    account.otpExpires = undefined;
    await account.save();

    generateToken(res, account._id, account.role || 'user');

    res.status(200).json({
      _id: account._id,
      name: account.name,
      email: account.email,
      role: account.role || 'user',
      isVerified: account.isVerified
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Auth user/admin & get token
// @route   POST /api/auth/login
export const login = async (req, res) => {
  const { email, password, role = 'user' } = req.body;

  try {
    // Try the model based on role first
    let Model = role === 'admin' ? Admin : User;
    let account = await Model.findOne({ email });

    // If not found and role was user, also try Admin collection
    if (!account && role !== 'admin') {
      account = await Admin.findOne({ email });
    }

    // If still not found, try User collection as fallback
    if (!account && role === 'admin') {
      account = await User.findOne({ email });
    }

    if (!account) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const isMatch = await account.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // ---- VERIFICATION CHECK DISABLED FOR DEVELOPMENT ----
    // if (!account.isVerified) {
    //   return res.status(403).json({ 
    //     message: 'Please verify your email first' 
    //   });
    // }
    // -----------------------------------------------------

    if (account.role === 'admin' && account.status === 'suspended') {
      return res.status(403).json({ message: 'Account suspended by Super Admin' });
    }

    generateToken(res, account._id, account.role || 'user');

    res.status(200).json({
      _id: account._id,
      name: account.name,
      email: account.email,
      role: account.role || 'user',
      status: account.status || 'active'
    });

  } catch (error) {
    console.log('LOGIN ERROR:', error.message);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Logout user / clear cookie
// @route   POST /api/auth/logout
export const logout = (req, res) => {
  res.cookie('jwt', '', {
    httpOnly: true,
    expires: new Date(0),
  });
  res.status(200).json({ message: 'Logged out successfully' });
};

// @desc    Get user profile
// @route   GET /api/auth/me
export const getMe = async (req, res) => {
  if (req.user) {
    res.status(200).json({
      _id: req.user._id,
      name: req.user.name,
      email: req.user.email,
      role: req.user.role,
      status: req.user.status || 'active'
    });
  } else {
    res.status(404).json({ message: 'User not found' });
  }
};