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

    const [scoresLocal, setScoresLocal] = useState([0, 0, 0]);
    const [scoresVisitante, setScoresVisitante] = useState([0, 0, 0]);

    const [pointsLocal, setPointsLocal] = useState(0);
    const [pointsVisitante, setPointsVisitante] = useState(0);


    const handleTeamChange = (index, value) => {
        if (index === 0) {
            setTeamNameLocal(value);
            setPlayersTeamLocal(equipos[value]);
            if(equipos[value].length === 2){
                setCompetitorsLocal([equipos[value][0].PLAYER, equipos[value][1].PLAYER]);
            }
        }
        else {
            setTeamNameVisitante(value);
            setPlayersTeamVisitante(equipos[value]);
            if(equipos[value].length === 2){
                setCompetitorsVisitante([equipos[value][0].PLAYER, equipos[value][1].PLAYER]);
            }
        }
    };

    const handlePlayerChange = (isLocal, index, value) => {
        if (isLocal) {
            let array = [...competitorLocal];
            array[index] = value;
            setCompetitorsLocal(array);
        }
        else {
            let array = [...competitorVisitante];
            array[index] = value;
            setCompetitorsVisitante(array);
        }
    }


    const handleScoreChange = (isLocal, index, value) => {
        if (isLocal) {
            const newScores = [...scoresLocal];
            newScores[index] = value;
            setScoresLocal(newScores);
            calcularScore(newScores, scoresVisitante);
        } else {
            const newScores = [...scoresVisitante];
            newScores[index] = value;
            setScoresVisitante(newScores);
            calcularScore(scoresLocal, newScores);
        }
    };

    const calcularScore = (_scoresLocal, _scoresVisitante) => {
        let puntosLocal = 0;
        let puntosVisitante = 0;

        for (let i = 0; i < _scoresLocal.length; i++) {
            if (_scoresLocal[i] > _scoresVisitante[i]) {
                puntosLocal++;
            } else if (_scoresVisitante[i] > _scoresLocal[i]) {
                puntosVisitante++;
            }
        }
        setPointsLocal(puntosLocal);
        setPointsVisitante(puntosVisitante);
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!!teamNameLocal && !!teamNameVisitante && competitorLocal && competitorVisitante && scoresLocal && scoresVisitante && !!pointsLocal && !!pointsVisitante) {
            console.log({ teamNameLocal, teamNameVisitante, competitorLocal, competitorVisitante, scoresLocal, scoresVisitante, pointsLocal, pointsVisitante });
            // onSubmit({ teamNameLocal, teamNameVisitante, players, setScores });
        } else {
            alert('Por favor, rellene todos los campos.');
        }
    };

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
            {/* MODALIDAD */}
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
            {/* JORNADA */}
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
            {/* EQUIPOS LOCAL - VISITANTE */}
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
                        <label className="form-label">JUGADORES LOCAL:</label>
                        <div className='d-flex'>
                            <select
                                key={0}
                                onChange={(e) => handlePlayerChange(true, 0, e.target.value)}
                                required
                                value={competitorLocal[0]}
                                className="form-input jugador1"
                            >
                                <option value="">Seleccione un jugador</option>
                                {playersTeamLocal.map((jugador, index) => (
                                    <option key={jugador.ID} value={jugador.PLAYER}>{jugador.PLAYER}</option>
                                ))}
                            </select>
                            <select
                                key={0}
                                onChange={(e) => handlePlayerChange(true, 1, e.target.value)}
                                required
                                value={competitorLocal[1]}
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
                        <label className="form-label">EQUIPO VISITANTE:</label>
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
                        <label className="form-label">JUGADORES VISITANTE:</label>
                        <div className='d-flex'>
                            <select
                                key={0}
                                onChange={(e) => handlePlayerChange(false, 0, e.target.value)}
                                required
                                value={competitorVisitante[0]}
                                className="form-input jugador1"
                            >
                                <option value="">Seleccione un jugador</option>
                                {playersTeamVisitante.map((jugador, index) => (
                                    <option key={jugador.ID} value={jugador.PLAYER}>{jugador.PLAYER}</option>
                                ))}
                            </select>
                            <select
                                key={0}
                                onChange={(e) => handlePlayerChange(false, 1, e.target.value)}
                                required
                                value={competitorVisitante[1]}
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
            {/* PUNTUACION SETS */}
            <div className='sets' >
                <div key={'local_0'} className={'header_local'} style={{ gridRow: 0 }}>
                    <input
                        type="number"
                        min={0}
                        required
                        disabled
                        className="form-input"
                        value={pointsLocal}
                    />
                </div>
                <div key={'vs'} className={'header_vs'}>
                    VS
                </div>
                <div key={'visitante_0'} className={'header_visitante'} style={{ gridRow: 0 }}>
                    <input
                        type="number"
                        min={0}
                        required
                        disabled
                        className="form-input"
                        value={pointsVisitante}
                    />
                </div>
                {scoresLocal.map((score, index) => (
                    <div key={'local_' + index} className={'sets_local'} style={{ gridRow: index + 2 }}>
                        <input
                            type="number"
                            onChange={(e) => handleScoreChange(true, index, e.target.value)}
                            placeholder={`Set ${index + 1}`}
                            required
                            className="form-input"
                        />
                    </div>
                ))}
                {scoresVisitante.map((score, index) => (
                    <div key={'visitante_' + index} className={'sets_visitante'} style={{ gridRow: index + 2 }}>
                        <input
                            type="number"
                            onChange={(e) => handleScoreChange(false, index, e.target.value)}
                            placeholder={`Set ${index + 1}`}
                            required
                            className="form-input"
                        />
                    </div>
                ))}
            </div>
            <button type="submit" className="form-button" onClick={handleSubmit}>Enviar</button>
        </form>
    );
}

export default SetForm;
