import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Calendar, Bell, ArrowRight, Info } from 'lucide-react';
import Card from '../ui/Card';
import Button from '../ui/Button';
import { notificationService, matchService } from '../../services/api';

const Overview = ({ onViewChange }) => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [matches, setMatches] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [notifRes, matchRes] = await Promise.all([
          notificationService.getNotifications(),
          matchService.getMatches()
        ]);
        setNotifications(notifRes.data.slice(0, 3));
        
        // Find next match (closest to today)
        const now = new Date();
        const sortedMatches = matchRes.data
          .filter(m => new Date(m.match_date) >= now.setHours(0,0,0,0))
          .sort((a, b) => new Date(a.match_date) - new Date(b.match_date));
          
        setMatches(sortedMatches);
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
      }
    };

    fetchData();
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
        {/* Next Matches Card */}
        <Card className="flex flex-col lg:col-span-1">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center border border-primary/20">
              <Calendar size={20} className="text-primary" />
            </div>
            <h3 className="text-xl font-bold">Próximos Partidos</h3>
          </div>

          <div className="space-y-4 flex-1">
            {matches.length > 0 ? (
              matches.slice(0, 2).map((match, idx) => (
                <div key={idx} className="p-4 bg-white/5 rounded-2xl border border-white/5 border-dashed relative overflow-hidden group">
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-[10px] font-black text-primary uppercase tracking-widest bg-primary/10 px-2 py-0.5 rounded">
                      {match.match_date}
                    </span>
                    <span className="text-[10px] font-bold text-slate-500 uppercase">
                      {match.match_time.substring(0, 5)}
                    </span>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-tighter">
                      {match.team_name}
                    </p>
                    <h4 className="text-lg font-bold">
                      {match.is_home ? `vs ${match.opponent}` : `@ ${match.opponent}`}
                    </h4>
                  </div>
                  <div className="mt-3 flex items-center gap-2">
                    <span className={`w-1.5 h-1.5 rounded-full ${match.published ? 'bg-green-500' : 'bg-yellow-500'}`}></span>
                    <p className="text-[10px] text-slate-400 font-medium truncate">{match.location || 'Localización por definir'}</p>
                  </div>
                  {idx === 0 && (
                    <div className="absolute top-0 right-0 p-1">
                       <span className="bg-gold-gradient text-[8px] font-black px-1.5 py-0.5 rounded text-dark uppercase">Inminente</span>
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center p-8 opacity-50 border border-white/5 border-dashed rounded-2xl">
                <p className="text-slate-500 text-sm font-medium">No hay partidos programados.</p>
              </div>
            )}
          </div>

          {matches.length > 0 && (
            <Button variant="outline" className="mt-6 w-full py-2 text-sm border-white/5" onClick={() => onViewChange?.('Calendario')} icon={ArrowRight}>
              Ver Calendario Completo
            </Button>
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
