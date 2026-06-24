import React, { useEffect, useState } from 'react';
import { Link, useLocation, Outlet } from 'react-router-dom';
import './Dashboard.css';
import { useTemporada } from '../context/TemporadaContext';
import { getTemporadas } from '../services/temporadasService';

const NAV_ITEMS = [
  { to: '/dashboard',                label: 'Inicio' },
  { to: '/dashboard/ranking',        label: 'Ranking' },
  { to: '/dashboard/equipos',        label: 'Equipos' },
  { to: '/dashboard/jugadores',      label: 'Jugadores' },
  { to: '/dashboard/jornadas',       label: 'Jornadas' },
  { to: '/dashboard/form',           label: 'Introducir resultado' },
  { to: '/dashboard/competicion-2',  label: 'Competición' },
  { to: '/dashboard/temporadas',     label: 'Temporadas' },
];

function AppLayout() {
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
    <div className="dashboard-layout">
      <aside className="sidebar">
        <div className="sidebar-brand">
          <span className="sidebar-brand-icon">LB</span>
          <span className="sidebar-brand-text">Liga Bádminton</span>
        </div>

        <div className="sidebar-temporada">
          <label className="sidebar-temporada-label" htmlFor="temporada-sel">Temporada</label>
          <select
            id="temporada-sel"
            value={temporada ?? ''}
            onChange={e => setTemporada(e.target.value)}
          >
            {temporadas.map(t => (
              <option key={t.id} value={t.id}>{t.nombre}</option>
            ))}
          </select>
        </div>

        <nav className="sidebar-nav">
          {NAV_ITEMS.map(({ to, label }) => (
            <Link
              key={to}
              to={to}
              className={`sidebar-nav-item${location.pathname === to ? ' active' : ''}`}
            >
              {label}
            </Link>
          ))}
        </nav>

        <div className="sidebar-footer">
          <Link to="/" className="sidebar-logout">Cerrar sesión</Link>
        </div>
      </aside>

      <main className="dashboard-main">
        <Outlet />
      </main>
    </div>
  );
}

export default AppLayout;
