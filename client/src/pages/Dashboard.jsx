import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  Users, 
  Calendar, 
  Bell, 
  Trophy, 
  LogOut, 
  LayoutDashboard,
  ClipboardList,
  Target,
  Menu,
  X
} from 'lucide-react';
import Overview from '../components/views/Overview';
import TeamsView from '../components/views/TeamsView';
import ScheduleView from '../components/views/ScheduleView';
import NotificationsView from '../components/views/NotificationsView';
import CallupsView from '../components/views/CallupsView';
import PredictionsView from '../components/views/PredictionsView';
import MVPView from '../components/views/MVPView';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Container from '../components/ui/Container';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const [activeView, setActiveView] = useState('Resumen');
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const menuItems = [
    { icon: <LayoutDashboard size={20} />, label: 'Resumen', roles: ['coach', 'player', 'parent', 'admin', 'superadmin'] },
    { icon: <Users size={20} />, label: 'Equipos', roles: ['coach', 'admin', 'superadmin'] },
    { icon: <Calendar size={20} />, label: 'Calendario', roles: ['coach', 'player', 'parent', 'admin', 'superadmin'] },
    { icon: <ClipboardList size={20} />, label: 'Convocatorias', roles: ['coach', 'superadmin'] },
    { icon: <Target size={20} />, label: 'Quiniela', roles: ['player', 'parent', 'superadmin'] },
    { icon: <Bell size={20} />, label: 'Notificaciones', roles: ['coach', 'player', 'parent', 'admin', 'superadmin'] },
    { icon: <Trophy size={20} />, label: 'MVP Semanal', roles: ['coach', 'player', 'parent', 'admin', 'superadmin'] },
  ];

  const filteredMenu = menuItems.filter(item => {
    const userRole = user?.role?.toLowerCase();
    return item.roles.includes(userRole);
  });

  const handleSelectView = (label) => {
    setActiveView(label);
    setIsMenuOpen(false);
  };

  const renderView = () => {
    const viewMap = {
      'Resumen': <Overview />,
      'Equipos': <TeamsView />,
      'Calendario': <ScheduleView />,
      'Notificaciones': <NotificationsView />,
      'Convocatorias': <CallupsView />,
      'Quiniela': <PredictionsView />,
      'MVP Semanal': <MVPView />
    };
    
    return viewMap[activeView] || <Overview />;
  };

  return (
    <div className="min-h-screen bg-dark overflow-x-hidden">
      {/* Background Effects */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-5%] left-[-5%] w-[40%] h-[40%] rounded-full bg-primary/5 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-primary/5 blur-[120px]" />
      </div>

      {/* Topbar */}
      <header className="fixed top-0 left-0 right-0 h-20 bg-dark/60 backdrop-blur-xl border-b border-white/5 flex items-center justify-between px-6 z-[100] shadow-glass">
        <div className="flex items-center gap-4">
          <Button 
            variant="secondary" 
            className="p-3 bg-white/5 border-white/10 rounded-xl"
            onClick={() => setIsMenuOpen(true)}
            icon={Menu}
          />
          <h2 className="text-2xl font-bold tracking-tight">
            Golea <span className="text-primary text-xs uppercase tracking-widest ml-2 hidden sm:inline-block">Elite</span>
          </h2>
        </div>
        
        <div className="flex items-center gap-6">
          <div className="hidden sm:flex flex-col items-end">
            <span className="text-sm font-semibold text-white">{user?.username}</span>
            <span className="text-[10px] uppercase tracking-widest text-primary font-bold">{user?.role}</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-gold-gradient p-[1px]">
            <div className="w-full h-full rounded-xl bg-dark-card flex items-center justify-center text-primary font-bold text-lg">
              {user?.username?.charAt(0).toUpperCase()}
            </div>
          </div>
        </div>
      </header>

      {/* Sidebar Drawer */}
      <div 
        className={`fixed inset-y-0 left-0 w-80 bg-surface/98 backdrop-blur-2xl z-[200] transition-transform duration-500 ease-out shadow-glass border-r border-white/5 flex flex-col ${isMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}
      >
        <div className="p-8 flex justify-between items-center border-b border-white/5">
          <h2 className="text-4xl lg:text-5xl font-bold tracking-tighter">Golea</h2>
          <Button 
            variant="ghost" 
            onClick={() => setIsMenuOpen(false)}
            icon={X}
            className="p-2"
          />
        </div>

        <nav className="flex-1 p-6 space-y-2 overflow-y-auto">
          {filteredMenu.map((item, index) => (
            <div 
              key={index} 
              onClick={() => handleSelectView(item.label)}
              className={`flex items-center gap-4 px-6 py-4 rounded-2xl cursor-pointer transition-all duration-300 group ${
                activeView === item.label 
                ? 'bg-primary/10 text-primary border-l-4 border-primary shadow-gold-glow' 
                : 'text-slate-400 hover:text-white hover:bg-white/5 border-l-4 border-transparent'
              }`}
            >
              <div className={`${activeView === item.label ? 'scale-110' : 'group-hover:scale-110'} transition-transform`}>
                {item.icon}
              </div>
              <span className="font-bold tracking-wide uppercase text-xs">{item.label}</span>
            </div>
          ))}
        </nav>

        <div className="p-6 border-t border-white/5 bg-black/20">
          <Button 
            variant="outline" 
            className="w-full justify-center py-4 rounded-2xl border-white/10 text-slate-400 hover:text-red-400 hover:border-red-400/30 hover:bg-red-500/5"
            onClick={logout}
            icon={LogOut}
          >
            Cerrar Sesión
          </Button>
        </div>
      </div>

      {/* Backdrop */}
      {isMenuOpen && (
        <div 
          onClick={() => setIsMenuOpen(false)}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[150] transition-opacity duration-300"
        />
      )}

      {/* Main Content */}
      <main className="relative z-10 pt-28 pb-12 transition-all duration-500">
        <Container>
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
            {React.cloneElement(renderView(), { onViewChange: handleSelectView })}
          </div>
        </Container>
      </main>
    </div>
  );
};

export default Dashboard;
