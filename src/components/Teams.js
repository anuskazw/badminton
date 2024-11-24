import React from 'react';
import { useLocation } from 'react-router-dom';
import { useState } from 'react';
import './Teams.css';


function Teams({ teams = [] }) {
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const playerId = queryParams.get('id');
    const [openTeamId, setOpenTeamId] = useState(null);

    const filteredPlayers = playerId ? teams.filter(p => p.id === parseInt(playerId)) : teams;

    // Modificación para mostrar hasta 3 jugadores por equipo
    const renderTeamPlayers = (team) => {
        return team?.jugadores?.map((player, index) => (
            <div key={index}>
                {player}
            </div>
        ));
    };

    return (
        <div>
            <h2>Lista de Equipos</h2>
            <ul className="player-list">
                {filteredPlayers.map(team => (
                    <li 
                        key={team.id} 
                        onClick={() => setOpenTeamId(openTeamId === team.id ? null : team.id)}
                        className="team-card"
                    >
                        <div className="team-item">
                            <div className="team-name">
                                {team.name}
                            </div>
                            <div className="team-points">
                                {team.total}
                            </div>
                        </div>
                        {openTeamId === team.id && (
                            <div className="team-modalities" style={{ marginTop: '10px' }}>
                                <strong>Jugadores del equipo:</strong>
                                {renderTeamPlayers(team)}
                            </div>
                        )}
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default Teams;
