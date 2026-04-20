import React from 'react';
import Container from '../ui/Container';

const Footer = () => {
  const links = [
    { name: 'Politica Privacidad', href: '#' },
    { name: 'Seguridad', href: '#' },
    { name: 'Contacto VIP', href: '#' }
  ];

  return (
    <footer className="border-t border-dark-border pt-12 pb-8 bg-dark-card relative z-10 selection:bg-primary/20">
      <Container className="flex flex-col lg:flex-row justify-between items-center gap-8 text-center lg:text-left">
        <div className="flex items-center justify-center">
           <img src="/logo.png" alt="GOLEA" className="h-16 w-auto object-contain drop-shadow-md" />
        </div>
        
        <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-8">
          {links.map((link, index) => (
            <React.Fragment key={link.name}>
              <a 
                href={link.href} 
                className="relative text-xs uppercase tracking-[0.15em] text-primary/70 hover:text-white transition-all duration-300 hover:scale-105"
              >
                {link.name}
              </a>
              {index < links.length - 1 && (
                <span className="hidden md:block text-primary/20 text-xs">|</span>
              )}
            </React.Fragment>
          ))}
        </div>

        <div className="text-sm text-slate-500 font-medium w-full lg:w-auto text-center lg:text-right">
          &copy; {new Date().getFullYear()} GOLEA Management. Elite Access.
        </div>
      </Container>
    </footer>
  );
};

export default Footer;
