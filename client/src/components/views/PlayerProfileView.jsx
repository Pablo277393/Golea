import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { playerService, attendanceService } from '../../services/api';
import { 
  User, 
  Mail, 
  Phone, 
  Hash, 
  Shield, 
  BookOpen,
  CalendarDays,
  Edit2,
  Check,
  X,
  Activity,
  Award,
  Calendar
} from 'lucide-react';
import Card from '../ui/Card';
import AttendanceExcelTable from '../ui/AttendanceExcelTable';

const PlayerProfileView = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [attendanceData, setAttendanceData] = useState([]);
  const [trainings, setTrainings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    first_name: '',
    last_name: '',
    phone: '',
    bio: '',
    birth_date: ''
  });

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [profileRes, attendanceRes] = await Promise.all([
          playerService.getProfile(),
          attendanceService.getPlayerAttendance(user.id)
        ]);
        
        setProfile(profileRes.data);
        
        // Adapt attendance data
        const trainingsList = attendanceRes.data.map(t => ({
          id: t.id,
          training_date: t.training_date,
          training_time: t.training_time,
          location: t.location
        }));
        
        const attendanceList = attendanceRes.data.map(t => ({
          training_id: t.id,
          player_id: user.id,
          status: t.status,
          is_golden_cone: t.is_golden_cone
        }));

        setAttendanceData(attendanceList);
        // Unique trainings
        const uniqueTrainings = Array.from(new Set(trainingsList.map(t => t.id)))
          .map(id => trainingsList.find(t => t.id === id));
        setTrainings(uniqueTrainings);
        setEditForm({
          first_name: profileRes.data.first_name || '',
          last_name: profileRes.data.last_name || '',
          phone: profileRes.data.phone || '',
          bio: profileRes.data.bio || '',
          birth_date: profileRes.data.birth_date || ''
        });

      } catch (err) {
        console.error('Error fetching player profile data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  const handleUpdateProfile = async () => {
    try {
      await playerService.updateProfile(editForm);
      setProfile({ ...profile, ...editForm });
      setIsEditing(false);
      alert('Perfil actualizado con éxito');
    } catch (err) {
      alert('Error al actualizar el perfil');
    }
  };

  const calculateAge = (birthday) => {
    if (!birthday) return 'N/A';
    const ageDifMs = Date.now() - new Date(birthday).getTime();
    const ageDate = new Date(ageDifMs);
    return Math.abs(ageDate.getUTCFullYear() - 1970);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 animate-pulse">
        <User size={48} className="text-primary/20 mb-4" />
        <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px]">Cargando Perfil Élite...</p>
      </div>
    );
  }

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <header>
        <h1 className="text-4xl lg:text-5xl font-black tracking-tight text-white mb-2 uppercase">
          Perfil de <span className="text-gold-glow">Jugador</span>
        </h1>
        <p className="text-slate-400 font-medium">Información oficial y registro de rendimiento.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Personal Details Card */}
        <Card className="lg:col-span-1 p-8 border-primary/20 bg-primary/5 backdrop-blur-xl relative overflow-hidden group">
          <div className="absolute -right-4 -top-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <Shield size={120} />
          </div>
          
          <div className="flex flex-col items-center text-center mb-8 relative z-10">
            <div className="w-24 h-24 rounded-3xl bg-gold-gradient p-[1px] mb-4 shadow-gold-glow">
              <div className="w-full h-full rounded-3xl bg-dark flex items-center justify-center text-primary text-4xl font-black">
                {profile?.jersey_number || <User size={40} />}
              </div>
            </div>
            <h2 className="text-2xl font-bold text-white">{profile?.first_name} {profile?.last_name}</h2>
            <div className="flex items-center gap-2 mt-1">
              <p className="text-primary font-bold uppercase tracking-widest text-[10px]">{profile?.position || 'Sin posición'}</p>
              <span className="text-slate-600 text-[10px]">•</span>
              <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">{calculateAge(profile?.birth_date)} Años</p>
            </div>
          </div>

          <div className="space-y-6 relative z-10">
            {isEditing ? (
              <div className="space-y-4">
                <input 
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white"
                  placeholder="Nombre"
                  value={editForm.first_name}
                  onChange={e => setEditForm({...editForm, first_name: e.target.value})}
                />
                <input 
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white"
                  placeholder="Apellidos"
                  value={editForm.last_name}
                  onChange={e => setEditForm({...editForm, last_name: e.target.value})}
                />
                <input 
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white"
                  placeholder="Teléfono"
                  value={editForm.phone}
                  onChange={e => setEditForm({...editForm, phone: e.target.value})}
                />
                <input 
                  type="date"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white"
                  value={editForm.birth_date}
                  onChange={e => setEditForm({...editForm, birth_date: e.target.value})}
                />
                <div className="flex gap-2">
                  <button onClick={handleUpdateProfile} className="flex-1 bg-primary text-black py-2 rounded-xl font-bold flex items-center justify-center gap-2">
                    <Check size={16} /> Guardar
                  </button>
                  <button onClick={() => setIsEditing(false)} className="flex-1 bg-white/5 text-white py-2 rounded-xl font-bold flex items-center justify-center gap-2">
                    <X size={16} /> Cancelar
                  </button>
                </div>
              </div>
            ) : (
              <>
                <button 
                  onClick={() => setIsEditing(true)}
                  className="absolute top-0 right-0 p-2 bg-primary/10 text-primary rounded-lg hover:bg-primary/20 transition-colors"
                >
                  <Edit2 size={16} />
                </button>
                <div className="flex items-center gap-4 p-4 bg-white/5 rounded-2xl border border-white/5">
                  <div className="text-primary"><Hash size={18} /></div>
                  <div>
                    <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Dorsal</p>
                    <p className="font-bold text-white text-sm">#{profile?.jersey_number ?? 'N/A'}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4 p-4 bg-white/5 rounded-2xl border border-white/5">
                  <div className="text-primary"><CalendarDays size={18} /></div>
                  <div>
                    <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Fecha Nacimiento</p>
                    <p className="font-bold text-white text-sm">{profile?.birth_date || 'N/A'}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-4 p-4 bg-white/5 rounded-2xl border border-white/5">
                  <div className="text-primary"><Shield size={18} /></div>
                  <div>
                    <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Equipo</p>
                    <p className="font-bold text-white text-sm">{profile?.team_name || 'Agente Libre'}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4 p-4 bg-white/5 rounded-2xl border border-white/5">
                  <div className="text-primary"><Phone size={18} /></div>
                  <div>
                    <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Teléfono</p>
                    <p className="font-bold text-white text-sm">{profile?.phone || 'Sin registrar'}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4 p-4 bg-white/5 rounded-2xl border border-white/5">
                  <div className="text-primary"><Mail size={18} /></div>
                  <div>
                    <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Email</p>
                    <p className="font-bold text-white text-sm">{profile?.email}</p>
                  </div>
                </div>
              </>
            )}
          </div>
        </Card>

        {/* Bio and Stats */}
        <div className="lg:col-span-2 space-y-8">
          <Card className="p-8">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <BookOpen className="text-primary" size={24} />
                <h3 className="text-xl font-bold uppercase tracking-tight">Biografía / Descripción</h3>
              </div>
            </div>
            {isEditing ? (
              <textarea 
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-4 text-white min-h-[120px]"
                placeholder="Escribe algo sobre ti..."
                value={editForm.bio}
                onChange={e => setEditForm({...editForm, bio: e.target.value})}
              ></textarea>
            ) : (
              <p className="text-slate-400 leading-relaxed italic">
                {profile?.bio || '"No se ha añadido una descripción todavía. Pulsa en editar para actualizar tu perfil."'}
              </p>
            )}
          </Card>

          <div className="grid grid-cols-2 gap-4">
            <Card className="p-6 border-white/5 text-center">
              <Activity className="text-primary mx-auto mb-3" size={24} />
              <p className="text-3xl font-black text-white">{trainings.length}</p>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1">Sesiones</p>
            </Card>
            <Card className="p-6 border-gold/20 text-center bg-gold/5">
              <Award className="text-primary mx-auto mb-3" size={24} />
              <p className="text-3xl font-black text-white">
                {attendanceData.filter(a => a.is_golden_cone === 1).length}
              </p>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1">Conos de Oro</p>
            </Card>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <Calendar className="text-primary" size={24} />
          <h3 className="text-2xl font-bold uppercase tracking-tight">Log de Entrenamientos</h3>
        </div>
        
        {trainings.length > 0 && profile ? (
          <AttendanceExcelTable 
            players={[profile].filter(Boolean)}
            trainings={trainings}
            attendanceData={attendanceData}
            readOnly={true}
          />
        ) : (
          <Card className="p-16 border-dashed border-white/10 flex flex-col items-center justify-center text-center">
            <Calendar size={48} className="text-slate-700 mb-4" />
            <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px]">Aún no hay registros de entrenamiento</p>
          </Card>
        )}
      </div>
    </div>
  );
};

export default PlayerProfileView;
