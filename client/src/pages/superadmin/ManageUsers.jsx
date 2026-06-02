import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { Trash2, Ban, Search, ShieldCheck, User } from 'lucide-react';
import toast from 'react-hot-toast';

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        // In a real scenario we might fetch users and admins separately or combined
        const { data } = await api.get('/superadmin/users');
        setUsers(data);
      } catch (error) {
        toast.error('Failed to load users');
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  const handleAction = async (id, action, type = 'user') => {
    if (!window.confirm(`Are you sure you want to ${action} this account?`)) return;
    
    try {
      await api.put(`/superadmin/manage-account/${type}/${id}`, { action });
      toast.success(`Account ${action}ed successfully`);
      
      if (action === 'delete') {
        setUsers(users.filter(u => u._id !== id));
      } else if (action === 'suspend') {
        setUsers(users.map(u => u._id === id ? { ...u, status: 'suspended' } : u));
      }
    } catch (error) {
      toast.error(`Failed to ${action} account`);
    }
  };

  const filteredUsers = users.filter(u => 
    u.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    u.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="h-full flex flex-col">
      <header className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Manage Users</h1>
          <p className="text-gray-400">View and manage all registered user accounts</p>
        </div>
        
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-2.5 w-5 h-5 text-gray-500" />
          <input 
            type="text" 
            placeholder="Search users..."
            className="w-full bg-gray-900 border border-gray-800 rounded-lg py-2 pl-10 pr-4 text-white focus:outline-none focus:border-red-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </header>

      <div className="flex-1 bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden flex flex-col">
        {loading ? (
          <div className="p-8 text-center text-gray-400">Loading users...</div>
        ) : filteredUsers.length === 0 ? (
          <div className="p-16 text-center text-gray-500">No users found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-gray-400">
              <thead className="text-xs text-gray-500 uppercase bg-gray-800/50">
                <tr>
                  <th className="px-6 py-4 font-medium">User</th>
                  <th className="px-6 py-4 font-medium">Role</th>
                  <th className="px-6 py-4 font-medium">Status</th>
                  <th className="px-6 py-4 font-medium">Joined</th>
                  <th className="px-6 py-4 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user) => (
                  <tr key={user._id} className="border-b border-gray-800 hover:bg-gray-800/20 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 font-bold ${user.role === 'admin' ? 'bg-red-500/20 text-red-500' : 'bg-blue-500/20 text-blue-500'}`}>
                          {user.name?.charAt(0) || 'U'}
                        </div>
                        <div>
                          <div className="text-white font-medium">{user.name}</div>
                          <div className="text-xs text-gray-500">{user.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        {user.role === 'admin' ? <ShieldCheck className="w-4 h-4 mr-1 text-red-500" /> : <User className="w-4 h-4 mr-1 text-blue-500" />}
                        <span className="capitalize">{user.role}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                        user.status === 'suspended' ? 'bg-red-500/20 text-red-500' :
                        'bg-green-500/20 text-green-500'
                      }`}>
                        {user.status || 'Active'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {new Date(user.createdAt || Date.now()).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-right space-x-2">
                      <button 
                        onClick={() => handleAction(user._id, 'suspend', user.role)}
                        className="text-yellow-500 hover:text-yellow-400 p-2 hover:bg-yellow-500/10 rounded-lg transition-colors inline-flex items-center"
                        title="Suspend User"
                        disabled={user.status === 'suspended'}
                      >
                        <Ban className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => handleAction(user._id, 'delete', user.role)}
                        className="text-red-500 hover:text-red-400 p-2 hover:bg-red-500/10 rounded-lg transition-colors inline-flex items-center"
                        title="Delete User"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageUsers;
