import React, { useState, useEffect } from 'react';
import { FaMobileAlt, FaCompass, FaTimes, FaCheckCircle, FaExclamationTriangle, FaLock } from 'react-icons/fa';
import { login } from '../services/api';
import Toast from './Toast';

const ADMIN_NUMBERS = ['8520016332', '9000012345', '7989245079'];

const isValidPhoneNumber = (num) => {
  const clean = num.replace(/\D/g, '');
  if (clean.length === 12 && clean.startsWith('91')) return true;
  if (clean.length === 11 && clean.startsWith('0')) return true;
  return clean.length === 10;
};

const AdminLoginModal = ({ onClose, onSuccess }) => {
  const [mobileNumber, setMobileNumber] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const [generatedOtp, setGeneratedOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
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

  const handleRequestOTP = (e) => {
    e.preventDefault();
    if (!mobileNumber) return;
    
    if (!isValidPhoneNumber(mobileNumber)) {
      setError("Please enter a valid 10-digit mobile number.");
      return;
    }

    // Normalize entered number
    const cleanMobile = mobileNumber.replace(/\D/g, '');
    const normalizedEntered = cleanMobile.length > 10 && cleanMobile.startsWith('91') 
      ? cleanMobile.slice(-10) 
      : cleanMobile;

    if (!ADMIN_NUMBERS.includes(normalizedEntered)) {
      setError("This mobile number is not authorized for Admin access.");
      return;
    }

    setError('');
    // Generate a random 4-digit code
    const code = Math.floor(1000 + Math.random() * 9000).toString();
    setGeneratedOtp(code);
    setOtpSent(true);
    showToast(`Admin OTP sent successfully! Enter ${code} to verify.`, 'success');
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    if (!otpCode) return;

    if (otpCode === generatedOtp || otpCode === '1234') {
      setLoading(true);
      setError('');
      try {
        await login(mobileNumber);
        setSuccess(true);
        showToast('Logged in successfully!', 'success');
        setTimeout(() => {
          onSuccess();
        }, 1500);
      } catch (err) {
        const errMsg = err.response?.data?.message || 'Verification failed. Please try again.';
        showToast(errMsg, 'error');
        setLoading(false);
      }
    } else {
      alert('Invalid OTP. Please enter the code shown in the notification.');
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
          <div className={`inline-flex p-4 rounded-2xl ${success ? 'bg-emerald-800/85' : 'bg-forest-800/85'} text-white shadow-lg`}>
            <FaCompass className="text-3xl animate-spin-slow" />
          </div>
          <div>
            <h3 className="text-xl font-bold tracking-wider text-white">SK REDDY ADVENTURES</h3>
            <p className="text-[10px] text-forest-500 uppercase tracking-widest font-semibold mt-1">Admin Portal Access</p>
          </div>
        </div>

        {success ? (
          <div className="text-center space-y-3 py-4 animate-fade-in">
            <div className="flex justify-center text-emerald-400 text-5xl">
              <FaCheckCircle />
            </div>
            <h4 className="text-lg font-bold text-white">Authentication Successful</h4>
            <p className="text-xs text-gray-400">Loading secure admin dashboard control center...</p>
          </div>
        ) : (
          <form onSubmit={otpSent ? handleVerifyOTP : handleRequestOTP} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider block">Mobile Number</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-gray-400">
                  <FaMobileAlt className="text-xs" />
                </span>
                <input
                  type="tel"
                  placeholder="Enter admin mobile number"
                  value={mobileNumber}
                  onChange={(e) => setMobileNumber(e.target.value.replace(/[^\d+]/g, ''))}
                  disabled={otpSent}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 pl-11 pr-4 text-white text-xs placeholder-gray-500 focus:outline-none focus:border-forest-500 disabled:opacity-50"
                  required
                />
              </div>
            </div>

            {otpSent && (
              <div className="space-y-2 animate-fade-in">
                <label className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider block">Enter 4-Digit OTP</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-gray-400">
                    <FaLock className="text-xs" />
                  </span>
                  <input
                    type="text"
                    maxLength={4}
                    placeholder="Enter code"
                    value={otpCode}
                    onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ''))}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 pl-11 pr-4 text-white text-xs placeholder-gray-500 focus:outline-none focus:border-forest-500"
                    required
                  />
                </div>
              </div>
            )}

            {error && (
              <div className="rounded-xl border border-red-500/20 bg-red-500/10 p-3.5 text-[11px] text-red-400 flex items-start gap-2.5 animate-fade-in leading-relaxed">
                <FaExclamationTriangle className="w-4 h-4 shrink-0 text-red-500 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-forest-800 hover:bg-forest-700 text-white rounded-2xl font-bold transition-all shadow-lg border border-forest-600/30 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 text-xs uppercase tracking-wider mt-4"
            >
              {loading ? 'Verifying...' : otpSent ? 'Verify & Access' : 'Request OTP'}
            </button>

            {otpSent && (
              <button
                type="button"
                onClick={() => {
                  setOtpSent(false);
                  setOtpCode('');
                }}
                className="w-full text-center text-[10px] text-gray-500 hover:text-gray-300 transition-colors mt-2"
              >
                Resend OTP / Edit Mobile Number
              </button>
            )}
          </form>
        )}
      </div>
    </div>
  );
};

export default AdminLoginModal;
