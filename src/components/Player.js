import React from 'react';
import { useLocation } from 'react-router-dom';
import { useState } from 'react';
import './Player.css';
import RANKINGS from './RANKINGS.json';
import JUGADORES from './ID_JUGADORES.json';


function Player({ players }) {

    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const playerId = queryParams.get('id');
    const [openPlayerId, setOpenPlayerId] = useState(null);

    const getFilteredPlayers = (playerId) => {
        const filtered = playerId ? (JUGADORES || []).filter(p => p.ID === parseInt(playerId)) : JUGADORES;
        filtered.sort((a, b) => b.total - a.total);
        return filtered;
    };

    const assignModalities = (jugador, playerId) => {
        let modalidades = [];
        Object.keys(RANKINGS).forEach(key => {
            RANKINGS[key].forEach(element => {
                if (element.ID === parseInt(playerId)) {
                    if (key === 'RANKING') {
                        jugador.total = element.Total;
                    } else {
                        modalidades.push({ mod: key, value: element.Total });
                    }
                }
            });
        });
        jugador.modalidades = modalidades;
    };

    let filteredPlayers = getFilteredPlayers(playerId);
    filteredPlayers.forEach(jugador => assignModalities(jugador, jugador.ID));

    const getText = (key) => {
        switch (key) {
            case 'RANK FEM IND':
                return 'Individual femenino: ';
            case 'RANK MASC IND':
                return 'Individual masculino: ';
            case 'RANK FEM DOB':
                return 'Dobles femenino: ';
            case 'RANK MASC DOB':
                return 'Dobles masculino: ';
            case 'RANK MIX DOB':
                return 'Dobles mixto: ';
            default:
                return '';
        }
    }

    return (
        <div>
            <h2>{playerId ? 'Jugador ' : 'Lista de Jugadores'}</h2>

            <ul className="player-list">
                {filteredPlayers.map((player) => (
                    <li
                        id={player.id}
                        key={'p_' + player.id}
                        className="player-card"
                    >
                        <div className={`player-item ${openPlayerId === player?.ID ? 'selected' : ''}`}
                            onClick={() => setOpenPlayerId(openPlayerId === player.ID ? null : player.ID)}>
                            <div className="player-name">
                                {player.PLAYER}
                            </div>
                            <div className="player-points">
                                {player.total}
                            </div>
                        </div>
                        {openPlayerId === player.ID && (
                            <div className="player-modalities">
                                <p><strong>MODALIDADES:</strong></p>
                                <ul>
                                    {(player.modalidades || []).map((modalidad, index) => (
                                        <li id={'m_' + index} key={'m_' + index} className='player-modalidad'>
                                            <span>{getText(modalidad.mod)}</span>
                                            <span className="player-points">{modalidad.value}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                        {playerId && openPlayerId === player.ID && (
                            <div className="player-competiciones">
                                <p><strong>Competiciones:</strong></p>
                            </div>
                        )}
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default Player;
