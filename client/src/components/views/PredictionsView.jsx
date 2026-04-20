import React from 'react';
import { Target, Award, Trophy, ChevronRight, Star } from 'lucide-react';
import Card from '../ui/Card';
import Button from '../ui/Button';

const PredictionsView = () => {
  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700 max-w-6xl mx-auto">
      <header className="flex flex-col sm:flex-row justify-between items-center gap-6">
        <div>
          <h2 className="text-4xl lg:text-5xl font-bold tracking-tight mb-2">Quiniela de Élite</h2>
          <p className="text-slate-400 font-medium">Demuestre su visión estratégica y escale en el ranking global.</p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-primary/10 border border-primary/20 rounded-full">
           <Trophy size={16} className="text-primary" />
           <span className="text-xs font-bold text-primary uppercase tracking-widest">850 Points</span>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Prediction Card */}
        <Card className="lg:col-span-2 p-8 shadow-glass" hover={false}>
          <div className="flex items-center gap-3 mb-10">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center border border-primary/20">
              <Target size={22} className="text-primary" />
            </div>
            <h3 className="text-xl font-bold uppercase tracking-wider text-white">Próximo Desafío</h3>
          </div>

          <div className="p-10 bg-white/5 rounded-3xl border border-white/5 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <Target size={120} className="text-primary" />
            </div>
            
            <div className="relative z-10 text-center">
              <p className="text-xs font-bold text-primary uppercase tracking-[0.3em] mb-8">Liga Profesional • Jornada 24</p>
              
              <div className="flex flex-col md:flex-row justify-center items-center gap-8 md:gap-16 mb-12">
                <div className="flex flex-col items-center gap-4">
                  <div className="w-20 h-20 rounded-2xl bg-dark flex items-center justify-center border border-white/10 shadow-glass">
                    <span className="text-2xl font-bold text-white">GFC</span>
                  </div>
                  <span className="font-bold text-white">Golea FC</span>
                </div>

                <div className="flex items-center gap-4">
                  <input 
                    type="number" 
                    defaultValue="0" 
                    className="w-20 h-24 bg-dark-card border-2 border-white/10 rounded-2xl text-center text-4xl font-bold text-primary transition-all focus:border-primary focus:outline-none focus:shadow-gold-glow"
                  />
                  <span className="text-3xl font-extrabold text-slate-700">-</span>
                  <input 
                    type="number" 
                    defaultValue="0" 
                    className="w-20 h-24 bg-dark-card border-2 border-white/10 rounded-2xl text-center text-4xl font-bold text-primary transition-all focus:border-primary focus:outline-none focus:shadow-gold-glow"
                  />
                </div>

                <div className="flex flex-col items-center gap-4">
                  <div className="w-20 h-20 rounded-2xl bg-dark flex items-center justify-center border border-white/10 shadow-glass">
                    <span className="text-2xl font-bold text-slate-400">GUN</span>
                  </div>
                  <span className="font-bold text-slate-300">Galaxy Utd</span>
                </div>
              </div>

              <Button variant="primary" className="w-full max-w-sm py-4 text-lg shadow-gold-glow">
                Confirmar Predicción
              </Button>
            </div>
          </div>
          
          <div className="mt-8 p-6 bg-primary/5 border border-primary/10 rounded-2xl">
             <div className="flex gap-4 items-start">
               <Star size={20} className="text-primary shrink-0 mt-1" />
               <p className="text-sm text-slate-400 leading-relaxed">
                 Las predicciones se cierran 1 hora antes del pitido inicial. Un acierto exacto otorga <span className="text-primary font-bold">100 puntos</span> extra en el ranking MVP global.
               </p>
             </div>
          </div>
        </Card>

        {/* Global Ranking Card */}
        <div className="space-y-6">
          <div className="flex items-center gap-3 mb-2 px-2">
            <Award size={20} className="text-primary" />
            <h3 className="text-xl font-bold uppercase tracking-wider text-white">Top Ranking</h3>
          </div>
          
          <Card className="p-0 border-white/5 overflow-hidden" hover={false}>
            <div className="divide-y divide-white/5">
              {[1, 2, 3, 4, 5].map((pos) => (
                <div 
                  key={pos} 
                  className={`px-6 py-5 flex items-center justify-between group hover:bg-white/5 transition-all cursor-pointer ${pos === 1 ? 'bg-primary/5' : ''}`}
                >
                  <div className="flex items-center gap-4">
                    <span className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold border transition-colors ${
                      pos === 1 ? 'bg-primary text-dark border-primary' : 'bg-white/5 text-slate-400 border-white/10'
                    }`}>
                      #{pos}
                    </span>
                    <div className="flex flex-col">
                      <span className={`font-bold transition-colors ${pos === 1 ? 'text-white' : 'text-slate-300 group-hover:text-white'}`}>
                        Usuario_Elite_{pos}
                      </span>
                      <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Premium Member</span>
                    </div>
                  </div>
                  <div className="flex flex-col items-end">
                    <span className={`font-bold transition-all ${pos === 1 ? 'text-primary scale-110' : 'text-slate-400 group-hover:text-primary'}`}>
                      {2400 - pos*150} pts
                    </span>
                    {pos === 1 && <span className="text-[8px] text-primary/50 font-bold uppercase tracking-tighter">Leader</span>}
                  </div>
                </div>
              ))}
            </div>
            
            <div className="p-4 bg-white/5 border-t border-white/5">
               <Button variant="ghost" className="w-full text-xs font-bold uppercase tracking-[0.2em]" icon={ChevronRight}>
                 Ver Ranking Completo
               </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default PredictionsView;
