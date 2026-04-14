import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  Users, 
  Calendar, 
  Bell, 
  Trophy, 
  LogOut, 
  LayoutDashboard,
  ClipboardList,
  Target
} from 'lucide-react';
import Overview from '../components/views/Overview';
import TeamsView from '../components/views/TeamsView';
import ScheduleView from '../components/views/ScheduleView';
import NotificationsView from '../components/views/NotificationsView';
import CallupsView from '../components/views/CallupsView';
import PredictionsView from '../components/views/PredictionsView';
import MVPView from '../components/views/MVPView';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const [activeView, setActiveView] = useState('Resumen');

  const menuItems = [
    { icon: <LayoutDashboard size={20} />, label: 'Resumen', roles: ['coach', 'player', 'parent', 'admin', 'superadmin'] },
    { icon: <Users size={20} />, label: 'Equipos', roles: ['coach', 'admin', 'superadmin'] },
    { icon: <Calendar size={20} />, label: 'Calendario', roles: ['coach', 'player', 'parent', 'admin', 'superadmin'] },
    { icon: <ClipboardList size={20} />, label: 'Convocatorias', roles: ['coach', 'superadmin'] },
    { icon: <Target size={20} />, label: 'Quiniela', roles: ['player', 'parent', 'superadmin'] },
    { icon: <Bell size={20} />, label: 'Notificaciones', roles: ['coach', 'player', 'parent', 'admin', 'superadmin'] },
    { icon: <Trophy size={20} />, label: 'MVP Semanal', roles: ['coach', 'player', 'parent', 'admin', 'superadmin'] },
  ];

  const filteredMenu = menuItems.filter(item => item.roles.includes(user?.role));

  const renderView = () => {
    switch (activeView) {
      case 'Resumen': return <Overview />;
      case 'Equipos': return <TeamsView />;
      case 'Calendario': return <ScheduleView />;
      case 'Notificaciones': return <NotificationsView />;
      case 'Convocatorias': return <CallupsView />;
      case 'Quiniela': return <PredictionsView />;
      case 'MVP Semanal': return <MVPView />;
      default: return <Overview />;
    }
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      {/* Sidebar */}
      <aside className="glass-card" style={{ width: '260px', borderRadius: '0', borderRight: '1px solid var(--border)', display: 'flex', flexDirection: 'column' }}>
        <div style={{ padding: '2rem 1.5rem' }}>
          <h2 className="text-gradient" style={{ fontWeight: '800' }}>Golea</h2>
        </div>

        <nav style={{ flex: 1, padding: '0 1rem' }}>
          {filteredMenu.map((item, index) => (
            <div 
              key={index} 
              onClick={() => setActiveView(item.label)}
              style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '1rem', 
                padding: '0.75rem 1rem', 
                borderRadius: '0.5rem', 
                cursor: 'pointer',
                marginBottom: '0.5rem',
                color: activeView === item.label ? 'var(--primary)' : 'var(--text-muted)',
                background: activeView === item.label ? 'rgba(0, 255, 136, 0.1)' : 'transparent',
                transition: 'var(--transition)'
              }}
            >
              {item.icon}
              <span style={{ fontWeight: '500' }}>{item.label}</span>
            </div>
          ))}
        </nav>

        <div style={{ padding: '1.5rem', borderTop: '1px solid var(--border)' }}>
          <button onClick={logout} className="btn btn-outline" style={{ width: '100%', justifyContent: 'flex-start' }}>
            <LogOut size={20} /> Cerrar Sesión
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main style={{ flex: 1, padding: '2.5rem', overflowY: 'auto', background: 'var(--bg-darker)' }}>
        {renderView()}
      </main>
    </div>
  );
};

export default Dashboard;
