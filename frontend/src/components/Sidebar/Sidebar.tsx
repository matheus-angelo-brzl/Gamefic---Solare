import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import LogoSolare from '../../assets/logo.svg';
import './Sidebar.css';

export default function Sidebar({ userRole }) {
  const [isOpen, setIsOpen] = useState(false);
  const toggleSidebar = () => setIsOpen(!isOpen);

  return (
    <>
      <button className="mobile-toggle" onClick={toggleSidebar}>☰</button>
      <aside className={`sidebar ${isOpen ? 'open' : ''}`}>

        <div className="sidebar-logo">
          <img src={LogoSolare} alt="Logo Solare" className="logo-img" />
          <h2>Solare</h2>
        </div>

        <nav className="sidebar-nav">
          {/* 1. O bloco do NavLink do '/Home' foi completamente removido daqui */}

          {/* 2. Alterado de 'Tarefas' para 'Missões' (e rota para /missoes) */}
          <NavLink to="/missoes" className="nav-item">
            <span>Missões</span>
          </NavLink>

          <NavLink to="/rankings" className="nav-item">
            <span>Rankings</span>
          </NavLink>

          {/* 3. Mantida a trava de segurança por Role, mas atualizado para 'Gestão' */}
          {(userRole === 'rh' || userRole === 'admin') && (
            <NavLink to="/gestao" className="nav-item">
              <span>Gestão</span>
            </NavLink>
          )}

          <NavLink to="/perfil" className="nav-item">
            <span>Perfil</span>
          </NavLink>
        </nav>

        <div className="sidebar-footer">
          <NavLink to="/login" className="logout-btn">
            <span>Sair</span>
          </NavLink>
        </div>
      </aside>
    </>
  );
}