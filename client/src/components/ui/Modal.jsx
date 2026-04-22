import React from 'react';
import { X } from 'lucide-react';
import Button from './Button';

const Modal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300"
        onClick={onClose}
      />
      
      {/* Modal Content */}
      <div className="relative w-full max-w-md bg-surface/98 backdrop-blur-2xl border border-white/10 rounded-3xl shadow-glass overflow-hidden animate-in zoom-in-95 duration-300">
        <div className="p-6 border-b border-white/5 flex items-center justify-between">
          <h3 className="text-xl font-bold tracking-tight text-white">{title}</h3>
          <Button variant="ghost" className="p-2" onClick={onClose} icon={X} />
        </div>
        
        <div className="p-8">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;
