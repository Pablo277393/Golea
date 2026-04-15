import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronDown, BarChart2, Shield, Zap, ArrowRight, Menu, X, CheckCircle2 } from 'lucide-react';

const LandingPage = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-dark text-slate-200">
      {/* Background Effects */}
      <div className="absolute top-0 left-0 w-full h-[120vh] z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-5%] left-[-5%] w-[40%] h-[40%] rounded-full bg-gold-light/10 blur-[120px] transition-transform duration-1000" />
        <div className="absolute top-[30%] right-[-10%] w-[30%] h-[50%] rounded-full bg-gold/5 blur-[100px]" />
        <div className="absolute bottom-[-20%] left-[20%] w-[50%] h-[50%] rounded-full bg-dark-card blur-[150px]" />
      </div>

      {/* Header */}
      <header className="absolute top-0 left-0 w-full z-50 py-6">
        <div className="container mx-auto px-6 lg:px-12 flex justify-between items-center">
          <Link to="/" className="flex items-center hover:scale-105 transition-transform">
            <img src="/logo.png" alt="GOLEA" className="h-20 w-auto object-contain drop-shadow-xl" />
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-10 z-50">
            <a href="#club" className="relative text-xs uppercase tracking-[0.2em] text-gold-light/80 hover:text-white transition-all duration-300 after:content-[''] after:absolute after:-bottom-1.5 after:left-0 after:w-0 after:h-[1px] after:bg-gold-light hover:after:w-full after:transition-all">The Club</a>
            <a href="#privileges" className="relative text-xs uppercase tracking-[0.2em] text-gold-light/80 hover:text-white transition-all duration-300 after:content-[''] after:absolute after:-bottom-1.5 after:left-0 after:w-0 after:h-[1px] after:bg-gold-light hover:after:w-full after:transition-all">Privileges</a>
            <a href="#concierge" className="relative text-xs uppercase tracking-[0.2em] text-gold-light/80 hover:text-white transition-all duration-300 after:content-[''] after:absolute after:-bottom-1.5 after:left-0 after:w-0 after:h-[1px] after:bg-gold-light hover:after:w-full after:transition-all">Concierge</a>
          </nav>

          {/* Action Button */}
          <div className="hidden md:flex relative group">
            <Link to="/login" className="btn-glass flex items-center gap-2 py-2 px-4 transition-all duration-300 hover:border-gold text-white font-medium">
              Acceder
            </Link>
          </div>

          {/* Mobile Menu Toggle */}
          <button className="md:hidden text-white" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
            {isMobileMenuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </header>

      {/* Mobile Menu Content */}
      <div className={`fixed inset-0 z-40 bg-dark/95 backdrop-blur-xl transition-transform duration-300 md:hidden ${isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'} pt-24 px-6`}>
         <nav className="flex flex-col gap-6 text-xl text-center">
            <a href="#club" onClick={() => setIsMobileMenuOpen(false)} className="text-gold-light hover:text-white transition-colors">The Club</a>
            <a href="#privileges" onClick={() => setIsMobileMenuOpen(false)} className="text-gold-light hover:text-white transition-colors">Privileges</a>
            <a href="#concierge" onClick={() => setIsMobileMenuOpen(false)} className="text-gold-light hover:text-white transition-colors">Concierge</a>
            <div className="h-px w-full bg-dark-border my-2"></div>
            <Link to="/login" onClick={() => setIsMobileMenuOpen(false)} className="text-gold font-medium">Iniciar sesión</Link>
            <a href="#app" onClick={() => setIsMobileMenuOpen(false)} className="font-medium">Descargar App</a>
         </nav>
      </div>

      <main className="relative z-10">
        {/* Hero Section */}
        <section id="club" className="pt-32 pb-20 lg:pt-48 lg:pb-32 px-6">
          <div className="container mx-auto max-w-5xl text-center">
            <div className="inline-block px-4 py-1.5 rounded-full glass-panel text-xs font-medium tracking-widest text-gold mb-8 uppercase border border-gold/20">
              Elite Sports Management
            </div>
            <h1 className="text-5xl lg:text-7xl font-bold font-manrope leading-tight mb-6">
              La Excelencia en <br className="hidden md:block"/> <span className="text-gold-glow">Gestión Deportiva</span>
            </h1>
            <p className="text-lg lg:text-xl text-slate-400 mb-10 max-w-2xl mx-auto">
              La plataforma de élite basada en datos. Acceso exclusivo a herramientas de alto rendimiento para clubes y organizaciones del más alto nivel.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button className="btn-gold w-full sm:w-auto text-lg flex items-center justify-center gap-2">
                Contacta con nosotros <ArrowRight className="w-5 h-5" />
              </button>
              <button className="btn-glass w-full sm:w-auto text-lg">
                Explorar Privilegios
              </button>
            </div>
          </div>
        </section>

        {/* Features Bento Grid */}
        <section id="privileges" className="py-20 px-6">
          <div className="container mx-auto max-w-6xl">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-manrope font-bold mb-4">El Estándar Global de la Industria</h2>
              <div className="w-16 h-1 bg-gold mx-auto rounded-full"></div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Card 1 */}
              <div className="glass-panel p-8 rounded-2xl group hover:border-gold/30 hover:bg-white/[0.04] transition-all duration-500 relative overflow-hidden">
                <div className="absolute top-0 right-0 -mr-8 -mt-8 w-32 h-32 bg-gold/10 rounded-full blur-[40px] group-hover:bg-gold/20 transition-all"></div>
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-gold/20 to-gold/5 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform border border-gold/10">
                  <Zap className="text-gold w-6 h-6" />
                </div>
                <h3 className="text-xl font-manrope font-bold mb-3 text-white">Gestión Inteligente</h3>
                <p className="text-slate-400 text-sm leading-relaxed">
                  Automatización total y optimización de recursos. Tome decisiones en milisegundos con nuestras herramientas predictivas.
                </p>
              </div>

              {/* Card 2 */}
              <div className="glass-panel p-8 rounded-2xl group hover:border-gold/30 hover:bg-white/[0.04] transition-all duration-500 relative overflow-hidden">
                <div className="absolute top-0 right-0 -mr-8 -mt-8 w-32 h-32 bg-gold/10 rounded-full blur-[40px] group-hover:bg-gold/20 transition-all"></div>
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-gold/20 to-gold/5 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform border border-gold/10">
                  <Shield className="text-gold w-6 h-6" />
                </div>
                <h3 className="text-xl font-manrope font-bold mb-3 text-white">Exclusividad</h3>
                <p className="text-slate-400 text-sm leading-relaxed">
                  Acceso estrictamente limitado. Una red privada y segura diseñada para la privacidad absoluta de su club.
                </p>
              </div>

              {/* Card 3 */}
              <div className="glass-panel p-8 rounded-2xl group hover:border-gold/30 hover:bg-white/[0.04] transition-all duration-500 relative overflow-hidden">
                <div className="absolute top-0 right-0 -mr-8 -mt-8 w-32 h-32 bg-gold/10 rounded-full blur-[40px] group-hover:bg-gold/20 transition-all"></div>
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-gold/20 to-gold/5 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform border border-gold/10">
                  <BarChart2 className="text-gold w-6 h-6" />
                </div>
                <h3 className="text-xl font-manrope font-bold mb-3 text-white">Análisis en Tiempo Real</h3>
                <p className="text-slate-400 text-sm leading-relaxed">
                  Data cruda convertida en KPIs accionables. Monitorice el rendimiento deportivo y financiero instantáneamente.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Data Analytics Destacado */}
        <section id="concierge" className="py-24 px-6 overflow-hidden">
          <div className="container mx-auto max-w-6xl">
            <div className="flex flex-col lg:flex-row items-center gap-16">
              
              <div className="lg:w-1/2 relative w-full">
                <div className="absolute inset-0 bg-gold/20 rounded-full blur-[100px] pointer-events-none"></div>
                <div className="glass-panel p-6 rounded-2xl relative border-t border-l border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.5)] bg-dark-card/60 backdrop-blur-3xl">
                  <div className="flex justify-between items-center mb-6">
                    <div>
                      <h4 className="text-white font-manrope font-bold">Rendimiento Global</h4>
                      <span className="text-xs text-slate-400">Actualizado hace 2 min</span>
                    </div>
                    <div className="flex gap-2">
                       <span className="w-2 h-2 rounded-full bg-red-400/80"></span>
                       <span className="w-2 h-2 rounded-full bg-yellow-400/80"></span>
                       <span className="w-2 h-2 rounded-full bg-green-400/80"></span>
                    </div>
                  </div>
                  {/* Mockup Chart Area */}
                  <div className="h-48 w-full border-b border-white/5 mb-4 flex items-end gap-2 pb-2 px-2">
                    {[30, 45, 25, 60, 40, 80, 55, 90, 75, 100].map((height, i) => (
                      <div key={i} className="flex-1 bg-gradient-to-t from-gold/20 to-gold rounded-t-sm transition-all duration-1000 ease-in-out hover:opacity-100 cursor-pointer" style={{ height: `${height}%`, opacity: 0.7 + (i * 0.03) }}></div>
                    ))}
                  </div>
                  <div className="flex justify-between text-xs text-slate-500 px-2 font-medium">
                    <span>Oct</span><span>Nov</span><span>Dic</span><span>Ene</span><span>Feb</span>
                  </div>
                </div>
              </div>

              <div className="lg:w-1/2">
                <h2 className="text-3xl lg:text-4xl font-manrope font-bold mb-6 leading-tight">Visión Panorámica del <span className="text-gold-glow">Éxito</span></h2>
                <p className="text-slate-400 mb-8 leading-relaxed text-lg">
                  Nuestra interfaz central le proporciona el control absoluto. Identifique oportunidades antes que sus competidores gracias al Big Data.
                </p>
                <ul className="space-y-4">
                  {[
                    "Proyección algorítmica de talento deportivo",
                    "Seguridad de datos de grado militar en nube",
                    "Reportes automatizados a junta directiva",
                    "Alineación financiera y rendimiento deportivo"
                  ].map((item, i) => (
                    <li key={i} className="flex items-center gap-3">
                       <CheckCircle2 className="text-gold w-5 h-5 flex-shrink-0" />
                       <span className="text-slate-300 font-medium">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

            </div>
          </div>
        </section>

        {/* Call To Action Final */}
        <section className="py-24 px-6">
          <div className="container mx-auto max-w-4xl">
            <div className="glass-panel p-12 text-center rounded-3xl relative overflow-hidden bg-gradient-to-b from-dark-card to-dark border-t border-t-gold/30">
               <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-1/2 h-1/2 bg-gold/10 blur-[80px] pointer-events-none"></div>
               <h2 className="text-3xl md:text-5xl font-manrope font-bold mb-6 relative z-10">Únase a la Nueva Era</h2>
               <p className="text-slate-400 mb-10 max-w-xl mx-auto relative z-10 text-lg">
                 Deje de competir en el pasado. El futuro del management deportivo está disponible para las organizaciones elegidas.
               </p>
               <button className="btn-gold text-lg px-8 py-4 relative z-10 shadow-[0_0_30px_rgba(212,175,55,0.2)]">
                 Contacta con nosotros
               </button>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-dark-border pt-12 pb-8 px-6 bg-dark-card relative z-10">
        <div className="container mx-auto flex flex-col lg:flex-row justify-between items-center gap-8 text-center lg:text-left">
          <div className="flex items-center justify-center">
             <img src="/logo.png" alt="GOLEA" className="h-16 w-auto object-contain drop-shadow-md" />
          </div>
          <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-8">
            <a href="#" className="relative text-xs uppercase tracking-[0.15em] text-gold-light/70 hover:text-white transition-all duration-300 hover:scale-105">Politica Privacidad</a>
            <span className="hidden md:block text-gold-light/20 text-xs">|</span>
            <a href="#" className="relative text-xs uppercase tracking-[0.15em] text-gold-light/70 hover:text-white transition-all duration-300 hover:scale-105">Seguridad</a>
            <span className="hidden md:block text-gold-light/20 text-xs">|</span>
            <a href="#" className="relative text-xs uppercase tracking-[0.15em] text-gold-light/70 hover:text-white transition-all duration-300 hover:scale-105">Contacto VIP</a>
          </div>
          <div className="text-sm text-slate-600 font-medium w-full lg:w-auto text-center lg:text-right">
            &copy; 2026 GOLEA Management. Elite Access.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
