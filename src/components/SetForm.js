import React, { useState } from 'react';
import './SetForm.css';


function SetForm({ onSubmit }) {
    const [teamName, setTeamName] = useState('');
    const [players, setPlayers] = useState(['', '']);
    const [setScores, setSetScores] = useState(['', '']);

    const handlePlayerChange = (index, value) => {
        const newPlayers = [...players];
        newPlayers[index] = value;
        setPlayers(newPlayers);
    };

    const handleScoreChange = (index, value) => {
        const newScores = [...setScores];
        newScores[index] = value;
        setSetScores(newScores);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit({ teamName, players, setScores });
        setTeamName('');
        setPlayers(['', '']);
        setSetScores(['', '']);
    };

    return (
        <form onSubmit={handleSubmit} className="set-form">
            <div className="form-group">
                <label className="form-label">Nombre del equipo:</label>
                <input
                    type="text"
                    value={teamName}
                    onChange={(e) => setTeamName(e.target.value)}
                    required
                    className="form-input"
                />
            </div>
            <div className="form-group">
                <label className="form-label">Jugadores:</label>
                {players.map((player, index) => (
                    <input
                        key={index}
                        type="text"
                        value={player}
                        onChange={(e) => handlePlayerChange(index, e.target.value)}
                        placeholder={`Jugador ${index + 1}`}
                        required
                        className="form-input"
                    />
                ))}
            </div>
            <div className="form-group">
                <label className="form-label">Sets:</label>
                {setScores.map((score, index) => (
                    <input
                        key={index}
                        type="number"
                        value={score}
                        onChange={(e) => handleScoreChange(index, e.target.value)}
                        placeholder={`Set ${index + 1}`}
                        required
                        className="form-input"
                    />
                ))}
            </div>
            <button type="submit" className="form-button">Enviar</button>
        </form>
    );
}

export default SetForm;
