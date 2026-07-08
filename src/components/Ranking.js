import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './Ranking.css';
import { getRankings } from '../services/rankingsService';
import api from '../services/api';
import { useTemporada } from '../context/TemporadaContext';

const TIPOS = {
  'Global': 'RANKING',
  'Dobles Femenino': 'RANK FEM DOB',
  'Dobles Masculino': 'RANK MASC DOB',
  'Dobles Mixto': 'RANK MIX DOB',
  'Individual Femenino': 'RANK FEM IND',
  'Individual Masculino': 'RANK MASC IND',
};

const CAMPOS_EXCLUIDOS = new Set(['id', 'tipo', 'ID', 'temporada', 'Temporada']);

const MODALIDAD_POR_TIPO = {
  'RANK FEM DOB': 'DOBLES FEMENINO',
  'RANK MASC DOB': 'DOBLES MASCULINO',
  'RANK MIX DOB': 'DOBLES MIXTO',
};

function Ranking() {
  const [rankings, setRankings] = useState([]);
  const [competidores, setCompetidores] = useState([]);
  const [openSection, setOpenSection] = useState(null);
  const [busqueda, setBusqueda] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { temporada } = useTemporada();
  const jugadoresPath = location.pathname.startsWith('/dashboard') ? '/dashboard/jugadores' : '/jugadores';

  useEffect(() => {
    if (!temporada) return;
    getRankings(temporada)
      .then(setRankings)
      .catch(() => setError('No se pudo cargar el ranking. ¿Está el servidor en marcha?'));
    api.get(`competidores?temporada=${encodeURIComponent(temporada)}`)
      .then(setCompetidores)
      .catch(() => setCompetidores([]));
  }, [temporada]);

  // en los rankings de dobles cada fila es un EQUIPO, no un jugador: para que
  // la búsqueda encuentre a una jugadora hay que mirar en el roster de esa
  // modalidad concreta (el mismo nombre de equipo existe, con roster distinto,
  // en Femenino/Masculino/Mixto)
  const equipoTieneJugador = (modalidad, nombreEquipo, term) =>
    competidores.some(c =>
      c.modalidad === modalidad &&
      (c.equipo === nombreEquipo || nombreEquipo.includes(c.equipo) || c.equipo.includes(nombreEquipo)) &&
      c.jugadores.some(j => j.PLAYER.toLowerCase().includes(term))
    );

  const toggleSection = (section) => {
    setOpenSection(openSection === section ? null : section);
  };

  const filtrar = (entries, tipo) => {
    const term = busqueda.trim().toLowerCase();
    if (!term) return entries;
    const modalidad = MODALIDAD_POR_TIPO[tipo];
    return entries.filter(e => {
      const coincideDirecto = Object.values(e).some(v => String(v).toLowerCase().includes(term));
      if (coincideDirecto) return true;
      return e.EQUIPO && modalidad ? equipoTieneJugador(modalidad, e.EQUIPO, term) : false;
    });
  };

  const getEntradasPorTipo = (tipo) => filtrar(rankings.filter(r => r.tipo === tipo), tipo);

  const renderTable = (entries) => {
    if (!entries.length) return <p className="ranking-empty">No hay resultados</p>;
    const headers = Object.keys(entries[0]).filter(h => !CAMPOS_EXCLUIDOS.has(h));
    return (
      <table>
        <thead className='sticky'>
          <tr>{headers.map(h => <th key={h}>{h}</th>)}</tr>
        </thead>
        <tbody>
          {entries.map((entry, i) => (
            <tr
              key={i}
              className={entry.JUGADOR ? 'clicable' : ''}
              onClick={entry.JUGADOR ? () => navigate(`${jugadoresPath}?id=${entry.ID}`) : undefined}
            >
              {headers.map(h => (
                <td className={h === 'Total' ? 'bold' : ''} key={h}>{entry[h]}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    );
  };

  const buscando = busqueda.trim().length > 0;

  if (error) return <div className="ranking-page"><p className="msg-error">{error}</p></div>;

  return (
    <div className="ranking-page">
      <h2>Ranking de Jugadores</h2>

      <div className="ranking-search">
        <input
          type="search"
          placeholder="Buscar jugador..."
          value={busqueda}
          onChange={e => setBusqueda(e.target.value)}
          className="ranking-search-input"
        />
      </div>

      {Object.entries(TIPOS).map(([label, tipo]) => {
        const isOpen = buscando || openSection === tipo;
        return (
          <div key={tipo}>
            <button className="ranking-section-btn" onClick={() => toggleSection(tipo)}>
              {label}
            </button>
            {isOpen && (
              <div className="ranking-list">
                {renderTable(getEntradasPorTipo(tipo))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

export default Ranking;
