import React, { useContext } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { GraduationCap, BookOpen, Menu, Files, LogOut } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { token, logout } = useContext(AuthContext);

  const handleLogout = () => {
    logout();
    navigate('/');
  };
  
  return (
    <header className="glass" style={{ position: 'sticky', top: 0, zIndex: 50, padding: '1rem 0' }}>
      <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', textDecoration: 'none', color: 'inherit' }}>
          <img src="/logo.png" alt="Logotipo CEIP San Isidro" style={{ height: '65px', width: 'auto', objectFit: 'contain' }} />
          <h1 style={{ fontSize: '1.5rem', margin: 0 }}>CEIP San Isidro</h1>
        </Link>
        
        <nav style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
          <Link 
            to="/" 
            style={{ 
              textDecoration: 'none', 
              color: location.pathname === '/' ? 'var(--color-primary)' : 'var(--color-text)',
              fontWeight: location.pathname === '/' ? '600' : '500',
              transition: 'color 0.2s'
            }}
          >
            Inicio
          </Link>
          <Link 
            to="/noticias" 
            style={{ 
              textDecoration: 'none', 
              color: location.pathname === '/noticias' ? 'var(--color-primary)' : 'var(--color-text)',
              fontWeight: location.pathname === '/noticias' ? '600' : '500',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              transition: 'color 0.2s'
            }}
          >
            <BookOpen size={18} /> Noticias
          </Link>
          <Link 
            to="/calendario" 
            style={{ 
              textDecoration: 'none', 
              color: location.pathname === '/calendario' ? 'var(--color-primary)' : 'var(--color-text)',
              fontWeight: location.pathname === '/calendario' ? '600' : '500',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              transition: 'color 0.2s'
            }}
          >
            <Menu size={18} /> Calendario
          </Link>
          <Link 
            to="/documentos" 
            style={{ 
              textDecoration: 'none', 
              color: location.pathname === '/documentos' ? 'var(--color-primary)' : 'var(--color-text)',
              fontWeight: location.pathname === '/documentos' ? '600' : '500',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              transition: 'color 0.2s'
            }}
          >
            <Files size={18} /> Documentos
          </Link>
          
          {token ? (
            <button onClick={handleLogout} className="btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <LogOut size={18} /> Salir
            </button>
          ) : (
            <Link to="/login" className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none' }}>
              Acceder
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}
