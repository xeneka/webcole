import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Settings, X, Upload } from 'lucide-react';

export default function PopupNotification() {
  const [popupData, setPopupData] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  
  // Admin states
  const { token } = useContext(AuthContext);
  const [showAdminModal, setShowAdminModal] = useState(false);
  const [editData, setEditData] = useState({ is_active: false, title: '', description: '', image_url: '', link_url: '' });
  const [uploading, setUploading] = useState(false);

  // Fetch logic
  const fetchPopup = async () => {
    try {
      const res = await fetch('http://localhost:8000/api/popup/');
      if (res.ok) {
        const data = await res.json();
        setPopupData(data);
        setEditData(data);
        
        // Show only if active and not dismissed in this session
        if (data.is_active && sessionStorage.getItem('popupDismissed') !== 'true') {
          setShowPopup(true);
        }
      }
    } catch (err) {
      console.error("Error fetching popup", err);
    }
  };

  useEffect(() => {
    fetchPopup();
  }, []);

  const handleDismiss = () => {
    sessionStorage.setItem('popupDismissed', 'true');
    setShowPopup(false);
  };

  const handleSaveAdmin = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:8000/api/popup/', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(editData)
      });
      if (res.ok) {
        const data = await res.json();
        setPopupData(data);
        setShowAdminModal(false);
        // Reset dismiss flag for admin testing
        sessionStorage.removeItem('popupDismissed');
        if (data.is_active) setShowPopup(true);
        else setShowPopup(false);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    try {
      const response = await fetch("http://localhost:8000/api/upload", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`
        },
        body: formData
      });
      if (response.ok) {
        const data = await response.json();
        setEditData({...editData, image_url: data.url});
      }
    } catch (error) {
      console.error("Error subiendo imagen:", error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <>
      {/* Public Popup Modal */}
      {showPopup && popupData && (
        <div style={{
          position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
          backgroundColor: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)',
          zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center'
        }}>
          <div className="glass animate-fade-in" style={{
            background: 'white', borderRadius: '16px', maxWidth: '600px', width: '90%',
            overflow: 'hidden', position: 'relative', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
          }}>
            <button onClick={handleDismiss} style={{
              position: 'absolute', top: '15px', right: '15px', background: 'rgba(255,255,255,0.8)',
              border: 'none', borderRadius: '50%', padding: '8px', cursor: 'pointer', zIndex: 10
            }}>
              <X size={20} />
            </button>
            {popupData.image_url && (
              <img src={popupData.image_url} alt="Noticia Alerta" style={{ width: '100%', maxHeight: '350px', objectFit: 'cover' }} />
            )}
            <div style={{ padding: '2rem', textAlign: 'center' }}>
              <h2 style={{ color: 'var(--color-primary-dark)', marginBottom: '1rem', fontSize: '2rem' }}>{popupData.title}</h2>
              <p style={{ color: 'var(--color-text)', fontSize: '1.2rem', whiteSpace: 'pre-wrap', marginBottom: '2rem' }}>{popupData.description}</p>
              
              <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
                {popupData.link_url && (
                  <a 
                    href={popupData.link_url} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="btn-secondary" 
                    style={{ textDecoration: 'none', padding: '0.8rem 2rem' }}
                    onClick={handleDismiss} // Also dismiss the popup if they go read more!
                  >
                    Saber Más
                  </a>
                )}
                <button 
                  onClick={handleDismiss}
                  className="btn-primary" 
                  style={{ padding: '0.8rem 2rem' }}>
                  Entendido
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Admin Button */}
      {token && (
        <button 
          onClick={() => setShowAdminModal(true)}
          title="Configurar Alerta Portada"
          style={{
            position: 'fixed', bottom: '30px', right: '30px', zIndex: 99,
            background: 'var(--color-primary-dark)', color: 'white', border: 'none',
            borderRadius: '50%', width: '60px', height: '60px', display: 'flex',
            alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
          }}
        >
          <Settings size={28} />
        </button>
      )}

      {/* Admin Settings Modal */}
      {showAdminModal && (
        <div style={{
          position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
          backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1000, display: 'flex',
          alignItems: 'center', justifyContent: 'center'
        }}>
          <div className="glass" style={{ background: 'white', padding: '2rem', borderRadius: '12px', width: '90%', maxWidth: '500px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
              <h2>Configurar Alerta Portada</h2>
              <button onClick={() => setShowAdminModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><X /></button>
            </div>
            <form onSubmit={handleSaveAdmin} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 'bold' }}>
                <input 
                  type="checkbox" 
                  checked={editData.is_active} 
                  onChange={(e) => setEditData({...editData, is_active: e.target.checked})}
                />
                Activar Alerta
              </label>
              
              <input 
                type="text" 
                placeholder="Título" 
                value={editData.title} 
                onChange={(e) => setEditData({...editData, title: e.target.value})}
                style={{ padding: '0.75rem', borderRadius: '8px', border: '1px solid #cbd5e1' }}
              />
              <textarea 
                placeholder="Descripción del anuncio..." 
                value={editData.description} 
                onChange={(e) => setEditData({...editData, description: e.target.value})}
                rows="4"
                style={{ padding: '0.75rem', borderRadius: '8px', border: '1px solid #cbd5e1' }}
              />
              <input 
                type="url" 
                placeholder="Enlace web adicional (Opcional, ej: http://...)" 
                value={editData.link_url || ''} 
                onChange={(e) => setEditData({...editData, link_url: e.target.value})}
                style={{ padding: '0.75rem', borderRadius: '8px', border: '1px solid #cbd5e1' }}
              />
              
              <div style={{ border: '2px dashed #cbd5e1', padding: '1rem', borderRadius: '8px', textAlign: 'center' }}>
                {editData.image_url && <img src={editData.image_url} alt="Preview" style={{ height: '100px', objectFit: 'cover', marginBottom: '1rem' }}/>}
                <label style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', color: 'var(--color-primary)' }}>
                  <Upload size={18} /> {uploading ? 'Subiendo...' : 'Subir Imagen (Opcional)'}
                  <input type="file" accept="image/*" onChange={handleImageUpload} style={{ display: 'none' }} disabled={uploading}/>
                </label>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1rem' }}>
                <button type="button" onClick={() => setShowAdminModal(false)} className="btn-secondary">Cancelar</button>
                <button type="submit" className="btn-primary" disabled={uploading}>Guardar</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
