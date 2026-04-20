import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { 
  Calendar, 
  MapPin, 
  Clock, 
  Plus, 
  ArrowLeft, 
  ClipboardCheck, 
  X, 
  Search, 
  Trophy, 
  Swords, 
  ArrowRight 
} from 'lucide-react';
import Card from '../ui/Card';
import Button from '../ui/Button';
import Input from '../ui/Input';

const ScheduleView = () => {
  const { user } = useAuth();
  const [selectedMatch, setSelectedMatch] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [newEvent, setNewEvent] = useState({
    type: 'training',
    title: '',
    date: '2026-04-18',
    time: '18:00',
    location: '',
    description: '',
    team: 'Primer Equipo'
  });

  const [events, setEvents] = useState([
    { 
      id: 1, 
      type: 'match', 
      title: 'vs Galaxy United', 
      date: '2026-04-18', 
      time: '10:30', 
      location: 'Estadio Local', 
      team: 'Primer Equipo',
      description: 'Partido correspondiente a la jornada 24 de liga.',
      callup: ['Juan Pérez', 'Marcos Ruiz', 'Luis Cano', 'Iván G.', 'Pol Soler']
    },
    { 
      id: 2, 
      type: 'training', 
      title: 'Entrenamiento Táctico', 
      date: '2026-04-15', 
      time: '18:00',
      description: 'Sesión enfocada en la salida de balón y presión tras pérdida.',
      team: 'Primer Equipo',
      callup: null
    },
    { 
      id: 3, 
      type: 'training', 
      title: 'Físico', 
      date: '2026-04-16', 
      time: '17:30',
      description: 'Trabajo preventivo y de fuerza en el gimnasio.',
      team: 'Juvenil A',
      callup: null
    },
  ]);

  const handleCreateEvent = (e) => {
    e.preventDefault();
    const event = {
      ...newEvent,
      id: Date.now(),
      callup: newEvent.type === 'match' ? ['Jugador Demo 1', 'Jugador Demo 2'] : null
    };
    setEvents([event, ...events]);
    setShowForm(false);
    setNewEvent({ type: 'training', title: '', date: '2026-04-18', time: '18:00', location: '', description: '', team: 'Primer Equipo' });
  };

  const getDay = (dateStr) => {
    if (!dateStr || typeof dateStr !== 'string') return '??';
    const parts = dateStr.split('-');
    return parts.length > 2 ? parts[2] : dateStr;
  };

  if (selectedMatch) {
    return (
      <div className="space-y-8 animate-in fade-in slide-in-from-left-4 duration-500">
        <Button 
          variant="secondary" 
          onClick={() => setSelectedMatch(null)} 
          className="px-4 py-2 text-sm" 
          icon={ArrowLeft}
        >
          Volver al Calendario
        </Button>

        <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h2 className="text-4xl font-bold tracking-tight mb-2">
              Detalle del <span className="text-gold-glow">Partido</span>
            </h2>
            <p className="text-slate-400 font-medium tracking-wide">
              {selectedMatch.team || 'Sin equipo'} • Jornada de Liga
            </p>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          <Card className="lg:col-span-2 p-8" hover={false}>
            <div className="flex items-center gap-4 mb-10">
               <div className="w-16 h-16 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center">
                  <Swords size={32} className="text-primary" />
               </div>
               <div>
                  <h3 className="text-3xl font-bold">{selectedMatch.title || 'Sin título'}</h3>
                  <span className="px-3 py-1 bg-primary/10 text-primary border border-primary/20 rounded-full text-[10px] font-bold uppercase tracking-widest mt-2">Competición Oficial</span>
               </div>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-12 p-6 bg-white/5 rounded-2xl border border-white/5">
              <div className="flex items-center gap-4">
                <Calendar size={20} className="text-primary" />
                <div>
                   <p className="text-[10px] uppercase font-bold text-slate-500 tracking-widest">Fecha</p>
                   <p className="font-bold text-slate-200">{selectedMatch.date || '---'}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <Clock size={20} className="text-primary" />
                <div>
                   <p className="text-[10px] uppercase font-bold text-slate-500 tracking-widest">Hora</p>
                   <p className="font-bold text-slate-200">{selectedMatch.time || '---'}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <MapPin size={20} className="text-primary" />
                <div>
                   <p className="text-[10px] uppercase font-bold text-slate-500 tracking-widest">Lugar</p>
                   <p className="font-bold text-slate-200">{selectedMatch.location || 'Consultar'}</p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
               <h4 className="text-lg font-bold flex items-center gap-2">
                 <Search size={18} className="text-primary" /> Objetivos Técnico-Tácticos
               </h4>
               <p className="text-slate-400 font-medium leading-relaxed bg-black/20 p-6 rounded-xl border border-white/5 italic">
                  "{selectedMatch.description || 'Sin descripción detallada.'}"
               </p>
            </div>
          </Card>

          {selectedMatch.callup && Array.isArray(selectedMatch.callup) && (
            <Card className="p-0 border-white/5 overflow-hidden" hover={false}>
              <div className="p-8 border-b border-white/5 bg-white/5">
                <h3 className="text-xl font-bold flex items-center gap-3">
                  <ClipboardCheck size={24} className="text-primary" /> Convocatoria
                </h3>
              </div>
              <div className="divide-y divide-white/5">
                {selectedMatch.callup.map((player, idx) => (
                  <div key={idx} className="px-8 py-4 flex items-center justify-between group hover:bg-white/5 transition-colors">
                    <span className="font-bold text-slate-300 group-hover:text-primary transition-colors">{player}</span>
                    <div className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.3)]"></div>
                  </div>
                ))}
              </div>
            </Card>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <header className="flex flex-col sm:flex-row justify-between items-center gap-6">
        <div>
          <h2 className="text-4xl lg:text-5xl font-bold tracking-tight mb-2">Calendario y Eventos</h2>
          <p className="text-slate-400 font-medium">Planificación estratégica de la temporada.</p>
        </div>
        {(user?.role === 'coach' || user?.role === 'superadmin' || user?.role === 'admin') && (
          <Button 
            variant={showForm ? 'secondary' : 'primary'} 
            onClick={() => setShowForm(!showForm)} 
            icon={showForm ? X : Plus}
            className="w-full sm:w-auto"
          >
            {showForm ? 'Cancelar' : 'Nuevo Evento'}
          </Button>
        )}
      </header>

      {showForm && (
        <Card className="border-primary/30 shadow-gold/10" hover={false}>
          <form onSubmit={handleCreateEvent} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="space-y-2">
              <label className="label-base">Tipo de Evento</label>
              <select 
                value={newEvent.type} 
                onChange={(e) => setNewEvent({...newEvent, type: e.target.value})} 
                className="input-base cursor-pointer"
              >
                <option value="training">🏋️ Entrenamiento</option>
                <option value="match">⚽ Partido</option>
              </select>
            </div>
            <Input
              label="Título del evento"
              value={newEvent.title}
              onChange={(e) => setNewEvent({...newEvent, title: e.target.value})}
              placeholder="Ej: Derby vs Galaxy"
              required
            />
            <Input
              label="Fecha"
              type="date"
              value={newEvent.date}
              onChange={(e) => setNewEvent({...newEvent, date: e.target.value})}
              required
            />
            <Input
              label="Equipo"
              value={newEvent.team}
              onChange={(e) => setNewEvent({...newEvent, team: e.target.value})}
              required
            />
            
            {newEvent.type === 'match' && (
               <>
                <Input
                  label="Hora de Inicio"
                  type="time"
                  value={newEvent.time}
                  onChange={(e) => setNewEvent({...newEvent, time: e.target.value})}
                />
                <Input
                  label="Localización"
                  value={newEvent.location}
                  onChange={(e) => setNewEvent({...newEvent, location: e.target.value})}
                  placeholder="Estadio / Campo"
                  icon={MapPin}
                />
               </>
            )}
            
            <div className="lg:col-span-4 space-y-2">
              <label className="label-base">Descripción / Objetivos</label>
              <textarea 
                value={newEvent.description} 
                onChange={(e) => setNewEvent({...newEvent, description: e.target.value})} 
                placeholder="Indique los detalles relevantes para el staff y jugadores..."
                className="input-base min-h-[100px] py-4"
              />
            </div>
            
            <div className="lg:col-span-4 pt-4">
              <Button type="submit" variant="primary" className="w-full py-4 text-lg" icon={Plus}>
                Publicar Evento en Calendario
              </Button>
            </div>
          </form>
        </Card>
      )}

      <div className="space-y-4">
        {events && Array.isArray(events) && events.map(event => (
          <Card 
            key={event.id} 
            className="p-1 px-8 lg:px-10 hover:border-primary/40"
            hover={true}
          >
            <div className="flex flex-col lg:flex-row items-center justify-between gap-8 py-6">
              <div className="flex flex-col lg:flex-row items-center gap-8 w-full">
                {/* Date Plate */}
                <div className="flex flex-col items-center justify-center w-20 h-20 rounded-2xl bg-white/5 border border-white/10 shadow-glass shrink-0 group-hover:border-primary/30 transition-colors">
                  <span className="text-3xl font-bold text-white leading-none">{getDay(event.date)}</span>
                  <span className="text-[10px] font-extrabold text-primary uppercase tracking-widest mt-1">2026</span>
                </div>

                <div className="flex-1 text-center lg:text-left space-y-2">
                  <div className="flex flex-wrap justify-center lg:justify-start items-center gap-3">
                    <span className={`px-3 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-[0.2em] border ${
                      event.type === 'match' 
                      ? 'bg-red-500/10 text-red-400 border-red-500/20' 
                      : 'bg-primary/10 text-primary border-primary/20'
                    }`}>
                      {event.type === 'match' ? 'Competición' : 'Entrenamiento'}
                    </span>
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center gap-1.5">
                      <div className="w-1 h-1 rounded-full bg-slate-600"></div> {event.team || 'Golea'}
                    </span>
                  </div>
                  <h4 className="text-2xl font-bold group-hover:text-primary transition-colors">{event.title || 'Sin Título'}</h4>
                  
                  <div className="flex flex-wrap justify-center lg:justify-start items-center gap-6 text-sm text-slate-500 font-medium">
                    <span className="flex items-center gap-2">
                      <Clock size={16} className="text-primary/70" /> {event.time || 'Horario a confirmar'}
                    </span>
                    {event.location && (
                      <span className="flex items-center gap-2">
                        <MapPin size={16} className="text-primary/70" /> {event.location}
                      </span>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="shrink-0 w-full lg:w-auto">
                 {event.type === 'match' ? (
                   <Button 
                    variant="secondary"
                    onClick={() => setSelectedMatch(event)}
                    icon={ArrowRight}
                    className="w-full lg:w-auto px-8 py-3 rounded-xl border-white/5"
                  >
                    Detalles del Match
                  </Button>
                 ) : (
                    <div className="hidden lg:flex items-center gap-2 text-slate-600">
                       <Trophy size={20} />
                    </div>
                 )}
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ScheduleView;
