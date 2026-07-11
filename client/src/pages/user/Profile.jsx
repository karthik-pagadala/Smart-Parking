import React from "react";
import { useAuth } from "../../context/AuthContext";
import {
  User,
  Mail,
  Phone,
  ShieldCheck,
  KeyRound,
  Calendar,
  BadgeCheck,
  Activity,
} from "lucide-react";
import { motion } from "framer-motion";

const Profile = () => {
  const { user } = useAuth();

  if (!user) return null;

  const isAdmin =
    user.role === "admin" || user.role === "superadmin";

  return (
    <div className="min-h-full max-w-6xl mx-auto px-4 pb-10">

      {/* Heading */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold text-white">
          My Profile
        </h1>
        <p className="text-gray-400 mt-1">
          View your account details and security information
        </p>
      </motion.div>

      {/* Profile Banner */}
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-700 p-8 shadow-2xl"
      >
        <div className="absolute right-0 top-0 w-72 h-72 rounded-full bg-white/10 blur-3xl"></div>
        <div className="absolute left-0 bottom-0 w-60 h-60 rounded-full bg-cyan-400/10 blur-3xl"></div>

        <div className="relative flex flex-col md:flex-row md:items-center gap-6">

          {/* Avatar */}
          <div className="relative">
            <div className="w-32 h-32 rounded-full bg-white/20 backdrop-blur-md border-4 border-white/30 flex items-center justify-center">
              <span className="text-5xl font-bold text-white">
                {user.name.charAt(0).toUpperCase()}
              </span>
            </div>

            {isAdmin && (
              <div className="absolute bottom-2 right-2 bg-red-500 p-2 rounded-full border-4 border-white">
                <ShieldCheck className="w-5 h-5 text-white" />
              </div>
            )}
          </div>

          {/* User Info */}
          <div className="text-white flex-1">
            <h2 className="text-3xl font-bold">
              {user.name}
            </h2>

            <p className="mt-2 text-blue-100">
              {user.email}
            </p>

            <div className="flex flex-wrap gap-3 mt-5">

              <span className="px-4 py-2 rounded-full bg-white/20 backdrop-blur-md text-sm capitalize">
                {user.role}
              </span>

              <span className="px-4 py-2 rounded-full bg-green-500/30 text-sm">
                {user.status || "Active"}
              </span>

            </div>
          </div>
        </div>
      </motion.div>

      {/* Stats */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: .2 }}
        className="grid md:grid-cols-3 gap-6 mt-8"
      >

        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 hover:border-blue-500 transition">
          <Activity className="w-10 h-10 text-blue-400 mb-4" />

          <h3 className="text-gray-400 text-sm">
            Account Status
          </h3>

          <p className="text-2xl font-bold text-white mt-2">
            {user.status || "Active"}
          </p>
        </div>

        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 hover:border-green-500 transition">
          <BadgeCheck className="w-10 h-10 text-green-400 mb-4" />

          <h3 className="text-gray-400 text-sm">
            User Role
          </h3>

          <p className="text-2xl font-bold text-white capitalize mt-2">
            {user.role}
          </p>
        </div>

        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 hover:border-purple-500 transition">
          <Calendar className="w-10 h-10 text-purple-400 mb-4" />

          <h3 className="text-gray-400 text-sm">
            Member Since
          </h3>

          <p className="text-2xl font-bold text-white mt-2">
            2026
          </p>
        </div>

      </motion.div>

      {/* Details */}
      <div className="grid lg:grid-cols-2 gap-8 mt-8">

        {/* Personal Info */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-gray-900 border border-gray-800 rounded-3xl p-8"
        >
          <h2 className="text-white text-xl font-semibold mb-8">
            Personal Information
          </h2>

          <div className="space-y-6">

            <div className="flex items-center bg-gray-800 rounded-xl p-4">
              <User className="text-blue-400 mr-4" />

              <div>
                <p className="text-gray-400 text-sm">
                  Full Name
                </p>

                <p className="text-white font-medium">
                  {user.name}
                </p>
              </div>
            </div>

            <div className="flex items-center bg-gray-800 rounded-xl p-4">
              <Mail className="text-green-400 mr-4" />

              <div>
                <p className="text-gray-400 text-sm">
                  Email Address
                </p>

                <p className="text-white font-medium">
                  {user.email}
                </p>
              </div>
            </div>

            <div className="flex items-center bg-gray-800 rounded-xl p-4">
              <Phone className="text-yellow-400 mr-4" />

              <div>
                <p className="text-gray-400 text-sm">
                  Phone Number
                </p>

                <p className="text-white font-medium">
                  {user.phone || "Not Provided"}
                </p>
              </div>
            </div>

          </div>
        </motion.div>

        {/* Security */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-gray-900 border border-gray-800 rounded-3xl p-8"
        >
          <h2 className="text-white text-xl font-semibold mb-8">
            Security Settings
          </h2>

          <div className="rounded-2xl border border-gray-800 bg-gray-800 p-6">

            <div className="flex items-center justify-between flex-wrap gap-5">

              <div className="flex items-center">

                <div className="bg-blue-600 p-4 rounded-xl mr-5">
                  <KeyRound className="text-white" />
                </div>

                <div>
                  <h3 className="text-white font-semibold">
                    Password
                  </h3>

                  <p className="text-gray-400 text-sm">
                    Keep your account secure by updating your password regularly.
                  </p>
                </div>

              </div>

              <button
                className="
                px-6
                py-3
                rounded-xl
                bg-gradient-to-r
                from-blue-600
                to-indigo-600
                hover:from-blue-500
                hover:to-indigo-500
                text-white
                font-semibold
                transition
                "
              >
                Change Password
              </button>

            </div>

          </div>

          <div className="mt-8 rounded-2xl bg-blue-500/10 border border-blue-500/20 p-5">

            <h3 className="text-blue-400 font-semibold mb-2">
              Security Tips
            </h3>

            <ul className="space-y-2 text-gray-300 text-sm list-disc ml-5">
              <li>Use a strong password.</li>
              <li>Never share your credentials.</li>
              <li>Update your password every few months.</li>
              <li>Logout from shared devices.</li>
            </ul>

          </div>

        </motion.div>

      </div>
    </div>
  );
};

export default Profile;