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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Predictions Widget */}
        <Card className="flex flex-col h-full">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center border border-primary/20">
              <Target size={22} className="text-primary" />
            </div>
            <h3 className="text-xl font-bold uppercase tracking-wider text-white">Triple Desafío</h3>
          </div>
          
          <p className="text-sm text-slate-400 mb-8 leading-relaxed font-medium">
            Prediga el resultado de los 3 partidos seleccionados esta semana para ganar el premio especial.
          </p>
          
          <div className="flex-1 flex flex-col justify-center bg-black/20 rounded-3xl border border-white/5 p-8 text-center group">
            <div className="flex justify-center items-center gap-8 mb-8">
              <Trophy size={48} className="text-primary opacity-20 group-hover:opacity-40 transition-opacity" />
            </div>
            <Button variant="primary" className="w-full shadow-gold-glow">Ir a la Quiniela</Button>
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

      </div>
      
      <div className="p-8 bg-gold-gradient/[0.03] border border-primary/10 rounded-3xl relative overflow-hidden">
         <div className="absolute top-0 right-0 p-6 opacity-10">
            <Gift size={100} className="text-primary" />
         </div>
         <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
            <div className="w-16 h-16 rounded-2xl bg-gold-gradient flex items-center justify-center shrink-0 shadow-gold-glow">
               <Zap size={32} className="text-dark" />
            </div>
            <div className="flex-1 text-center md:text-left">
               <h4 className="text-2xl font-bold mb-2">Premios Semanales Activos</h4>
               <p className="text-slate-400 font-medium leading-relaxed max-w-2xl">
                 Cada semana sorteamos premios exclusivos entre todos los usuarios que acierten el <span className="text-primary font-bold">Triple Desafío</span>. ¡No olvide enviar sus predicciones antes del cierre!
               </p>
            </div>
            <Button variant="secondary" className="px-8 shrink-0">Mis Premios</Button>
         </div>
      </div>
    </div>
  );
};

export default GamificationView;
