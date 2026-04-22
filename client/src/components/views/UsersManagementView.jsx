import React, { useState, useEffect } from 'react';
import { authService } from '../../services/api';
import { UserPlus, Search, User, Trash2, Edit2, Shield, Users, Mail, Phone, ChevronRight, X } from 'lucide-react';
import Card from '../ui/Card';
import Button from '../ui/Button';
import Input from '../ui/Input';
import Modal from '../ui/Modal';

const UsersManagementView = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    role: 'player',
    firstName: '',
    lastName: '',
    phone: '',
    bio: ''
  });

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await authService.getUsersByRole();
      setUsers(res.data);
    } catch (err) {
      console.error('Error fetching users:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleOpenModal = (user = null) => {
    if (user) {
      setEditingUser(user);
      setFormData({
        username: user.username,
        email: user.email,
        password: '',
        role: user.role,
        firstName: user.first_name || '',
        lastName: user.last_name || '',
        phone: user.phone || '',
        bio: user.bio || ''
      });
    } else {
      setEditingUser(null);
      setFormData({
        username: '',
        email: '',
        password: '',
        role: 'player',
        firstName: '',
        lastName: '',
        phone: '',
        bio: ''
      });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingUser) {
        await authService.updateUser(editingUser.id, formData);
      } else {
        await authService.createUser(formData);
      }
      setIsModalOpen(false);
      fetchUsers();
    } catch (err) {
      alert(err.response?.data?.message || 'Error al procesar la solicitud');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('¿Estás seguro de que deseas eliminar este usuario? Esta acción no se puede deshacer.')) return;
    try {
      await authService.deleteUser(id);
      fetchUsers();
    } catch (err) {
      alert('Error al eliminar el usuario');
    }
  };

  const filteredUsers = users.filter(u => 
    u.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (u.first_name && u.first_name.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const getRoleBadge = (role) => {
    const roles = {
      superadmin: 'bg-red-500/10 text-red-400 border-red-500/20',
      admin: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
      coach: 'bg-primary/10 text-primary border-primary/20',
      player: 'bg-green-500/10 text-green-400 border-green-500/20',
      parent: 'bg-blue-500/10 text-blue-400 border-blue-500/20'
    };
    return roles[role?.toLowerCase()] || 'bg-slate-500/10 text-slate-400 border-slate-500/20';
  };

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <header className="flex flex-col sm:flex-row justify-between items-center gap-6">
        <div>
          <h2 className="text-4xl lg:text-5xl font-bold tracking-tight mb-2">Gestión de <span className="text-primary">Usuarios</span></h2>
          <p className="text-slate-400 font-medium">Administra las cuentas y roles del sistema.</p>
        </div>
        <Button variant="primary" icon={UserPlus} onClick={() => handleOpenModal()}>
          Nuevo Usuario
        </Button>
      </header>

      <Card className="p-4 bg-white/[0.02] border-white/5">
        <div className="flex items-center gap-4 px-4 py-2">
          <Search size={20} className="text-slate-500" />
          <input 
            type="text" 
            placeholder="Buscar por nombre, email o usuario..." 
            className="flex-1 bg-transparent border-none focus:outline-none text-white font-medium placeholder:text-slate-600"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-500 bg-white/5 px-3 py-1 rounded-full">
            <Users size={14} /> {filteredUsers.length} Usuarios
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {loading ? (
          [1, 2, 3, 4, 5, 6].map(i => (
            <div key={i} className="h-48 bg-white/5 rounded-3xl animate-pulse border border-white/5" />
          ))
        ) : filteredUsers.map(u => (
          <Card key={u.id} className="p-6 hover:border-primary/40 transition-all group overflow-hidden relative">
            <div className="absolute -right-4 -bottom-4 opacity-5 group-hover:opacity-10 transition-opacity">
              <User size={120} />
            </div>

            <div className="flex justify-between items-start mb-6">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-gold-gradient p-[1px]">
                  <div className="w-full h-full rounded-2xl bg-dark-card flex items-center justify-center text-primary font-bold text-xl">
                    {u.first_name?.charAt(0) || u.username.charAt(0).toUpperCase()}
                  </div>
                </div>
                <div>
                  <h4 className="text-lg font-bold text-white group-hover:text-primary transition-colors">
                    {u.first_name ? `${u.first_name} ${u.last_name || ''}` : u.username}
                  </h4>
                  <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-widest border ${getRoleBadge(u.role)}`}>
                    {u.role}
                  </span>
                </div>
              </div>
              
              <div className="flex gap-2 relative z-10">
                <button 
                  onClick={() => handleOpenModal(u)}
                  className="p-2 bg-white/5 rounded-xl text-slate-400 hover:text-primary hover:bg-primary/10 transition-all"
                >
                  <Edit2 size={16} />
                </button>
                <button 
                  onClick={() => handleDelete(u.id)}
                  className="p-2 bg-white/5 rounded-xl text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-all"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>

            <div className="space-y-3 relative z-10">
              <div className="flex items-center gap-3 text-xs text-slate-400">
                <Mail size={14} className="text-primary/60" />
                <span className="truncate">{u.email}</span>
              </div>
              {u.phone && (
                <div className="flex items-center gap-3 text-xs text-slate-400">
                  <Phone size={14} className="text-primary/60" />
                  <span>{u.phone}</span>
                </div>
              )}
            </div>

            <div className="mt-6 pt-6 border-t border-white/5 flex justify-between items-center relative z-10">
               <span className="text-[10px] font-bold text-slate-600 uppercase tracking-widest">ID: #{u.id}</span>
               <div className="flex items-center gap-2 text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="text-[9px] font-black uppercase tracking-tighter">Gestionar</span>
                  <ChevronRight size={14} />
               </div>
            </div>
          </Card>
        ))}
      </div>

      {/* User Form Modal */}
      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        title={editingUser ? 'Editar Usuario' : 'Crear Nuevo Usuario'}
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Usuario"
              value={formData.username}
              onChange={(e) => setFormData({...formData, username: e.target.value})}
              required
              placeholder="Username"
            />
            <Input
              label="Email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              required
              placeholder="correo@ejemplo.com"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input
              label={editingUser ? 'Password (dejar vacío para mantener)' : 'Password'}
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
              required={!editingUser}
              placeholder="********"
            />
            <div className="space-y-2">
              <label className="label-base">Rol</label>
              <select 
                value={formData.role}
                onChange={(e) => setFormData({...formData, role: e.target.value})}
                className="input-base cursor-pointer"
              >
                <option value="player">Jugador</option>
                <option value="coach">Entrenador</option>
                <option value="parent">Padre/Tutor</option>
                <option value="admin">Administrador</option>
                <option value="superadmin">Superadmin</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Nombre"
              value={formData.firstName}
              onChange={(e) => setFormData({...formData, firstName: e.target.value})}
              placeholder="Nombre"
            />
            <Input
              label="Apellidos"
              value={formData.lastName}
              onChange={(e) => setFormData({...formData, lastName: e.target.value})}
              placeholder="Apellidos"
            />
          </div>

          <Input
            label="Teléfono"
            value={formData.phone}
            onChange={(e) => setFormData({...formData, phone: e.target.value})}
            placeholder="+34 000 000 000"
          />

          <div className="space-y-2">
            <label className="label-base">Biografía</label>
            <textarea 
              value={formData.bio}
              onChange={(e) => setFormData({...formData, bio: e.target.value})}
              className="input-base min-h-[100px] py-4"
              placeholder="Información adicional del usuario..."
            />
          </div>

          <div className="pt-4 flex gap-4">
            <Button type="button" variant="secondary" className="flex-1 justify-center" onClick={() => setIsModalOpen(false)}>
              Cancelar
            </Button>
            <Button type="submit" variant="primary" className="flex-1 justify-center">
              {editingUser ? 'Actualizar' : 'Crear Usuario'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default UsersManagementView;
