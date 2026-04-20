import React from 'react';

const Button = ({ 
  children, 
  variant = 'primary', 
  className = '', 
  onClick, 
  type = 'button',
  disabled = false,
  icon: Icon
}) => {
  const baseStyles = "inline-flex items-center justify-center gap-2 font-semibold transition-all duration-200 active:scale-95 disabled:opacity-50 disabled:pointer-events-none";
  
  const variants = {
    primary: "bg-gold-gradient text-dark px-6 py-3 rounded-xl shadow-gold-glow hover:shadow-[0_0_25px_rgba(212,175,55,0.4)] hover:-translate-y-0.5",
    secondary: "glass-panel text-white px-6 py-3 rounded-xl hover:border-primary/50 hover:bg-white/10",
    outline: "border border-primary/50 text-primary px-6 py-3 rounded-xl hover:bg-primary/10",
    ghost: "text-slate-400 hover:text-white px-4 py-2 rounded-lg hover:bg-white/5",
    link: "text-primary hover:text-primary-light underline-offset-4 hover:underline px-0 py-0"
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyles} ${variants[variant]} ${className}`}
    >
      {children}
      {Icon && <Icon className="w-5 h-5" />}
    </button>
  );
};

export default Button;
