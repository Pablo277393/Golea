import React from 'react';
import { Target, Award } from 'lucide-react';

const PredictionsView = () => {
  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
      <header style={{ marginBottom: '2.5rem' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: '700' }}>Quiniela Semanal</h2>
        <p style={{ color: 'var(--text-muted)' }}>Predice los resultados y escala en el ranking del club.</p>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '2rem' }}>
        <div className="glass-card">
          <h3 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <Target size={24} className="text-gradient" /> Próximo Partido
          </h3>
          <div style={{ background: 'var(--glass)', padding: '2rem', borderRadius: '1rem', textAlign: 'center' }}>
            {/* UI de predicción */}
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '1.5rem', marginBottom: '1.5rem' }}>
              <input type="number" defaultValue="0" style={{ width: '60px', height: '60px', fontSize: '1.5rem', textAlign: 'center', borderRadius: '0.75rem' }} />
              <span style={{ fontWeight: '800' }}>-</span>
              <input type="number" defaultValue="0" style={{ width: '60px', height: '60px', fontSize: '1.5rem', textAlign: 'center', borderRadius: '0.75rem' }} />
            </div>
            <button className="btn btn-primary" style={{ width: '100%' }}>Guardar Predicción</button>
          </div>
        </div>

        <div className="glass-card">
          <h3 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <Award size={24} className="text-gradient" /> Top Ranking
          </h3>
          {[1, 2, 3].map(pos => (
            <div key={pos} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.75rem 0' }}>
              <span>#{pos} Usuario_Demo</span>
              <span style={{ color: 'var(--primary)', fontWeight: 'bold' }}>{1000 - pos*10} pts</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PredictionsView;
