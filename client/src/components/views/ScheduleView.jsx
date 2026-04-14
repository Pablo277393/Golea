import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Calendar, MapPin, Clock, Plus, ArrowLeft, ClipboardCheck, ThumbsUp, X } from 'lucide-react';

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
      callup: ['Juan Pérez', 'Marcos Ruiz', 'Luis Cano', 'Iván G.', 'Pol Soler'],
      votes: 12
    },
    { 
      id: 2, 
      type: 'training', 
      title: 'Entrenamiento Táctico', 
      date: '2026-04-15', 
      description: 'Sesión enfocada en la salida de balón y presión tras pérdida.',
      team: 'Primer Equipo',
      votes: 5 
    },
    { 
      id: 3, 
      type: 'training', 
      title: 'Físico', 
      date: '2026-04-16', 
      description: 'Trabajo preventivo y de fuerza en el gimnasio.',
      team: 'Juvenil A',
      votes: 3 
    },
  ]);

  const handleCreateEvent = (e) => {
    e.preventDefault();
    const event = {
      ...newEvent,
      id: Date.now(),
      votes: 0,
      callup: newEvent.type === 'match' ? ['Jugador Demo 1', 'Jugador Demo 2'] : null
    };
    setEvents([event, ...events]);
    setShowForm(false);
    setNewEvent({ type: 'training', title: '', date: '2026-04-18', time: '18:00', location: '', description: '', team: 'Primer Equipo' });
  };

  const handleVote = (id) => {
    setEvents(events.map(ev => ev.id === id ? { ...ev, votes: ev.votes + 1 } : ev));
    if (selectedMatch && selectedMatch.id === id) {
      setSelectedMatch({ ...selectedMatch, votes: selectedMatch.votes + 1 });
    }
  };

  if (selectedMatch) {
    return (
      <div>
        <button onClick={() => setSelectedMatch(null)} className="btn btn-outline" style={{ marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <ArrowLeft size={18} /> Volver al Calendario
        </button>

        <header style={{ marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '1.75rem', fontWeight: '800' }}>Detalle del <span className="text-gradient">Partido</span></h2>
          <p style={{ color: 'var(--text-muted)' }}>{selectedMatch.team} • Jornada de Liga</p>
        </header>

        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 300px', gap: '1.5rem', alignItems: 'start' }}>
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

            <p style={{ color: 'var(--text-muted)', lineHeight: '1.6', marginBottom: '2rem' }}>{selectedMatch.description}</p>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
               <button onClick={() => handleVote(selectedMatch.id)} className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                 <ThumbsUp size={18} /> {selectedMatch.votes} Votos
               </button>
            </div>
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
        {(user?.role === 'coach' || user?.role === 'superadmin' || user?.role === 'admin') && (
          <button onClick={() => setShowForm(!showForm)} className="btn btn-primary">
            {showForm ? <X size={18} /> : <Plus size={18} />} {showForm ? 'Cerrar' : 'Nuevo Evento'}
          </button>
        )}
      </div>

      {showForm && (
        <div className="glass-card" style={{ marginBottom: '2rem', border: '1px solid var(--primary)' }}>
          <form onSubmit={handleCreateEvent} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
            <div className="input-group">
              <label>Tipo</label>
              <select value={newEvent.type} onChange={(e) => setNewEvent({...newEvent, type: e.target.value})} style={{ width: '100%', padding: '0.75rem', background: 'var(--glass)', border: '1px solid var(--border)', borderRadius: '0.5rem', color: 'var(--text-main)' }}>
                <option value="training">Entrenamiento</option>
                <option value="match">Partido</option>
              </select>
            </div>
            <div className="input-group">
              <label>Título</label>
              <input type="text" value={newEvent.title} onChange={(e) => setNewEvent({...newEvent, title: e.target.value})} placeholder="Ej: vs Real Madrid" required />
            </div>
            <div className="input-group">
              <label>Fecha</label>
              <input type="date" value={newEvent.date} onChange={(e) => setNewEvent({...newEvent, date: e.target.value})} required />
            </div>
            <div className="input-group">
              <label>Equipo</label>
              <input type="text" value={newEvent.team} onChange={(e) => setNewEvent({...newEvent, team: e.target.value})} required />
            </div>
            {newEvent.type === 'match' && (
               <>
                <div className="input-group">
                  <label>Hora</label>
                  <input type="time" value={newEvent.time} onChange={(e) => setNewEvent({...newEvent, time: e.target.value})} />
                </div>
                <div className="input-group">
                  <label>Lugar</label>
                  <input type="text" value={newEvent.location} onChange={(e) => setNewEvent({...newEvent, location: e.target.value})} placeholder="Estadio" />
                </div>
               </>
            )}
            <div className="input-group" style={{ gridColumn: '1 / -1' }}>
              <label>Descripción</label>
              <textarea value={newEvent.description} onChange={(e) => setNewEvent({...newEvent, description: e.target.value})} placeholder="Mensaje informativo..." style={{ width: '100%', padding: '0.75rem', background: 'var(--glass)', border: '1px solid var(--border)', borderRadius: '0.5rem', color: 'var(--text-main)', minHeight: '80px' }} />
            </div>
            <div style={{ gridColumn: '1 / -1' }}>
              <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>Crear Evento</button>
            </div>
          </form>
        </div>
      )}

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
            
            <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.5rem' }}>
               <p style={{ fontSize: '0.875rem', fontWeight: '600' }}>{event.team}</p>
               <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button onClick={(e) => { e.stopPropagation(); handleVote(event.id); }} className="btn btn-outline" style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                    <ThumbsUp size={14} /> {event.votes}
                  </button>
                  {event.type === 'match' && (
                    <button onClick={() => setSelectedMatch(event)} className="btn btn-outline" style={{ padding: '0.4rem 1rem', fontSize: '0.875rem' }}>
                      Ver más
                    </button>
                  )}
               </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ScheduleView;
