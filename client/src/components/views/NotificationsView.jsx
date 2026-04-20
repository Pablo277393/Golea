import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Bell, Send, User, Users, Globe, Info, Clock, CheckCircle2 } from 'lucide-react';
import Card from '../ui/Card';
import Button from '../ui/Button';
import Input from '../ui/Input';

const NotificationsView = () => {
  const { user } = useAuth();
  const [notifications] = useState([
    { id: 1, title: 'Entrenamiento Actualizado', message: 'El entrenamiento de hoy se mueve al campo 2 para mejorar el drenaje tras las lluvias.', date: 'Hoy, 09:00', scope: 'team', type: 'training' },
    { id: 2, title: 'Equipación Nueva', message: 'Ya están disponibles las nuevas equipaciones de entrenamiento en las oficinas del club.', date: 'Ayer, 18:30', scope: 'global', type: 'info' },
  ]);

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
            {notifications.map(n => (
              <Card key={n.id} className={`p-8 border-l-4 ${n.type === 'training' ? 'border-l-primary' : 'border-l-slate-600'}`}>
                <div className="flex flex-col md:flex-row justify-between gap-4 mb-4">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${n.type === 'training' ? 'bg-primary/10 text-primary' : 'bg-slate-500/10 text-slate-400'}`}>
                      {n.type === 'training' ? <Users size={18} /> : <Info size={18} />}
                    </div>
                    <h4 className="text-xl font-bold text-white">{n.title}</h4>
                  </div>
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                    <Clock size={14} /> {n.date}
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
                  
                  <div className="flex-1 h-px bg-white/5"></div>
                  
                  <Button variant="ghost" className="text-xs py-1 px-3">
                    Marcar como leído
                  </Button>
                </div>
              </Card>
            ))}
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
              <form className="space-y-6">
                <Input
                  label="Asunto"
                  placeholder="Título de la notificación..."
                  required
                />

                <div className="space-y-2">
                  <label className="label-base">Mensaje</label>
                  <textarea 
                    rows="4" 
                    placeholder="Escribe el contenido del mensaje de difusión..."
                    className="input-base min-h-[120px] py-4"
                  ></textarea>
                </div>

                <div className="space-y-3">
                  <label className="label-base">Destinatarios</label>
                  <div className="grid grid-cols-3 gap-2">
                    <button type="button" title="Global" className="p-3 bg-white/5 border border-white/10 rounded-xl text-slate-400 hover:bg-primary/20 hover:text-primary hover:border-primary/40 transition-all flex justify-center">
                      <Globe size={20} />
                    </button>
                    <button type="button" title="Equipo" className="p-3 bg-white/5 border border-white/10 rounded-xl text-slate-400 hover:bg-primary/20 hover:text-primary hover:border-primary/40 transition-all flex justify-center">
                      <Users size={20} />
                    </button>
                    <button type="button" title="Individual" className="p-3 bg-white/5 border border-white/10 rounded-xl text-slate-400 hover:bg-primary/20 hover:text-primary hover:border-primary/40 transition-all flex justify-center">
                      <User size={20} />
                    </button>
                  </div>
                </div>

                <Button variant="primary" className="w-full py-4 rounded-2xl" icon={CheckCircle2}>
                  Lanzar Notificación
                </Button>
              </form>
            </Card>
            
            <div className="p-6 bg-primary/5 border border-primary/10 rounded-2xl">
               <p className="text-[10px] text-primary/70 font-bold uppercase tracking-[0.2em] mb-2 leading-tight">Elite Concierge Tip</p>
               <p className="text-xs text-slate-500 leading-relaxed italic">
                 "Los mensajes con segmentación global son visibles para todos los socios y staff del club."
               </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationsView;
