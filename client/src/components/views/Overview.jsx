import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Calendar, Bell, ArrowRight, Info } from 'lucide-react';
import Card from '../ui/Card';
import Button from '../ui/Button';

const Overview = ({ onViewChange }) => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [matches, setMatches] = useState([]);

  useEffect(() => {
    // Mocking logic for demo mode
    const mockNotifs = [
      { type: 'match', title: 'Entrenamiento Actualizado', message: 'El entrenamiento de hoy se mueve al campo 2.' },
      { type: 'info', title: 'Nueva Notificación', message: 'Se ha abierto el periodo de inscripción para el torneo de verano.' }
    ];
    const mockMatches = [
      { match_date: '2026-04-18', match_time: '10:30', opponent: 'Galaxy United', location: 'Estadio Local', is_home: true }
    ];

    setNotifications(mockNotifs);
    setMatches(mockMatches);
  }, []);

  const nextMatch = matches[0];

  return (
    <div className="space-y-10">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl lg:text-5xl font-bold tracking-tight mb-2">
            Hola, <span className="text-gold-glow">{user?.username}</span>
          </h1>
          <p className="text-slate-400 font-medium tracking-wide">
            Esto es lo que está pasando en el club hoy.
          </p>
        </div>
        <div className="flex gap-4">
          <Button variant="secondary" className="px-5 py-2 text-sm" icon={Bell} onClick={() => onViewChange?.('Notificaciones')}>
            Notificaciones
          </Button>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {/* Next Match Card */}
        <Card className="flex flex-col">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center border border-primary/20">
              <Calendar size={20} className="text-primary" />
            </div>
            <h3 className="text-xl font-bold">Próximo Partido</h3>
          </div>

          {nextMatch ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center py-4 bg-white/5 rounded-2xl border border-white/5 border-dashed">
              <p className="text-xs font-bold text-primary uppercase tracking-[0.2em] mb-4">
                {nextMatch.match_date} • {nextMatch.match_time}
              </p>
              <h4 className="text-2xl font-bold mb-2">Golea FC</h4>
              <p className="text-slate-500 font-bold text-sm mb-2">VS</p>
              <h4 className="text-2xl font-bold mb-6">{nextMatch.opponent}</h4>
              <p className="text-xs font-bold text-slate-400 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
                {nextMatch.location}
              </p>
              
              <Button variant="outline" className="mt-8 w-full py-3" onClick={() => onViewChange?.('Calendario')} icon={ArrowRight}>
                Ver Detalles
              </Button>
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center p-8 opacity-50">
              <p className="text-slate-500">No hay partidos programados.</p>
            </div>
          )}
        </Card>

        {/* Notifications Card */}
        <Card className="lg:col-span-2">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center border border-primary/20">
              <Bell size={20} className="text-primary" />
            </div>
            <h3 className="text-xl font-bold">Últimas Notificaciones</h3>
          </div>

          <div className="space-y-4">
            {notifications.map((n, i) => (
              <div 
                key={i} 
                className="group flex gap-4 p-4 rounded-2xl bg-white/5 border border-white/5 hover:border-primary/20 hover:bg-white/10 transition-all cursor-pointer"
                onClick={() => onViewChange?.('Notificaciones')}
              >
                <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-dark flex items-center justify-center border border-white/5">
                  <Info size={16} className="text-slate-400 group-hover:text-primary transition-colors" />
                </div>
                <div>
                  <p className="font-bold text-white mb-1 group-hover:text-primary transition-colors">{n.title}</p>
                  <p className="text-sm text-slate-400 leading-relaxed">{n.message}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Overview;
