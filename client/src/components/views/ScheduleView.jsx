import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Calendar, MapPin, Clock, Plus, ArrowLeft, ClipboardCheck } from 'lucide-react';

const ScheduleView = () => {
  const { user } = useAuth();
  const [selectedMatch, setSelectedMatch] = useState(null);

  const [events] = useState([
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
      description: 'Sesión enfocada en la salida de balón y presión tras pérdida. Traer ropa de entrenamiento oficial.',
      team: 'Primer Equipo' 
    },
    { 
      id: 3, 
      type: 'training', 
      title: 'Físico', 
      date: '2026-04-16', 
      description: 'Trabajo preventivo y de fuerza en el gimnasio del club.',
      team: 'Juvenil A' 
    },
  ]);

  if (selectedMatch) {
    return (
      <div>
        <button 
          onClick={() => setSelectedMatch(null)} 
          className="btn btn-outline" 
          style={{ marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
        >
          <ArrowLeft size={18} /> Volver al Calendario
        </button>

        <header style={{ marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '1.75rem', fontWeight: '800' }}>Detalle del <span className="text-gradient">Partido</span></h2>
          <p style={{ color: 'var(--text-muted)' }}>{selectedMatch.team} • Jornada de Liga</p>
        </header>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: '1.5rem', alignItems: 'start' }}>
          <div className="glass-card">
            <h3 style={{ marginBottom: '1.5rem', fontSize: '1.25rem' }}>{selectedMatch.title}</h3>
            
            <div style={{ display: 'grid', gap: '1rem', marginBottom: '2rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--text-muted)' }}>
                <Calendar size={18} className="text-primary" /> <strong>Fecha:</strong> {selectedMatch.date}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--text-muted)' }}>
                <Clock size={18} className="text-primary" /> <strong>Hora:</strong> {selectedMatch.time}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--text-muted)' }}>
                <MapPin size={18} className="text-primary" /> <strong>Lugar:</strong> {selectedMatch.location}
              </div>
            </div>

            <p style={{ color: 'var(--text-muted)', lineHeight: '1.6' }}>{selectedMatch.description}</p>
          </div>

          <div className="glass-card">
            <h3 style={{ marginBottom: '1.5rem', fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <ClipboardCheck size={20} className="text-gradient" /> Convocatoria
            </h3>
            <ul style={{ listStyle: 'none', padding: 0 }}>
              {selectedMatch.callup.map((player, idx) => (
                <li key={idx} style={{ padding: '0.75rem 0', borderBottom: '1px solid var(--border)', fontSize: '0.9rem' }}>
                  {player}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: '700' }}>Calendario y Eventos</h2>
        {(user?.role === 'coach' || user?.role === 'superadmin') && (
          <button className="btn btn-primary"><Plus size={18} /> Nuevo Evento</button>
        )}
      </div>

      <div style={{ display: 'grid', gap: '1rem' }}>
        {events.map(event => (
          <div key={event.id} className="glass-card" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
              <div style={{ 
                padding: '1rem', 
                background: event.type === 'match' ? 'rgba(0, 255, 136, 0.1)' : 'rgba(99, 102, 241, 0.1)', 
                borderRadius: '0.75rem',
                color: event.type === 'match' ? 'var(--primary)' : 'var(--secondary)',
                width: '60px',
                textAlign: 'center'
              }}>
                <span style={{ fontSize: '0.75rem', fontWeight: '800' }}>{event.date.split('-')[2]}</span><br/>
                <span style={{ fontSize: '0.65rem' }}>ABR</span>
              </div>
              <div>
                <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', fontWeight: 'bold', color: event.type === 'match' ? 'var(--primary)' : 'var(--secondary)' }}>
                  {event.type === 'match' ? 'Partido' : 'Entrenamiento'}
                </span>
                <h4 style={{ fontWeight: '700' }}>{event.title}</h4>
                {event.type === 'match' ? (
                  <div style={{ display: 'flex', gap: '1rem', marginTop: '0.25rem', fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}><Clock size={14} /> {event.time}</span>
                  </div>
                ) : (
                  <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>{event.description}</p>
                )}
              </div>
            </div>
            
            <div style={{ textAlign: 'right' }}>
               <p style={{ fontSize: '0.875rem', fontWeight: '600', marginBottom: '0.5rem' }}>{event.team}</p>
               {event.type === 'match' && (
                 <button 
                  onClick={() => setSelectedMatch(event)}
                  className="btn btn-outline" 
                  style={{ padding: '0.4rem 1rem', fontSize: '0.875rem' }}
                >
                  Ver más
                </button>
               )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ScheduleView;
