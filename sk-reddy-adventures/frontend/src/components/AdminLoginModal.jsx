import React, { useState, useEffect } from 'react';
import { FaLock, FaUser, FaCompass, FaTimes } from 'react-icons/fa';
import { login } from '../services/api';
import Toast from './Toast';

const AdminLoginModal = ({ onClose, onSuccess }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    // Disable body scroll when open
    document.body.style.overflow = 'hidden';
    
    const handleEscape = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEscape);

    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleEscape);
    };
  }, [onClose]);

  const showToast = (message, type) => {
    setToast({ message, type });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username || !password) {
      showToast('Please fill in all fields', 'error');
      return;
    }

    setLoading(true);
    try {
      await login(username, password);
      showToast('Logged in successfully!', 'success');
      setTimeout(() => {
        onSuccess();
      }, 1000);
    } catch (error) {
      const errMsg = error.response?.data?.message || 'Login failed. Please try again.';
      showToast(errMsg, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center px-4 animate-fade-in">
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      <div className="w-full max-w-md glass p-8 md:p-10 rounded-3xl shadow-2xl border border-white/10 relative">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-gray-400 hover:text-white rounded-full transition-colors text-lg cursor-pointer"
          title="Close (Esc)"
        >
          <FaTimes />
        </button>

        {/* Header Logo */}
        <div className="text-center space-y-4 mb-8">
          <div className="inline-flex p-4 rounded-2xl bg-forest-800/85 text-white shadow-lg">
            <FaCompass className="text-3xl animate-spin-slow" />
          </div>
          <div>
            <h3 className="text-xl font-bold tracking-wider text-white">SK REDDY ADVENTURES</h3>
            <p className="text-[10px] text-forest-500 uppercase tracking-widest font-semibold mt-1">Admin Portal Access</p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider block">Username</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-gray-400">
                <FaUser className="text-xs" />
              </span>
              <input
                type="text"
                placeholder="Enter username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 pl-11 pr-4 text-white text-xs placeholder-gray-500 focus:outline-none focus:border-forest-500"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider block">Password</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-gray-400">
                <FaLock className="text-xs" />
              </span>
              <input
                type="password"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 pl-11 pr-4 text-white text-xs placeholder-gray-500 focus:outline-none focus:border-forest-500"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-forest-800 hover:bg-forest-700 text-white rounded-2xl font-bold transition-all shadow-lg border border-forest-600/30 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 text-xs uppercase tracking-wider mt-4"
          >
            {loading ? 'Authenticating...' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLoginModal;
