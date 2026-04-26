import React, { useContext, useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { GraduationCap, BookOpen, Menu, Files, LogOut, X, CalendarDays } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';

const links = [
  { to: '/', label: 'Inicio', icon: null },
  { to: '/noticias', label: 'Noticias', icon: <BookOpen size={18} /> },
  { to: '/calendario', label: 'Calendario', icon: <CalendarDays size={18} /> },
  { to: '/documentos', label: 'Documentos', icon: <Files size={18} /> },
];

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { token, logout } = useContext(AuthContext);
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);

  const handleLogout = () => {
    logout();
    navigate('/');
    setOpen(false);
  };

  // Close menu on outside click
  useEffect(() => {
    const handler = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  // Close menu on route change
  useEffect(() => { setOpen(false); }, [location.pathname]);

  return (
    <header className="glass" style={{ position: 'sticky', top: 0, zIndex: 50, padding: '0.75rem 0' }} ref={menuRef}>
      <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        {/* Logo */}
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', textDecoration: 'none', color: 'inherit' }}>
          <img src="/logo.png" alt="Logotipo CEIP San Isidro" style={{ height: '52px', width: 'auto', objectFit: 'contain' }} />
          <span className="navbar-title" style={{ fontSize: '1.2rem', fontWeight: 700, fontFamily: 'var(--font-heading)' }}>
            CEIP San Isidro
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="navbar-desktop">
          {links.map(({ to, label, icon }) => (
            <Link key={to} to={to} style={{
              textDecoration: 'none',
              color: location.pathname === to ? 'var(--color-primary)' : 'var(--color-text)',
              fontWeight: location.pathname === to ? '600' : '500',
              display: 'flex', alignItems: 'center', gap: '0.4rem',
              transition: 'color 0.2s'
            }}>
              {icon}{label}
            </Link>
          ))}
          {token ? (
            <button onClick={handleLogout} className="btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1.2rem' }}>
              <LogOut size={18} /> Salir
            </button>
          ) : (
            <Link to="/login" className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none', padding: '0.5rem 1.2rem' }}>
              Acceder
            </Link>
          )}
        </nav>

        {/* Hamburger button (mobile only) */}
        <button
          className="navbar-hamburger"
          onClick={() => setOpen(!open)}
          aria-label="Abrir menú"
          style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '0.5rem', color: 'var(--color-text)' }}
        >
          {open ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="navbar-mobile-menu glass animate-fade-in">
          {links.map(({ to, label, icon }) => (
            <Link key={to} to={to} className="navbar-mobile-link" style={{
              color: location.pathname === to ? 'var(--color-primary)' : 'var(--color-text)',
              fontWeight: location.pathname === to ? '600' : '500',
            }}>
              {icon}{label}
            </Link>
          ))}
          <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: '1rem', marginTop: '0.5rem' }}>
            {token ? (
              <button onClick={handleLogout} className="btn-secondary" style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                <LogOut size={18} /> Cerrar sesión
              </button>
            ) : (
              <Link to="/login" className="btn-primary" onClick={() => setOpen(false)} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', textDecoration: 'none' }}>
                Acceder
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
