import React, { useState } from 'react';
import { Trophy, Award, TrendingUp, ThumbsUp, CheckCircle } from 'lucide-react';

const MVPView = () => {
  const [votedId, setVotedId] = useState(null);
  const [candidates, setCandidates] = useState([
    { id: 1, name: 'Marc Rovira', votes: 12 },
    { id: 2, name: 'Pau García', votes: 8 },
    { id: 3, name: 'Àlex Marín', votes: 15 },
    { id: 4, name: 'Dani Ruiz', votes: 5 }
  ]);

  const handleVote = (id) => {
    if (votedId === id) return; // Already voted for this one
    
    setCandidates(candidates.map(c => {
      if (c.id === id) return { ...c, votes: c.votes + 1 };
      if (c.id === votedId) return { ...c, votes: c.votes - 1 }; // Undo previous vote
      return c;
    }));
    setVotedId(id);
  };

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
      <header style={{ marginBottom: '2.5rem' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: '700' }}>Votaciones MVP</h2>
        <p style={{ color: 'var(--text-muted)' }}>Elige al jugador más valioso del fin de semana.</p>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '2rem' }}>
        <div className="glass-card">
          <h3 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <Trophy size={24} className="text-gradient" /> Candidatos
          </h3>
          <div style={{ display: 'grid', gap: '1rem' }}>
            {candidates.map((candidate, i) => (
              <div 
                key={candidate.id} 
                className={votedId === candidate.id ? 'glass-card' : ''}
                style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'space-between', 
                  padding: '1rem', 
                  background: votedId === candidate.id ? 'rgba(0, 255, 136, 0.05)' : 'var(--glass)', 
                  borderRadius: '0.75rem', 
                  border: votedId === candidate.id ? '1px solid var(--primary)' : '1px solid var(--border)',
                  transition: 'var(--transition)'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                   <div style={{ 
                     width: '32px', 
                     height: '32px', 
                     borderRadius: '50%', 
                     background: votedId === candidate.id ? 'var(--primary)' : 'var(--glass)', 
                     color: votedId === candidate.id ? 'var(--bg-darker)' : 'var(--text-main)', 
                     display: 'flex', 
                     alignItems: 'center', 
                     justifyContent: 'center', 
                     fontWeight: 'bold',
                     border: '1px solid var(--border)'
                   }}>
                     {i+1}
                   </div>
                   <div>
                     <span style={{ fontWeight: '600', display: 'block' }}>{candidate.name}</span>
                     <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{candidate.votes} votos</span>
                   </div>
                </div>
                <button 
                  onClick={() => handleVote(candidate.id)}
                  className={votedId === candidate.id ? 'btn btn-primary' : 'btn btn-outline'} 
                  style={{ padding: '0.4rem 1rem', fontSize: '0.875rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                >
                  {votedId === candidate.id ? <CheckCircle size={14} /> : <ThumbsUp size={14} />}
                  {votedId === candidate.id ? 'Votado' : 'Votar'}
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="glass-card">
          <h3 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <Award size={24} className="text-gradient" /> MVP de la jornada
          </h3>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>Ganador oficial de la última jornada disputada.</p>
          <div style={{ textAlign: 'center', padding: '1.5rem', background: 'var(--glass)', borderRadius: '1rem', border: '1px dashed var(--border)' }}>
             <TrendingUp size={48} className="text-primary" style={{ marginBottom: '1rem' }} />
             <p style={{ fontWeight: '800', fontSize: '1.4rem', marginBottom: '0.25rem' }}>Marc Rovira</p>
             <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Ganador Semana 14</p>
             <div style={{ marginTop: '1.5rem', display: 'flex', justifyContent: 'center', gap: '1.5rem' }}>
                <div><p style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>3</p><p style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>GOLES</p></div>
                <div><p style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>1</p><p style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>ASISTENCIAS</p></div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MVPView;
