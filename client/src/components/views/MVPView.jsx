import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Trophy, Award, TrendingUp, ThumbsUp, CheckCircle, Star, Target, Crown } from 'lucide-react';
import Card from '../ui/Card';
import Button from '../ui/Button';

const MVPView = () => {
  const [votedId, setVotedId] = useState(null);
  const [candidates, setCandidates] = useState([
    { id: 1, name: 'Marc Rovira', votes: 12, position: 'Delantero' },
    { id: 2, name: 'Pau García', votes: 8, position: 'Portero' },
    { id: 3, name: 'Àlex Marín', votes: 15, position: 'Defensa' },
    { id: 4, name: 'Dani Ruiz', votes: 5, position: 'Mediocentro' }
  ]);

  const handleVote = (id) => {
    if (votedId === id) return;
    
    setCandidates(candidates.map(c => {
      if (c.id === id) return { ...c, votes: c.votes + 1 };
      if (c.id === votedId) return { ...c, votes: c.votes - 1 };
      return c;
    }));
    setVotedId(id);
  };

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700 max-w-6xl mx-auto">
      <header className="flex flex-col sm:flex-row justify-between items-center gap-6">
        <div>
          <h2 className="text-4xl lg:text-5xl font-bold tracking-tight mb-2">Votaciones MVP</h2>
          <p className="text-slate-400 font-medium tracking-wide">El prestigio se gana en el campo. Elija a la figura de la jornada.</p>
        </div>
        <div className="flex items-center gap-3 px-6 py-3 bg-primary/10 border border-primary/20 rounded-2xl">
           <Crown size={20} className="text-primary" />
           <span className="text-sm font-bold text-primary uppercase tracking-widest">Hall of Fame Access</span>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Candidates Selection */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center gap-3 mb-2 px-2">
            <Trophy size={20} className="text-primary" />
            <h3 className="text-xl font-bold uppercase tracking-wider text-white">Nómina de Candidatos</h3>
          </div>
          
          <div className="grid gap-4">
            {candidates.map((candidate, i) => {
              const isActive = votedId === candidate.id;
              return (
                <div 
                  key={candidate.id} 
                  className={`relative p-6 rounded-2xl flex items-center justify-between border transition-all duration-500 group ${
                    isActive 
                    ? 'bg-primary/10 border-primary shadow-gold-glow' 
                    : 'bg-white/5 border-white/5 hover:border-white/10 hover:bg-white/[0.08]'
                  }`}
                >
                  <div className="flex items-center gap-6">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold text-lg border transition-all ${
                      isActive 
                      ? 'bg-primary text-dark border-primary' 
                      : 'bg-white/5 text-slate-500 border-white/10 group-hover:border-primary/30 group-hover:text-primary'
                    }`}>
                      {i + 1}
                    </div>
                    
                    <div>
                      <h4 className={`text-xl font-bold transition-colors ${isActive ? 'text-white' : 'text-slate-300 group-hover:text-white'}`}>
                        {candidate.name}
                      </h4>
                      <div className="flex items-center gap-3 text-xs font-bold uppercase tracking-widest mt-1">
                        <span className="text-slate-500">{candidate.position}</span>
                        <span className="w-1 h-1 rounded-full bg-slate-700"></span>
                        <span className="text-primary">{candidate.votes} Votos de Elite</span>
                      </div>
                    </div>
                  </div>

                  <Button 
                    onClick={() => handleVote(candidate.id)}
                    variant={isActive ? 'primary' : 'secondary'}
                    className="px-6 py-2.5 text-sm"
                    icon={isActive ? CheckCircle : ThumbsUp}
                  >
                    {isActive ? 'Votado' : 'Votar'}
                  </Button>
                </div>
              );
            })}
          </div>
        </div>

        {/* Current Leader / Last MVP */}
        <div className="space-y-6">
          <div className="flex items-center gap-3 mb-2 px-2">
            <Award size={20} className="text-primary" />
            <h3 className="text-xl font-bold uppercase tracking-wider text-white">MVP Histórico</h3>
          </div>
          
          <Card className="p-0 border-primary/20 bg-primary/[0.02]" hover={false}>
            <div className="p-8 text-center relative overflow-hidden group">
               <div className="absolute inset-0 bg-primary/5 blur-[80px] group-hover:bg-primary/10 transition-all pointer-events-none"></div>
               
               <div className="relative z-10">
                 <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gold-gradient p-[1px] shadow-gold-glow group-hover:scale-105 transition-transform">
                    <div className="w-full h-full rounded-full bg-dark flex items-center justify-center">
                       <TrendingUp size={40} className="text-primary" />
                    </div>
                 </div>
                 
                 <h2 className="text-3xl font-bold text-white mb-2">Marc Rovira</h2>
                 <p className="text-[10px] font-bold text-primary uppercase tracking-[0.2em] mb-8">Máximo Exponente • Semana 14</p>
                 
                 <div className="grid grid-cols-2 gap-4 mb-8">
                    <div className="p-4 bg-white/5 rounded-2xl border border-white/10">
                       <p className="text-3xl font-bold text-white">3</p>
                       <p className="text-[8px] font-bold text-slate-500 uppercase tracking-widest mt-1">GOLES</p>
                    </div>
                    <div className="p-4 bg-white/5 rounded-2xl border border-white/10">
                       <p className="text-3xl font-bold text-white">1</p>
                       <p className="text-[8px] font-bold text-slate-500 uppercase tracking-widest mt-1">ASISTENCIAS</p>
                    </div>
                 </div>

                 <Button variant="ghost" className="w-full text-xs" icon={ArrowRight}>
                    Ver Galería de Éxitos
                 </Button>
               </div>
            </div>
            
            <div className="p-6 bg-primary/10 border-t border-primary/20 flex items-center gap-4">
               <div className="p-2 rounded-lg bg-primary/20">
                  <Star size={16} className="text-primary" />
               </div>
               <div className="flex-1">
                  <p className="text-[10px] font-bold text-primary uppercase tracking-widest mb-1">Récord de la Red</p>
                  <div className="h-1.5 w-full bg-dark rounded-full overflow-hidden">
                     <div className="h-full bg-primary w-[85%] rounded-full shadow-gold-glow"></div>
                  </div>
               </div>
            </div>
          </Card>
          
          <div className="p-6 bg-black/20 border border-white/5 rounded-2xl">
             <div className="flex gap-3">
                <Target size={18} className="text-slate-500 shrink-0 mt-1" />
                <p className="text-xs text-slate-500 leading-relaxed font-medium italic">
                  "El MVP de la jornada se calcula mediante una ponderación de votos de socios y métricas algorítmicas de rendimiento."
                </p>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const ArrowRight = ({ size, className }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <path d="M5 12h14m-7-7 7 7-7 7"/>
  </svg>
);

export default MVPView;
