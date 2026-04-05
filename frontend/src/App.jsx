import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import News from './pages/News'
import Login from './pages/Login'
import Documents from './pages/Documents'
import CalendarScreen from './pages/CalendarScreen'
import { AuthProvider } from './context/AuthContext'

const FacebookIcon = ({ size = 26, strokeWidth = 1.5, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
  </svg>
);

const InstagramIcon = ({ size = 26, strokeWidth = 1.5, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
  </svg>
);

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
          <Navbar />
          <div style={{ flexGrow: 1 }}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/noticias" element={<News />} />
              <Route path="/calendario" element={<CalendarScreen />} />
              <Route path="/documentos" element={<Documents />} />
              <Route path="/login" element={<Login />} />
            </Routes>
          </div>
          
          <footer style={{ background: '#f1f5f9', padding: '2rem 0', marginTop: 'auto' }}>
            <div className="container" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem', color: 'var(--color-text-muted)' }}>
              <div style={{ display: 'flex', gap: '1.5rem', marginBottom: '0.5rem' }}>
                <a 
                  href="https://www.facebook.com/ceipsanisidroelpriorato/?locale=es_ES" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  style={{ color: 'var(--color-primary-dark)', transition: 'color 0.2s', display: 'flex', alignItems: 'center' }}
                  title="Visitar Facebook de CEIP San Isidro"
                  aria-label="Facebook del centro"
                >
                  <FacebookIcon size={26} strokeWidth={1.5} />
                </a>
                <a 
                  href="https://www.instagram.com/ceipsanisidro/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  style={{ color: '#E1306C', transition: 'color 0.2s', display: 'flex', alignItems: 'center' }}
                  title="Visitar Instagram de CEIP San Isidro"
                  aria-label="Instagram del centro"
                >
                  <InstagramIcon size={26} strokeWidth={1.5} />
                </a>
              </div>
              <p style={{ margin: 0 }}>&copy; {new Date().getFullYear()} CEIP San Isidro. Todos los derechos reservados.</p>
            </div>
          </footer>
        </div>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App
