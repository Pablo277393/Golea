import React from 'react';

const Container = ({ children, className = '', size = 'base' }) => {
  const sizes = {
    base: 'max-w-6xl',
    narrow: 'max-w-5xl',
    wide: 'max-w-7xl',
    full: 'max-w-none'
  };

  return (
    <div className={`container mx-auto px-6 ${sizes[size]} ${className}`}>
      {children}
    </div>
  );
};

export default Container;
