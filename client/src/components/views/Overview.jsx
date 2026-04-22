import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Calendar, Bell, ArrowRight, Info, MoreVertical, QrCode, Copy, Check } from 'lucide-react';
import Card from '../ui/Card';
import Button from '../ui/Button';
import Modal from '../ui/Modal';
import { notificationService, matchService, playerService, parentService } from '../../services/api';

const Overview = ({ onViewChange }) => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [matches, setMatches] = useState([]);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [linkingCode, setLinkingCode] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        let notifRes, matchRes;
        
        if (user?.role?.toLowerCase() === 'parent') {
          [notifRes, matchRes] = await Promise.all([
            parentService.getNotifications(),
            parentService.getUpcomingMatches()
          ]);
        } else {
          [notifRes, matchRes] = await Promise.all([
            notificationService.getNotifications(),
            matchService.getMatches()
          ]);
        }

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
  }, [user]);

  const handleGenerateCode = async () => {
    setIsGenerating(true);
    setIsMenuOpen(false);
    try {
      const res = await playerService.generateLinkingCode();
      setLinkingCode(res.data.linkingCode);
      setIsModalOpen(true);
    } catch (err) {
      console.error('Error generating linking code:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(linkingCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

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
        <div className="flex gap-4 relative">
          <Button variant="secondary" className="px-5 py-2 text-sm" icon={Bell} onClick={() => onViewChange?.('Notificaciones')}>
            Notificaciones
          </Button>
          
          {user?.role?.toLowerCase() === 'player' && (
            <div className="relative">
              <Button 
                variant="outline" 
                className="p-3 border-white/10" 
                icon={MoreVertical} 
                onClick={() => setIsMenuOpen(!isMenuOpen)} 
              />
              
              {isMenuOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-surface/95 backdrop-blur-xl border border-white/10 rounded-2xl shadow-glass z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                  <button 
                    onClick={handleGenerateCode}
                    disabled={isGenerating}
                    className="w-full text-left px-6 py-4 text-xs font-bold uppercase tracking-widest text-slate-300 hover:text-primary hover:bg-white/5 transition-all flex items-center gap-3"
                  >
                    <QrCode size={16} />
                    {isGenerating ? 'Generando...' : 'Código Vinculación'}
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </header>

      {/* Linking Code Modal */}
      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        title="Código de Vinculación"
      >
        <div className="text-center space-y-6">
          <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto border border-primary/20 text-primary">
            <QrCode size={40} />
          </div>
          
          <div>
            <p className="text-slate-400 text-sm font-medium mb-2 uppercase tracking-widest">Tu código único es:</p>
            <div className="bg-dark/50 border border-white/10 rounded-2xl p-6 font-mono text-3xl font-black text-primary tracking-tighter shadow-inner relative group">
              {linkingCode}
              <button 
                onClick={copyToClipboard}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-primary/10 rounded-xl text-primary opacity-0 group-hover:opacity-100 transition-all hover:bg-primary hover:text-dark"
              >
                {copied ? <Check size={18} /> : <Copy size={18} />}
              </button>
            </div>
          </div>

          <p className="text-[10px] text-slate-500 uppercase tracking-tight leading-relaxed">
            Comparte este código con tu padre o madre para que puedan vincular tu perfil a su cuenta.
          </p>

          <Button className="w-full justify-center py-4 rounded-2xl" onClick={() => setIsModalOpen(false)}>
            Entendido
          </Button>
        </div>
      </Modal>

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
                      {match.player_username && (
                        <span className="ml-2 text-[7px] font-black uppercase tracking-[0.2em] text-primary bg-primary/10 px-1.5 py-0.5 rounded align-middle">
                          {match.player_first_name || match.player_username}
                        </span>
                      )}
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
                  <div className="flex items-center gap-2 mb-1">
                    <p className="font-bold text-white group-hover:text-primary transition-colors">{n.title}</p>
                    {n.player_username && (
                      <span className="text-[7px] font-black uppercase tracking-[0.2em] text-primary bg-primary/10 px-1.5 py-0.5 rounded">
                        {n.player_first_name || n.player_username}
                      </span>
                    )}
                  </div>
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
