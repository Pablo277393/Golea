import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Users, Plus, ArrowLeft, UserCircle, Shield, Briefcase, ArrowRight } from 'lucide-react';
import Card from '../ui/Card';
import Button from '../ui/Button';

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
      <div className="space-y-8 animate-in fade-in slide-in-from-left-4 duration-500">
        <Button 
          variant="secondary" 
          className="px-4 py-2 text-sm" 
          onClick={() => setSelectedTeam(null)}
          icon={ArrowLeft}
        >
          Volver a Equipos
        </Button>

        <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h2 className="text-4xl font-bold tracking-tight mb-2">
              Plantilla: <span className="text-gold-glow">{selectedTeam.name}</span>
            </h2>
            <div className="flex items-center gap-4 text-slate-400 font-medium">
              <span className="flex items-center gap-1.5"><Briefcase size={14} className="text-primary" /> {selectedTeam.coach}</span>
              <span className="w-1 h-1 rounded-full bg-slate-600"></span>
              <span className="flex items-center gap-1.5"><Users size={14} className="text-primary" /> {teamPlayers.length} Jugadores</span>
            </div>
          </div>
        </header>

        <Card className="p-0 overflow-hidden border-white/5" hover={false}>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead className="bg-white/5">
                <tr className="text-left border-b border-white/5">
                  <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-[0.2em] text-primary">Dorsal</th>
                  <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-[0.2em] text-primary">Nombre del Jugador</th>
                  <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-[0.2em] text-primary">Especialidad</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {teamPlayers.map(p => (
                  <tr key={p.id} className="hover:bg-white/[0.02] transition-colors group">
                    <td className="px-8 py-6 font-bold text-xl text-white group-hover:text-primary transition-colors">#{p.number}</td>
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center border border-primary/20">
                          <UserCircle size={20} className="text-primary" />
                        </div>
                        <span className="font-bold text-slate-200">{p.name}</span>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <span className="px-4 py-1.5 bg-primary/10 border border-primary/20 text-primary rounded-full text-[10px] font-bold uppercase tracking-widest">
                        {p.position}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {teamPlayers.length === 0 && (
            <div className="p-20 text-center text-slate-500 font-medium italic">
              No hay jugadores registrados en este equipo aún.
            </div>
          )}
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <header className="flex flex-col sm:flex-row justify-between items-center gap-6">
        <div>
          <h2 className="text-4xl lg:text-5xl font-bold tracking-tight mb-2">Gestión de Equipos</h2>
          <p className="text-slate-400 font-medium">Control total sobre las plantillas y el staff técnico.</p>
        </div>
        {(user?.role === 'admin' || user?.role === 'superadmin') && (
          <Button variant="primary" icon={Plus} className="px-6 py-3 w-full sm:w-auto">
            Crear Equipo
          </Button>
        )}
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {teams.map(team => (
          <Card key={team.id} className="group">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-14 h-14 rounded-2xl bg-gold-gradient p-[1px] shadow-gold-glow group-hover:scale-110 transition-transform">
                <div className="w-full h-full rounded-2xl bg-dark flex items-center justify-center">
                  <Shield size={28} className="text-primary" />
                </div>
              </div>
              <div>
                <h4 className="text-xl font-bold text-white group-hover:text-primary-light transition-colors">{team.name}</h4>
                <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">{team.category}</p>
              </div>
            </div>
            
            <div className="space-y-3 mb-8">
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-500">Entrenador Principal</span>
                <span className="text-slate-300 font-bold">{team.coach}</span>
              </div>
              <div className="w-full h-px bg-white/5"></div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-500">Disponibilidad</span>
                <span className="text-primary font-bold">Activo</span>
              </div>
            </div>

            <Button 
              variant="secondary" 
              className="w-full py-4 rounded-xl"
              onClick={() => setSelectedTeam(team)}
              icon={ArrowRight}
            >
              Ver Plantilla
            </Button>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default TeamsView;
