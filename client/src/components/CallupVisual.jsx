import React, { useState } from 'react';
import { Users, CheckCircle, Circle } from 'lucide-react';

const CallupVisual = ({ players, onSelectionChange }) => {
  const [selectedIds, setSelectedIds] = useState([]);

  const togglePlayer = (id) => {
    const newSelected = selectedIds.includes(id) 
      ? selectedIds.filter(p => p !== id) 
      : [...selectedIds, id];
    setSelectedIds(newSelected);
    if (onSelectionChange) onSelectionChange(newSelected);
  };

  return (
    <div className="glass-card" style={{ padding: '2rem' }}>
      <h3 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <Users size={24} className="text-gradient" /> Visual Call-up Selection
      </h3>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: '1rem' }}>
        {players.map((player) => (
          <div 
            key={player.id}
            onClick={() => togglePlayer(player.id)}
            style={{ 
              padding: '1rem',
              borderRadius: '0.75rem',
              background: selectedIds.includes(player.id) ? 'rgba(0, 255, 136, 0.15)' : 'var(--glass)',
              border: `1px solid ${selectedIds.includes(player.id) ? 'var(--primary)' : 'var(--border)'}`,
              cursor: 'pointer',
              textAlign: 'center',
              transition: 'var(--transition)'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '-0.5rem' }}>
              {selectedIds.includes(player.id) ? <CheckCircle size={16} color="var(--primary)" /> : <Circle size={16} color="var(--text-muted)" />}
            </div>
            <div style={{ width: '50px', height: '50px', borderRadius: '50%', background: 'rgba(255,255,255,0.05)', margin: '0 auto 0.75rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ fontSize: '1.25rem' }}>{player.jerseyNumber}</span>
            </div>
            <p style={{ fontWeight: '600', fontSize: '0.875rem' }}>{player.name}</p>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{player.position}</p>
          </div>
        ))}
      </div>

      <div style={{ marginTop: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <p style={{ color: 'var(--text-muted)' }}>{selectedIds.length} players selected</p>
        <button className="btn btn-primary">Confirm Selection</button>
      </div>
    </div>
  );
};

export default CallupVisual;
