import React, { useState } from 'react';
import { Trophy, Award, TrendingUp, ThumbsUp } from 'lucide-react';

const MVPView = () => {
  const [candidates, setCandidates] = useState([
    { id: 1, name: 'Marc Rovira', votes: 12 },
    { id: 2, name: 'Pau García', votes: 8 },
    { id: 3, name: 'Àlex Marín', votes: 15 },
    { id: 4, name: 'Dani Ruiz', votes: 5 }
  ]);

  const handleVote = (id) => {
    setCandidates(candidates.map(c => c.id === id ? { ...c, votes: c.votes + 1 } : c));
  };

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
            {candidates.map((candidate, i) => (
              <div key={candidate.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem', background: 'var(--glass)', borderRadius: '0.75rem', border: '1px solid var(--border)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                   <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'var(--primary)', color: 'var(--bg-darker)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>
                     {i+1}
                   </div>
                   <div>
                     <span style={{ fontWeight: '600', display: 'block' }}>{candidate.name}</span>
                     <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{candidate.votes} votos acumulados</span>
                   </div>
                </div>
                <button 
                  onClick={() => handleVote(candidate.id)}
                  className="btn btn-primary" 
                  style={{ padding: '0.4rem 1rem', fontSize: '0.875rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                >
                  <ThumbsUp size={14} /> Votar
                </button>
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
