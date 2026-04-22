import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import LoginPage from './pages/LoginPage';
import Dashboard from './pages/Dashboard';
import LandingPage from './pages/LandingPage';

const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="min-h-screen bg-dark flex flex-col items-center justify-center">
        <div className="relative">
          <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full animate-pulse"></div>
          <img src="/logo.png" alt="Loading" className="h-24 w-auto relative z-10 animate-pulse" />
        </div>
        <p className="mt-8 text-primary font-bold tracking-[0.3em] uppercase text-[10px] animate-pulse">
          Validando Credenciales Élite
        </p>
      </div>
    );
  }
  
  return user ? children : <Navigate to="/login" />;
};

const AppRoutes = () => {
  const { user, loading } = useAuth();

  return (
    <Router>
      <Routes>
        <Route path="/login" element={
          user ? <Navigate to="/dashboard" /> : <LoginPage />
        } />
        <Route path="/dashboard" element={
          <PrivateRoute>
            <Dashboard />
          </PrivateRoute>
        } />
        <Route path="/mis-jugadores" element={
          <PrivateRoute>
            <Dashboard defaultView="Mis jugadores" />
          </PrivateRoute>
        } />
        <Route path="/" element={<LandingPage />} />
        {/* Add more routes like Register, Teams, etc. here */}
      </Routes>
    </Router>
  );
};

function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  );
}

export default App;
