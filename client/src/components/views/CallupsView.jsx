import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { 
  teamService, 
  matchService, 
  trainingService,
  authService 
} from '../../services/api';
import { 
  ClipboardList, 
  Search, 
  Calendar, 
  ChevronRight, 
  Trophy, 
  Swords, 
  Users,
  Shield,
  ArrowLeft,
  CheckCircle2
} from 'lucide-react';
import CallupVisual from '../CallupVisual';
import Card from '../ui/Card';
import Button from '../ui/Button';

const CallupsView = () => {
  const { user } = useAuth();
  const [teams, setTeams] = useState([]);
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [matches, setMatches] = useState([]);
  const [selectedMatch, setSelectedMatch] = useState(null);
  const [teamPlayers, setTeamPlayers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [step, setStep] = useState('team'); // 'team', 'match', 'players'
  const [currentCallup, setCurrentCallup] = useState([]);

  useEffect(() => {
    fetchTeams();
  }, []);

  const fetchTeams = async () => {
    try {
      const res = await teamService.getTeams({ managedOnly: user?.role === 'coach' });
      setTeams(res.data);
      if (res.data.length === 1) {
        handleSelectTeam(res.data[0]);
      }
    } catch (err) {
      console.error('Error fetching teams:', err);
      alert('Error al cargar la lista de equipos.');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectTeam = async (team) => {
    if (!team) return;
    setSelectedTeam(team);
    setLoading(true);
    try {
      const [matchesRes, playersRes] = await Promise.all([
        matchService.getMatches(),
        teamService.getTeamPlayers(team.id)
      ]);
      
      const allMatches = matchesRes?.data || [];
      const teamMatches = allMatches.filter(m => Number(m.team_id) === Number(team.id));
      
      setMatches(teamMatches);
      setTeamPlayers(playersRes?.data || []);
      setStep('match');
    } catch (err) {
      console.error('Error loading team data:', err);
      alert('Error al cargar los datos del equipo. Por favor, inténtelo de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectMatch = async (match) => {
    if (!match) return;
    setSelectedMatch(match);
    setLoading(true);
    try {
      const res = await trainingService.getCallups('match', match.id);
      setCurrentCallup((res?.data || []).map(c => c.player_id));
      setStep('players');
    } catch (err) {
      console.error('Error loading callups:', err);
      alert('Error al cargar la convocatoria actual.');
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmCallup = async (playerIds) => {
    try {
      await trainingService.updateCallups('match', selectedMatch.id, playerIds);
      alert('¡Convocatoria enviada!');
      setStep('match');
      setSelectedMatch(null);
    } catch (err) {
      console.error('Error saving callup:', err);
      alert('Error al enviar la convocatoria. Por favor, inténtelo de nuevo.');
    }
  };

  if (loading && step === 'team' && teams.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 animate-pulse">
        <Shield size={48} className="text-primary/20 mb-4" />
        <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px]">Cargando Equipos...</p>
      </div>
    );
  }

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-6xl mx-auto">
      <header className="flex flex-col sm:flex-row justify-between items-center gap-6">
        <div>
          <h2 className="text-4xl lg:text-5xl font-bold tracking-tight mb-2">Convocatorias</h2>
          <p className="text-slate-400 font-medium">Gestión de citaciones para partidos oficiales.</p>
        </div>
        {step !== 'team' && (
          <Button variant="secondary" onClick={() => setStep('team')} icon={ArrowLeft}>
            Volver a Equipos
          </Button>
        )}
      </header>

      {step === 'team' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {teams.length > 0 ? teams.map(team => (
            <Card key={team.id} className="p-8 group cursor-pointer hover:border-primary/50 transition-all" onClick={() => handleSelectTeam(team)}>
              <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Shield size={28} className="text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-1 group-hover:text-primary transition-colors">{team.name}</h3>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">{team.category}</p>
            </Card>
          )) : !loading && (
            <div className="col-span-full py-20 text-center bg-white/[0.02] rounded-3xl border border-white/5 border-dashed">
              <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">No tienes equipos asignados</p>
            </div>
          )}
        </div>
      )}

      {step === 'match' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-2xl font-bold flex items-center gap-3">
              <Calendar size={24} className="text-primary" />
              Partidos: <span className="text-gold-glow">{selectedTeam?.name}</span>
            </h3>
          </div>
          
          {loading ? (
            <div className="py-20 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px]">Cargando Partidos...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {matches.length > 0 ? matches.map(match => (
              <Card key={match.id} className="p-6 cursor-pointer hover:bg-white/[0.03]" onClick={() => handleSelectMatch(match)}>
                <div className="flex justify-between items-start mb-4">
                  <span className="text-[10px] font-black text-primary uppercase tracking-widest bg-primary/10 px-2 py-0.5 rounded">
                    {match.match_date}
                  </span>
                  <Swords size={16} className="text-slate-600" />
                </div>
                <h4 className="text-xl font-bold mb-2">vs {match.opponent}</h4>
                <div className="flex items-center gap-4 text-xs text-slate-500 font-bold uppercase tracking-widest">
                  <span>{match.match_time.substring(0, 5)}</span>
                  <span>•</span>
                  <span>{match.location || 'Sin ubicación'}</span>
                </div>
              </Card>
            )) : (
              <div className="col-span-2 py-20 text-center bg-white/[0.02] rounded-3xl border border-white/5 border-dashed">
                <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">No hay partidos registrados para este equipo</p>
              </div>
            )}
            </div>
          )}
        </div>
      )}

      {step === 'players' && (
        <div className="space-y-8">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-2xl font-bold">Convocatoria: vs {selectedMatch.opponent}</h3>
              <p className="text-sm text-slate-400">{selectedTeam.name} • {selectedMatch.match_date}</p>
            </div>
            <Button variant="secondary" onClick={() => setStep('match')} icon={ArrowLeft}>Volver a Partidos</Button>
          </div>

          <Card className="p-8 border-white/5" hover={false}>
            <CallupVisual 
              players={teamPlayers.map(p => ({
                id: p.id,
                name: p.full_name || p.username,
                jerseyNumber: p.jersey_number,
                position: p.position
              }))} 
              initialSelected={currentCallup}
              onConfirm={handleConfirmCallup}
            />
          </Card>
        </div>
      )}
    </div>
  );
};

export default CallupsView;
