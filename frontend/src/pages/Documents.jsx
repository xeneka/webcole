import React, { useState, useEffect, useContext } from 'react';
import { FileText, Image as ImageIcon, Upload, Send, PlusCircle } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';

export default function Documents() {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const { token } = useContext(AuthContext);
  
  // Form state
  const [isAdding, setIsAdding] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [pdfFile, setPdfFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  const fetchDocuments = async () => {
    try {
      const res = await fetch('http://localhost:8000/api/documents/');
      if (res.ok) {
        const data = await res.json();
        setDocuments(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, []);

  const handleUploadFile = async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    const res = await fetch('http://localhost:8000/api/upload', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}` },
      body: formData
    });
    if (res.ok) {
      const data = await res.json();
      return data.url;
    }
    throw new Error('Upload failed');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!pdfFile) return alert('El documento PDF es obligatorio');
    
    setUploading(true);
    try {
      const pdfUrl = await handleUploadFile(pdfFile);
      let imageUrl = null;
      if (imageFile) {
        imageUrl = await handleUploadFile(imageFile);
      }

      const res = await fetch('http://localhost:8000/api/documents/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          title,
          description,
          image_url: imageUrl,
          file_url: pdfUrl
        })
      });
      
      if (res.ok) {
        setTitle('');
        setDescription('');
        setImageFile(null);
        setPdfFile(null);
        setIsAdding(false);
        fetchDocuments();
      }
    } catch (err) {
      console.error(err);
      alert('Error subiendo documento');
    } finally {
      setUploading(false);
    }
  };

  return (
    <main className="container" style={{ padding: '4rem 0' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '2.5rem' }}>Documentos del Centro</h2>
        {token && (
          <button 
            className="btn-primary" 
            onClick={() => setIsAdding(!isAdding)}
            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
          >
            <PlusCircle size={20} />
            {isAdding ? 'Cancelar' : 'Subir Documento'}
          </button>
        )}
      </div>

      {isAdding && token && (
        <form className="glass animate-fade-in" onSubmit={handleSubmit} style={{ padding: '2rem', borderRadius: 'var(--radius-lg)', marginBottom: '3rem' }}>
          <h3 style={{ marginBottom: '1.5rem' }}>Subir nuevo documento</h3>
          <div className="grid md:grid-cols-2" style={{ gap: '1.5rem', marginBottom: '1.5rem' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label>Nombre del Documento</label>
              <input 
                required
                value={title} onChange={e => setTitle(e.target.value)}
                style={{ padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--color-border)' }} 
                placeholder="Ej. Normativa 2026"
              />
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', gridRow: 'span 2' }}>
              <label>Descripción breve</label>
              <textarea 
                required
                value={description} onChange={e => setDescription(e.target.value)}
                rows={5}
                style={{ padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--color-border)', fontFamily: 'inherit' }} 
              ></textarea>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Upload size={16}/> Archivo PDF (Requerido)</label>
              <input 
                type="file" accept=".pdf"
                onChange={e => setPdfFile(e.target.files[0])}
                style={{ padding: '0.5rem', borderRadius: '8px', border: '1px dashed var(--color-primary)' }} 
              />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><ImageIcon size={16}/> Foto de portada (Opcional)</label>
              <input 
                type="file" accept="image/*"
                onChange={e => setImageFile(e.target.files[0])}
                style={{ padding: '0.5rem', borderRadius: '8px', border: '1px dashed var(--color-border)' }} 
              />
            </div>
          </div>
          
          <button type="submit" className="btn-primary" disabled={uploading} style={{ width: '100%', opacity: uploading ? 0.7 : 1 }}>
            {uploading ? 'Subiendo archivos...' : 'Subir Documento'}
          </button>
        </form>
      )}

      {loading ? (
        <p style={{ textAlign: 'center' }}>Cargando documentos...</p>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3" style={{ gap: '2rem' }}>
          {documents.length === 0 ? (
            <p style={{ gridColumn: '1 / -1', textAlign: 'center', color: 'var(--color-text-muted)' }}>No hay documentos disponibles.</p>
          ) : (
            documents.map(doc => (
              <div key={doc.id} className="glass animate-fade-in" style={{ borderRadius: 'var(--radius-lg)', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                {doc.image_url ? (
                  <img src={doc.image_url} alt={doc.title} style={{ width: '100%', height: '160px', objectFit: 'cover' }} />
                ) : (
                  <div style={{ background: '#e2e8f0', height: '160px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94a3b8' }}>
                    <FileText size={48} />
                  </div>
                )}
                <div style={{ padding: '1.5rem', flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                  <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>{doc.title}</h3>
                  <p style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem', marginBottom: '1.5rem', flexGrow: 1 }}>{doc.description}</p>
                  <a href={doc.file_url} target="_blank" rel="noreferrer" className="btn-secondary" style={{ textAlign: 'center', display: 'block', textDecoration: 'none' }}>
                    Ver PDF
                  </a>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </main>
  );
}
