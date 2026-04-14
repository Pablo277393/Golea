import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Bell, Send, User, Users, Globe } from 'lucide-react';

const NotificationsView = () => {
  const { user } = useAuth();
  const [notifications] = useState([
    { id: 1, title: 'Entrenamiento Actualizado', message: 'El entrenamiento de hoy se mueve al campo 2 para mejorar el drenaje.', date: 'Hoy, 09:00', scope: 'team', type: 'training' },
    { id: 2, title: 'Equipación Nueva', message: 'Ya están disponibles las nuevas equipaciones en las oficinas del club.', date: 'Ayer, 18:30', scope: 'global', type: 'info' },
  ]);

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: '700' }}>Centro de Notificaciones</h2>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: (user?.role === 'coach' || user?.role === 'admin') ? '1fr 350px' : '1fr', gap: '2rem' }}>
        
        {/* Inbox */}
        <div>
          <h3 style={{ fontSize: '1.1rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Bell size={20} className="text-gradient" /> Bandeja de Entrada
          </h3>
          <div style={{ display: 'grid', gap: '1rem' }}>
            {notifications.map(n => (
              <div key={n.id} className="glass-card" style={{ padding: '1.25rem', borderLeft: n.type === 'training' ? '3px solid var(--secondary)' : '3px solid var(--primary)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                  <h4 style={{ fontWeight: '700' }}>{n.title}</h4>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{n.date}</span>
                </div>
                <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', lineHeight: '1.4' }}>{n.message}</p>
                <div style={{ marginTop: '1rem', display: 'flex', gap: '0.5rem' }}>
                  <span style={{ fontSize: '0.7rem', background: 'var(--glass)', padding: '0.2rem 0.5rem', borderRadius: '1rem', color: 'var(--text-main)' }}>
                    {n.scope === 'team' ? 'Equipo' : 'Global'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Compose Panel (Coach only) */}
        {(user?.role === 'coach' || user?.role === 'admin') && (
          <div>
            <div className="glass-card" style={{ position: 'sticky', top: '2rem' }}>
              <h3 style={{ fontSize: '1.1rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Send size={20} className="text-gradient" /> Enviar Mensaje
              </h3>
              
              <div className="input-group">
                <label>Título</label>
                <input type="text" placeholder="Asunto del mensaje..." />
              </div>

              <div className="input-group">
                <label>Mensaje</label>
                <textarea rows="4" placeholder="Escribe aquí tu mensaje..."></textarea>
              </div>

              <div className="input-group">
                <label>Segmentación</label>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button className="btn btn-outline" style={{ padding: '0.5rem', flex: 1 }}><Globe size={16} /></button>
                  <button className="btn btn-outline" style={{ padding: '0.5rem', flex: 1 }}><Users size={16} /></button>
                  <button className="btn btn-outline" style={{ padding: '0.5rem', flex: 1 }}><User size={16} /></button>
                </div>
              </div>

              <button className="btn btn-primary" style={{ width: '100%' }}>Enviar Notificación</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationsView;
