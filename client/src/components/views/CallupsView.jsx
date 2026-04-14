import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { ClipboardList, Search } from 'lucide-react';
import CallupVisual from '../CallupVisual';

const CallupsView = () => {
  const { user } = useAuth();
  const [selectedEvent, setSelectedEvent] = useState(1);

  const mockPlayers = [
    { id: 101, name: 'Marc Rovira', jerseyNumber: 10, position: 'Delantero' },
    { id: 102, name: 'Pau García', jerseyNumber: 1, position: 'Portero' },
    { id: 103, name: 'Àlex Marín', jerseyNumber: 4, position: 'Defensa' },
    { id: 104, name: 'Joan Font', jerseyNumber: 8, position: 'Mediocentro' },
    { id: 105, name: 'Sergi López', jerseyNumber: 11, position: 'Extremo' },
    { id: 106, name: 'Dani Ruiz', jerseyNumber: 5, position: 'Defensa' },
  ];

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' }}>
        <div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: '700' }}>Gestión de Convocatorias</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Selecciona los jugadores para el próximo evento.</p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '300px 1fr', gap: '2rem' }}>
        {/* Event Selector */}
        <div className="glass-card" style={{ height: 'fit-content' }}>
          <h3 style={{ fontSize: '1rem', marginBottom: '1.25rem', fontWeight: '700' }}>Eventos Próximos</h3>
          <div 
            onClick={() => setSelectedEvent(1)}
            style={{ 
              padding: '1rem', 
              borderRadius: '0.5rem', 
              background: selectedEvent === 1 ? 'rgba(0, 255, 136, 0.1)' : 'var(--glass)',
              border: `1px solid ${selectedEvent === 1 ? 'var(--primary)' : 'var(--border)'}`,
              cursor: 'pointer',
              marginBottom: '0.75rem'
            }}
          >
            <p style={{ fontSize: '0.75rem', fontWeight: 'bold', color: 'var(--primary)' }}>PARTIDO</p>
            <p style={{ fontWeight: '600' }}>vs Galaxy United</p>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>18 Abr • 10:30</p>
          </div>
          <div 
            onClick={() => setSelectedEvent(2)}
            style={{ 
              padding: '1rem', 
              borderRadius: '0.5rem', 
              background: selectedEvent === 2 ? 'rgba(0, 255, 136, 0.1)' : 'var(--glass)',
              border: `1px solid ${selectedEvent === 2 ? 'var(--primary)' : 'var(--border)'}`,
              cursor: 'pointer'
            }}
          >
            <p style={{ fontSize: '0.75rem', fontWeight: 'bold', color: 'var(--secondary)' }}>ENTRENAMIENTO</p>
            <p style={{ fontWeight: '600' }}>Táctico Miércoles</p>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>15 Abr • 18:00</p>
          </div>
        </div>

        {/* Visual Selector */}
        <div>
          <CallupVisual players={mockPlayers} onSelectionChange={(ids) => console.log('Selected:', ids)} />
        </div>
      </div>
    </div>
  );
};

export default CallupsView;
