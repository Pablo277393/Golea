import React from 'react';
import { Link } from 'react-router-dom';
import { BarChart2, Shield, Zap, ArrowRight, CheckCircle2 } from 'lucide-react';
import PageLayout from '../components/layout/PageLayout';
import Container from '../components/ui/Container';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';

const LandingPage = () => {
  return (
    <PageLayout>
      <main>
        {/* Hero Section */}
        <section id="club" className="section-padding pt-32 lg:pt-48">
          <Container size="narrow" className="text-center">
            <div className="inline-block px-4 py-1.5 rounded-full border border-primary/20 bg-primary/5 text-xs font-bold tracking-[0.2em] text-primary mb-8 uppercase">
              Elite Sports Management
            </div>
            <h1 className="text-5xl lg:text-8xl mb-8 leading-[1.1]">
              La Excelencia en <br className="hidden md:block"/> 
              <span className="text-gold-glow">Gestión Deportiva</span>
            </h1>
            <p className="text-lg lg:text-xl text-slate-400 mb-12 max-w-2xl mx-auto leading-relaxed">
              La plataforma de élite basada en datos. Acceso exclusivo a herramientas de alto rendimiento para clubes y organizaciones del más alto nivel.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
              <Button variant="primary" className="w-full sm:w-auto text-lg px-8 py-4" icon={ArrowRight}>
                Contacta con nosotros
              </Button>
            </div>
          </Container>
        </section>

        {/* Features Bento Grid */}
        <section id="privileges" className="section-padding">
          <Container>
            <div className="text-center mb-20 text-balance">
              <h2 className="text-4xl lg:text-5xl mb-6">El Estándar Global de la Industria</h2>
              <div className="w-24 h-1 bg-gold-gradient mx-auto rounded-full shadow-gold-glow"></div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Card>
                <div className="w-14 h-14 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
                  <Zap className="text-primary w-7 h-7" />
                </div>
                <h3 className="text-2xl mb-4 text-white">Gestión Inteligente</h3>
                <p className="text-slate-400 text-base leading-relaxed">
                  Automatización total y optimización de recursos. Tome decisiones en milisegundos con nuestras herramientas predictivas.
                </p>
              </Card>

              <Card>
                <div className="w-14 h-14 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
                  <Shield className="text-primary w-7 h-7" />
                </div>
                <h3 className="text-2xl mb-4 text-white">Exclusividad</h3>
                <p className="text-slate-400 text-base leading-relaxed">
                  Acceso estrictamente limitado. Una red privada y segura diseñada para la privacidad absoluta de su club.
                </p>
              </Card>

              <Card>
                <div className="w-14 h-14 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
                  <BarChart2 className="text-primary w-7 h-7" />
                </div>
                <h3 className="text-2xl mb-4 text-white">Análisis en Tiempo Real</h3>
                <p className="text-slate-400 text-base leading-relaxed">
                  Data cruda convertida en KPIs accionables. Monitorice el rendimiento deportivo y financiero instantáneamente.
                </p>
              </Card>
            </div>
          </Container>
        </section>

        {/* Data Analytics Destacado */}
        <section id="concierge" className="section-padding overflow-hidden">
          <Container>
            <div className="flex flex-col lg:flex-row items-center gap-20 lg:gap-32">
              
              <div className="lg:w-1/2 relative w-full">
                <div className="absolute inset-0 bg-primary/10 rounded-full blur-[100px] pointer-events-none"></div>
                <Card className="p-8 shadow-glass bg-surface/60 backdrop-blur-3xl" hover={false}>
                  <div className="flex justify-between items-center mb-10">
                    <div>
                      <h4 className="text-xl text-white font-bold">Rendimiento Global</h4>
                      <span className="text-xs text-slate-500 uppercase tracking-widest">Live Updates</span>
                    </div>
                    <div className="flex gap-2">
                       <span className="w-2.5 h-2.5 rounded-full bg-red-500/50 shadow-[0_0_8px_rgba(239,68,68,0.3)]"></span>
                       <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/50 shadow-[0_0_8px_rgba(245,158,11,0.3)]"></span>
                       <span className="w-2.5 h-2.5 rounded-full bg-green-500/50 shadow-[0_0_8px_rgba(34,197,94,0.3)]"></span>
                    </div>
                  </div>
                  
                  <div className="h-56 w-full border-b border-white/5 mb-6 flex items-end gap-3 pb-2 px-2">
                    {[30, 45, 25, 60, 40, 80, 55, 90, 75, 100].map((height, i) => (
                      <div 
                        key={i} 
                        className="flex-1 bg-gradient-to-t from-primary/10 to-primary rounded-t-lg transition-all duration-700 ease-out hover:brightness-125" 
                        style={{ height: `${height}%`, opacity: 0.5 + (i * 0.05) }}
                      ></div>
                    ))}
                  </div>
                  <div className="flex justify-between text-xs text-slate-500 px-2 font-bold tracking-tighter">
                    <span>OCT</span><span>NOV</span><span>DIC</span><span>ENE</span><span>FEB</span>
                  </div>
                </Card>
              </div>

              <div className="lg:w-1/2">
                <h2 className="text-4xl lg:text-5xl mb-8 leading-tight">Visión Panorámica del <br/><span className="text-gold-glow">Éxito Deportivo</span></h2>
                <p className="text-slate-400 mb-10 leading-relaxed text-lg">
                  Nuestra interfaz central le proporciona el control absoluto. Identifique oportunidades antes que sus competidores gracias al Big Data y algoritmos predictivos de alto nivel.
                </p>
                <ul className="space-y-6">
                  {[
                    "Proyección algorítmica de talento deportivo",
                    "Seguridad de datos de grado militar en nube",
                    "Reportes automatizados a junta directiva",
                    "Alineación financiera y rendimiento deportivo"
                  ].map((item, i) => (
                    <li key={i} className="flex items-center gap-4 group">
                       <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center border border-primary/20 group-hover:bg-primary/20 transition-colors">
                          <CheckCircle2 className="text-primary w-4 h-4" />
                       </div>
                       <span className="text-slate-300 font-medium text-lg">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </Container>
        </section>

        {/* Call To Action Final */}
        <section className="section-padding">
          <Container size="narrow">
            <Card className="p-16 text-center border-t border-primary/30 bg-gradient-to-b from-dark-card to-dark overflow-hidden" hover={false}>
               <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-1/2 bg-primary/10 blur-[100px] pointer-events-none"></div>
               <h2 className="text-4xl md:text-6xl mb-8 relative z-10">Únase a la Nueva Era</h2>
               <p className="text-slate-400 mb-12 max-w-xl mx-auto relative z-10 text-lg lg:text-xl">
                 Deje de competir en el pasado. El futuro del management deportivo está disponible para las organizaciones elegidas.
               </p>
               <Button variant="primary" className="text-xl px-12 py-5 shadow-gold-glow relative z-10">
                 Contacta con nosotros
               </Button>
            </Card>
          </Container>
        </section>
      </main>
    </PageLayout>
  );
};

export default LandingPage;
