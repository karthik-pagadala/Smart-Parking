import React from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { ShieldAlert, Users, PieChart, LogOut } from 'lucide-react';

const SuperAdminLayout = () => {
  const { logout, user } = useAuth();
  const location = useLocation();

  const navItems = [
    { name: 'Analytics', path: '/superadmin/analytics', icon: PieChart },
    { name: 'Verify Parkings', path: '/superadmin/verify-parkings', icon: ShieldAlert },
    { name: 'Manage Users', path: '/superadmin/manage-users', icon: Users },
  ];

  return (
    <div className="min-h-screen bg-[#0A0F2C] flex">
      {/* Sidebar Navigation */}
      <nav className="w-64 bg-gray-900 border-r border-gray-800 hidden md:flex flex-col">
        <div className="p-6">
          <h1 className="text-2xl font-bold text-white tracking-wider">
            SUPER<span className="text-red-500">ADMIN</span>
          </h1>
          <p className="text-xs text-gray-500 mt-1 uppercase tracking-widest font-semibold">System Control</p>
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
                    ? 'bg-red-600 text-white' 
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
            <div className="w-10 h-10 rounded-full bg-red-500/20 flex items-center justify-center text-red-500 font-bold">
              SA
            </div>
            <div>
              <p className="text-white text-sm font-medium">{user?.name || 'Super Admin'}</p>
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
            SUPER<span className="text-red-500">ADMIN</span>
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
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname.includes(item.path);
            return (
              <Link
                key={item.name}
                to={item.path}
                className={`p-2 rounded-xl transition-colors ${
                  isActive ? 'text-red-500 bg-red-500/10' : 'text-gray-500'
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

export default SuperAdminLayout;
