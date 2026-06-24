import React, { useEffect, useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import './Teams.css';
import { getParticipantes } from '../services/participantesService';
import { useTemporada } from '../context/TemporadaContext';

function Teams() {
  const location = useLocation();
  const playerId = new URLSearchParams(location.search).get('id');
  const [competidores, setCompetidores] = useState([]);
  const [openModalities, setOpenModalities] = useState(new Set());
  const [error, setError] = useState(null);
  const { temporada } = useTemporada();

  useEffect(() => {
    if (!temporada) return;
    getParticipantes(temporada)
      .then(data => {
        setCompetidores(data);
        const modalities = [...new Set(data.map(c => c.modalidad))];
        setOpenModalities(new Set(modalities));
      })
      .catch(() => setError('No se pudo cargar los equipos. ¿Está el servidor en marcha?'));
  }, [temporada]);

  const lista = playerId
    ? competidores.filter(c => c.jugadores.some(j => String(j.id) === String(playerId)))
    : competidores;

  const porModalidad = Object.values(
    lista.reduce((acc, c) => {
      if (!acc[c.modalidad]) acc[c.modalidad] = { modalidad: c.modalidad, equipos: [] };
      acc[c.modalidad].equipos.push({ equipo: c.equipo, jugadores: c.jugadores });
      return acc;
    }, {})
  );

  const toggleModalidad = (nombre) => {
    setOpenModalities(prev => {
      const next = new Set(prev);
      next.has(nombre) ? next.delete(nombre) : next.add(nombre);
      return next;
    });
  };

  if (error) return (
    <div className="teams-page">
      <p className="teams-error">{error}</p>
    </div>
  );

  return (
    <div className="teams-page">
      <div className="teams-header">
        <Link to="/dashboard" className="teams-back">← Volver</Link>
        <h2>Equipos</h2>
      </div>

      <div className="teams-sections">
        {porModalidad.map(({ modalidad, equipos }) => {
          const isOpen = openModalities.has(modalidad);
          return (
            <section key={modalidad} className="modality-section">
              <button
                className={`modality-header${isOpen ? ' modality-header--open' : ''}`}
                onClick={() => toggleModalidad(modalidad)}
              >
                <span className="modality-title">{modalidad}</span>
                <span className="modality-meta">
                  <span className="modality-count">{equipos.length} equipos</span>
                  <span className="modality-chevron">{isOpen ? '▲' : '▼'}</span>
                </span>
              </button>

              {isOpen && (
                <div className="modality-body">
                  <div className="modality-grid">
                    {equipos.map(({ equipo, jugadores }) => (
                      <div key={equipo} className="team-card">
                        <div className="team-name">{equipo}</div>
                        <div className="team-players">
                          {jugadores.map(j => (
                            <span key={j.id} className="player-tag">{j.nombre}</span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </section>
          );
        })}
      </div>
    </div>
  );
}

export default Teams;
