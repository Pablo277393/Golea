import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { teamService, gamificationService } from '../../services/api';
import { Trophy, Award, TrendingUp, CheckCircle, Star, Target, Crown, Users, Layout, ShieldCheck, History, Calendar } from 'lucide-react';
import Card from '../ui/Card';
import Button from '../ui/Button';

const MVPView = () => {
  const { user } = useAuth();
  const [teams, setTeams] = useState([]);
  const [selectedTeamId, setSelectedTeamId] = useState('');
  const [players, setPlayers] = useState([]);
  const [currentMVP, setCurrentMVP] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const isCoach = user?.role === 'coach';
  const isAdmin = ['admin', 'superadmin'].includes(user?.role);
  const canManage = isCoach || isAdmin;

  // Load teams on mount
  useEffect(() => {
    const fetchTeams = async () => {
      try {
        const params = isCoach ? { managedOnly: true } : {};
        const res = await teamService.getTeams(params);
        setTeams(res.data);
        
        if (!canManage && res.data.length > 0) {
          setSelectedTeamId(res.data[0].id);
        }
      } catch (err) {
        console.error('Error fetching teams:', err);
      }
    };
    fetchTeams();
  }, [user, isCoach, canManage]);

  // Load players, current MVP and history when team changes
  useEffect(() => {
    if (!selectedTeamId) return;

    const fetchData = async () => {
      setLoading(true);
      try {
        const [playersRes, mvpRes, historyRes] = await Promise.all([
          teamService.getTeamPlayers(selectedTeamId),
          gamificationService.getMVP(selectedTeamId),
          gamificationService.getMVPHistory(selectedTeamId)
        ]);
        setPlayers(playersRes.data);
        setCurrentMVP(mvpRes.data);
        setHistory(historyRes.data);
      } catch (err) {
        console.error('Error fetching team data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [selectedTeamId]);

  const handleSelectMVP = async (playerId) => {
    if (!canManage) return;
    setSaving(true);
    try {
      await gamificationService.selectMVP({
        team_id: selectedTeamId,
        player_id: playerId
      });
      // Refresh current and history
      const [mvpRes, historyRes] = await Promise.all([
        gamificationService.getMVP(selectedTeamId),
        gamificationService.getMVPHistory(selectedTeamId)
      ]);
      setCurrentMVP(mvpRes.data);
      setHistory(historyRes.data);
    } catch (err) {
      console.error('Error selecting MVP:', err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700 max-w-6xl mx-auto">
      <header className="flex flex-col sm:flex-row justify-between items-center gap-6">
        <div>
          <h2 className="text-4xl lg:text-5xl font-bold tracking-tight mb-2">Apartado MVP</h2>
          <p className="text-slate-400 font-medium tracking-wide">
            {canManage 
              ? 'Gestione el reconocimiento de sus jugadores por equipo.' 
              : 'Consulte el jugador más destacado de su equipo.'}
          </p>
        </div>
        <div className="flex items-center gap-3 px-6 py-3 bg-primary/10 border border-primary/20 rounded-2xl">
          <Crown size={20} className="text-primary" />
          <span className="text-sm font-bold text-primary uppercase tracking-widest">Golea Premium</span>
        </div>
      </header>

      {/* Team Selector (Only for Coaches/Admins) */}
      {canManage && (
        <div className="flex flex-wrap items-center gap-6 p-6 bg-white/5 border border-white/10 rounded-3xl">
          <div className="flex items-center gap-3">
            <Layout size={20} className="text-primary" />
            <span className="text-sm font-bold text-white uppercase tracking-wider">Seleccionar Equipo:</span>
          </div>
          <select
            value={selectedTeamId}
            onChange={(e) => setSelectedTeamId(e.target.value)}
            className="bg-dark border border-white/10 text-white px-4 py-2 rounded-xl focus:outline-none focus:border-primary transition-colors min-w-[200px]"
          >
            <option value="">Seleccione un equipo...</option>
            {teams.map(team => (
              <option key={team.id} value={team.id}>{team.name} - {team.category}</option>
            ))}
          </select>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Players List (For Coaches) or History (For Players/Parents) */}
        <div className="lg:col-span-2 space-y-8">
          {canManage ? (
            <section className="space-y-6">
              <div className="flex items-center gap-3 mb-2 px-2">
                <Users size={20} className="text-primary" />
                <h3 className="text-xl font-bold uppercase tracking-wider text-white">Plantilla del Equipo</h3>
              </div>

              {!selectedTeamId ? (
                <div className="p-12 text-center bg-white/5 border border-dashed border-white/10 rounded-3xl">
                  <p className="text-slate-500 font-medium">Seleccione un equipo para ver sus jugadores.</p>
                </div>
              ) : loading ? (
                <div className="p-12 text-center">
                  <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
                  <p className="text-slate-500">Cargando jugadores...</p>
                </div>
              ) : (
                <div className="grid gap-4">
                  {players.map((player) => {
                    // Check if player is current MVP for the current week
                    const isMVP = currentMVP?.player_id === player.id;
                    return (
                      <div
                        key={player.id}
                        className={`relative p-5 rounded-2xl flex items-center justify-between border transition-all duration-500 group ${isMVP
                          ? 'bg-primary/10 border-primary shadow-gold-glow'
                          : 'bg-white/5 border-white/5 hover:border-white/10'
                          }`}
                      >
                        <div className="flex items-center gap-5">
                          <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold text-lg border transition-all ${isMVP
                            ? 'bg-primary text-dark border-primary'
                            : 'bg-white/5 text-slate-500 border-white/10'
                            }`}>
                            {player.jersey_number || '#'}
                          </div>
                          <div>
                            <h4 className="text-lg font-bold text-white group-hover:text-primary transition-colors">
                              {player.full_name || player.username}
                            </h4>
                            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                              {player.position || 'Jugador'}
                            </p>
                          </div>
                        </div>

                        <Button
                          onClick={() => handleSelectMVP(player.id)}
                          variant={isMVP ? 'primary' : 'secondary'}
                          disabled={saving}
                          className="px-5 py-2 text-xs"
                          icon={isMVP ? CheckCircle : ShieldCheck}
                        >
                          {isMVP ? 'MVP Actual' : 'Elegir MVP'}
                        </Button>
                      </div>
                    );
                  })}
                </div>
              )}
            </section>
          ) : null}

          {/* History Section (Visible to everyone if team selected) */}
          <section className="space-y-6">
            <div className="flex items-center gap-3 mb-2 px-2">
              <History size={20} className="text-primary" />
              <h3 className="text-xl font-bold uppercase tracking-wider text-white">Historial del Último Mes</h3>
            </div>

            {!selectedTeamId ? (
              <div className="p-12 text-center bg-white/5 border border-dashed border-white/10 rounded-3xl">
                <p className="text-slate-500 font-medium">El historial se actualizará dinámicamente.</p>
              </div>
            ) : history.length === 0 ? (
              <div className="p-12 text-center bg-white/5 border border-white/5 rounded-3xl">
                <p className="text-slate-500">No hay registros previos para este equipo.</p>
              </div>
            ) : (
              <div className="grid gap-4">
                {history.map((entry, idx) => (
                  <div key={`${entry.id}-${idx}`} className="p-4 bg-white/[0.03] border border-white/5 rounded-2xl flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center text-slate-400">
                        <Calendar size={18} />
                      </div>
                      <div>
                        <h5 className="font-bold text-white text-sm">
                          {entry.first_name} {entry.last_name}
                        </h5>
                        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                          Semana {entry.week_number} • {entry.year}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 px-3 py-1 bg-primary/5 rounded-full border border-primary/10">
                      <Star size={12} className="text-primary" />
                      <span className="text-[10px] font-bold text-primary uppercase">Destacado</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>

        {/* Current MVP Display (Premium Card) */}
        <div className="space-y-6">
          <div className="flex items-center gap-3 mb-2 px-2">
            <Award size={20} className="text-primary" />
            <h3 className="text-xl font-bold uppercase tracking-wider text-white">MVP del Equipo</h3>
          </div>

          <Card className="p-0 border-primary/20 bg-primary/[0.02]" hover={false}>
            <div className="p-8 text-center relative overflow-hidden group">
              <div className="absolute inset-0 bg-primary/5 blur-[80px] group-hover:bg-primary/10 transition-all pointer-events-none"></div>

              <div className="relative z-10">
                <div className="w-28 h-28 mx-auto mb-6 rounded-full bg-gold-gradient p-[1px] shadow-gold-glow relative">
                  <div className="w-full h-full rounded-full bg-dark flex items-center justify-center overflow-hidden">
                    {currentMVP?.profile_image ? (
                      <img 
                        src={currentMVP.profile_image.startsWith('http') ? currentMVP.profile_image : `http://localhost:5000${currentMVP.profile_image}`} 
                        alt="MVP" 
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <TrendingUp size={44} className="text-primary" />
                    )}
                  </div>
                  <div className="absolute -bottom-2 -right-2 bg-primary text-dark p-2 rounded-full shadow-lg">
                    <Crown size={16} />
                  </div>
                </div>

                <h2 className="text-3xl font-bold text-white mb-2">
                  {currentMVP ? `${currentMVP.first_name} ${currentMVP.last_name}` : 'Pendiente'}
                </h2>
                <p className="text-[10px] font-bold text-primary uppercase tracking-[0.2em] mb-8">
                  {currentMVP ? `MÁXIMO EXPONENTE • SEMANA ${currentMVP.week_number}` : 'EL PRESTIGIO SE GANA'}
                </p>

                <div className="grid grid-cols-1 gap-4 mb-8">
                  <div className="p-4 bg-white/5 rounded-2xl border border-white/10">
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Estado</p>
                    <p className="text-xl font-bold text-white mt-1">
                      {currentMVP ? 'Designado' : 'Sin asignar'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-center gap-2 text-primary font-bold text-xs uppercase tracking-widest">
                  <Target size={14} />
                  <span>Excelencia Deportiva</span>
                </div>
              </div>
            </div>

            <div className="p-6 bg-primary/10 border-t border-primary/20 flex items-center gap-4">
              <div className="p-2 rounded-lg bg-primary/20">
                <Star size={16} className="text-primary" />
              </div>
              <div className="flex-1">
                <p className="text-[10px] font-bold text-primary uppercase tracking-widest mb-1">Impacto en el Club</p>
                <div className="h-1.5 w-full bg-dark rounded-full overflow-hidden">
                  <div className={`h-full bg-primary rounded-full shadow-gold-glow transition-all duration-1000 ${currentMVP ? 'w-[100%]' : 'w-0'}`}></div>
                </div>
              </div>
            </div>
          </Card>

          <div className="p-6 bg-black/20 border border-white/5 rounded-2xl">
            <div className="flex gap-3">
              <Target size={18} className="text-slate-500 shrink-0 mt-1" />
              <p className="text-xs text-slate-500 leading-relaxed font-medium italic">
                "El MVP es el reflejo del esfuerzo, la disciplina y el talento puesto al servicio del equipo."
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MVPView;
