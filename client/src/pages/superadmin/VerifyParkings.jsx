import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { Check, X, Building, ShieldAlert, Phone, Mail } from 'lucide-react';
import toast from 'react-hot-toast';

const VerifyParkings = () => {
  const [pendingAdmins, setPendingAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [rejectingId, setRejectingId] = useState(null);
  const [rejectionReason, setRejectionReason] = useState('');

  useEffect(() => {
    const fetchPending = async () => {
      try {
        const { data } = await api.get('/superadmin/pending-admins');
        setPendingAdmins(data);
      } catch (error) {
        toast.error('Failed to load pending admins');
      } finally {
        setLoading(false);
      }
    };
    fetchPending();
  }, []);

  const handleVerify = async (id, status) => {
    if (status === 'rejected' && !rejectionReason.trim()) {
      return toast.error('Please provide a reason for rejection');
    }

    try {
      await api.put(`/superadmin/verify-admin/${id}`, { status, rejectionReason });
      toast.success(`Admin ${status} successfully`);
      setPendingAdmins(pendingAdmins.filter(admin => admin._id !== id));
      setRejectingId(null);
      setRejectionReason('');
    } catch (error) {
      toast.error('Verification update failed');
    }
  };

  if (loading) return <div className="p-8 text-white">Loading pending verifications...</div>;

  return (
    <div className="h-full flex flex-col">
      <header className="mb-6">
        <h1 className="text-2xl font-bold text-white">Verify Admin Accounts</h1>
        <p className="text-gray-400">Review business registrations before they can add parking spaces</p>
      </header>

      {pendingAdmins.length === 0 ? (
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-16 text-center flex flex-col items-center justify-center">
          <ShieldAlert className="w-16 h-16 text-gray-800 mb-4" />
          <h3 className="text-xl font-bold text-white mb-2">No Pending Verifications</h3>
          <p className="text-gray-500">All admin business accounts have been reviewed.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {pendingAdmins.map((admin) => (
            <div key={admin._id} className="bg-gray-900 border border-gray-800 rounded-2xl p-6 flex flex-col">
              <div className="flex justify-between items-start mb-6 pb-6 border-b border-gray-800">
                <div className="flex items-center">
                  <div className="w-12 h-12 rounded-xl bg-red-500/20 flex items-center justify-center text-red-500 mr-4">
                    <Building className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white">{admin.businessName}</h3>
                    <p className="text-gray-400 text-sm">{admin.name}</p>
                  </div>
                </div>
                <span className="bg-yellow-500/20 text-yellow-500 text-xs font-bold px-3 py-1 rounded-full border border-yellow-500/30">
                  PENDING REVIEW
                </span>
              </div>

              <div className="space-y-3 mb-6 flex-1">
                <div className="flex items-center text-gray-300 bg-gray-800/50 p-3 rounded-lg">
                  <Mail className="w-4 h-4 mr-3 text-gray-500" /> {admin.email}
                </div>
                <div className="flex items-center text-gray-300 bg-gray-800/50 p-3 rounded-lg">
                  <Phone className="w-4 h-4 mr-3 text-gray-500" /> {admin.phone || 'Not provided'}
                </div>
                {/* Normally we would map business documents here from admin.businessDocuments array */}
                <div className="bg-gray-800/30 border border-gray-700 border-dashed rounded-lg p-4 text-center">
                  <p className="text-gray-500 text-sm">Business Documents Attached</p>
                  <button className="text-blue-500 text-sm font-medium mt-1 hover:underline">View Document (PDF)</button>
                </div>
              </div>

              <div className="pt-4 border-t border-gray-800">
                {rejectingId === admin._id ? (
                  <div className="space-y-3">
                    <input 
                      type="text" 
                      placeholder="Reason for rejection (sent to admin)..." 
                      className="w-full bg-gray-800 border border-gray-700 rounded-lg py-2 px-3 text-white text-sm focus:outline-none focus:border-red-500"
                      value={rejectionReason}
                      onChange={(e) => setRejectionReason(e.target.value)}
                      autoFocus
                    />
                    <div className="flex space-x-2">
                      <button 
                        onClick={() => handleVerify(admin._id, 'rejected')}
                        className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 rounded-lg text-sm font-semibold transition-colors"
                      >
                        Confirm Reject
                      </button>
                      <button 
                        onClick={() => { setRejectingId(null); setRejectionReason(''); }}
                        className="flex-1 bg-gray-700 hover:bg-gray-600 text-white py-2 rounded-lg text-sm font-semibold transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex space-x-3">
                    <button 
                      onClick={() => handleVerify(admin._id, 'approved')}
                      className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2.5 rounded-lg text-sm font-semibold transition-colors flex justify-center items-center"
                    >
                      <Check className="w-4 h-4 mr-2" /> Approve Business
                    </button>
                    <button 
                      onClick={() => setRejectingId(admin._id)}
                      className="flex-1 bg-gray-800 hover:bg-red-500/20 text-gray-300 hover:text-red-400 py-2.5 rounded-lg text-sm font-semibold transition-colors border border-gray-700 hover:border-red-500/50 flex justify-center items-center"
                    >
                      <X className="w-4 h-4 mr-2" /> Reject
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default VerifyParkings;
