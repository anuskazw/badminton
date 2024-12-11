import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Ranking.css';
import RANKINGS from './ficheros/RANKINGS.json';

function Ranking() {
    const [openSection, setOpenSection] = useState(null);
    const navigate = useNavigate();

    const rankings = {
        'Global': RANKINGS.RANKING,
        'Dobles Femenino': RANKINGS['RANK FEM DOB'],
        'Dobles Masculino': RANKINGS['RANK MASC DOB'],
        'Dobles Mixto': RANKINGS['RANK MIX DOB'],
        'Individual Femenino': RANKINGS['RANK FEM IND'],
        'Individual Masculino': RANKINGS['RANK MASC IND'],
    };

    const toggleSection = (section) => {
        setOpenSection(openSection === section ? null : section);
    };

    const handlePlayerClick = (id) => {
        navigate(`/jugadores?id=${id}`);
    };

    const renderTable = (players) => {
        const headers = Object.keys(players[0]);
        return (
            <table>
                <thead className='sticky'>
                    <tr>
                        {headers.map((header) => (
                            header !== 'ID' && <th key={header}>{header}</th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {players.map((player, index) => (
                        <tr key={index} onClick={() => handlePlayerClick(player['ID'])}>
                            {headers.map((header) => (
                                header !== 'ID' && 
                                <td className={`${header === 'Total' ? 'bold':''}`} key={header}>{player[header]}</td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        );
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