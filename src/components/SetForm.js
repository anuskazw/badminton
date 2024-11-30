import React, { useState } from 'react';
import './SetForm.css';
import EQUIPOS from './EQUIPOS_MODALIDAD.json'


function SetForm({ onSubmit }) {

    const [modalidad, setModalidad] = useState('');
    const [equipos, setEquipos] = useState([]);

    const [teamNameLocal, setTeamNameLocal] = useState('');
    const [teamNameVisitante, setTeamNameVisitante] = useState('');

    const [playersTeamLocal, setPlayersTeamLocal] = useState([]);
    const [playersTeamVisitante, setPlayersTeamVisitante] = useState([]);

    const [competitorLocal, setCompetitorsLocal] = useState(['', '']);
    const [competitorVisitante, setCompetitorsVisitante] = useState(['', '']);

    const [setScoresLocal, setSetScoresLocal] = useState([0, 0, 0]);
    const [setScoresVisitante, setSetScoresVisitante] = useState([0, 0, 0]);

    const handleTeamChange = (index, value) => {
        if (index === 0) {
            setTeamNameLocal(value);
            setPlayersTeamLocal(equipos[value]);
        }
        else {
            setTeamNameVisitante(value);
            setPlayersTeamVisitante(equipos[value]);
        }
    };

    const handlePlayerChange = () => {

    }


    // const handleScoreChange = (index, value) => {
    //     const newScores = [...setScores];
    //     newScores[index] = value;
    //     setSetScores(newScores);
    // };

    // const handleSubmit = (e) => {
    //     e.preventDefault();
    //     onSubmit({ teamName, players, setScores });
    //     setTeamName('');
    //     setPlayers(['', '']);
    //     setSetScores(['', '']);
    // };
    // const EQUIPOS_POR_MODALIDAD = [];
    const extractEquiposModalidad = (modalidad) => {
        setEquipos(EQUIPOS[modalidad]);
        setTeamNameLocal(EQUIPOS[modalidad]);
        setTeamNameVisitante(EQUIPOS[modalidad]);
    }


    const MODALIDADES = [];
    const extractEquipos = () => {
        Object.keys(EQUIPOS).forEach(modalidad => {
            MODALIDADES.push(modalidad);
        });
    }
    extractEquipos();

    const changeModalidad = (e) => {
        setModalidad(e.target.value);
        if (!e.target.value) {
            setEquipos([]);
        } else {
            extractEquiposModalidad(e.target.value)
        }
    }

    return (
        <form className="set-form">
            <div className="form-group">
                <label className="form-label">MODALIDAD:</label>
                <select
                    onChange={(e) => changeModalidad(e)}
                    required
                    className="form-input"
                >
                    <option value="">Seleccione modalidad</option>
                    {MODALIDADES.map((modalidad) => (
                        <option key={modalidad} value={modalidad}>{modalidad}</option>
                    ))}
                </select>
            </div>
            <div className="form-group">
                <label className="form-label">JORNADA:</label>
                <select
                    required
                    className="form-input"
                >
                    <option value="">Nº JORNADA</option>
                    {Array.from({ length: 14 }, (v, i) => (
                        <option key={i} value={i + 1}>{`${i + 1}ª JORNADA`}</option>
                    ))}
                </select>
            </div>
            <div className='d-flex'>

                {/* LOCAL */}

                <div className='local'>
                    <div className="form-group">
                        <label className="form-label">EQUIPO LOCAL:</label>
                        <select
                            key={0}
                            onChange={(e) => handleTeamChange(0, e.target.value, true)}
                            required
                            className="form-input"
                        >
                            <option value="">Seleccione un equipo</option>
                            {Object.keys(equipos).map((equipo, index) => (
                                <option key={index} value={equipos[index]}>{equipo}</option>
                            ))}
                        </select>
                    </div>
                    <div className="form-group">
                        <label className="form-label">JUGADORES:</label>
                        <div className='d-flex'>
                            <select
                                key={0}
                                onChange={(e) => handlePlayerChange(0, e.target.value)}
                                required
                                className="form-input jugador1"
                            >
                                <option value="">Seleccione un jugador</option>
                                {playersTeamLocal.map((jugador, index) => (
                                    <option key={jugador.ID} value={jugador.PLAYER}>{jugador.PLAYER}</option>
                                ))}
                            </select>
                            <select
                                key={0}
                                onChange={(e) => handlePlayerChange(0, e.target.value)}
                                required
                                className="form-input jugador2"
                            >
                                <option value="">Seleccione un jugador</option>
                                {playersTeamLocal.map((jugador, index) => (
                                    <option key={jugador.ID} value={jugador.PLAYER}>{jugador.PLAYER}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>

                {/* VISITANTE */}

                <div className='visitante'>
                    <div className="form-group">
                        <label className="form-label">EQUIPO LOCAL:</label>
                        <select
                            key={0}
                            onChange={(e) => handleTeamChange(1, e.target.value)}
                            required
                            className="form-input"
                        >
                            <option value="">Seleccione un equipo</option>
                            {Object.keys(equipos).map((equipo, index) => (
                                <option key={index} value={equipos[index]}>{equipo}</option>
                            ))}
                        </select>
                    </div>
                    <div className="form-group">
                        <label className="form-label">JUGADORES:</label>
                        <div className='d-flex'>
                            <select
                                key={0}
                                onChange={(e) => handlePlayerChange(0, e.target.value)}
                                required
                                className="form-input jugador1"
                            >
                                <option value="">Seleccione un jugador</option>
                                {playersTeamVisitante.map((jugador, index) => (
                                    <option key={jugador.ID} value={jugador.PLAYER}>{jugador.PLAYER}</option>
                                ))}
                            </select>
                            <select
                                key={0}
                                onChange={(e) => handlePlayerChange(0, e.target.value)}
                                required
                                className="form-input jugador2"
                            >
                                <option value="">Seleccione un jugador</option>
                                {playersTeamVisitante.map((jugador, index) => (
                                    <option key={jugador.ID} value={jugador.PLAYER}>{jugador.PLAYER}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>
            </div>
            <div className="form-group">
                <label className="form-label">Sets:</label>
                {setScoresLocal.map((score, index) => (
                    <input
                        key={index}
                        type="number"
                        value={score}
                        min={0}
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
