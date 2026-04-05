import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Lock } from 'lucide-react';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const success = await login(username, password);
    if (success) {
      navigate('/');
    } else {
      setError('Credenciales incorrectas');
    }
  };

  return (
    <div className="container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
      <form className="glass animate-fade-in" onSubmit={handleSubmit} style={{ padding: '3rem', borderRadius: 'var(--radius-lg)', width: '100%', maxWidth: '400px' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{ background: 'var(--color-primary)', display: 'inline-block', padding: '1rem', borderRadius: '50%', color: 'white', marginBottom: '1rem' }}>
            <Lock size={32} />
          </div>
          <h2>Acceso Privado</h2>
        </div>

        {error && <p style={{ color: 'var(--color-secondary)', textAlign: 'center', marginBottom: '1rem' }}>{error}</p>}

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginBottom: '2rem' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label>Usuario</label>
            <input 
              value={username} onChange={e => setUsername(e.target.value)}
              style={{ padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--color-border)' }} 
            />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label>Contraseña</label>
            <input 
              type="password"
              value={password} onChange={e => setPassword(e.target.value)}
              style={{ padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--color-border)' }} 
            />
          </div>
        </div>

        <button type="submit" className="btn-primary" style={{ width: '100%' }}>Iniciar Sesión</button>
      </form>
    </div>
  );
}
