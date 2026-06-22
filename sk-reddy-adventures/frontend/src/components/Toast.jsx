import React, { useEffect } from 'react';
import { FaCheckCircle, FaExclamationCircle, FaTimes } from 'react-icons/fa';

const Toast = ({ message, type = 'success', onClose, duration = 4000 }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);
    return () => clearTimeout(timer);
  }, [onClose, duration]);

  const isSuccess = type === 'success';

  return (
    <div className="fixed top-24 right-6 z-50 animate-bounce-short">
      <div className={`glass px-5 py-4 rounded-xl shadow-2xl flex items-center gap-3 border-l-4 ${
        isSuccess ? 'border-l-forest-500' : 'border-l-red-500'
      } max-w-sm`}>
        {isSuccess ? (
          <FaCheckCircle className="text-forest-500 text-xl shrink-0" />
        ) : (
          <FaExclamationCircle className="text-red-500 text-xl shrink-0" />
        )}
        <div className="flex-1">
          <p className="text-sm font-medium text-white">{message}</p>
        </div>
        <button 
          onClick={onClose} 
          className="text-gray-400 hover:text-white transition-colors duration-150 ml-2"
        >
          <FaTimes className="text-sm" />
        </button>
      </div>
    </div>
  );
};

export default Toast;
