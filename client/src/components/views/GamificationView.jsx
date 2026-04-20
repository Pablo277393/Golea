import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { Target, Trophy, Award, TrendingUp, Star, ChevronRight, Zap } from 'lucide-react';
import Card from '../ui/Card';
import Button from '../ui/Button';

const GamificationView = () => {
  const { user } = useAuth();
  
  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700 max-w-6xl mx-auto">
      <header className="flex flex-col sm:flex-row justify-between items-center gap-6">
        <div>
          <h2 className="text-4xl lg:text-5xl font-bold tracking-tight mb-2">Gamificación y Recompensas</h2>
          <p className="text-slate-400 font-medium">Participe, prediga y conviértase en la élite del club.</p>
        </div>
        <div className="flex items-center gap-3 px-6 py-3 bg-primary/10 border border-primary/20 rounded-2xl">
           <Zap size={20} className="text-primary" />
           <span className="text-sm font-bold text-primary uppercase tracking-widest">Nivel Pro • 2,450 XP</span>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        
        {/* Predictions Widget */}
        <Card className="flex flex-col h-full">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center border border-primary/20">
              <Target size={22} className="text-primary" />
            </div>
            <h3 className="text-xl font-bold uppercase tracking-wider text-white">Quiniela Semanal</h3>
          </div>
          
          <p className="text-sm text-slate-400 mb-8 leading-relaxed font-medium">
            Prediga el resultado del próximo compromiso para obtener reconocimiento en el ranking global del club.
          </p>
          
          <div className="flex-1 flex flex-col justify-center bg-black/20 rounded-3xl border border-white/5 p-8 text-center group">
            <div className="flex justify-center items-center gap-8 mb-8">
              <div className="flex flex-col items-center gap-3">
                <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center border border-primary/20 group-hover:scale-110 transition-transform">
                  <span className="font-bold text-primary">GFC</span>
                </div>
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Local</p>
              </div>
              
              <div className="flex items-center gap-2">
                <div className="w-12 h-14 bg-dark rounded-xl flex items-center justify-center text-2xl font-bold text-white border border-white/10 shadow-glass">2</div>
                <span className="text-xl font-bold text-slate-700">-</span>
                <div className="w-12 h-14 bg-dark rounded-xl flex items-center justify-center text-2xl font-bold text-white border border-white/10 shadow-glass">1</div>
              </div>

              <div className="flex flex-col items-center gap-3">
                <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center border border-white/10 group-hover:scale-110 transition-transform">
                  <span className="font-bold text-slate-400">GTY</span>
                </div>
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Visit.</p>
              </div>
            </div>
            <Button variant="primary" className="w-full shadow-gold-glow">Actualizar Predicción</Button>
          </div>
        </Card>

        {/* MVP Vote Widget */}
        <Card className="flex flex-col h-full">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center border border-primary/20">
              <Trophy size={22} className="text-primary" />
            </div>
            <h3 className="text-xl font-bold uppercase tracking-wider text-white">Votación MVP</h3>
          </div>
          
          <p className="text-sm text-slate-400 mb-8 leading-relaxed font-medium">
            Elija al componente más destacado del último partido para que acceda al Salón de la Fama.
          </p>

          <div className="flex-1 space-y-4">
            {['Marc Rovira', 'Pau García', 'Àlex Marín'].map((name, i) => (
              <div 
                key={i} 
                className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5 hover:border-primary/20 hover:bg-white/10 transition-all cursor-pointer group"
              >
                <div className="flex items-center gap-4">
                  <div className="w-8 h-8 rounded-lg bg-dark flex items-center justify-center text-[10px] font-bold text-slate-500 border border-white/10 group-hover:text-primary transition-colors">
                    {i + 1}
                  </div>
                  <span className="font-bold text-slate-300 group-hover:text-white transition-colors">{name}</span>
                </div>
                <Button variant="ghost" className="text-[10px] px-3 py-1.5 uppercase font-bold tracking-widest">Votar</Button>
              </div>
            ))}
          </div>
        </Card>

        {/* Global Ranking Widget */}
        <Card className="flex flex-col h-full">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center border border-primary/20">
              <Award size={22} className="text-primary" />
            </div>
            <h3 className="text-xl font-bold uppercase tracking-wider text-white">Alta Jerarquía</h3>
          </div>
          
          <div className="flex-1 divide-y divide-white/5">
            {[1, 2, 3, 4, 5].map(pos => (
              <div key={pos} className="flex items-center justify-between py-4 group cursor-pointer">
                <div className="flex items-center gap-4">
                  <span className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-black border transition-all ${
                    pos === 1 ? 'bg-primary text-dark border-primary shadow-gold-glow scale-110' : 'bg-white/5 text-slate-500 border-white/10 group-hover:text-primary'
                  }`}>
                    #{pos}
                  </span>
                  <div className="flex flex-col">
                    <span className={`font-bold text-sm transition-colors ${pos === 1 ? 'text-white' : 'text-slate-300 group-hover:text-white'}`}>
                      Usuario_Elite_{pos}
                    </span>
                  </div>
                </div>
                <span className={`font-black text-xs tracking-tighter ${pos === 1 ? 'text-primary' : 'text-slate-500 group-hover:text-primary'} transition-colors`}>
                  {2500 - (pos * 150)} PTS
                </span>
              </div>
            ))}
          </div>
          
          <div className="mt-8 pt-6 border-t border-white/5">
            <Button variant="outline" className="w-full text-xs font-bold uppercase tracking-[0.2em]" icon={ChevronRight}>
              Ranking Completo
            </Button>
          </div>
        </Card>

      </div>
      
      <div className="p-8 bg-gold-gradient/[0.03] border border-primary/10 rounded-3xl relative overflow-hidden">
         <div className="absolute top-0 right-0 p-6 opacity-10">
            <Star size={100} className="text-primary" />
         </div>
         <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
            <div className="w-16 h-16 rounded-2xl bg-gold-gradient flex items-center justify-center shrink-0 shadow-gold-glow">
               <TrendingUp size={32} className="text-dark" />
            </div>
            <div className="flex-1 text-center md:text-left">
               <h4 className="text-2xl font-bold mb-2">Su Rendimiento es Notorio</h4>
               <p className="text-slate-400 font-medium leading-relaxed max-w-2xl">
                 Se encuentra en el <span className="text-primary font-bold">top 5%</span> de la organización. Mantenga su nivel de participación para desbloquear el acceso exclusivo al Concierge V.I.P. del club.
               </p>
            </div>
            <Button variant="secondary" className="px-8 shrink-0">Mis Premios</Button>
         </div>
      </div>
    </div>
  );
};

export default GamificationView;
