import React, { useState, useEffect } from 'react';
import { parentService } from '../../services/api';
import { UserPlus, Users, QrCode, AlertCircle, CheckCircle2, ChevronRight, User } from 'lucide-react';
import Card from '../ui/Card';
import Button from '../ui/Button';
import AttendanceExcelTable from '../ui/AttendanceExcelTable';
import { attendanceService } from '../../services/api';
import { ArrowLeft } from 'lucide-react';

const MyPlayersView = () => {
  const [players, setPlayers] = useState([]);
  const [linkingCode, setLinkingCode] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [selectedChild, setSelectedChild] = useState(null);
  const [attendanceData, setAttendanceData] = useState([]);

  useEffect(() => {
    fetchPlayers();
  }, []);

  const fetchPlayers = async () => {
    setLoading(true);
    try {
      const res = await parentService.getPlayers();
      setPlayers(res.data);
    } catch (err) {
      console.error('Error fetching players:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleLinkPlayer = async (e) => {
    e.preventDefault();
    if (!linkingCode.trim()) return;

    setSubmitting(true);
    setMessage({ type: '', text: '' });

    try {
      const res = await parentService.linkPlayer(linkingCode);
      setMessage({ type: 'success', text: res.data.message });
      setLinkingCode('');
      fetchPlayers();
    } catch (err) {
      setMessage({ 
        type: 'error', 
        text: err.response?.data?.message || 'Error al vincular el jugador' 
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleSelectChild = async (child) => {
    setLoading(true);
    try {
      const res = await attendanceService.getPlayerAttendance(child.id);
      // attendanceService.getPlayerAttendance returns a list of trainings with status/is_golden_cone joined
      // We need to adapt it for AttendanceExcelTable which expects { players, trainings, attendanceData }
      setSelectedChild(child);
      
      // Adaptation:
      const trainings = res.data.map(t => ({
        id: t.id,
        training_date: t.training_date,
        training_time: t.training_time,
        location: t.location
      }));
      
      const attendance = res.data.map(t => ({
        training_id: t.id,
        player_id: child.id,
        status: t.status,
        is_golden_cone: t.is_golden_cone
      }));

      setAttendanceData(attendance);
      // We need unique trainings (though they should be unique from the query)
      const uniqueTrainings = Array.from(new Set(trainings.map(t => t.id)))
        .map(id => trainings.find(t => t.id === id));
        
      setChildTrainings(uniqueTrainings);

    } catch (err) {
      console.error('Error fetching child attendance', err);
    } finally {
      setLoading(false);
    }
  };

  const [childTrainings, setChildTrainings] = useState([]);

  if (selectedChild) {
    return (
      <div className="space-y-8 animate-in fade-in slide-in-from-left-4 duration-500">
        <Button 
          variant="secondary" 
          onClick={() => setSelectedChild(null)}
          icon={ArrowLeft}
        >
          Volver a Mis Jugadores
        </Button>

        <header>
          <h2 className="text-4xl font-bold tracking-tight mb-2">
            Entrenamientos: <span className="text-gold-glow">{selectedChild.first_name}</span>
          </h2>
          <p className="text-slate-400 font-medium">Historial completo de asistencia y reconocimientos.</p>
        </header>

        <AttendanceExcelTable 
          players={[selectedChild]}
          trainings={childTrainings}
          attendanceData={attendanceData}
          readOnly={true}
        />
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black tracking-tight text-white mb-2 uppercase">
            Mis <span className="text-primary">Jugadores</span>
          </h1>
          <p className="text-slate-400 font-medium">Gestiona y vincula a tus hijos en la plataforma élite.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Linking Form Column */}
        <div className="xl:col-span-1 space-y-6">
          <Card className="p-8 border-primary/20 bg-primary/5 backdrop-blur-xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <QrCode size={80} />
            </div>
            
            <h3 className="text-xl font-bold mb-6 flex items-center gap-3">
              <UserPlus className="text-primary" size={24} />
              Vincular Nuevo Jugador
            </h3>

            <form onSubmit={handleLinkPlayer} className="space-y-4">
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest font-black text-slate-400 ml-1">
                  Código de Vinculación
                </label>
                <input
                  type="text"
                  placeholder="Ej: JPX-8K4M-92QD"
                  value={linkingCode}
                  onChange={(e) => setLinkingCode(e.target.value.toUpperCase())}
                  className="w-full bg-dark/50 border border-white/10 rounded-2xl px-6 py-4 focus:outline-none focus:border-primary/50 transition-all font-mono tracking-wider text-primary placeholder:text-slate-600"
                />
              </div>

              {message.text && (
                <div className={`p-4 rounded-2xl flex items-center gap-3 text-xs font-bold uppercase tracking-wider ${
                  message.type === 'success' ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'
                }`}>
                  {message.type === 'success' ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
                  {message.text}
                </div>
              )}

              <Button 
                type="submit" 
                className="w-full justify-center py-4 rounded-2xl shadow-gold-glow"
                disabled={submitting}
              >
                {submitting ? 'Vinculando...' : 'Asociar Jugador'}
              </Button>
            </form>
            
            <div className="mt-6 p-4 rounded-xl bg-white/5 border border-white/5 text-[10px] text-slate-400 leading-relaxed uppercase tracking-tight">
              Solicita el código único a tu hijo/a. Este código se encuentra en su perfil de jugador.
            </div>
          </Card>
        </div>

        {/* Players List Column */}
        <div className="xl:col-span-2 space-y-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-xl font-bold flex items-center gap-3">
              <Users className="text-primary" size={24} />
              Jugadores Asociados
            </h3>
            <span className="bg-primary/10 text-primary text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest border border-primary/20">
              {players.length} {players.length === 1 ? 'Jugador' : 'Jugadores'}
            </span>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[1, 2].map(i => (
                <div key={i} className="h-32 bg-white/5 rounded-3xl animate-pulse border border-white/5" />
              ))}
            </div>
          ) : players.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {players.map((player) => (
                <Card 
                  key={player.id} 
                  className="p-6 hover:border-primary/40 transition-all group cursor-pointer overflow-hidden relative"
                  onClick={() => handleSelectChild(player)}
                >
                  {/* Decorative element */}
                  <div className="absolute -right-4 -bottom-4 opacity-5 group-hover:opacity-10 transition-opacity">
                    <User size={120} />
                  </div>

                  <div className="flex items-center gap-5 relative z-10">
                    <div className="w-16 h-16 rounded-2xl bg-gold-gradient p-[1px]">
                      <div className="w-full h-full rounded-2xl bg-dark-card flex items-center justify-center text-primary font-bold text-2xl">
                        {player.first_name?.charAt(0) || player.username.charAt(0).toUpperCase()}
                      </div>
                    </div>
                    
                    <div className="flex-1">
                      <h4 className="text-lg font-bold text-white group-hover:text-primary transition-colors">
                        {player.first_name} {player.last_name}
                      </h4>
                      <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mb-2">@{player.username}</p>
                      
                      <div className="flex items-center gap-2">
                        <span className="text-[9px] bg-white/5 text-slate-400 px-2 py-1 rounded-md border border-white/5 font-mono">
                          {player.linking_code}
                        </span>
                      </div>
                    </div>

                    <ChevronRight className="text-slate-600 group-hover:text-primary group-hover:translate-x-1 transition-all" size={20} />
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="p-16 border-dashed border-white/10 bg-transparent flex flex-col items-center justify-center text-center">
              <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mb-6 text-slate-600">
                <Users size={40} />
              </div>
              <h4 className="text-xl font-bold text-white mb-2">No tienes jugadores asociados</h4>
              <p className="text-slate-400 max-w-xs mx-auto text-sm">
                Utiliza el formulario de la izquierda para vincular a tus hijos ingresando su código de vinculación único.
              </p>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyPlayersView;
