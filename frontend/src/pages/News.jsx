import React, { useState, useEffect, useContext } from 'react';
import { Image, Video, PlusCircle, Send, Upload } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';

export default function News() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { token } = useContext(AuthContext);
  
  // Form state
  const [isAdding, setIsAdding] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [videoUrl, setVideoUrl] = useState('');
  const [uploading, setUploading] = useState(false);

  const fetchPosts = async () => {
    try {
      const res = await fetch('/api/posts/');
      if (res.ok) {
        const data = await res.json();
        setPosts(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

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
    setUploading(true);
    try {
      let finalImageUrl = null;
      if (imageFile) {
        finalImageUrl = await handleUploadFile(imageFile);
      }

      const res = await fetch('/api/posts/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          title,
          content,
          image_url: finalImageUrl,
          video_url: videoUrl || null
        })
      });
      
      if (res.ok) {
        setTitle('');
        setContent('');
        setImageFile(null);
        setVideoUrl('');
        setIsAdding(false);
        fetchPosts();
      }
    } catch (err) {
      console.error(err);
      alert('Error subiendo noticia');
    } finally {
      setUploading(false);
    }
  };

  const getYouTubeId = (url) => {
    if (!url) return null;
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  return (
    <main className="container" style={{ padding: '4rem 0' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '2.5rem' }}>Noticias y Actividades</h2>
        {token && (
          <button 
            className="btn-primary" 
            onClick={() => setIsAdding(!isAdding)}
            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
          >
            <PlusCircle size={20} />
            {isAdding ? 'Cancelar' : 'Añadir Noticia'}
          </button>
        )}
      </div>

      {isAdding && token && (
        <form className="glass animate-fade-in" onSubmit={handleSubmit} style={{ padding: '2rem', borderRadius: 'var(--radius-lg)', marginBottom: '3rem' }}>
          <h3 style={{ marginBottom: '1.5rem' }}>Crear nueva publicación</h3>
          <div className="grid md:grid-cols-2" style={{ gap: '1.5rem', marginBottom: '1.5rem' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label>Título (requerido)</label>
              <input 
                required
                value={title} onChange={e => setTitle(e.target.value)}
                style={{ padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--color-border)' }} 
              />
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Upload size={16}/> Subir Foto (opcional)</label>
              <input 
                type="file" accept="image/*"
                onChange={e => setImageFile(e.target.files[0])}
                style={{ padding: '0.5rem', borderRadius: '8px', border: '1px dashed var(--color-border)' }} 
              />
            </div>

            <div className="md:grid-cols-2" style={{ gridColumn: '1 / -1', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Video size={16}/> URL de Video YouTube (opcional)</label>
              <input 
                value={videoUrl} onChange={e => setVideoUrl(e.target.value)}
                style={{ padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--color-border)' }} 
                placeholder="Ej. https://www.youtube.com/watch?v=..."
              />
            </div>
            
            <div style={{ gridColumn: '1 / -1', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label>Contenido</label>
              <textarea 
                required
                value={content} onChange={e => setContent(e.target.value)}
                rows={4}
                style={{ padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--color-border)', fontFamily: 'inherit' }} 
              ></textarea>
            </div>
          </div>
          
          <button type="submit" className="btn-primary" disabled={uploading} style={{ width: '100%', opacity: uploading ? 0.7 : 1 }}>
             {uploading ? 'Subiendo noticia...' : 'Publicar'}
          </button>
        </form>
      )}

      {loading ? (
        <p style={{ textAlign: 'center', padding: '3rem' }}>Cargando publicaciones...</p>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3" style={{ gap: '2rem' }}>
          {posts.length === 0 ? (
            <p style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '3rem', color: 'var(--color-text-muted)' }}>No hay noticias publicadas todavía.</p>
          ) : (
            posts.map(post => (
              <article key={post.id} className="glass animate-fade-in" style={{ borderRadius: 'var(--radius-lg)', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                {post.video_url && getYouTubeId(post.video_url) ? (
                   <div style={{ position: 'relative', paddingBottom: '56.25%', height: 0 }}>
                    <iframe 
                      src={`https://www.youtube.com/embed/${getYouTubeId(post.video_url)}`}
                      style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 'none' }}
                      allowFullScreen
                    ></iframe>
                   </div>
                ) : post.image_url ? (
                  <img src={post.image_url} alt={post.title} style={{ width: '100%', height: '240px', objectFit: 'cover' }} />
                ) : (
                  <div style={{ background: 'var(--color-primary)', height: '80px' }}></div>
                )}
                
                <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
                  <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>{post.title}</h3>
                  <p style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem', marginBottom: '1rem', flexGrow: 1 }}>
                    {post.content}
                  </p>
                  <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
                    {new Date(post.created_at).toLocaleDateString()}
                  </span>
                </div>
              </article>
            ))
          )}
        </div>
      )}
    </main>
  );
}
