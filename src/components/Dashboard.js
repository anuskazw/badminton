import React from 'react';
import { Link } from 'react-router-dom';
import { useTemporada } from '../context/TemporadaContext';

const NAV_ITEMS = [
  { to: '/ranking',       label: 'Ranking' },
  { to: '/equipos',       label: 'Equipos' },
  { to: '/jugadores',     label: 'Jugadores' },
  { to: '/jornadas',      label: 'Jornadas' },
  { to: '/form',          label: 'Introducir resultado' },
  { to: '/competicion-2', label: 'Competición' },
  { to: '/temporadas',    label: 'Temporadas' },
];

function Dashboard() {
  const { temporada } = useTemporada();

  return (
    <div className="dashboard-home">
      <header className="dashboard-main-header">
        <h2>Bienvenida a la Liga</h2>
        {temporada && (
          <span className="dashboard-badge">{temporada}</span>
        )}
      </header>

      <p className="dashboard-intro">
        Selecciona una sección en el menú lateral para gestionar la competición.
      </p>

      <div className="dashboard-cards">
        {NAV_ITEMS.map(({ to, label }) => (
          <Link key={to} to={to} className="dashboard-card">
            <span>{label}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default Dashboard;
