import React, { useState } from 'react';
import './Jornadas.css';

const Jornadas = () => {

    const [competidor, setCompetidor] = useState('');

    const [modalidad, setModalidad ] = useState('Todos');

    const rondas = [
        {
            titulo: 'Ronda 1',
            jugados: 9,
            competidores: [
                {
                    local: {
                        nombre: 'Equipo B',
                        jugadores: ['Marta Rodríguez', 'Mónica Castrillejo'],
                        sets: [21, 10, 21],
                        modalidad: 'Dobles Femenino',
                        puntos: 2
                    },
                    visitante: {
                        nombre: 'Equipo A',
                        jugadores: ['Anuska Caballero', 'Mónica Rodríguez'],
                        sets: [18, 21, 13],
                        modalidad: 'Dobles Femenino',
                        puntos: 1
                    }
                },
                {
                    local: {
                        nombre: 'Equipo B',
                        jugadores: ['Ander Falquina', 'Javier Sordo'],
                        sets: [21, 10, 21],
                        modalidad: 'Dobles Masculino',
                        puntos: 2
                    },
                    visitante: {
                        nombre: 'Equipo A',
                        jugadores: ['Raul Bak', 'Simon Bak'],
                        sets: [18, 21, 13],
                        modalidad: 'Dobles Masculino',
                        puntos: 1
                    }
                },
                {
                    local: {
                        nombre: 'Equipo B',
                        jugadores: ['Marta Rodríguez', 'Mónica Castrillejo'],
                        sets: [21, 10, 21],
                        modalidad: 'Dobles Femenino',
                        puntos: 2
                    },
                    visitante: {
                        nombre: 'Equipo A',
                        jugadores: ['Anuska Caballero', 'Mónica Rodríguez'],
                        sets: [18, 21, 13],
                        modalidad: 'Dobles Femenino',
                        puntos: 1
                    }
                }
            ]
        }
    ]



    return (
        <div className="jornadas-container">
            <div className="modalidad-filtro">
                <label>
                    <input type="radio" name="modalidad" value="Todos" onClick={() => setModalidad('Todos')} checked={modalidad === 'Todos'} />
                    Todas las modalidades
                </label>
                <label>
                    <input type="radio" name="modalidad" value="Dobles Femenino" onClick={() => setModalidad('Dobles Femenino')} checked={modalidad === 'Dobles Femenino'} />
                    Dobles Femenino
                </label>
                <label>
                    <input type="radio" name="modalidad" value="Dobles Masculino" onClick={() => setModalidad('Dobles Masculino')} checked={modalidad === 'Dobles Masculino'} />
                    Dobles Masculino
                </label>
                <label>
                    <input type="radio" name="modalidad" value="Dobles Mixto" onClick={() => setModalidad('Dobles Mixto')} checked={modalidad === 'Dobles Mixto'} />
                    Dobles Mixto
                </label>
                <label>
                    <input type="radio" name="modalidad" value="Individual Femenino" onClick={() => setModalidad('Individual Femenino')} checked={modalidad === 'Individual Femenino'} />
                    Individual Femenino
                </label>
                <label>
                    <input type="radio" name="modalidad" value="Individual Masculino" onClick={() => setModalidad('Individual Masculino')} checked={modalidad === 'Individual Masculino'} />
                    Individual Masculino
                </label>

            </div>
            {rondas.map((ronda, index) => (
                <div key={index} className="ronda">
                    <h4 className="">{ronda.titulo}</h4>
                    {ronda.competidores.filter(c => modalidad === 'Todos' || c.local.modalidad === modalidad).map((c) => (
                        <div>
                            <div className='contenedor competidor' onClick={() => setCompetidor(c)}>
                                <div className="contenedor participante">{c.local.nombre}</div>
                                <div className="contenedor set">{c.local.puntos}</div>
                                <div className="contenedor set">{c.visitante.puntos}</div>
                                <div className="contenedor participante">{c.visitante.nombre}</div>
                            </div>
                            <div className='contenedor competidor'>
                            {
                                c.local.jugadores && c.local.jugadores.map((jugador)=> (
                                    <p className='participante'>{jugador}</p>
                                ))
                            }
                            {
                                c.local.jugadores && c.visitante.jugadores.map((jugador)=> (
                                    <p className='participante'>{jugador}</p>
                                ))
                            }
                            </div>
                        </div>

                    ))}
                </div>
            ))}
        </div>
    );
};

export default Jornadas; 