import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import './Player.css';
import { getJugadores } from '../services/jugadoresService';
import { getRankings } from '../services/rankingsService';
import { useTemporada } from '../context/TemporadaContext';

const LABEL_MODALIDAD = {
  'RANK FEM IND': 'Individual femenino',
  'RANK MASC IND': 'Individual masculino',
  'RANK FEM DOB': 'Dobles femenino',
  'RANK MASC DOB': 'Dobles masculino',
  'RANK MIX DOB': 'Dobles mixto',
};

function Player() {
  const location = useLocation();
  const playerId = new URLSearchParams(location.search).get('id');

  const [jugadores, setJugadores] = useState([]);
  const [rankings, setRankings] = useState([]);
  const [openPlayerId, setOpenPlayerId] = useState(null);
  const [error, setError] = useState(null);
  const { temporada } = useTemporada();

  useEffect(() => {
    if (!temporada) return;
    Promise.all([getJugadores(), getRankings(temporada)])
      .then(([j, r]) => { setJugadores(j); setRankings(r); })
      .catch(() => setError('No se pudo cargar los datos. ¿Está el servidor en marcha?'));
  }, [temporada]);

  const getTotal = (idJugador) => {
    const entry = rankings.find(r => r.tipo === 'RANKING' && r.ID === +idJugador);
    return entry?.Total ?? 0;
  };

  const getModalidades = (idJugador) =>
    rankings
      .filter(r => r.tipo !== 'RANKING' && r.ID === +idJugador)
      .map(r => ({ mod: r.tipo, value: r.Total }));

  const lista = playerId
    ? jugadores.filter(j => String(j.id) === String(playerId))
    : [...jugadores].sort((a, b) => getTotal(+b.id) - getTotal(+a.id));

  if (error) return <div className="player-page"><p className="msg-error">{error}</p></div>;

  return (
    <div className="player-page">
      <h2>{playerId ? 'Jugador' : 'Lista de Jugadores'}</h2>
      <ul className="player-list">
        {lista.map((player) => (
          <li key={player.id} className="player-card">
            <div
              className={`player-item ${openPlayerId === player.id ? 'selected' : ''}`}
              onClick={() => setOpenPlayerId(openPlayerId === player.id ? null : player.id)}
            >
              <div className="player-name">{player.nombre}</div>
              <div className="player-points">{getTotal(player.id)}</div>
            </div>
            {openPlayerId === player.id && (
              <div className="player-modalities">
                <p><strong>MODALIDADES:</strong></p>
                <ul>
                  {getModalidades(player.id).map((m, i) => (
                    <li key={i} className='player-modalidad'>
                      <span>{LABEL_MODALIDAD[m.mod] ?? m.mod}: </span>
                      <span className="player-points">{m.value}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Player;
