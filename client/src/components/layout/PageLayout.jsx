import React from 'react';
import Navbar from './Navbar';
import Footer from './Footer';

const PageLayout = ({ children, hideNavbar = false, hideFooter = false }) => {
  return (
    <div className="min-h-screen relative bg-dark selection:bg-primary/20">
      {/* Dynamic Global Background Effects */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-5%] left-[-5%] w-[40%] h-[40%] rounded-full bg-primary/5 blur-[120px] animate-pulse" />
        <div className="absolute top-[30%] right-[-10%] w-[30%] h-[50%] rounded-full bg-primary/5 blur-[100px]" />
        <div className="absolute bottom-[-10%] left-[10%] w-[40%] h-[40%] rounded-full bg-primary/5 blur-[120px]" />
      </div>

      {!hideNavbar && <Navbar />}

      <main className={`relative z-10 ${!hideNavbar ? 'pt-20' : ''}`}>
        {children}
      </main>

      {!hideFooter && <Footer />}
    </div>
  );
};

export default PageLayout;
