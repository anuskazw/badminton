import React from 'react';
import { useLocation } from 'react-router-dom';
import { useState } from 'react';
import './Player.css';


function Player({ players = [
    { id: 1, name: 'Jugador 1', lastName: 'Apellido', total: 45, modalidades: ['Individual Masculino', 'Dobles Mixto'] },
    { id: 2, name: 'Jugador 2', lastName: 'Apellido', total: 35, modalidades: ['Individual Femenino'] },
    { id: 3, name: 'Jugador 3', lastName: 'Apellido', total: 55, modalidades: ['Dobles Masculino', 'Dobles Mixto'] }
] }) {
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const playerId = queryParams.get('id');
    const [openPlayerId, setOpenPlayerId] = useState(null);

    const filteredPlayers = playerId ? players.filter(p => p.id === parseInt(playerId)) : players;

    return (
        <div>
            <h2>Lista de Jugadores</h2>
            <ul className="player-list">
                {filteredPlayers.map(player => (
                    <li 
                        key={player.id} 
                        onClick={() => setOpenPlayerId(openPlayerId === player.id ? null : player.id)}
                        className="player-card"
                    >
                        <div className="player-item">
                            <div className="player-name">
                                {player.name} {player.lastName}
                            </div>
                            <div className="player-points">
                                {player.total}
                            </div>
                        </div>
                        {openPlayerId === player.id && (
                            <div className="player-modalities" style={{ marginTop: '10px' }}>
                                <strong>Modalidades:</strong>
                                <ul>
                                    {(player.modalidades || []).map((modalidad, index) => (
                                        <li key={index}>{modalidad}</li>
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
