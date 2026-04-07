import React, { useState, useEffect, useContext } from 'react';
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import format from 'date-fns/format';
import parse from 'date-fns/parse';
import startOfWeek from 'date-fns/startOfWeek';
import getDay from 'date-fns/getDay';
import es from 'date-fns/locale/es';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { AuthContext } from '../context/AuthContext';
import { X, Upload, Video, Calendar as CalendarIcon, Clock, PlusCircle } from 'lucide-react';

const locales = { 'es': es };
const localizer = dateFnsLocalizer({ format, parse, startOfWeek, getDay, locales });

export default function CalendarScreen() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const { token } = useContext(AuthContext);

  // Modals state
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  
  // Add Event Form State
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [videoUrl, setVideoUrl] = useState('');
  const [uploading, setUploading] = useState(false);

  const fetchEvents = async () => {
    try {
      const res = await fetch('/api/events/');
      if (res.ok) {
        const data = await res.json();
        const formattedEvents = data.map(ev => ({
          ...ev,
          start: new Date(ev.start_date),
          end: new Date(ev.end_date)
        }));
        setEvents(formattedEvents);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
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

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    setUploading(true);
    try {
      let imageUrl = null;
      if (imageFile) {
        imageUrl = await handleUploadFile(imageFile);
      }

      const res = await fetch('/api/events/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          title,
          description,
          start_date: new Date(startDate).toISOString(),
          end_date: new Date(endDate).toISOString(),
          image_url: imageUrl,
          video_url: videoUrl || null
        })
      });
      
      if (res.ok) {
        setShowAddModal(false);
        setTitle('');
        setDescription('');
        setStartDate('');
        setEndDate('');
        setImageFile(null);
        setVideoUrl('');
        fetchEvents();
      }
    } catch (err) {
      console.error(err);
      alert('Error subiendo evento');
    } finally {
      setUploading(false);
    }
  };

  const commonModalStyle = {
    position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
    background: 'rgba(0,0,0,0.5)', zIndex: 100, display: 'flex',
    alignItems: 'center', justifyContent: 'center', padding: '1rem'
  };

  const getYouTubeId = (url) => {
    if (!url) return null;
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  return (
    <main className="container" style={{ padding: '4rem 0', display: 'flex', flexDirection: 'column' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '2.5rem' }}>Calendario Escolar</h2>
        {token && (
          <button 
            className="btn-primary" 
            onClick={() => setShowAddModal(true)}
            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
          >
            <PlusCircle size={20} /> Añadir Evento
          </button>
        )}
      </div>

      <div style={{ height: '70vh', background: 'white', padding: '1.5rem', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-sm)' }}>
        <Calendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          culture="es"
          onSelectEvent={(event) => setSelectedEvent(event)}
          messages={{ 
             today: 'Hoy', previous: 'Ant.', next: 'Sig.', month: 'Mes', week: 'Semana', day: 'Día', agenda: 'Agenda' 
          }}
          style={{ height: '100%', fontFamily: 'var(--font-body)' }}
        />
      </div>

      {/* VER DETALLE MODAL */}
      {selectedEvent && (
        <div style={commonModalStyle} onClick={(e) => { if (e.target === e.currentTarget) setSelectedEvent(null); }}>
          <div className="glass animate-fade-in" style={{ background: 'white', maxWidth: '600px', width: '100%', borderRadius: 'var(--radius-lg)', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
            <div style={{ position: 'relative' }}>
               {selectedEvent.video_url && getYouTubeId(selectedEvent.video_url) ? (
                 <div style={{ position: 'relative', paddingBottom: '56.25%', height: 0 }}>
                  <iframe 
                    src={`https://www.youtube.com/embed/${getYouTubeId(selectedEvent.video_url)}`}
                    style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 'none' }}
                    allowFullScreen
                  />
                 </div>
              ) : selectedEvent.image_url ? (
                <img src={selectedEvent.image_url} alt={selectedEvent.title} style={{ width: '100%', height: '300px', objectFit: 'cover' }} />
              ) : (
                <div style={{ background: 'var(--color-primary)', height: '150px' }}></div>
              )}
              <button 
                onClick={() => setSelectedEvent(null)}
                style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'rgba(0,0,0,0.5)', color: 'white', border: 'none', borderRadius: '50%', padding: '0.5rem', cursor: 'pointer' }}
              >
                <X size={24} />
              </button>
            </div>
            
            <div style={{ padding: '2rem' }}>
              <h3 style={{ fontSize: '1.8rem', marginBottom: '1rem' }}>{selectedEvent.title}</h3>
              
              <div style={{ display: 'flex', gap: '1.5rem', marginBottom: '1.5rem', color: 'var(--color-text-muted)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                   <CalendarIcon size={18} /> {format(selectedEvent.start, 'dd MMM yyyy')}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                   <Clock size={18} /> {format(selectedEvent.start, 'HH:mm')} - {format(selectedEvent.end, 'HH:mm')}
                </div>
              </div>
              
              <p style={{ lineHeight: '1.6', color: 'var(--color-text)' }}>{selectedEvent.description}</p>
            </div>
          </div>
        </div>
      )}

      {/* AÑADIR MODAL */}
      {showAddModal && token && (
        <div style={commonModalStyle} onClick={(e) => { if (e.target === e.currentTarget) setShowAddModal(false); }}>
          <div className="glass animate-fade-in" style={{ background: 'white', maxWidth: '600px', width: '100%', borderRadius: 'var(--radius-lg)', padding: '2rem' }}>
             <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <h3>Crear Nuevo Evento</h3>
                <button onClick={() => setShowAddModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><X size={24} /></button>
             </div>
             
             <form onSubmit={handleAddSubmit}>
                <div className="grid md:grid-cols-2" style={{ gap: '1.5rem', marginBottom: '1.5rem' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', gridColumn: '1 / -1' }}>
                    <label>Título del Evento</label>
                    <input required value={title} onChange={e => setTitle(e.target.value)} style={{ padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--color-border)' }} />
                  </div>
                  
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <label>Fecha y Hora Inicio</label>
                    <input type="datetime-local" required value={startDate} onChange={e => setStartDate(e.target.value)} style={{ padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--color-border)' }} />
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <label>Fecha y Hora Fin</label>
                    <input type="datetime-local" required value={endDate} onChange={e => setEndDate(e.target.value)} style={{ padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--color-border)' }} />
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', gridRow: 'span 2' }}>
                    <label>Descripción</label>
                    <textarea required rows={5} value={description} onChange={e => setDescription(e.target.value)} style={{ padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--color-border)', fontFamily: 'inherit' }}></textarea>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Upload size={16}/> Foto de Cartel (Opcional)</label>
                    <input type="file" accept="image/*" onChange={e => setImageFile(e.target.files[0])} style={{ padding: '0.5rem', borderRadius: '8px', border: '1px dashed var(--color-border)' }} />
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Video size={16}/> URL Video de YouTube (Opcional)</label>
                    <input value={videoUrl} onChange={e => setVideoUrl(e.target.value)} style={{ padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--color-border)' }} placeholder="https://..." />
                  </div>
                </div>

                <button type="submit" className="btn-primary" disabled={uploading} style={{ width: '100%', opacity: uploading ? 0.7 : 1 }}>
                  {uploading ? 'Creando evento...' : 'Guardar Evento en el Calendario'}
                </button>
             </form>
          </div>
        </div>
      )}
    </main>
  );
}
