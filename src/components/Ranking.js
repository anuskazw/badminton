import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Ranking.css';
import { getRankings } from '../services/rankingsService';
import { useTemporada } from '../context/TemporadaContext';

const TIPOS = {
  'Global': 'RANKING',
  'Dobles Femenino': 'RANK FEM DOB',
  'Dobles Masculino': 'RANK MASC DOB',
  'Dobles Mixto': 'RANK MIX DOB',
  'Individual Femenino': 'RANK FEM IND',
  'Individual Masculino': 'RANK MASC IND',
};

const CAMPOS_EXCLUIDOS = new Set(['id', 'tipo', 'ID']);

function Ranking() {
  const [rankings, setRankings] = useState([]);
  const [openSection, setOpenSection] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { temporada } = useTemporada();

  useEffect(() => {
    if (!temporada) return;
    getRankings(temporada)
      .then(setRankings)
      .catch(() => setError('No se pudo cargar el ranking. ¿Está el servidor en marcha?'));
  }, [temporada]);

  const toggleSection = (section) => {
    setOpenSection(openSection === section ? null : section);
  };

  const getEntradasPorTipo = (tipo) => rankings.filter(r => r.tipo === tipo);

  const renderTable = (entries) => {
    if (!entries.length) return null;
    const headers = Object.keys(entries[0]).filter(h => !CAMPOS_EXCLUIDOS.has(h));
    return (
      <table>
        <thead className='sticky'>
          <tr>{headers.map(h => <th key={h}>{h}</th>)}</tr>
        </thead>
        <tbody>
          {entries.map((entry, i) => (
            <tr key={i} onClick={() => navigate(`/jugadores?id=${entry.ID}`)}>
              {headers.map(h => (
                <td className={h === 'Total' ? 'bold' : ''} key={h}>{entry[h]}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    );
  };

  if (error) return <div className="ranking-page"><p className="msg-error">{error}</p></div>;

  return (
    <div className="ranking-page">
      <h2>Ranking de Jugadores</h2>
      {Object.entries(TIPOS).map(([label, tipo]) => (
        <div key={tipo}>
          <button className="ranking-section-btn" onClick={() => toggleSection(tipo)}>{label}</button>
          {openSection === tipo && (
            <div className="ranking-list">
              {renderTable(getEntradasPorTipo(tipo))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

export default Ranking;
