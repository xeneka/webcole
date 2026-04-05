import React from 'react';
import Hero from '../components/Hero';
import PopupNotification from '../components/PopupNotification';

export default function Home() {
  return (
    <main>
      <PopupNotification />
      <Hero />
      <section className="container" style={{ padding: '4rem 0' }}>
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <h2 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>Nuestra Filosofía</h2>
          <p style={{ color: 'var(--color-text-muted)' }}>Educación integral para los retos del siglo XXI.</p>
        </div>
        
        <div className="grid md:grid-cols-3">
          {[
            { title: "Innovación", desc: "Laboratorios de última generación y aulas interactivas." },
            { title: "Valores", desc: "Desarrollo humano, empatía y responsabilidad social." },
            { title: "Excelencia", desc: "Profesores premiados y programas académicos top." }
          ].map((item, i) => (
            <div key={i} className="glass" style={{ padding: '2rem', borderRadius: 'var(--radius-lg)', textAlign: 'center' }}>
              <div style={{ 
                width: '64px', height: '64px', 
                background: '#eff6ff', 
                borderRadius: '50%',
                margin: '0 auto 1.5rem auto',
                display: 'flex', alignItems: 'center', justifyContent: 'center'
              }}>
                🌟
              </div>
              <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>{item.title}</h3>
              <p style={{ color: 'var(--color-text-muted)' }}>{item.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
