import React from 'react';

const Card = ({ children, className = '', hover = true, ...props }) => {
  return (
    <div 
      className={`glass-panel p-6 rounded-2xl relative overflow-hidden transition-all duration-300 ${hover ? 'hover:border-primary/30 hover:bg-white/[0.04] hover:-translate-y-1' : ''} ${className}`}
      {...props}
    >
      {/* Decorative glow effect */}
      <div className="absolute top-0 right-0 -mr-8 -mt-8 w-32 h-32 bg-primary/10 rounded-full blur-[40px] pointer-events-none"></div>
      
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
};

export default Card;
