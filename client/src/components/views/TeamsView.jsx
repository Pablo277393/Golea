import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Users, Plus, ArrowLeft, UserCircle } from 'lucide-react';

const TeamsView = () => {
  const { user } = useAuth();
  const [selectedTeam, setSelectedTeam] = useState(null);

  const [teams] = useState([
    { id: 1, name: 'Primer Equipo', category: 'Sénior', coach: 'Carlos García' },
    { id: 2, name: 'Juvenil A', category: 'Sub-19', coach: 'Dani Marín' }
  ]);

  const [players] = useState([
    { id: 1, teamId: 1, name: 'Juan Pérez', position: 'Portero', number: 1 },
    { id: 2, teamId: 1, name: 'Marcos Ruiz', position: 'Defensa', number: 4 },
    { id: 3, teamId: 1, name: 'Luis Cano', position: 'Delantero', number: 9 },
    { id: 4, teamId: 2, name: 'Pol Soler', position: 'Medio', number: 10 },
    { id: 5, teamId: 2, name: 'Iván G.', position: 'Defensa', number: 2 },
  ]);

  if (selectedTeam) {
    const teamPlayers = players.filter(p => p.teamId === selectedTeam.id);
    return (
      <div>
        <button 
          onClick={() => setSelectedTeam(null)} 
          className="btn btn-outline" 
          style={{ marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
        >
          <ArrowLeft size={18} /> Volver a Equipos
        </button>

        <header style={{ marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '1.75rem', fontWeight: '800' }}>Plantilla: <span className="text-gradient">{selectedTeam.name}</span></h2>
          <p style={{ color: 'var(--text-muted)' }}>Mánager: {selectedTeam.coach} • {teamPlayers.length} Jugadores</p>
        </header>

        <div className="glass-card" style={{ padding: '0' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border)', textAlign: 'left' }}>
                <th style={{ padding: '1rem 1.5rem', color: 'var(--text-muted)', fontSize: '0.75rem', textTransform: 'uppercase' }}>Dorsal</th>
                <th style={{ padding: '1rem 1.5rem', color: 'var(--text-muted)', fontSize: '0.75rem', textTransform: 'uppercase' }}>Nombre</th>
                <th style={{ padding: '1rem 1.5rem', color: 'var(--text-muted)', fontSize: '0.75rem', textTransform: 'uppercase' }}>Posición</th>
              </tr>
            </thead>
            <tbody>
              {teamPlayers.map(p => (
                <tr key={p.id} style={{ borderBottom: '1px solid var(--border)', transition: 'var(--transition)' }}>
                  <td style={{ padding: '1rem 1.5rem', fontWeight: '800', color: 'var(--primary)' }}>#{p.number}</td>
                  <td style={{ padding: '1rem 1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <UserCircle size={24} className="text-muted" /> {p.name}
                  </td>
                  <td style={{ padding: '1rem 1.5rem' }}>
                    <span style={{ padding: '0.25rem 0.75rem', background: 'var(--glass)', borderRadius: '1rem', fontSize: '0.75rem' }}>{p.position}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {teamPlayers.length === 0 && (
            <p style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>No hay jugadores registrados en este equipo.</p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: '700' }}>Gestión de Equipos</h2>
        {user?.role === 'superadmin' && (
          <button className="btn btn-primary"><Plus size={18} /> Crear Equipo</button>
        )}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem' }}>
        {teams.map(team => (
          <div key={team.id} className="glass-card">
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
              <div style={{ width: '40px', height: '40px', background: 'var(--primary)', borderRadius: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Users size={24} color="var(--bg-darker)" />
              </div>
              <div>
                <h4 style={{ fontWeight: '700' }}>{team.name}</h4>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{team.category}</p>
              </div>
            </div>
            
            <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
              <p>Entrenador: {team.coach}</p>
            </div>

            <button 
              onClick={() => setSelectedTeam(team)}
              className="btn btn-outline" 
              style={{ width: '100%', marginTop: '1.5rem' }}
            >
              Ver Plantilla
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TeamsView;
