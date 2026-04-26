import React, { useState, useEffect, useContext } from 'react';
import { FileText, Image as ImageIcon, Upload, PlusCircle, Pencil, Trash2, EyeOff, Eye, X, Check } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';

export default function Documents() {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const { token } = useContext(AuthContext);

  // Create form state
  const [isAdding, setIsAdding] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [pdfFile, setPdfFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  // Edit state
  const [editingId, setEditingId] = useState(null);
  const [editTitle, setEditTitle] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [editImageFile, setEditImageFile] = useState(null);
  const [editPdfFile, setEditPdfFile] = useState(null);
  const [editSaving, setEditSaving] = useState(false);

  const fetchDocuments = async () => {
    try {
      const res = await fetch('/api/documents/');
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

  useEffect(() => { fetchDocuments(); }, []);

  const handleUploadFile = async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    const res = await fetch('/api/upload', {
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
      if (imageFile) imageUrl = await handleUploadFile(imageFile);

      const res = await fetch('/api/documents/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ title, description, image_url: imageUrl, file_url: pdfUrl })
      });
      if (res.ok) {
        setTitle(''); setDescription(''); setImageFile(null); setPdfFile(null);
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

  const handleDelete = async (id) => {
    if (!confirm('¿Seguro que quieres borrar este documento? Esta acción no se puede deshacer.')) return;
    const res = await fetch(`/api/documents/${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (res.ok) fetchDocuments();
  };

  const handleToggleActive = async (doc) => {
    const res = await fetch(`/api/documents/${doc.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify({ is_active: !doc.is_active })
    });
    if (res.ok) fetchDocuments();
  };

  const startEdit = (doc) => {
    setEditingId(doc.id);
    setEditTitle(doc.title);
    setEditDescription(doc.description);
    setEditImageFile(null);
    setEditPdfFile(null);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditImageFile(null);
    setEditPdfFile(null);
  };

  const handleSaveEdit = async (doc) => {
    setEditSaving(true);
    try {
      let finalImageUrl = doc.image_url;
      let finalFileUrl = doc.file_url;
      if (editImageFile) finalImageUrl = await handleUploadFile(editImageFile);
      if (editPdfFile) finalFileUrl = await handleUploadFile(editPdfFile);

      const res = await fetch(`/api/documents/${doc.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({
          title: editTitle,
          description: editDescription,
          image_url: finalImageUrl,
          file_url: finalFileUrl
        })
      });
      if (res.ok) { setEditingId(null); fetchDocuments(); }
    } catch (err) {
      console.error(err);
      alert('Error guardando cambios');
    } finally {
      setEditSaving(false);
    }
  };

  const visibleDocs = token ? documents : documents.filter(d => d.is_active);

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
              <input required value={title} onChange={e => setTitle(e.target.value)}
                style={{ padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--color-border)' }}
                placeholder="Ej. Normativa 2026" />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', gridRow: 'span 2' }}>
              <label>Descripción breve</label>
              <textarea required value={description} onChange={e => setDescription(e.target.value)} rows={5}
                style={{ padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--color-border)', fontFamily: 'inherit' }} />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Upload size={16} /> Archivo PDF (Requerido)</label>
              <input type="file" accept=".pdf" onChange={e => setPdfFile(e.target.files[0])}
                style={{ padding: '0.5rem', borderRadius: '8px', border: '1px dashed var(--color-primary)' }} />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><ImageIcon size={16} /> Foto de portada (Opcional)</label>
              <input type="file" accept="image/*" onChange={e => setImageFile(e.target.files[0])}
                style={{ padding: '0.5rem', borderRadius: '8px', border: '1px dashed var(--color-border)' }} />
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
          {visibleDocs.length === 0 ? (
            <p style={{ gridColumn: '1 / -1', textAlign: 'center', color: 'var(--color-text-muted)' }}>No hay documentos disponibles.</p>
          ) : (
            visibleDocs.map(doc => (
              <div key={doc.id} className="glass animate-fade-in" style={{
                borderRadius: 'var(--radius-lg)', overflow: 'hidden', display: 'flex', flexDirection: 'column',
                opacity: (!doc.is_active && token) ? 0.55 : 1,
                outline: (!doc.is_active && token) ? '2px dashed var(--color-border)' : 'none'
              }}>
                {editingId === doc.id ? (
                  <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    <input value={editTitle} onChange={e => setEditTitle(e.target.value)}
                      style={{ padding: '0.6rem', borderRadius: '8px', border: '1px solid var(--color-border)', fontWeight: 600 }}
                      placeholder="Nombre del documento" />
                    <textarea value={editDescription} onChange={e => setEditDescription(e.target.value)} rows={3}
                      style={{ padding: '0.6rem', borderRadius: '8px', border: '1px solid var(--color-border)', fontFamily: 'inherit', resize: 'vertical' }}
                      placeholder="Descripción" />
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                      <label style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>Cambiar PDF (opcional)</label>
                      <input type="file" accept=".pdf" onChange={e => setEditPdfFile(e.target.files[0])}
                        style={{ padding: '0.4rem', borderRadius: '8px', border: '1px dashed var(--color-primary)' }} />
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                      <label style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>Cambiar imagen (opcional)</label>
                      <input type="file" accept="image/*" onChange={e => setEditImageFile(e.target.files[0])}
                        style={{ padding: '0.4rem', borderRadius: '8px', border: '1px dashed var(--color-border)' }} />
                    </div>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button onClick={() => handleSaveEdit(doc)} disabled={editSaving}
                        style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem', padding: '0.6rem', borderRadius: '8px', background: 'var(--color-primary)', color: '#fff', border: 'none', cursor: 'pointer', opacity: editSaving ? 0.7 : 1 }}>
                        <Check size={16} /> {editSaving ? 'Guardando...' : 'Guardar'}
                      </button>
                      <button onClick={cancelEdit}
                        style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem', padding: '0.6rem', borderRadius: '8px', background: 'transparent', border: '1px solid var(--color-border)', cursor: 'pointer' }}>
                        <X size={16} /> Cancelar
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    {doc.image_url ? (
                      <img src={doc.image_url} alt={doc.title} style={{ width: '100%', height: '160px', objectFit: 'cover' }} />
                    ) : (
                      <div style={{ background: '#e2e8f0', height: '160px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94a3b8' }}>
                        <FileText size={48} />
                      </div>
                    )}
                    <div style={{ padding: '1.5rem', flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                      {!doc.is_active && token && (
                        <span style={{ fontSize: '0.7rem', fontWeight: 600, color: '#f59e0b', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem' }}>
                          Desactivado
                        </span>
                      )}
                      <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>{doc.title}</h3>
                      <p style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem', marginBottom: '1rem', flexGrow: 1 }}>{doc.description}</p>
                      <a href={doc.file_url} target="_blank" rel="noreferrer" className="btn-secondary"
                        style={{ textAlign: 'center', display: 'block', textDecoration: 'none', marginBottom: token ? '0.75rem' : '0' }}>
                        Ver PDF
                      </a>
                      {token && (
                        <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                          <button onClick={() => startEdit(doc)} title="Editar"
                            style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.3rem', padding: '0.35rem 0.5rem', borderRadius: '6px', border: '1px solid var(--color-border)', background: 'transparent', cursor: 'pointer', fontSize: '0.8rem' }}>
                            <Pencil size={14} /> Editar
                          </button>
                          <button onClick={() => handleToggleActive(doc)} title={doc.is_active ? 'Desactivar' : 'Activar'}
                            style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.3rem', padding: '0.35rem 0.5rem', borderRadius: '6px', border: '1px solid var(--color-border)', background: 'transparent', cursor: 'pointer', fontSize: '0.8rem' }}>
                            {doc.is_active ? <EyeOff size={14} /> : <Eye size={14} />}
                            {doc.is_active ? 'Desactivar' : 'Activar'}
                          </button>
                          <button onClick={() => handleDelete(doc.id)} title="Borrar"
                            style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.3rem', padding: '0.35rem 0.5rem', borderRadius: '6px', border: '1px solid #ef4444', color: '#ef4444', background: 'transparent', cursor: 'pointer', fontSize: '0.8rem' }}>
                            <Trash2 size={14} /> Borrar
                          </button>
                        </div>
                      )}
                    </div>
                  </>
                )}
              </div>
            ))
          )}
        </div>
      )}
    </main>
  );
}
