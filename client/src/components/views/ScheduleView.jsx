import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { 
  matchService, 
  teamService 
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
  Info
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
  
  const [formData, setFormData] = useState({
    team_id: '',
    opponent: '',
    match_date: new Date().toISOString().split('T')[0],
    match_time: '10:00',
    location: '',
    is_home: 1,
    convocation: '',
    notes: ''
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      const [matchesRes, teamsRes] = await Promise.all([
        matchService.getMatches(),
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
        convocation: '',
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

  const isStaff = ['coach', 'admin', 'superadmin'].includes(user?.role);
  const isAdmin = ['admin', 'superadmin'].includes(user?.role);

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

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          <Card className="lg:col-span-2 p-8" hover={false}>
            <div className="flex items-center gap-4 mb-10">
               <div className="w-16 h-16 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center">
                  <Swords size={32} className="text-primary" />
               </div>
               <div>
                  <h3 className="text-3xl font-bold">vs {selectedMatch.opponent}</h3>
                  <span className="px-3 py-1 bg-primary/10 text-primary border border-primary/20 rounded-full text-[10px] font-bold uppercase tracking-widest mt-2">{selectedMatch.team_id === 1 ? 'Primer Equipo - Élite' : 'Competición Oficial'}</span>
               </div>
            </div>
            
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

            <div className="space-y-6">
                <div className="space-y-4">
                  <h4 className="text-sm font-bold flex items-center gap-2 uppercase tracking-widest text-slate-400">
                    <Info size={16} className="text-primary" /> Notas del Entrenador
                  </h4>
                  <p className="text-slate-300 font-medium leading-relaxed bg-black/20 p-6 rounded-xl border border-white/5 italic">
                      {selectedMatch.notes || '"Sin observaciones adicionales para este encuentro."'}
                  </p>
                </div>
            </div>
          </Card>

          <Card className="p-0 border-white/5 overflow-hidden" hover={false}>
            <div className="p-8 border-b border-white/5 bg-white/5">
              <h3 className="text-xl font-bold flex items-center gap-3">
                <ClipboardCheck size={24} className="text-primary" /> Convocatoria
              </h3>
            </div>
            <div className="p-8 min-h-[200px]">
               {selectedMatch.convocation ? (
                  <div className="whitespace-pre-wrap text-slate-400 font-medium leading-relaxed">
                     {selectedMatch.convocation}
                  </div>
               ) : (
                  <div className="flex flex-col items-center justify-center h-full opacity-30 text-center">
                     <AlertCircle size={32} className="mb-2" />
                     <p className="text-xs font-bold uppercase tracking-widest">Lista no disponible</p>
                  </div>
               )}
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
        {isStaff && (
          <Button 
            variant={showForm ? 'secondary' : 'primary'} 
            onClick={() => setShowForm(!showForm)} 
            icon={showForm ? X : Plus}
            className="w-full sm:w-auto"
          >
            {showForm ? 'Cancelar' : 'Nuevo Partido'}
          </Button>
        )}
      </header>

      {showForm && (
        <Card className="border-primary/30 shadow-gold/10" hover={false}>
          <form onSubmit={handleCreateMatch} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="space-y-2">
              <label className="label-base">Equipo</label>
              <select 
                required
                value={formData.team_id} 
                onChange={(e) => setFormData({...formData, team_id: e.target.value})} 
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
              onChange={(e) => setFormData({...formData, opponent: e.target.value})}
              placeholder="Nombre del club rival"
              required
            />
            <Input
              label="Fecha"
              type="date"
              value={formData.match_date}
              onChange={(e) => setFormData({...formData, match_date: e.target.value})}
              required
            />
            <Input
              label="Hora"
              type="time"
              value={formData.match_time}
              onChange={(e) => setFormData({...formData, match_time: e.target.value})}
              required
            />
            <Input
              label="Localización"
              value={formData.location}
              onChange={(e) => setFormData({...formData, location: e.target.value})}
              placeholder="Estadio / Ciudad Deportiva"
              icon={MapPin}
            />
            <div className="space-y-2">
              <label className="label-base">Campo</label>
              <select 
                value={formData.is_home} 
                onChange={(e) => setFormData({...formData, is_home: parseInt(e.target.value)})} 
                className="input-base cursor-pointer"
              >
                <option value={1}>Local</option>
                <option value={0}>Visitante</option>
              </select>
            </div>
            
            <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="label-base">Convocatoria (Lista de jugadores)</label>
                <textarea 
                  value={formData.convocation} 
                  onChange={(e) => setFormData({...formData, convocation: e.target.value})} 
                  placeholder="Ej: Marc, David, Pau..."
                  className="input-base min-h-[120px] py-4"
                />
              </div>
              <div className="space-y-2">
                <label className="label-base">Notas / Instrucciones</label>
                <textarea 
                  value={formData.notes} 
                  onChange={(e) => setFormData({...formData, notes: e.target.value})} 
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
                <div className={`flex flex-col items-center justify-center w-20 h-20 rounded-2xl border shadow-glass shrink-0 transition-colors ${
                  match.published ? 'bg-white/5 border-white/10 text-white' : 'bg-yellow-500/5 border-yellow-500/20 text-yellow-500/70'
                }`}>
                  <span className="text-3xl font-bold leading-none">{getDay(match.match_date)}</span>
                  <span className="text-[10px] font-extrabold uppercase tracking-widest mt-1 opacity-60">2026</span>
                </div>

                <div className="flex-1 text-center lg:text-left space-y-2">
                  <div className="flex flex-wrap justify-center lg:justify-start items-center gap-3">
                    {match.team_id === 1 && (
                      <span className="px-2 py-0.5 bg-gold-gradient text-dark rounded-md text-[8px] font-black uppercase tracking-tighter">Primer Equipo</span>
                    )}
                    <span className={`px-3 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-[0.2em] border ${
                      match.published 
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
    </div>
  );
};

export default ScheduleView;
