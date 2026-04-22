import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { User, Lock, Eye, EyeOff, ArrowRight, ArrowUpRight } from 'lucide-react';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const user = await login({ email, password });
      if (user.role?.toLowerCase() === 'parent') {
        navigate('/mis-jugadores');
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      setError('Credenciales incorrectas. Verifique sus datos.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#131313] text-[#e5e2e1] min-h-screen flex flex-col justify-center items-center overflow-hidden relative font-manrope">
      
      {/* Background Texture/Visual */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        {/* Glows */}
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#eab308]/10 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-[#59440c]/5 rounded-full blur-[150px]"></div>
        
        {/* Texture Image */}
        <img 
          className="w-full h-full object-cover opacity-20 grayscale" 
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuCP57KVB9V4dXH9AYIZSGCHWBfJgiB3Hra5Lmi0VWF6EjDVnJHFvv4gp80-wET3eGuCL83VyDLGdHhMSXGi2FMZjzWX3qhLx1NMezxiEMUjsgND1tBteUcQhivr1NJsaNhXQrmlkVQlAUqygwyL-glasnoUGToyLnwIlCBvsXp0EnB8b3c-pp1m-bylDgJuF7F6JtQKIGw_ieP7UfFsPZP2LQlyFrTnv4kKX3Bq_WcZ_0iP070aqSixVaN3jtRGUESKvM-l1nPW7qQl" 
          alt="Sports Texture"
        />
      </div>

      {/* Login Container */}
      <main className="w-full max-w-md px-6 py-12 relative z-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
        
        {/* Branding Header */}
        <div className="flex flex-col items-center mb-10 relative">
          <img src="/logo.png" alt="GOLEA Logo" className="h-24 lg:h-32 w-auto object-contain drop-shadow-[0_0_30px_rgba(212,175,55,0.5)] mb-4" />
          <div className="text-[#ffd165] tracking-[0.3em] font-bold text-[10px] uppercase">Elite Sports Management</div>
        </div>

        {/* Sleek Card */}
        <div className="glass-panel gold-glow rounded-xl p-8 md:p-10 relative">
          <h1 className="text-2xl font-light mb-8 text-center tracking-tight">
            Acceso a <span className="text-[#f7be1d] font-bold">Plataforma</span>
          </h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Username/Email Field */}
            <div className="space-y-2">
              <label className="text-[#d3c5ac] text-xs uppercase tracking-widest font-semibold ml-1" htmlFor="email">
                Identificador de Usuario
              </label>
              <div className="relative group flex items-center">
                <User size={18} className="absolute left-3 text-[#e2c380] group-focus-within:text-[#ffd165] transition-colors" />
                <input 
                  className="w-full bg-[#353534]/20 border-b-2 border-[#4f4633] focus:border-[#ffd165] focus:outline-none text-[#e5e2e1] pl-10 pr-4 py-3 transition-all duration-300 placeholder:text-[#d3c5ac]/30 hover:bg-white/5" 
                  id="email" 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Escriba su usuario" 
                  required
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <label className="text-[#d3c5ac] text-xs uppercase tracking-widest font-semibold ml-1" htmlFor="password">
                Clave de Acceso
              </label>
              <div className="relative group flex items-center">
                <Lock size={18} className="absolute left-3 text-[#e2c380] group-focus-within:text-[#ffd165] transition-colors" />
                <input 
                  className="w-full bg-[#353534]/20 border-b-2 border-[#4f4633] focus:border-[#ffd165] focus:outline-none text-[#e5e2e1] pl-10 pr-12 py-3 transition-all duration-300 placeholder:text-[#d3c5ac]/30 hover:bg-white/5" 
                  id="password" 
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••" 
                  required
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 p-1.5 bg-black/60 text-[#ffd165] hover:text-[#f7be1d] transition-all hover:bg-black rounded-full border border-[#ffd165]/20 hover:border-[#ffd165]/50 flex items-center justify-center"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {error && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-500 p-3 rounded-xl text-center text-[10px] font-bold uppercase tracking-widest animate-shake">
                {error}
              </div>
            )}

            {/* Action Button */}
            <div className="pt-4">
              <button 
                type="submit" 
                disabled={loading}
                className="w-full bg-gradient-to-r from-[#ffd165] to-[#eab308] text-[#251a00] font-bold py-4 rounded-md shadow-lg shadow-[#eab308]/20 flex items-center justify-center gap-2 group transition-all active:scale-[0.98] disabled:opacity-50"
              >
                <span className="uppercase tracking-widest text-xs">{loading ? 'Validando...' : 'Acceder al Sistema'}</span>
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </form>

          {/* Secondary Link */}
          <div className="mt-8 text-center">
            <button className="inline-flex items-center px-4 py-2 bg-black/30 border border-[#ffd165]/10 text-[#ffd165] text-[10px] uppercase tracking-[0.2em] font-bold rounded-lg hover:bg-black/60 hover:border-[#ffd165]/40 transition-all group">
               ¿Ha olvidado su contraseña?
            </button>
          </div>
        </div>

        <footer className="mt-10 flex flex-col items-center gap-4">
          <div className="text-[9px] text-[#d3c5ac]/50 tracking-widest uppercase">
            © 2026 GOLEA - Elite Sports Management
          </div>
        </footer>
      </main>

      {/* Decorative Corner Elements */}
      <div className="fixed bottom-0 left-0 p-8 hidden md:block opacity-30">
        <div className="w-16 h-16 border-l-2 border-b-2 border-[#ffd165]/40 rounded-bl-3xl"></div>
      </div>
      <div className="fixed top-0 right-0 p-8 hidden md:block opacity-30">
        <div className="w-16 h-16 border-t-2 border-r-2 border-[#ffd165]/40 rounded-tr-3xl"></div>
      </div>
    </div>
  );
};

export default LoginPage;
