import React from 'react';
import { FaTimes } from 'react-icons/fa';

const Modal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop overlay */}
      <div 
        className="fixed inset-0 bg-black/70 backdrop-blur-sm transition-opacity" 
        onClick={onClose}
      />
      
      {/* Modal window */}
      <div className="relative z-10 w-full max-w-2xl bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl overflow-hidden transform transition-all duration-300 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-800 bg-zinc-950">
          <h3 className="text-lg font-semibold text-zinc-100">{title}</h3>
          <button 
            onClick={onClose} 
            className="p-1.5 rounded-full hover:bg-zinc-800 text-zinc-400 hover:text-zinc-200 transition-colors"
          >
            <FaTimes className="text-sm" />
          </button>
        </div>
        
        {/* Body content */}
        <div className="p-6 overflow-y-auto flex-1 text-zinc-300">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;
