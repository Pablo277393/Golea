import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { teamService, authService } from '../../services/api';
import { 
  Users, 
  Plus, 
  ArrowLeft, 
  UserCircle, 
  Shield, 
  Briefcase, 
  ArrowRight,
  X,
  Mail,
  User,
  Hash,
  Activity,
  Edit2,
  Trash2,
  Lock,
  UserCheck,
  MoreVertical,
  MinusCircle
} from 'lucide-react';
import Card from '../ui/Card';
import Button from '../ui/Button';
import Input from '../ui/Input';

const TeamsView = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('teams'); // 'teams' or 'staff'
  const [teams, setTeams] = useState([]);
  const [staff, setStaff] = useState([]);
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [teamPlayers, setTeamPlayers] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Modal States
  const [showCreateTeam, setShowCreateTeam] = useState(false);
  const [showUserModal, setShowUserModal] = useState(false); // For both coach and player
  const [showAddPlayerToRoster, setShowAddPlayerToRoster] = useState(false);
  
  // Form Logic States
  const [modalMode, setModalMode] = useState('create'); // 'create' or 'edit'
  const [teamModalMode, setTeamModalMode] = useState('create'); // 'create' or 'edit'
  const [userRole, setUserRole] = useState('player'); // 'player' or 'coach'
  const [editingUserId, setEditingUserId] = useState(null);
  const [editingTeamId, setEditingTeamId] = useState(null);
  const [addRosterMode, setAddRosterMode] = useState('existing'); // 'existing' or 'new'

  // Forms
  const [teamForm, setTeamForm] = useState({ name: '', category: '', coach_id: '' });
  const [userForm, setUserForm] = useState({
    username: '', email: '', password: '', firstName: '', lastName: '', phone: '', bio: ''
  });
  const [rosterForm, setRosterForm] = useState({ 
    player_id: '', jersey_number: '', position: '' 
  });

  const [availablePlayers, setAvailablePlayers] = useState([]);
  const [availableCoaches, setAvailableCoaches] = useState([]);

  useEffect(() => {
    loadInitialData();
  }, [activeTab]);

  const loadInitialData = async () => {
    setLoading(true);
    try {
      if (activeTab === 'teams') {
        const res = await teamService.getTeams({ managedOnly: user?.role === 'coach' });
        setTeams(res.data);
        const coaches = await authService.getUsersByRole('coach');
        setAvailableCoaches(coaches.data);
      } else {
        const res = await authService.getUsersByRole('coach');
        setStaff(res.data);
      }
    } catch (err) {
      console.error('Error loading data', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchRoster = async (id) => {
    try {
      const res = await teamService.getTeamPlayers(id || selectedTeam.id);
      setTeamPlayers(res.data);
    } catch (err) {
      console.error('Error loading roster', err);
    }
  };

  const handleSelectTeam = (team) => {
    setSelectedTeam(team);
    fetchRoster(team.id);
  };

  // User Actions (Coach/Player)
  const openUserModal = (mode, role, userData = null) => {
    setModalMode(mode);
    setUserRole(role);
    if (mode === 'edit' && userData) {
      setEditingUserId(userData.id);
      setUserForm({
        username: userData.username || '',
        email: userData.email || '',
        password: '', // Empty password for edits unless specified
        firstName: userData.first_name || '',
        lastName: userData.last_name || '',
        phone: userData.phone || '',
        bio: userData.bio || ''
      });
    } else {
      setEditingUserId(null);
      setUserForm({ username: '', email: '', password: '', firstName: '', lastName: '', phone: '', bio: '' });
    }
    setShowUserModal(true);
  };

  const handleUserSubmit = async (e) => {
    e.preventDefault();
    try {
      if (modalMode === 'create') {
        await authService.createUser({ ...userForm, role: userRole });
      } else {
        await authService.updateUser(editingUserId, { ...userForm, role: userRole });
      }
      setShowUserModal(false);
      loadInitialData();
      if (selectedTeam) fetchRoster();
    } catch (err) {
      alert(err.response?.data?.message || 'Error en la operación');
    }
  };

  const handleDeleteUser = async (id) => {
    if (!window.confirm('¿Estás seguro de eliminar este usuario? Se borrará permanentemente del sistema.')) return;
    try {
      await authService.deleteUser(id);
      loadInitialData();
      if (selectedTeam) fetchRoster();
    } catch (err) {
      alert('Error eliminando usuario');
    }
  };

  // Team Actions
  const openTeamModal = (mode, teamData = null) => {
    setTeamModalMode(mode);
    if (mode === 'edit' && teamData) {
      setEditingTeamId(teamData.id);
      setTeamForm({
        name: teamData.name || '',
        category: teamData.category || '',
        coach_id: teamData.coach_id || ''
      });
    } else {
      setEditingTeamId(null);
      setTeamForm({ name: '', category: '', coach_id: '' });
    }
    setShowCreateTeam(true);
  };

  const handleTeamSubmit = async (e) => {
    e.preventDefault();
    try {
      if (teamModalMode === 'create') {
        await teamService.createTeam(teamForm);
      } else {
        await teamService.updateTeam(editingTeamId, teamForm);
      }
      setShowCreateTeam(false);
      loadInitialData();
    } catch (err) {
      alert('Error en la operación de equipo');
    }
  };

  const handleDeleteTeam = async (id) => {
    if (!window.confirm('¿Estás seguro de eliminar este equipo? Se borrarán todas las relaciones (jugadores, partidos, entrenamientos).')) return;
    try {
      await teamService.deleteTeam(id);
      loadInitialData();
    } catch (err) {
      alert('Error eliminando equipo');
    }
  };

  // Roster Actions
  const openAddRoster = async () => {
    setShowAddPlayerToRoster(true);
    setAddRosterMode('existing');
    const res = await authService.getUsersByRole('player');
    setAvailablePlayers(res.data);
  };

  const handleAddRoster = async (e) => {
    e.preventDefault();
    try {
      let playerId = rosterForm.player_id;
      if (addRosterMode === 'new') {
        const res = await authService.createUser({ ...userForm, role: 'player' });
        playerId = res.data.user.id;
      }
      await teamService.addPlayerToTeam(selectedTeam.id, {
        player_id: playerId,
        jersey_number: rosterForm.jersey_number,
        position: rosterForm.position
      });
      setShowAddPlayerToRoster(false);
      fetchRoster();
    } catch (err) {
      alert(err.response?.data?.message || 'Error añadiendo al equipo');
    }
  };

  const handleRemoveFromRoster = async (playerId) => {
    if (!window.confirm('¿Quitar a este jugador de la plantilla? El usuario seguirá existiendo en el sistema.')) return;
    try {
      await teamService.removePlayerFromTeam(selectedTeam.id, playerId);
      fetchRoster();
    } catch (err) {
      alert('Error quitando del equipo');
    }
  };

  if (loading && teams.length === 0 && staff.length === 0) {
    return (
      <div className="flex items-center justify-center p-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  // TEAM DETAIL VIEW
  if (selectedTeam) {
    return (
      <div className="space-y-8 animate-in fade-in slide-in-from-left-4 duration-500">
        <Button variant="secondary" className="px-4 py-2 text-sm" onClick={() => setSelectedTeam(null)} icon={ArrowLeft}>
          Volver a Listados
        </Button>

        <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h2 className="text-4xl font-bold tracking-tight mb-2">
              Plantilla: <span className="text-gold-glow">{selectedTeam.name}</span>
            </h2>
            <div className="flex items-center gap-4 text-slate-400 font-medium">
              <span className="flex items-center gap-1.5"><Briefcase size={14} className="text-primary" /> {selectedTeam.coach_name || 'Sin coach'}</span>
              <span className="w-1 h-1 rounded-full bg-slate-600"></span>
              <span className="flex items-center gap-1.5"><Users size={14} className="text-primary" /> {teamPlayers.length} Jugadores</span>
            </div>
          </div>
          {(user?.role === 'superadmin' || user?.role === 'admin' || user?.role === 'coach') && (
            <Button variant="primary" icon={Plus} onClick={openAddRoster}>
              Gestionar Plantilla
            </Button>
          )}
        </header>

        <Card className="p-0 overflow-hidden border-white/5" hover={false}>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead className="bg-white/5">
                <tr className="text-left border-b border-white/5">
                  <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-[0.2em] text-primary">Dorsal</th>
                  <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-[0.2em] text-primary">Nombre</th>
                  <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-[0.2em] text-primary">Posición</th>
                  <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-[0.2em] text-primary text-center">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {teamPlayers.map(p => (
                  <tr key={p.id} className="hover:bg-white/[0.02] transition-colors group">
                    <td className="px-8 py-6 font-bold text-xl text-white">#{p.jersey_number}</td>
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center border border-primary/20">
                          <UserCircle size={20} className="text-primary" />
                        </div>
                        <div>
                          <p className="font-bold text-slate-200">{p.full_name}</p>
                          <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">{p.username}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <span className="px-4 py-1.5 bg-primary/10 border border-primary/20 text-primary rounded-full text-[10px] font-bold uppercase tracking-widest">
                        {p.position}
                      </span>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center justify-center gap-2">
                        {(user?.role === 'admin' || user?.role === 'superadmin') && (
                          <button onClick={() => openUserModal('edit', 'player', p)} className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors">
                            <Edit2 size={16} />
                          </button>
                        )}
                        {(user?.role === 'admin' || user?.role === 'superadmin' || user?.role === 'coach') && (
                          <button onClick={() => handleRemoveFromRoster(p.id)} className="p-2 rounded-lg bg-white/5 hover:bg-red-500/10 text-slate-400 hover:text-red-500 transition-colors" title="Quitar de equipo">
                            <MinusCircle size={16} />
                          </button>
                        )}
                        {(user?.role === 'admin' || user?.role === 'superadmin') && (
                          <button onClick={() => handleDeleteUser(p.id)} className="p-2 rounded-lg bg-white/5 hover:bg-red-500/20 text-red-500/50 hover:text-red-500 transition-colors" title="Eliminar del sistema">
                            <Trash2 size={16} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
        
        {/* Modal: Add Player to Roster */}
        {showAddPlayerToRoster && (
          <div className="fixed inset-0 z-[500] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setShowAddPlayerToRoster(false)}></div>
            <Card className="relative w-full max-w-xl p-8 border-primary/30 z-10" hover={false}>
              <div className="flex justify-between items-center mb-8">
                <h3 className="text-2xl font-bold">Gestión de Plantilla</h3>
                <button onClick={() => setShowAddPlayerToRoster(false)} className="text-slate-400 hover:text-white"><X size={24} /></button>
              </div>

              {(user?.role === 'admin' || user?.role === 'superadmin') && (
                <div className="flex gap-4 mb-8">
                  <button 
                    className={`flex-1 py-3 rounded-xl border transition-all font-bold text-xs uppercase tracking-widest ${addRosterMode === 'existing' ? 'bg-primary text-black border-primary' : 'bg-white/5 border-white/10 text-slate-400'}`}
                    onClick={() => setAddRosterMode('existing')}
                  >
                    Existente
                  </button>
                  <button 
                    className={`flex-1 py-3 rounded-xl border transition-all font-bold text-xs uppercase tracking-widest ${addRosterMode === 'new' ? 'bg-primary text-black border-primary' : 'bg-white/5 border-white/10 text-slate-400'}`}
                    onClick={() => setAddRosterMode('new')}
                  >
                    Nuevo Registro
                  </button>
                </div>
              )}

              <form onSubmit={handleAddRoster} className="space-y-6">
                {addRosterMode === 'existing' ? (
                  <div className="space-y-2">
                    <label className="label-base">Seleccionar Jugador</label>
                    <select required className="input-base" value={rosterForm.player_id} onChange={(e) => setRosterForm({...rosterForm, player_id: e.target.value})}>
                      <option value="">Seleccione...</option>
                      {availablePlayers.map(p => <option key={p.id} value={p.id}>{p.username} ({p.email})</option>)}
                    </select>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-4">
                    <Input label="Usuario" value={userForm.username} onChange={(e) => setUserForm({...userForm, username: e.target.value})} required icon={User} />
                    <Input label="Email" type="email" value={userForm.email} onChange={(e) => setUserForm({...userForm, email: e.target.value})} required icon={Mail} />
                    <Input label="Nombre" value={userForm.firstName} onChange={(e) => setUserForm({...userForm, firstName: e.target.value})} required />
                    <Input label="Apellidos" value={userForm.lastName} onChange={(e) => setUserForm({...userForm, lastName: e.target.value})} required />
                    <div className="col-span-2">
                      <Input label="Contraseña" type="password" value={userForm.password} onChange={(e) => setUserForm({...userForm, password: e.target.value})} placeholder="Dejar vacío para 'golea2026'" icon={Lock} />
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4">
                  <Input label="Dorsal" type="number" value={rosterForm.jersey_number} onChange={(e) => setRosterForm({...rosterForm, jersey_number: e.target.value})} required icon={Hash} />
                  <Input label="Posición" value={rosterForm.position} onChange={(e) => setRosterForm({...rosterForm, position: e.target.value})} required icon={Activity} />
                </div>

                <Button type="submit" variant="primary" className="w-full py-4 text-lg">
                  Confirmar Asignación
                </Button>
              </form>
            </Card>
          </div>
        )}
        
        {/* Reusable User Edit Modal */}
        {showUserModal && (
          <div className="fixed inset-0 z-[501] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/90 backdrop-blur-sm" onClick={() => setShowUserModal(false)}></div>
            <Card className="relative w-full max-w-xl p-8 border-primary/30 z-10" hover={false}>
              <div className="flex justify-between items-center mb-8">
                <h3 className="text-2xl font-bold">Editar {userRole === 'coach' ? 'Staff' : 'Jugador'}</h3>
                <button onClick={() => setShowUserModal(false)} className="text-slate-400 hover:text-white"><X size={24} /></button>
              </div>
              <form onSubmit={handleUserSubmit} className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <Input label="Usuario" value={userForm.username} onChange={(e) => setUserForm({...userForm, username: e.target.value})} required icon={User} />
                  <Input label="Email" type="email" value={userForm.email} onChange={(e) => setUserForm({...userForm, email: e.target.value})} required icon={Mail} />
                  <Input label="Nombre" value={userForm.firstName} onChange={(e) => setUserForm({...userForm, firstName: e.target.value})} required />
                  <Input label="Apellidos" value={userForm.lastName} onChange={(e) => setUserForm({...userForm, lastName: e.target.value})} required />
                  <Input label="Teléfono" value={userForm.phone} onChange={(e) => setUserForm({...userForm, phone: e.target.value})} icon={Activity} />
                  <Input label="Password (Opcional)" type="password" value={userForm.password} onChange={(e) => setUserForm({...userForm, password: e.target.value})} placeholder="Cambiar contraseña..." icon={Lock} />
                </div>
                <div className="space-y-2">
                  <label className="label-base">Biografía/Notas</label>
                  <textarea className="input-base" rows="3" value={userForm.bio} onChange={(e) => setUserForm({...userForm, bio: e.target.value})}></textarea>
                </div>
                <Button type="submit" variant="primary" className="w-full py-3">Actualizar Registro</Button>
              </form>
            </Card>
          </div>
        )}
      </div>
    );
  }

  // LIST VIEWS (Teams or Staff)
  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <header className="flex flex-col sm:flex-row justify-between items-center gap-6">
        <div className="flex bg-white/5 p-1 rounded-2xl border border-white/10 w-full sm:w-auto">
          <button 
            className={`flex-1 sm:flex-none px-8 py-3 rounded-xl transition-all font-bold text-xs uppercase tracking-widest ${activeTab === 'teams' ? 'bg-primary text-black shadow-gold-glow' : 'text-slate-400 hover:text-white'}`}
            onClick={() => setActiveTab('teams')}
          >
            Equipos
          </button>
          {user?.role !== 'coach' && (
            <button 
              className={`flex-1 sm:flex-none px-8 py-3 rounded-xl transition-all font-bold text-xs uppercase tracking-widest ${activeTab === 'staff' ? 'bg-primary text-black shadow-gold-glow' : 'text-slate-400 hover:text-white'}`}
              onClick={() => setActiveTab('staff')}
            >
              Staff / Coaches
            </button>
          )}
        </div>
        
        {(user?.role === 'admin' || user?.role === 'superadmin') && (
          <div className="flex gap-4 w-full sm:w-auto">
            {activeTab === 'teams' ? (
              <Button variant="primary" icon={Plus} className="flex-1 sm:flex-none" onClick={() => openTeamModal('create')}>
                Crear Equipo
              </Button>
            ) : (
              <Button variant="primary" icon={Plus} className="flex-1 sm:flex-none" onClick={() => openUserModal('create', 'coach')}>
                Registrar Coach
              </Button>
            )}
          </div>
        )}
      </header>

      {activeTab === 'teams' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {teams.map(team => (
            <Card key={team.id} className="group overflow-hidden">
               {/* Actions Overlay */}
               {(user?.role === 'admin' || user?.role === 'superadmin') && (
                 <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity z-20">
                    <button onClick={() => openTeamModal('edit', team)} className="p-2 rounded-lg bg-white/10 backdrop-blur-md hover:bg-white/20 text-white transition-all shadow-xl border border-white/10">
                       <Edit2 size={14} />
                    </button>
                    <button onClick={() => handleDeleteTeam(team.id)} className="p-2 rounded-lg bg-red-500/20 backdrop-blur-md hover:bg-red-500/40 text-red-200 transition-all shadow-xl border border-red-500/20">
                       <Trash2 size={14} />
                    </button>
                 </div>
               )}

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
                  <span className="text-slate-500">Staff</span>
                  <span className="text-slate-300 font-bold">{team.coach_name || 'Sin coach'}</span>
                </div>
              </div>
              <Button 
                variant="secondary" 
                className="w-full py-4 rounded-xl"
                onClick={() => handleSelectTeam(team)}
                icon={ArrowRight}
              >
                Gestionar Equipo
              </Button>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="p-0 overflow-hidden border-white/5" hover={false}>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead className="bg-white/5">
                <tr className="text-left border-b border-white/5">
                  <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-[0.2em] text-primary">Entrenador</th>
                  <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-[0.2em] text-primary">Contacto</th>
                  <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-[0.2em] text-primary text-center">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {staff.map(c => (
                  <tr key={c.id} className="hover:bg-white/[0.02] transition-colors group">
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-gold-gradient p-[1px]">
                          <div className="w-full h-full rounded-xl bg-dark flex items-center justify-center">
                             <Briefcase size={20} className="text-primary" />
                          </div>
                        </div>
                        <div>
                          <p className="font-bold text-white">{c.first_name} {c.last_name}</p>
                          <p className="text-xs text-primary font-bold uppercase tracking-widest">{c.username}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                       <div className="flex flex-col gap-1">
                          <span className="text-slate-300 font-medium text-sm flex items-center gap-2"><Mail size={12} className="text-primary"/> {c.email}</span>
                          <span className="text-slate-500 text-xs flex items-center gap-2"><Activity size={12}/> {c.phone || 'Sin tlf'}</span>
                       </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center justify-center gap-2">
                        <button onClick={() => openUserModal('edit', 'coach', c)} className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors">
                          <Edit2 size={16} />
                        </button>
                        <button onClick={() => handleDeleteUser(c.id)} className="p-2 rounded-lg bg-white/5 hover:bg-red-500/20 text-red-500/50 hover:text-red-500 transition-colors">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* Modal: Create/Edit Team */}
      {showCreateTeam && (
        <div className="fixed inset-0 z-[500] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setShowCreateTeam(false)}></div>
          <Card className="relative w-full max-w-sm p-8 border-primary/30 z-10" hover={false}>
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-2xl font-bold">{teamModalMode === 'create' ? 'Nuevo Equipo' : 'Editar Equipo'}</h3>
              <button onClick={() => setShowCreateTeam(false)} className="text-slate-400 hover:text-white"><X size={24} /></button>
            </div>
            <form onSubmit={handleTeamSubmit} className="space-y-6">
              <Input label="Nombre" placeholder="Senior A" value={teamForm.name} onChange={(e) => setTeamForm({...teamForm, name: e.target.value})} required icon={Shield} />
              <Input label="Categoría" placeholder="Senior" value={teamForm.category} onChange={(e) => setTeamForm({...teamForm, category: e.target.value})} required icon={Users} />
              <div className="space-y-2">
                <label className="label-base">Asignar Coach</label>
                <select className="input-base" value={teamForm.coach_id} onChange={(e) => setTeamForm({...teamForm, coach_id: e.target.value})} required>
                  <option value="">Seleccione...</option>
                  {availableCoaches.map(c => <option key={c.id} value={c.id}>{c.username}</option>)}
                </select>
              </div>
              <Button type="submit" variant="primary" className="w-full py-4 text-lg">
                {teamModalMode === 'create' ? 'Registrar' : 'Guardar Cambios'}
              </Button>
            </form>
          </Card>
        </div>
      )}

      {/* Modal: User Create/Edit (from list) */}
      {showUserModal && activeTab === 'staff' && (
        <div className="fixed inset-0 z-[501] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/90 backdrop-blur-sm" onClick={() => setShowUserModal(false)}></div>
          <Card className="relative w-full max-w-xl p-8 border-primary/30 z-10" hover={false}>
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-2xl font-bold">{modalMode === 'create' ? 'Registrar Staff' : 'Editar Staff'}</h3>
              <button onClick={() => setShowUserModal(false)} className="text-slate-400 hover:text-white"><X size={24} /></button>
            </div>
            <form onSubmit={handleUserSubmit} className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <Input label="Usuario" value={userForm.username} onChange={(e) => setUserForm({...userForm, username: e.target.value})} required icon={User} />
                <Input label="Email" type="email" value={userForm.email} onChange={(e) => setUserForm({...userForm, email: e.target.value})} required icon={Mail} />
                <Input label="Nombre" value={userForm.firstName} onChange={(e) => setUserForm({...userForm, firstName: e.target.value})} required />
                <Input label="Apellidos" value={userForm.lastName} onChange={(e) => setUserForm({...userForm, lastName: e.target.value})} required />
                <Input label="Password" type="password" value={userForm.password} onChange={(e) => setUserForm({...userForm, password: e.target.value})} placeholder={modalMode === 'edit' ? 'Cambiar...' : 'Asignar contraseña'} icon={Lock} required={modalMode === 'create'} />
                <Input label="Teléfono" value={userForm.phone} onChange={(e) => setUserForm({...userForm, phone: e.target.value})} icon={Activity} />
              </div>
              <div className="space-y-2">
                <label className="label-base">Biografía</label>
                <textarea className="input-base" rows="3" value={userForm.bio} onChange={(e) => setUserForm({...userForm, bio: e.target.value})}></textarea>
              </div>
              <Button type="submit" variant="primary" className="w-full py-3">{modalMode === 'create' ? 'Registrar' : 'Actualizar'}</Button>
            </form>
          </Card>
        </div>
      )}
    </div>
  );
};

export default TeamsView;
