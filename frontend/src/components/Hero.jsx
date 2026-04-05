import React from 'react';

export default function Hero() {
  return (
    <section style={{ 
      padding: '8rem 0 6rem 0', 
      textAlign: 'center',
      /* Añadimos un tinte translúcido blanco para que la letra negra siga siendo super fácil de leer pase lo que pase con la foto */
      backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.8), rgba(255, 255, 255, 0.9)), url(/fondo.jpg)',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      position: 'relative',
      overflow: 'hidden'
    }}>
      <div className="container" style={{ position: 'relative', zIndex: 10 }}>
        <h1 className="animate-fade-in" style={{ fontSize: '4rem', marginBottom: '1.5rem', color: '#0f172a' }}>
          El Futuro de la Educación <br/>
          <span style={{ color: 'var(--color-primary)' }}>Empieza Aquí</span>
        </h1>
        <p className="animate-fade-in animation-delay-100" style={{ fontSize: '1.25rem', color: 'var(--color-text-muted)', maxWidth: '600px', margin: '0 auto 3rem auto' }}>
          Formando líderes del mañana con excelencia académica, valores e innovación tecnológica en cada paso.
        </p>
        
        <div className="animate-fade-in animation-delay-200" style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
          <button className="btn-primary" style={{ padding: '1rem 2rem', fontSize: '1.1rem' }}>Conoce Más</button>
          <button className="btn-secondary" style={{ padding: '1rem 2rem', fontSize: '1.1rem' }}>Admisiones</button>
        </div>
      </div>
      
      {/* Decorative Blob */}
      <div style={{
        position: 'absolute',
        top: '20%',
        right: '10%',
        width: '400px',
        height: '400px',
        background: 'linear-gradient(135deg, rgba(59,130,246,0.2), rgba(244,63,94,0.2))',
        filter: 'blur(60px)',
        borderRadius: '50%',
        zIndex: 0
      }}></div>
    </section>
  );
}
