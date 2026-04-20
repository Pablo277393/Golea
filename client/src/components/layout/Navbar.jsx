import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import Button from '../ui/Button';
import Container from '../ui/Container';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'The Club', href: '#club' },
    { name: 'Privileges', href: '#privileges' },
    { name: 'Concierge', href: '#concierge' }
  ];

  return (
    <header className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${isScrolled ? 'py-4 bg-dark/80 backdrop-blur-lg border-b border-white/5' : 'py-6'}`}>
      <Container className="flex justify-between items-center">
        <Link to="/" className="flex items-center hover:scale-105 transition-transform">
          <img src="/logo.png" alt="GOLEA" className="h-16 lg:h-20 w-auto object-contain drop-shadow-xl" />
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-10">
          {navLinks.map((link) => (
            <a 
              key={link.name}
              href={link.href} 
              className="relative text-xs uppercase tracking-[0.2em] text-primary/80 hover:text-white transition-all duration-300 after:content-[''] after:absolute after:-bottom-1.5 after:left-0 after:w-0 after:h-[1px] after:bg-primary hover:after:w-full after:transition-all"
            >
              {link.name}
            </a>
          ))}
        </nav>

        {/* Action Button */}
        <div className="hidden md:flex items-center gap-4">
          <Link to="/login">
            <Button variant="secondary" className="py-2 px-6 text-sm">
              Acceder
            </Button>
          </Link>
        </div>

        {/* Mobile Menu Toggle */}
        <button className="md:hidden text-white p-2" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
          {isMobileMenuOpen ? <X /> : <Menu />}
        </button>
      </Container>

      {/* Mobile Menu Content */}
      <div className={`fixed inset-0 z-40 bg-dark/95 backdrop-blur-xl transition-transform duration-300 md:hidden ${isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'} pt-24 px-6`}>
         <nav className="flex flex-col gap-6 text-xl text-center">
            {navLinks.map((link) => (
              <a 
                key={link.name}
                href={link.href} 
                onClick={() => setIsMobileMenuOpen(false)} 
                className="text-primary hover:text-white transition-colors"
              >
                {link.name}
              </a>
            ))}
            <div className="h-px w-full bg-dark-border my-2"></div>
            <Link to="/login" onClick={() => setIsMobileMenuOpen(false)}>
              <span className="text-primary font-medium">Iniciar sesión</span>
            </Link>
            <a href="#app" onClick={() => setIsMobileMenuOpen(false)} className="font-medium">Descargar App</a>
         </nav>
      </div>
    </header>
  );
};

export default Navbar;
