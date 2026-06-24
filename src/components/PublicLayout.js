import React, { useEffect, useState } from 'react';
import { Link, useLocation, Outlet } from 'react-router-dom';
import './PublicLayout.css';
import { useTemporada } from '../context/TemporadaContext';
import { getTemporadas } from '../services/temporadasService';

const NAV_ITEMS = [
  { to: '/ranking',   label: 'Ranking' },
  { to: '/jugadores', label: 'Jugadores' },
  { to: '/jornadas',  label: 'Jornadas' },
];

function PublicLayout() {
  const { temporada, setTemporada } = useTemporada();
  const [temporadas, setTemporadas] = useState([]);
  const location = useLocation();

  useEffect(() => {
    getTemporadas().then(ts => {
      setTemporadas(ts);
      if (!temporada || !ts.find(t => t.id === temporada)) {
        const activa = ts.find(t => t.estado === 'INICIADA') ?? ts[ts.length - 1];
        if (activa) setTemporada(activa.id);
      }
    }).catch(() => {});
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="public-layout">
      <header className="public-header">
        <div className="public-header-inner">
          <Link to="/ranking" className="public-brand">
            <span className="public-brand-icon">LB</span>
            <span className="public-brand-text">Liga Bádminton</span>
          </Link>

          <nav className="public-nav">
            {NAV_ITEMS.map(({ to, label }) => (
              <Link
                key={to}
                to={to}
                className={`public-nav-link${location.pathname === to ? ' active' : ''}`}
              >
                {label}
              </Link>
            ))}
          </nav>

          <div className="public-header-actions">
            {temporadas.length > 0 && (
              <select
                className="public-temporada-select"
                value={temporada ?? ''}
                onChange={e => setTemporada(e.target.value)}
              >
                {temporadas.map(t => (
                  <option key={t.id} value={t.id}>{t.nombre}</option>
                ))}
              </select>
            )}
            <Link to="/" className="public-login-btn">Entrar</Link>
          </div>
        </div>
      </header>

      <main className="public-main">
        <Outlet />
      </main>
    </div>
  );
}

export default PublicLayout;
