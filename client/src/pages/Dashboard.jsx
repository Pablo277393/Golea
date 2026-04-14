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

  const filteredMenu = menuItems.filter(item => item.roles.includes(user?.role));

  const handleSelectView = (label) => {
    setActiveView(label);
    setIsMenuOpen(false);
  };

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
    <div style={{ minHeight: '100vh', background: 'var(--bg-darker)' }}>
      {/* Topbar */}
      <header style={{ 
        position: 'fixed', 
        top: 0, 
        left: 0, 
        right: 0, 
        height: '70px', 
        background: 'rgba(10, 11, 20, 0.8)', 
        backdropFilter: 'blur(10px)', 
        borderBottom: '1px solid var(--border)', 
        display: 'flex', 
        alignItems: 'center', 
        padding: '0 1.5rem', 
        zIndex: 100,
        justifyContent: 'space-between'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <button 
            onClick={() => setIsMenuOpen(true)}
            style={{ 
              background: 'var(--glass)', 
              border: '1px solid var(--border)', 
              color: 'var(--text-main)', 
              padding: '0.5rem', 
              borderRadius: '0.5rem', 
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <Menu size={24} />
          </button>
          <h2 className="text-gradient" style={{ fontWeight: '800', fontSize: '1.5rem', marginLeft: '0.5rem' }}>Golea</h2>
        </div>
        
        <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <span>{user?.username} ({user?.role})</span>
        </div>
      </header>

      {/* Drawer Menu */}
      <div 
        style={{ 
          position: 'fixed', 
          top: 0, 
          left: isMenuOpen ? '0' : '-300px', 
          width: '280px', 
          height: '100vh', 
          background: 'rgba(13, 14, 25, 0.98)', 
          zIndex: 200, 
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)', 
          boxShadow: '10px 0 30px rgba(0,0,0,0.5)',
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        <div style={{ padding: '2rem 1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border)' }}>
          <h2 className="text-gradient" style={{ fontWeight: '800' }}>Golea</h2>
          <button 
            onClick={() => setIsMenuOpen(false)}
            style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
          >
            <X size={24} />
          </button>
        </div>

        <nav style={{ flex: 1, padding: '1.5rem 1rem' }}>
          {filteredMenu.map((item, index) => (
            <div 
              key={index} 
              onClick={() => handleSelectView(item.label)}
              style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '1rem', 
                padding: '0.85rem 1rem', 
                borderRadius: '0.75rem', 
                cursor: 'pointer',
                marginBottom: '0.5rem',
                color: activeView === item.label ? 'var(--primary)' : 'var(--text-muted)',
                background: activeView === item.label ? 'rgba(0, 255, 136, 0.1)' : 'transparent',
                transition: 'var(--transition)',
                borderLeft: activeView === item.label ? '3px solid var(--primary)' : '3px solid transparent'
              }}
            >
              {item.icon}
              <span style={{ fontWeight: '600' }}>{item.label}</span>
            </div>
          ))}
        </nav>

        <div style={{ padding: '1.5rem', borderTop: '1px solid var(--border)', background: 'rgba(0,0,0,0.2)' }}>
          <button onClick={logout} className="btn btn-outline" style={{ width: '100%', justifyContent: 'center', gap: '0.5rem' }}>
            <LogOut size={20} /> Cerrar Sesión
          </button>
        </div>
      </div>

      {/* Backdrop */}
      {isMenuOpen && (
        <div 
          onClick={() => setIsMenuOpen(false)}
          style={{ 
            position: 'fixed', 
            top: 0, 
            left: 0, 
            right: 0, 
            bottom: 0, 
            background: 'rgba(0,0,0,0.6)', 
            backdropFilter: 'blur(4px)', 
            zIndex: 150 
          }}
        />
      )}

      {/* Main Content */}
      <main style={{ 
        padding: '100px 1.5rem 2.5rem 1.5rem', 
        minHeight: '100vh',
        maxWidth: '1200px',
        margin: '0 auto'
      }}>
        {renderView()}
      </main>
    </div>
  );
};

export default Dashboard;
