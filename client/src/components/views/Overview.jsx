import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Calendar, Bell, Target, Trophy } from 'lucide-react';
import { matchService, notificationService } from '../../services/api';

const Overview = () => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [matches, setMatches] = useState([]);

  useEffect(() => {
    // Mocking logic for demo mode since DB might be offline
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
    <>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
        <div>
          <h1 style={{ fontSize: '2rem' }}>Hola, <span className="text-gradient">{user?.username}</span></h1>
          <p style={{ color: 'var(--text-muted)' }}>Esto es lo que está pasando en el club hoy.</p>
        </div>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '1.5rem' }}>
        <div className="glass-card">
          <h3 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Calendar size={20} className="text-gradient" /> Próximo Partido
          </h3>
          {nextMatch ? (
            <div style={{ textAlign: 'center', padding: '1rem' }}>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>{nextMatch.match_date} • {nextMatch.match_time}</p>
              <p style={{ fontSize: '1.25rem', fontWeight: '700', margin: '0.5rem 0' }}>Golea FC vs {nextMatch.opponent}</p>
              <p style={{ fontSize: '0.875rem', color: 'var(--primary)' }}>📍 {nextMatch.location}</p>
              <button className="btn btn-primary" style={{ marginTop: '1.5rem', width: '100%' }}>Ver Detalles</button>
            </div>
          ) : (
            <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '2rem' }}>No hay partidos programados.</p>
          )}
        </div>

        <div className="glass-card">
          <h3 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Bell size={20} className="text-gradient" /> Notificaciones
          </h3>
          {notifications.map((n, i) => (
            <div key={i} style={{ borderLeft: `2px solid var(--primary)`, paddingLeft: '1rem', marginBottom: '1.25rem' }}>
              <p style={{ fontSize: '0.875rem', fontWeight: '600' }}>{n.title}</p>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{n.message}</p>
            </div>
          ))}
        </div>

      </div>
    </>
  );
};

export default Overview;
