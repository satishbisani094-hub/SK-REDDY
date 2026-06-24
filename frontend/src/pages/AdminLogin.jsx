import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaLock, FaPhone, FaCompass, FaArrowLeft } from 'react-icons/fa';
import { sendOTP, verifyOTP, isAuthenticated } from '../services/api';
import Toast from '../components/Toast';

const AdminLogin = () => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState(1); // 1: Enter Phone, 2: Enter OTP
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);
  
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect if already logged in
    if (isAuthenticated()) {
      navigate('/admin/dashboard');
    }
  }, [navigate]);

  const showToast = (message, type) => {
    setToast({ message, type });
  };

  const handleSendOTP = async (e) => {
    e.preventDefault();
    if (!phoneNumber) {
      showToast('Please enter your phone number', 'error');
      return;
    }

    setLoading(true);
    try {
      await sendOTP(phoneNumber);
      showToast('OTP sent successfully to your mobile number!', 'success');
      setStep(2);
    } catch (error) {
      const errMsg = error.response?.data?.message || 'Failed to send OTP. Please check the phone number.';
      showToast(errMsg, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    if (!otp) {
      showToast('Please enter the OTP code', 'error');
      return;
    }

    setLoading(true);
    try {
      await verifyOTP(phoneNumber, otp);
      showToast('Logged in successfully!', 'success');
      setTimeout(() => {
        navigate('/admin/dashboard');
      }, 1000);
    } catch (error) {
      const errMsg = error.response?.data?.message || 'Verification failed. Please try again.';
      showToast(errMsg, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-dark-bg flex items-center justify-center px-4 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-forest-800/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-mountain-800/10 rounded-full blur-3xl"></div>

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      <div className="w-full max-w-md glass p-8 md:p-10 rounded-3xl shadow-2xl border border-white/5 relative z-10 animate-fade-in">
        {/* Header Logo */}
        <div className="text-center space-y-4 mb-8">
          <div className="inline-flex p-4 rounded-2xl bg-forest-800/80 text-white shadow-xl">
            <FaCompass className="text-3xl animate-spin-slow" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-wider text-white">SK REDDY ADVENTURES</h1>
            <p className="text-xs text-forest-500 uppercase tracking-widest font-semibold mt-1">Admin Portal Access</p>
          </div>
        </div>

        {/* Back Button (Only on Step 2) */}
        {step === 2 && (
          <button
            onClick={() => { setStep(1); setOtp(''); }}
            className="flex items-center gap-2 text-xs font-semibold text-gray-400 hover:text-white mb-6 transition-colors cursor-pointer"
          >
            <FaArrowLeft /> Edit Phone Number
          </button>
        )}

        {/* Step 1: Send OTP Form */}
        {step === 1 ? (
          <form onSubmit={handleSendOTP} className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider block">Phone Number</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-gray-400">
                  <FaPhone className="text-sm" />
                </span>
                <input
                  type="tel"
                  placeholder="e.g. +919999999999"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-3.5 pl-11 pr-4 text-white placeholder-gray-500 focus:outline-none focus:border-forest-500 focus:bg-white/10 transition-all text-sm"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-forest-800 hover:bg-forest-700 text-white rounded-2xl font-bold transition-all duration-300 shadow-lg border border-forest-600/30 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed mt-8 text-sm tracking-wide"
            >
              {loading ? 'Sending OTP...' : 'Send OTP'}
            </button>
          </form>
        ) : (
          /* Step 2: Verify OTP Form */
          <form onSubmit={handleVerifyOTP} className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider block">Enter OTP Code</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-gray-400">
                  <FaLock className="text-sm" />
                </span>
                <input
                  type="text"
                  maxLength="6"
                  placeholder="Enter 6-digit OTP"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-3.5 pl-11 pr-4 text-white placeholder-gray-500 focus:outline-none focus:border-forest-500 focus:bg-white/10 transition-all text-sm tracking-widest text-center font-bold"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-forest-800 hover:bg-forest-700 text-white rounded-2xl font-bold transition-all duration-300 shadow-lg border border-forest-600/30 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed mt-8 text-sm tracking-wide"
            >
              {loading ? 'Verifying...' : 'Verify & Sign In'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default AdminLogin;
