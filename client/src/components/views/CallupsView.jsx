import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { ClipboardList, Search, Calendar, ChevronRight, Trophy, Swords } from 'lucide-react';
import CallupVisual from '../CallupVisual';
import Card from '../ui/Card';
import Button from '../ui/Button';

const CallupsView = () => {
  const { user } = useAuth();
  const [selectedEvent, setSelectedEvent] = useState(1);

  const mockPlayers = [
    { id: 101, name: 'Marc Rovira', jerseyNumber: 10, position: 'Delantero' },
    { id: 102, name: 'Pau García', jerseyNumber: 1, position: 'Portero' },
    { id: 103, name: 'Àlex Marín', jerseyNumber: 4, position: 'Defensa' },
    { id: 104, name: 'Joan Font', jerseyNumber: 8, position: 'Mediocentro' },
    { id: 105, name: 'Sergi López', jerseyNumber: 11, position: 'Extremo' },
    { id: 106, name: 'Dani Ruiz', jerseyNumber: 5, position: 'Defensa' },
  ];

  const events = [
    { id: 1, title: 'vs Galaxy United', type: 'PARTIDO', date: '18 Abr • 10:30', icon: Swords },
    { id: 2, title: 'Táctico Miércoles', type: 'ENTRENAMIENTO', date: '15 Abr • 18:00', icon: Trophy }
  ];

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-6xl mx-auto">
      <header className="flex flex-col sm:flex-row justify-between items-center gap-6">
        <div>
          <h2 className="text-4xl lg:text-5xl font-bold tracking-tight mb-2">Gestión de Convocatorias</h2>
          <p className="text-slate-400 font-medium">Seleccione los activos de élite para los próximos compromisos.</p>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Event Selector */}
        <div className="space-y-6">
          <div className="flex items-center gap-3 mb-2 px-2">
            <Calendar size={20} className="text-primary" />
            <h3 className="text-xl font-bold uppercase tracking-wider text-white">Eventos Próximos</h3>
          </div>
          
          <div className="space-y-3">
            {events.map((event) => {
              const Icon = event.icon;
              const isActive = selectedEvent === event.id;
              return (
                <div 
                  key={event.id}
                  onClick={() => setSelectedEvent(event.id)}
                  className={`relative p-6 rounded-2xl cursor-pointer transition-all duration-500 border group ${
                    isActive 
                    ? 'bg-primary/10 border-primary shadow-gold-glow' 
                    : 'bg-white/5 border-white/5 hover:border-white/10 hover:bg-white/[0.08]'
                  }`}
                >
                  {isActive && (
                    <div className="absolute -left-1 top-1/2 -translate-y-1/2 w-2 h-8 bg-primary rounded-full blur-[2px]"></div>
                  )}
                  
                  <div className="flex justify-between items-start mb-3">
                    <span className={`text-[10px] font-bold uppercase tracking-[0.2em] ${isActive ? 'text-primary' : 'text-slate-500'}`}>
                      {event.type}
                    </span>
                    <Icon size={16} className={isActive ? 'text-primary' : 'text-slate-600'} />
                  </div>
                  
                  <h4 className={`text-lg font-bold mb-1 transition-colors ${isActive ? 'text-white' : 'text-slate-300 group-hover:text-white'}`}>
                    {event.title}
                  </h4>
                  <p className="text-xs font-medium text-slate-500 tracking-wide">
                    {event.date}
                  </p>
                  
                  {isActive && (
                    <div className="mt-4 flex justify-end">
                      <ChevronRight size={16} className="text-primary animate-pulse" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
          
          <div className="p-6 bg-primary/5 border border-primary/10 rounded-2xl">
             <p className="text-[10px] text-primary/70 font-bold uppercase tracking-[0.2em] mb-2 leading-tight">Configuración de Staff</p>
             <p className="text-xs text-slate-500 leading-relaxed italic">
               "Las convocatorias se notifican automáticamente a través de la red privada una vez publicadas."
             </p>
          </div>
        </div>

        {/* Visual Selector Area */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center gap-3 mb-2 px-2">
            <ClipboardList size={20} className="text-primary" />
            <h3 className="text-xl font-bold uppercase tracking-wider text-white">Configuración de Plantilla</h3>
          </div>
          
          <Card className="p-4 lg:p-8 border-white/5 overflow-hidden" hover={false}>
            <div className="mb-8 p-4 bg-white/5 rounded-xl border border-white/5 flex items-center justify-between">
               <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-primary animate-pulse"></div>
                  <span className="text-sm font-bold text-slate-400 tracking-wide">Interface de Selección en Tiempo Real</span>
               </div>
               <Button variant="ghost" className="text-xs py-1" icon={Search}>
                 Filtrar Jugadores
               </Button>
            </div>
            
            <CallupVisual 
              players={mockPlayers} 
              onSelectionChange={(ids) => console.log('Selected:', ids)} 
            />
            
            <div className="mt-12 flex justify-end gap-4 border-t border-white/5 pt-8">
              <Button variant="secondary" className="px-8">Descargar PDF</Button>
              <Button variant="primary" className="px-10 py-4 shadow-gold-glow">Publicar Convocatoria</Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CallupsView;
