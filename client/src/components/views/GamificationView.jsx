import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Target, Trophy, Award, TrendingUp } from 'lucide-react';

const GamificationView = () => {
  const { user } = useAuth();
  
  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
      <header style={{ marginBottom: '2.5rem' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: '700' }}>Gamificación y Recompensas</h2>
        <p style={{ color: 'var(--text-muted)' }}>Participa, predice y conviértete en el MVP de la semana.</p>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
        
        {/* Predictions Section */}
        <div className="glass-card">
          <h3 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <Target size={24} className="text-gradient" /> Quiniela Semanal
          </h3>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
            Predice el resultado del próximo partido para ganar puntos en el ranking del club.
          </p>
          
          <div style={{ background: 'var(--glass)', padding: '2rem', borderRadius: '1rem', textAlign: 'center' }}>
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '1.5rem', marginBottom: '1.5rem' }}>
              <div>
                <div style={{ width: '50px', height: '50px', background: 'var(--primary)', borderRadius: '50%', margin: '0 auto 0.5rem' }}></div>
                <p style={{ fontWeight: '700', fontSize: '0.75rem' }}>AFC</p>
              </div>
              <input type="number" defaultValue="0" style={{ width: '60px', height: '60px', fontSize: '1.5rem', textAlign: 'center', borderRadius: '0.75rem' }} />
              <span style={{ fontWeight: '800', fontSize: '1.25rem' }}>-</span>
              <input type="number" defaultValue="0" style={{ width: '60px', height: '60px', fontSize: '1.5rem', textAlign: 'center', borderRadius: '0.75rem' }} />
              <div>
                <div style={{ width: '50px', height: '50px', background: 'var(--text-muted)', borderRadius: '50%', margin: '0 auto 0.5rem' }}></div>
                <p style={{ fontWeight: '700', fontSize: '0.75rem' }}>GTY</p>
              </div>
            </div>
            <button className="btn btn-primary" style={{ width: '100%' }}>Guardar Predicción</button>
          </div>
        </div>

        {/* MVP Section */}
        <div className="glass-card">
          <h3 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <Trophy size={24} className="text-gradient" /> Votación MVP
          </h3>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
            Elige al jugador que más ha destacado en el último partido de tu equipo.
          </p>

          <div style={{ display: 'grid', gap: '0.75rem' }}>
            {['Marc Rovira', 'Pau García', 'Àlex Marín'].map((name, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem', background: 'var(--glass)', borderRadius: '0.75rem', cursor: 'pointer' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <TrendingUp size={16} />
                  </div>
                  <span style={{ fontWeight: '600' }}>{name}</span>
                </div>
                <button className="btn btn-outline" style={{ padding: '0.25rem 0.75rem', fontSize: '0.75rem' }}>Votar</button>
              </div>
            ))}
          </div>
        </div>

        {/* Global Ranking Widget */}
        <div className="glass-card">
          <h3 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <Award size={24} className="text-gradient" /> Ranking de puntos
          </h3>
          {[1, 2, 3].map(pos => (
            <div key={pos} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.75rem 0', borderBottom: pos !== 3 ? '1px solid var(--border)' : 'none' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <span style={{ fontWeight: '800', color: pos === 1 ? 'gold' : 'silver' }}>#{pos}</span>
                <span style={{ fontWeight: '500' }}>Usuario_Demo_{pos}</span>
              </div>
              <span style={{ fontWeight: '700', color: 'var(--primary)' }}>{1000 - (pos * 100)} pts</span>
            </div>
          ))}
          <button className="btn btn-outline" style={{ width: '100%', marginTop: '1.5rem' }}>Ver Ranking Completo</button>
        </div>

      </div>
    </div>
  );
};

export default GamificationView;
