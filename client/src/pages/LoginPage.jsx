import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Mail, Lock, LogIn, ShieldCheck } from 'lucide-react';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login({ email, password });
      navigate('/dashboard');
    } catch (err) {
      setError('Credenciales incorrectas o error de servidor');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-darker)' }}>
      <div className="glass-card" style={{ width: '100%', maxWidth: '400px', padding: '2.5rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <div style={{ display: 'inline-flex', padding: '1rem', background: 'var(--glass)', borderRadius: '1rem', marginBottom: '1rem' }}>
            <ShieldCheck size={40} className="text-gradient" />
          </div>
          <h1 className="text-gradient" style={{ fontSize: '2.5rem', fontWeight: '800' }}>Golea</h1>
          <p style={{ color: 'var(--text-muted)' }}>Gestión Inteligente de Clubes</p>
        </div>

        {error && <div style={{ background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', padding: '0.75rem', borderRadius: '0.5rem', marginBottom: '1.5rem', fontSize: '0.875rem', textAlign: 'center', border: '1px solid rgba(239, 68, 68, 0.2)' }}>{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Mail size={16} /> Correo Electrónico</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="email"
              required
            />
          </div>

          <div className="input-group">
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Lock size={16} /> Contraseña</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="contraseña"
              required
            />
          </div>

          <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '1rem', marginBottom: '1.5rem' }} disabled={loading}>
            {loading ? 'Entrando...' : 'Iniciar Sesión'} <LogIn size={20} />
          </button>
        </form>

      </div>
    </div>
  );
};

export default LoginPage;
