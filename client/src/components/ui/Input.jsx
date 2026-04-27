import React from 'react';

const Input = ({
  label,
  id,
  type = 'text',
  error,
  icon: Icon,
  className = '',
  ...props
}) => {
  return (
    <div className={`space-y-2 ${className}`}>
      {label && (
        <label htmlFor={id} className="label-base">
          {label}
        </label>
      )}
      <div className="relative group">
        {Icon && (
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-primary transition-colors">
            <Icon size={18} />
          </div>
        )}
        <input
          id={id}
          type={type}
          className={`input-base ${Icon ? 'pl-11' : ''} ${error ? 'border-red-500/50 bg-red-500/5' : ''}`}
          {...props}
        />
      </div>
      {error && (
        <p className="text-xs text-red-500 mt-1 flex items-center gap-1 font-medium">
          <span>⚠</span> {error}
        </p>
      )}
    </div>
  );
};

export default Input;
