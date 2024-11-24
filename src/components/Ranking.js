import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Ranking.css';

function Ranking() {
    const [openSection, setOpenSection] = useState(null);
    const navigate = useNavigate();

    const toggleSection = (section) => {
        setOpenSection(openSection === section ? null : section);
    };

    const handlePlayerClick = (id) => {
        navigate(`/jugadores?id=${id}`);
    };

    const renderTable = (players) => (
        <table>
            <thead>
                <tr>
                    <th>Jugador/Equipo</th>
                    <th>J1</th>
                    <th>J2</th>
                    <th>J3</th>
                    {/* Añade más columnas según sea necesario */}
                    <th>Total</th>
                </tr>
            </thead>
            <tbody>
                {players.map((player, index) => (
                    <tr key={index}>
                        <td onClick={() => handlePlayerClick(player.id)} style={{ cursor: 'pointer' }}>
                            {player.name}
                        </td>
                        <td>{player.j1}</td>
                        <td>{player.j2}</td>
                        <td>{player.j3}</td>
                        {/* Añade más celdas según sea necesario */}
                        <td>{player.total}</td>
                    </tr>
                ))}
            </tbody>
        </table>
    );

    const globalRanking = [
        { id: 1, name: 'Jugador 1', j1: 10, j2: 15, j3: 20, total: 45 },
        // Añade más jugadores
    ];

    const rankings = {
        'Global': globalRanking,
        'Dobles Femenino': globalRanking,
        'Dobles Masculino': globalRanking,
        'Dobles Mixto': globalRanking,
        'Individual Femenino': globalRanking,
        'Individual Masculino': globalRanking,
    };

    return (
        <div className="ranking-container">
            <h2>Ranking de Jugadores</h2>
            {Object.keys(rankings).map((key) => (
                <div key={key}>
                    <button onClick={() => toggleSection(key)}>
                        {key}
                    </button>
                    {openSection === key && (
                        <div className="ranking-list">
                            {renderTable(rankings[key])}
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
}

export default Ranking; 