import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, useNavigate, Navigate } from 'react-router-dom';
import Rankings from './pages/Rankings/Rankings';
import Missoes from './pages/Missoes/index';
import Gestao from './pages/Gestao/index';
import Auth from './pages/Auth/index';
import Perfil from './pages/Perfil/index';
import { BottomNav, NavTab } from './ui/BottomNav';
import { Session } from './api/session';

type AuthStatus = 'checking' | 'authenticated' | 'unauthenticated';

function useAuthStatus(): AuthStatus {
  const [status, setStatus] = useState<AuthStatus>('checking');
  useEffect(() => {
    setStatus(Session.isAuthenticated() ? 'authenticated' : 'unauthenticated');
  }, []);

  return status;
}

// ProtectedRoute checks if the user has a valid token.
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const status = useAuthStatus();
  if (status === 'checking') return null;
  if (status === 'unauthenticated') {
    return <Navigate to="/" replace />;
  }
  return <>{children}</>;
}

// GuestRoute checks if the user is already logged in, redirecting to the main app if so.
function GuestRoute({ children }: { children: React.ReactNode }) {
  const status = useAuthStatus();
  if (status === 'checking') return null;
  if (status === 'authenticated') {
    return <Navigate to="/tasks" replace />;
  }
  return <>{children}</>;
}

function MobileLayout({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<NavTab>('missoes');

  useEffect(() => {
    if (location.pathname.includes('/rankings')) setActiveTab('rankings');
    else if (location.pathname.includes('/gestao')) setActiveTab('gestao');
    else if (location.pathname.includes('/perfil')) setActiveTab('perfil');
    else setActiveTab('missoes');
  }, [location]);

  const handleNav = (tab: NavTab) => {
    setActiveTab(tab);
    if (tab === 'missoes') navigate('/tasks');
    if (tab === 'rankings') navigate('/rankings');
    if (tab === 'gestao') navigate('/gestao'); // Adicionar navegação para Gestao
    if (tab === 'perfil') navigate('/perfil');
  };

  if (location.pathname === '/') {
    return <div style={{ width: '100vw', minHeight: '100vh', backgroundColor: '#FAFAFA' }}>{children}</div>;
  }

  return (
    <div style={{
      width: '100vw',
      height: '100dvh',
      display: 'flex',
      flexDirection: 'column',
      backgroundColor: '#FAFAFA',
      overflow: 'hidden'
    }}>
      <main style={{
        flex: 1,
        overflowY: 'auto',
        overflowX: 'hidden',
      }}>
        {children}
      </main>
      <BottomNav active={activeTab} onPress={handleNav} />
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <MobileLayout>
        <Routes>
          <Route path="/" element={
            <GuestRoute>
              <Auth />
            </GuestRoute>
          } />
          
          <Route path="/tasks" element={
            <ProtectedRoute>
              <Missoes />
            </ProtectedRoute>
          } />
          
          <Route path="/rankings" element={
            <ProtectedRoute>
              <Rankings />
            </ProtectedRoute>
          } />

          <Route path="/gestao" element={
            <ProtectedRoute>
              <Gestao />
            </ProtectedRoute>
          } />

          <Route path="/perfil" element={
            <ProtectedRoute>
              <Perfil />
            </ProtectedRoute>
          } />
        </Routes>
      </MobileLayout>
    </Router>
  );
}