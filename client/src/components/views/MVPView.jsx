import React from 'react';
import { Trophy, Award, TrendingUp } from 'lucide-react';

const MVPView = () => {
  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
      <header style={{ marginBottom: '2.5rem' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: '700' }}>MVP de la Semana</h2>
        <p style={{ color: 'var(--text-muted)' }}>Vota por el jugador más destacado de la última jornada.</p>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '2rem' }}>
        <div className="glass-card">
          <h3 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <Trophy size={24} className="text-gradient" /> Candidatos Semanales
          </h3>
          <div style={{ display: 'grid', gap: '1rem' }}>
            {['Marc Rovira', 'Pau García', 'Àlex Marín', 'Dani Ruiz'].map((name, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem', background: 'var(--glass)', borderRadius: '0.75rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                   <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'var(--primary)', color: 'var(--bg-darker)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>
                     {i+1}
                   </div>
                   <span style={{ fontWeight: '600' }}>{name}</span>
                </div>
                <button className="btn btn-outline" style={{ padding: '0.4rem 1rem', fontSize: '0.875rem' }}>Votar</button>
              </div>
            ))}
          </div>
        </div>

        <div className="glass-card">
          <h3 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <Award size={24} className="text-gradient" /> Muro de la Fama
          </h3>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>Ganadores de las últimas semanas.</p>
          <div style={{ textAlign: 'center', padding: '1rem' }}>
             <TrendingUp size={48} className="text-gradient" style={{ marginBottom: '1rem' }} />
             <p style={{ fontWeight: '800', fontSize: '1.25rem' }}>Semana 14: Marc Rovira</p>
             <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>3 Goles • 1 Asistencia</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MVPView;
