import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Bell, Send, User, Users, Globe, Info, Clock, CheckCircle2 } from 'lucide-react';
import Card from '../ui/Card';
import Button from '../ui/Button';
import Input from '../ui/Input';
import { notificationService, parentService, teamService } from '../../services/api';

const NotificationsView = () => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
   const [sending, setSending] = useState(false);
  const [teams, setTeams] = useState([]);
  
  const isStaff = user?.role === 'coach' || user?.role === 'admin' || user?.role === 'superadmin';
  
  // Form state
  const [formData, setFormData] = useState({
     title: '',
    message: '',
    scope: user?.role === 'coach' ? 'team' : 'global',
    team_ids: []
  });

 

  const fetchNotifications = async () => {
    try {
      let res;
      if (user?.role?.toLowerCase() === 'parent') {
        res = await parentService.getNotifications();
      } else {
        res = await notificationService.getNotifications();
      }
      setNotifications(res.data);
    } catch (err) {
      console.error('Error fetching notifications:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchNotifications();
      if (isStaff) {
        teamService.getTeams({ managedOnly: user?.role === 'coach' }).then(res => {
          setTeams(res.data);
          if (res.data.length > 0 && user?.role === 'coach') {
            setFormData(prev => ({ ...prev, team_ids: [res.data[0].id] }));
          }
        });
      }
    }
  }, [user, isStaff]);



  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (formData.scope === 'team' && formData.team_ids.length === 0) {
      alert('Por favor, seleccione al menos un equipo.');
      return;
    }
    
    setSending(true);
    try {
       await notificationService.sendNotification({
        ...formData,
        type: 'informative'
      });
      setFormData({ 
        title: '', 
        message: '', 
        scope: user?.role === 'coach' ? 'team' : 'global', 
        team_ids: teams.length > 0 && user?.role === 'coach' ? [teams[0].id] : []
      });
      alert('¡Notificación enviada con éxito!');
      fetchNotifications();
    } catch (err) {
      console.error('Error sending notification:', err);
      alert('Error al enviar la notificación. Inténtelo de nuevo.');
    } finally {
      setSending(false);
    }
  };

  const handleMarkRead = async (id) => {
    try {
      await notificationService.markAsRead(id);
      fetchNotifications();
    } catch (err) {
      console.error('Error marking as read:', err);
    }
  };

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-6xl mx-auto">
      <header className="flex flex-col sm:flex-row justify-between items-center gap-6">
        <div>
          <h2 className="text-4xl lg:text-5xl font-bold tracking-tight mb-2">Centro de Comunicaciones</h2>
          <p className="text-slate-400 font-medium">Bandeja de entrada y difusión de mensajes oficiales.</p>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        
        {/* Inbox */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center gap-3 mb-2 px-2">
            <Bell size={20} className="text-primary" />
            <h3 className="text-xl font-bold uppercase tracking-wider text-white">Bandeja de Entrada</h3>
          </div>
          
          <div className="space-y-4">
            {loading ? (
              <div className="flex justify-center p-12">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-primary"></div>
              </div>
            ) : notifications.length === 0 ? (
              <div className="text-center p-12 text-slate-500 italic">
                No tienes notificaciones pendientes.
              </div>
            ) : (
              notifications.map(n => (
                <Card key={n.id} className={`p-8 border-l-4 ${n.type === 'training' ? 'border-l-primary' : 'border-l-slate-600'}`}>
                  <div className="flex flex-col md:flex-row justify-between gap-4 mb-4">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${n.type === 'training' ? 'bg-primary/10 text-primary' : 'bg-slate-500/10 text-slate-400'}`}>
                        {n.type === 'training' ? <Users size={18} /> : <Info size={18} />}
                      </div>
                      <div className="flex flex-col">
                        <h4 className="text-xl font-bold text-white">{n.title}</h4>
                        {n.player_username && (
                          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary mt-1">
                            Para: {n.player_first_name || n.player_username}
                          </span>
                        )}
                      </div>
                    </div>
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                      <Clock size={14} /> {new Date(n.created_at).toLocaleDateString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  
                  <p className="text-slate-400 leading-relaxed mb-6 font-medium">
                    {n.message}
                  </p>
                  
                  <div className="flex items-center gap-4">
                    <span className={`px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest border ${
                      n.scope === 'team' 
                      ? 'bg-primary/5 text-primary border-primary/20' 
                      : 'bg-slate-500/5 text-slate-400 border-slate-500/20'
                    }`}>
                      {n.scope === 'team' ? 'Alcance Equipo' : 'Difusión Global'}
                    </span>
                    
                    {!n.is_read && (
                      <>
                        <div className="flex-1 h-px bg-white/5"></div>
                        <Button variant="ghost" className="text-xs py-1 px-3" onClick={() => handleMarkRead(n.id)}>
                          Marcar como leído
                        </Button>
                      </>
                    )}
                  </div>
                </Card>
              ))
            )}
          </div>
        </div>

        {/* Compose Panel (Coach only) */}
        {(user?.role === 'coach' || user?.role === 'admin' || user?.role === 'superadmin') && (
          <div className="space-y-6 lg:sticky lg:top-28">
            <div className="flex items-center gap-3 mb-2 px-2">
              <Send size={20} className="text-primary" />
              <h3 className="text-xl font-bold uppercase tracking-wider text-white">Difusión</h3>
            </div>
            
            <Card className="p-8 border-primary/20 bg-primary/[0.02]" hover={false}>
              <form onSubmit={handleSubmit} className="space-y-6">
                <Input
                  label="Asunto"
                  placeholder="Título de la notificación..."
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  required
                />

                <div className="space-y-2">
                  <label className="label-base">Mensaje</label>
                  <textarea 
                    rows="4" 
                    placeholder="Escribe el contenido del mensaje de difusión..."
                    className="input-base min-h-[120px] py-4"
                    value={formData.message}
                    onChange={(e) => setFormData({...formData, message: e.target.value})}
                    required
                  ></textarea>
                <div className="grid grid-cols-1 gap-6">
                  {user?.role !== 'coach' && (
                    <div className="space-y-2">
                      <label className="label-base">Alcance (Scope)</label>
                      <select 
                        value={formData.scope}
                        onChange={(e) => setFormData({...formData, scope: e.target.value})}
                        className="input-base cursor-pointer"
                      >
                        {(user?.role === 'admin' || user?.role === 'superadmin') && (
                          <option value="global">Global (Todo el Club)</option>
                        )}
                        <option value="team">Equipo Específico</option>
                      </select>
                    </div>
                  )}

                  {(formData.scope === 'team' || user?.role === 'coach') && (
                    <div className="space-y-3 animate-in fade-in slide-in-from-top-2 duration-300">
                      <div className="space-y-3 p-4 border border-primary/10 rounded-xl bg-primary/[0.03]">
                        <div className="flex justify-between items-center bg-slate-500/10 p-2 rounded-lg mb-2">
                          <label className="label-base mb-0">Seleccionar Equipos</label>
                          {user?.role === 'coach' && teams.length > 1 && (
                            <button 
                              type="button"
                              onClick={() => setFormData(prev => ({
                                ...prev, 
                                team_ids: prev.team_ids.length === teams.length ? [] : teams.map(t => t.id)
                              }))}
                              className="text-[10px] font-bold text-primary uppercase tracking-widest hover:underline"
                            >
                              {formData.team_ids.length === teams.length ? 'Desmarcar Equipos' : 'Marcar Equipos Asignados'}
                            </button>
                          )}
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          {teams.map(t => (
                            <button
                              key={t.id}
                              type="button"
                              onClick={() => {
                                const isSelected = formData.team_ids.includes(t.id);
                                setFormData(prev => ({
                                  ...prev,
                                  team_ids: isSelected 
                                    ? prev.team_ids.filter(id => id !== t.id)
                                    : [...prev.team_ids, t.id]
                                }));
                              }}
                              className={`flex items-center gap-3 p-4 rounded-xl border transition-all text-left ${
                                formData.team_ids.includes(t.id)
                                  ? 'bg-primary/20 border-primary text-primary shadow-gold-glow'
                                  : 'bg-white/5 border-white/10 text-slate-400 hover:bg-white/10'
                              }`}
                            >
                              <div className="flex-1">
                                <p className="text-xs font-bold uppercase tracking-wider truncate">{t.name}</p>
                                <p className="text-[8px] text-slate-500 font-medium">Categoría: {t.category || 'N/A'}</p>
                              </div>
                              {formData.team_ids.includes(t.id) && <CheckCircle2 size={16} />}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>



                <Button 
                  variant="primary" 
                  className="w-full py-4 rounded-2xl" 
                  icon={CheckCircle2}
                  disabled={sending || !formData.title || !formData.message}
                  type="submit"
                >
                  {sending ? 'Lanzando...' : 'Lanzar Notificación'}
                </Button>
              </form>
            </Card>
            
             {user?.role !== 'coach' && (
              <div className="p-6 bg-primary/5 border border-primary/10 rounded-2xl">
                 <p className="text-[10px] text-primary/70 font-bold uppercase tracking-[0.2em] mb-2 leading-tight">Elite Concierge Tip</p>
                 <p className="text-xs text-slate-500 leading-relaxed italic">
                   "Los mensajes con segmentación global son visibles para todos los socios y staff del club."
                 </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationsView;
