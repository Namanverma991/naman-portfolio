import React, { useEffect } from 'react';
import { FaCheckCircle, FaExclamationCircle, FaInfoCircle, FaTimes } from 'react-icons/fa';

const Toast = ({ message, type = 'success', onClose, duration = 3000 }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);
    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const typeStyles = {
    success: 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400',
    error: 'bg-rose-500/10 border-rose-500/20 text-rose-400',
    warning: 'bg-amber-500/10 border-amber-500/20 text-amber-400',
    info: 'bg-sky-500/10 border-sky-500/20 text-sky-400',
  };

  const icons = {
    success: <FaCheckCircle className="text-lg flex-shrink-0" />,
    error: <FaExclamationCircle className="text-lg flex-shrink-0" />,
    warning: <FaExclamationCircle className="text-lg flex-shrink-0" />,
    info: <FaInfoCircle className="text-lg flex-shrink-0" />,
  };

  return (
    <div className={`fixed bottom-5 right-5 z-50 flex items-center gap-3 px-4 py-3 rounded-xl border backdrop-blur-md shadow-2xl transition-all duration-300 transform translate-y-0 ${typeStyles[type]}`}>
      {icons[type]}
      <span className="font-medium text-sm pr-2">{message}</span>
      <button onClick={onClose} className="ml-auto p-1 rounded-full hover:bg-white/10 transition-colors text-current">
        <FaTimes className="text-xs" />
      </button>
    </div>
  );
};

export default Toast;
