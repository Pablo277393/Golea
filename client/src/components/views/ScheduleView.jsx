import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import {
  matchService,
  teamService,
  parentService,
  trainingService
} from '../../services/api';
import {
  Calendar,
  MapPin,
  Clock,
  Plus,
  ArrowLeft,
  ClipboardCheck,
  X,
  Search,
  Trophy,
  Swords,
  ArrowRight,
  Send,
  Trash2,
  AlertCircle,
  CheckCircle2,
  Info,
  ChevronLeft,
  ChevronRight,
  LayoutList,
  User
} from 'lucide-react';
import Card from '../ui/Card';
import Button from '../ui/Button';
import Input from '../ui/Input';

const ScheduleView = () => {
  const { user } = useAuth();
  const [matches, setMatches] = useState([]);
  const [teams, setTeams] = useState([]);
  const [selectedMatch, setSelectedMatch] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('list');
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [callups, setCallups] = useState([]);
  const [scoreFormData, setScoreFormData] = useState({ home_score: '', away_score: '' });

  const [formData, setFormData] = useState({
    team_id: '',
    opponent: '',
    match_date: new Date().toISOString().split('T')[0],
    match_time: '10:00',
    location: '',
    is_home: 1,
    notes: ''
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      const fetchMatchesPromise = user?.role?.toLowerCase() === 'parent'
        ? parentService.getCalendarMatches()
        : matchService.getMatches();

      const [matchesRes, teamsRes] = await Promise.all([
        fetchMatchesPromise,
        teamService.getTeams()
      ]);
      setMatches(matchesRes.data);
      setTeams(teamsRes.data);
    } catch (err) {
      console.error('Error fetching schedule data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (selectedMatch) {
      fetchCallups(selectedMatch.id);
      setScoreFormData({
        home_score: selectedMatch.home_score ?? '',
        away_score: selectedMatch.away_score ?? ''
      });
    }
  }, [selectedMatch]);

  const fetchCallups = async (matchId) => {
    try {
      const res = await trainingService.getCallups('match', matchId);
      setCallups(res.data);
    } catch (err) {
      console.error('Error fetching callups:', err);
    }
  };

  const handleUpdateScore = async () => {
    try {
      const res = await matchService.updateScore(selectedMatch.id, {
        home_score: parseInt(scoreFormData.home_score),
        away_score: parseInt(scoreFormData.away_score)
      });
      setSelectedMatch(res.data);
      alert('Marcador actualizado correctamente');
      fetchData();
    } catch (err) {
      alert('Error al actualizar el marcador');
    }
  };

  const handleCreateMatch = async (e) => {
    e.preventDefault();
    try {
      await matchService.createMatch({
        ...formData,
        published: 0 // Always creates as draft
      });
      setShowForm(false);
      setFormData({
        team_id: '',
        opponent: '',
        match_date: new Date().toISOString().split('T')[0],
        match_time: '10:00',
        location: '',
        is_home: 1,
        notes: ''
      });
      fetchData();
    } catch (err) {
      alert('Error al crear el partido');
    }
  };

  const handlePublish = async (id) => {
    if (!window.confirm('¿Desea publicar el partido? Se enviarán notificaciones a los jugadores y padres.')) return;
    try {
      await matchService.publishMatch(id);
      fetchData();
      if (selectedMatch?.id === id) {
        setSelectedMatch(prev => ({ ...prev, published: 1 }));
      }
    } catch (err) {
      alert('Error al publicar el partido');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('¿Está seguro de que desea eliminar este partido de forma permanente?')) return;
    try {
      await matchService.deleteMatch(id);
      setSelectedMatch(null);
      fetchData();
    } catch (err) {
      alert('Error al eliminar el partido');
    }
  };

  const getDay = (dateStr) => {
    if (!dateStr) return '??';
    return dateStr.split('-')[2];
  };

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    return { firstDay, daysInMonth };
  };

  const navigateMonth = (direction) => {
    setCurrentMonth(prev => {
      const next = new Date(prev);
      next.setMonth(prev.getMonth() + direction);
      return next;
    });
  };

  const isStaff = ['coach', 'admin', 'superadmin'].includes(user?.role);
  const isAdmin = ['admin', 'superadmin'].includes(user?.role);
  const canEditScore = isAdmin || (user?.role === 'coach' && selectedMatch?.coach_id === user?.id);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 animate-pulse">
        <Trophy size={48} className="text-primary/20 mb-4" />
        <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px]">Cargando Calendario...</p>
      </div>
    );
  }

  if (selectedMatch) {
    return (
      <div className="space-y-8 animate-in fade-in slide-in-from-left-4 duration-500">
        <div className="flex justify-between items-center">
          <Button
            variant="secondary"
            onClick={() => setSelectedMatch(null)}
            className="px-4 py-2 text-sm"
            icon={ArrowLeft}
          >
            Volver
          </Button>

          {isAdmin && (
            <Button
              variant="ghost"
              onClick={() => handleDelete(selectedMatch.id)}
              className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
              icon={Trash2}
            >
              Eliminar Partido
            </Button>
          )}
        </div>

        <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h2 className="text-4xl font-bold tracking-tight">
                Detalle del <span className="text-gold-glow">Partido</span>
              </h2>
              {selectedMatch.published ? (
                <span className="px-3 py-1 bg-green-500/10 text-green-400 border border-green-500/20 rounded-full text-[9px] font-black uppercase tracking-widest">Publicado</span>
              ) : (
                <span className="px-3 py-1 bg-yellow-500/10 text-yellow-400 border border-yellow-500/20 rounded-full text-[9px] font-black uppercase tracking-widest">Borrador</span>
              )}
            </div>
            <p className="text-slate-400 font-medium tracking-wide">
              {selectedMatch.team_name} • {selectedMatch.is_home ? 'Local' : 'Visitante'}
            </p>
          </div>

          {!selectedMatch.published && isStaff && (
            <Button variant="primary" icon={Send} onClick={() => handlePublish(selectedMatch.id)}>
              Publicar Ahora
            </Button>
          )}
        </header>

        <div className="max-w-5xl">
          <Card className="p-8" hover={false}>
            <div className="flex items-center gap-4 mb-10">
              <div className="w-16 h-16 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center">
                <Swords size={32} className="text-primary" />
              </div>
              <div>
                <h3 className="text-3xl font-bold">vs {selectedMatch.opponent}</h3>
                <div className="flex items-center gap-3 mt-2">
                  <span className="px-3 py-1 bg-primary/10 text-primary border border-primary/20 rounded-full text-[10px] font-bold uppercase tracking-widest">{selectedMatch.team_id === 1 ? 'Primer Equipo - Élite' : 'Competición Oficial'}</span>
                  {selectedMatch.home_score !== null && (
                    <span className="px-3 py-1 bg-white/10 text-white border border-white/20 rounded-full text-[12px] font-black tracking-widest">
                      RESULTADO: {selectedMatch.home_score} - {selectedMatch.away_score}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Score Editor for Authorized Personnel */}
            {canEditScore && selectedMatch.published === 1 && (
              <div className="mb-10 p-6 bg-primary/5 border border-primary/20 rounded-2xl">
                <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-primary mb-4 flex items-center gap-2">
                  <Trophy size={14} /> Actualizar Resultado Final
                </h4>
                <div className="flex items-center gap-6">
                  <div className="flex-1 grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[9px] font-bold text-slate-500 uppercase">Local</label>
                      <input 
                        type="number" 
                        value={scoreFormData.home_score}
                        onChange={(e) => setScoreFormData({...scoreFormData, home_score: e.target.value})}
                        className="input-base text-center text-xl font-bold py-2"
                        placeholder="0"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[9px] font-bold text-slate-500 uppercase">Visitante</label>
                      <input 
                        type="number" 
                        value={scoreFormData.away_score}
                        onChange={(e) => setScoreFormData({...scoreFormData, away_score: e.target.value})}
                        className="input-base text-center text-xl font-bold py-2"
                        placeholder="0"
                      />
                    </div>
                  </div>
                  <Button variant="primary" className="h-full px-6" onClick={handleUpdateScore}>
                    Guardar
                  </Button>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-12 p-6 bg-white/5 rounded-2xl border border-white/5">
              <div className="flex items-center gap-4">
                <Calendar size={20} className="text-primary" />
                <div>
                  <p className="text-[10px] uppercase font-bold text-slate-500 tracking-widest">Fecha</p>
                  <p className="font-bold text-slate-200">{selectedMatch.match_date}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <Clock size={20} className="text-primary" />
                <div>
                  <p className="text-[10px] uppercase font-bold text-slate-500 tracking-widest">Hora</p>
                  <p className="font-bold text-slate-200">{selectedMatch.match_time.substring(0, 5)}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <MapPin size={20} className="text-primary" />
                <div>
                  <p className="text-[10px] uppercase font-bold text-slate-500 tracking-widest">Lugar</p>
                  <p className="font-bold text-slate-200">{selectedMatch.location || 'Por definir'}</p>
                </div>
              </div>
            </div>

            <div className="space-y-8">
              <div className="space-y-4">
                <h4 className="text-sm font-bold flex items-center gap-2 uppercase tracking-widest text-slate-400">
                  <Info size={16} className="text-primary" /> Notas del Entrenador
                </h4>
                <p className="text-slate-300 font-medium leading-relaxed bg-black/20 p-6 rounded-xl border border-white/5 italic">
                  {selectedMatch.notes || '"Sin observaciones adicionales para este encuentro."'}
                </p>
              </div>

              <div className="space-y-4">
                <h4 className="text-sm font-bold flex items-center gap-2 uppercase tracking-widest text-slate-400">
                  <ClipboardCheck size={16} className="text-primary" /> Jugadores Convocados
                </h4>
                {callups.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {callups.map((player) => (
                      <div key={player.id} className="flex items-center gap-3 p-3 bg-white/5 rounded-xl border border-white/5">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center border border-primary/20">
                          <span className="text-primary font-bold text-sm">
                            {player.jersey_number || <User size={14} />}
                          </span>
                        </div>
                        <div>
                          <p className="font-bold text-slate-200 text-sm">
                            {player.first_name || player.last_name ? `${player.first_name || ''} ${player.last_name || ''}` : player.username}
                          </p>
                          <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">{player.position || 'Sin posición'}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-8 text-center bg-black/20 rounded-xl border border-white/5 border-dashed">
                    <p className="text-xs font-bold uppercase tracking-widest text-slate-500">No hay convocatoria publicada para este partido</p>
                  </div>
                )}
              </div>
            </div>
          </Card>


        </div>
      </div>
    );
  }

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <header className="flex flex-col sm:flex-row justify-between items-center gap-6">
        <div>
          <h2 className="text-4xl lg:text-5xl font-bold tracking-tight mb-2">Calendario de Partidos</h2>
          <p className="text-slate-400 font-medium">Gestión de encuentros y comunicación oficial.</p>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="flex bg-white/5 p-1 rounded-xl border border-white/10">
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 px-4 rounded-lg flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest transition-all ${viewMode === 'list' ? 'bg-primary text-dark shadow-gold-glow' : 'text-slate-400 hover:text-white'}`}
            >
              <LayoutList size={16} /> Lista
            </button>
            <button
              onClick={() => setViewMode('calendar')}
              className={`p-2 px-4 rounded-lg flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest transition-all ${viewMode === 'calendar' ? 'bg-primary text-dark shadow-gold-glow' : 'text-slate-400 hover:text-white'}`}
            >
              <Calendar size={16} /> Grid
            </button>
          </div>

          {isStaff && (
            <Button
              variant={showForm ? 'secondary' : 'primary'}
              onClick={() => setShowForm(!showForm)}
              icon={showForm ? X : Plus}
              className="flex-1 sm:flex-none"
            >
              {showForm ? 'Cancelar' : 'Nuevo'}
            </Button>
          )}
        </div>
      </header>

      {showForm && (
        <Card className="border-primary/30 shadow-gold/10" hover={false}>
          <form onSubmit={handleCreateMatch} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="space-y-2">
              <label className="label-base">Equipo</label>
              <select
                required
                value={formData.team_id}
                onChange={(e) => setFormData({ ...formData, team_id: e.target.value })}
                className="input-base cursor-pointer"
              >
                <option value="">Seleccionar Equipo...</option>
                {teams.map(t => (
                  <option key={t.id} value={t.id}>{t.id === 1 ? '⭐ ' : ''}{t.name}</option>
                ))}
              </select>
            </div>
            <Input
              label="Rival"
              value={formData.opponent}
              onChange={(e) => setFormData({ ...formData, opponent: e.target.value })}
              placeholder="Nombre del club rival"
              required
            />
            <Input
              label="Fecha"
              type="date"
              value={formData.match_date}
              onChange={(e) => setFormData({ ...formData, match_date: e.target.value })}
              required
            />
            <Input
              label="Hora"
              type="time"
              value={formData.match_time}
              onChange={(e) => setFormData({ ...formData, match_time: e.target.value })}
              required
            />
            <Input
              label="Localización"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              placeholder="Estadio / Ciudad Deportiva"
              icon={MapPin}
            />
            <div className="space-y-2">
              <label className="label-base">Campo</label>
              <select
                value={formData.is_home}
                onChange={(e) => setFormData({ ...formData, is_home: parseInt(e.target.value) })}
                className="input-base cursor-pointer"
              >
                <option value={1}>Local</option>
                <option value={0}>Visitante</option>
              </select>
            </div>

            <div className="lg:col-span-3">
              <div className="space-y-2">
                <label className="label-base">Notas / Instrucciones</label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="Indicaciones tácticas, hora de llegada, etc."
                  className="input-base min-h-[120px] py-4"
                />
              </div>
            </div>

            <div className="lg:col-span-3 pt-4">
              <Button type="submit" variant="primary" className="w-full py-4 text-lg" icon={Plus}>
                Guardar como Borrador
              </Button>
              <p className="text-center mt-4 text-[10px] text-slate-500 font-bold uppercase tracking-widest">
                El partido solo será visible públicamente tras pulsar "Publicar" en el listado.
              </p>
            </div>
          </form>
        </Card>
      )}

      {viewMode === 'list' ? (
        <div className="space-y-4">
          {matches.length > 0 ? matches.map(match => (
            <Card
              key={match.id}
              className={`p-1 px-8 lg:px-10 transition-all duration-300 ${match.published ? 'hover:border-primary/40' : 'border-yellow-500/10 bg-yellow-500/[0.01]'}`}
              hover={match.published}
            >
              <div className="flex flex-col lg:flex-row items-center justify-between gap-8 py-6">
                <div className="flex flex-col lg:flex-row items-center gap-8 w-full">
                  {/* Date Plate */}
                  <div className={`flex flex-col items-center justify-center w-20 h-20 rounded-2xl border shadow-glass shrink-0 transition-colors ${match.published ? 'bg-white/5 border-white/10 text-white' : 'bg-yellow-500/5 border-yellow-500/20 text-yellow-500/70'
                    }`}>
                    <span className="text-3xl font-bold leading-none">{getDay(match.match_date)}</span>
                    <span className="text-[10px] font-extrabold uppercase tracking-widest mt-1 opacity-60">2026</span>
                  </div>

                  <div className="flex-1 text-center lg:text-left space-y-2">
                    <div className="flex flex-wrap justify-center lg:justify-start items-center gap-3">
                      {match.team_id === 1 && (
                        <span className="px-2 py-0.5 bg-gold-gradient text-dark rounded-md text-[8px] font-black uppercase tracking-tighter">Primer Equipo</span>
                      )}
                      {match.player_username && (
                        <span className="px-2 py-0.5 bg-white/10 text-slate-300 rounded-md text-[8px] font-black uppercase tracking-widest border border-white/10">
                          {match.player_first_name || match.player_username}
                        </span>
                      )}
                      <span className={`px-3 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-[0.2em] border ${match.published
                          ? 'bg-primary/10 text-primary border-primary/20'
                          : 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20'
                        }`}>
                        {match.published ? 'Publicado' : 'Borrador'}
                      </span>
                      <span className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center gap-1.5">
                        <div className="w-1 h-1 rounded-full bg-slate-600"></div> {match.team_name}
                      </span>
                    </div>
                    <h4 className="text-2xl font-bold group-hover:text-primary transition-colors">vs {match.opponent}</h4>

                    <div className="flex flex-wrap justify-center lg:justify-start items-center gap-6 text-sm text-slate-500 font-medium">
                      <span className="flex items-center gap-2">
                        <Clock size={16} className="text-primary/70" /> {match.match_time.substring(0, 5)}
                      </span>
                      {match.location && (
                        <span className="flex items-center gap-2">
                          <MapPin size={16} className="text-primary/70" /> {match.location}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="shrink-0 w-full lg:w-auto flex flex-col sm:flex-row gap-3">
                  {!match.published && isStaff && (
                    <Button
                      variant="primary"
                      onClick={() => handlePublish(match.id)}
                      icon={Send}
                      className="w-full sm:w-auto px-6"
                    >
                      Publicar
                    </Button>
                  )}
                  <Button
                    variant="secondary"
                    onClick={() => setSelectedMatch(match)}
                    icon={ArrowRight}
                    className="w-full sm:w-auto px-8 py-3 rounded-xl border-white/5"
                  >
                    Ver Detalles
                  </Button>
                </div>
              </div>
            </Card>
          )) : (
            <div className="text-center py-20 bg-white/[0.02] rounded-3xl border border-white/5 border-dashed">
              <Calendar size={48} className="mx-auto mb-4 text-slate-700" />
              <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px]">No hay eventos programados en este momento</p>
            </div>
          )}
        </div>
      ) : (
        <Card className="p-8 border-white/5" hover={false}>
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-2xl font-bold uppercase tracking-tight">
              {currentMonth.toLocaleDateString('es-ES', { month: 'long', year: 'numeric' })}
            </h3>
            <div className="flex gap-2">
              <Button variant="secondary" className="p-2" icon={ChevronLeft} onClick={() => navigateMonth(-1)} />
              <Button variant="secondary" className="p-2" icon={ChevronRight} onClick={() => navigateMonth(1)} />
            </div>
          </div>

          <div className="grid grid-cols-7 gap-2">
            {['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'].map(d => (
              <div key={d} className="text-center py-2 text-[10px] font-black uppercase tracking-widest text-slate-500">
                {d}
              </div>
            ))}

            {Array.from({ length: (getDaysInMonth(currentMonth).firstDay + 6) % 7 }).map((_, i) => (
              <div key={`empty-${i}`} className="h-32 bg-white/[0.02] rounded-2xl border border-white/5 opacity-20" />
            ))}

            {Array.from({ length: getDaysInMonth(currentMonth).daysInMonth }).map((_, i) => {
              const day = i + 1;
              const dateStr = `${currentMonth.getFullYear()}-${String(currentMonth.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
              const dayMatches = matches.filter(m => m.match_date === dateStr);

              return (
                <div key={day} className={`h-32 p-3 rounded-2xl border transition-all ${dayMatches.length > 0 ? 'bg-primary/5 border-primary/20' : 'bg-white/5 border-white/5'}`}>
                  <span className={`text-sm font-bold ${dayMatches.length > 0 ? 'text-primary' : 'text-slate-500'}`}>{day}</span>
                  <div className="mt-2 space-y-1">
                    {dayMatches.map(m => (
                      <button
                        key={m.id}
                        onClick={() => setSelectedMatch(m)}
                        className="w-full text-left p-1.5 rounded-lg bg-primary/10 border border-primary/20 hover:bg-primary/20 transition-all overflow-hidden"
                      >
                        <p className="text-[8px] font-black text-primary uppercase truncate">vs {m.opponent}</p>
                        {m.player_username && (
                          <p className="text-[6px] font-bold text-slate-400 uppercase truncate mt-0.5">{m.player_first_name || m.player_username}</p>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      )}
    </div>
  );
};

export default ScheduleView;
