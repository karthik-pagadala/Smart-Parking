import React from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Map, Calendar, History, Bell, User, LogOut } from 'lucide-react';

const UserLayout = () => {
  const { logout, user, loading } = useAuth();
  const location = useLocation();

  const navItems = [
    { name: 'Find Parking', path: '/user/home', icon: Map },
    { name: 'My Bookings', path: '/user/my-bookings', icon: Calendar },
    { name: 'History', path: '/user/history', icon: History },
    { name: 'Notifications', path: '/user/notifications', icon: Bell },
    { name: 'Profile', path: '/user/profile', icon: User },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0A0F2C] flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0A0F2C] flex">
      {/* Sidebar Navigation */}
      <nav className="w-64 bg-gray-900 border-r border-gray-800 hidden md:flex flex-col">
        <div className="p-6">
          <h1 className="text-2xl font-bold text-white tracking-wider">
            SMART<span className="text-blue-500">PARK</span>
          </h1>
        </div>
        
        <div className="flex-1 px-4 space-y-2 mt-4">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname.includes(item.path);
            return (
              <Link
                key={item.name}
                to={item.path}
                className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-colors ${
                  isActive 
                    ? 'bg-blue-600 text-white' 
                    : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="font-medium">{item.name}</span>
              </Link>
            );
          })}
        </div>

        <div className="p-4 border-t border-gray-800">
          <div className="flex items-center space-x-3 mb-4 px-4">
            <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-500 font-bold">
              {user?.name?.charAt(0) || 'U'}
            </div>
            <div>
              <p className="text-white text-sm font-medium">{user?.name}</p>
              <p className="text-gray-500 text-xs truncate w-32">{user?.email}</p>
            </div>
          </div>
          <button 
            onClick={logout}
            className="flex items-center space-x-3 px-4 py-3 w-full text-red-400 hover:bg-red-500/10 rounded-xl transition-colors"
          >
            <LogOut className="w-5 h-5" />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Mobile Header */}
        <header className="md:hidden bg-gray-900 border-b border-gray-800 p-4 flex justify-between items-center">
          <h1 className="text-xl font-bold text-white tracking-wider">
            SMART<span className="text-blue-500">PARK</span>
          </h1>
          <button onClick={logout} className="text-red-400">
            <LogOut className="w-6 h-6" />
          </button>
        </header>

        {/* Dynamic Page Content */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8 bg-[#0A0F2C]">
          <Outlet />
        </div>
        
        {/* Mobile Bottom Nav */}
        <nav className="md:hidden bg-gray-900 border-t border-gray-800 flex justify-around p-3 pb-safe">
          {navItems.slice(0, 4).map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname.includes(item.path);
            return (
              <Link
                key={item.name}
                to={item.path}
                className={`p-2 rounded-xl transition-colors ${
                  isActive ? 'text-blue-500 bg-blue-500/10' : 'text-gray-500'
                }`}
              >
                <Icon className="w-6 h-6" />
              </Link>
            );
          })}
        </nav>
      </main>
    </div>
  );
};

export default UserLayout;
