import React, { useState, useEffect } from 'react';
import './Jornadas.css';
import { useTemporada } from '../context/TemporadaContext';
import { getJornadas } from '../services/jornadasService';

const MODALIDADES = [
    'DOBLES FEMENINO',
    'DOBLES MASCULINO',
    'DOBLES MIXTO',
    'INDIVIDUAL FEMENINO',
    'INDIVIDUAL MASCULINO',
];

const capitalize = (s) => s.charAt(0) + s.slice(1).toLowerCase();

const Jornadas = () => {
    const { temporada } = useTemporada();
    const [modalidad, setModalidad] = useState('Todos');
    const [busqueda, setBusqueda] = useState('');
    const [jornadas, setJornadas] = useState([]);
    const [cargando, setCargando] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!temporada) return;
        setCargando(true);
        setError(null);
        getJornadas(temporada)
            .then(setJornadas)
            .catch(() => setError('No se pudieron cargar las jornadas. ¿Está el servidor en marcha?'))
            .finally(() => setCargando(false));
    }, [temporada]);

    const term = busqueda.trim().toLowerCase();

    const partidoContieneParticipante = (j) => {
        if (!term) return true;
        const nombres = [
            j.local.equipo,
            j.visitante.equipo,
            ...(j.local.jugadores ?? []).map(p => p.nombre ?? p),
            ...(j.visitante.jugadores ?? []).map(p => p.nombre ?? p),
        ];
        return nombres.some(n => String(n).toLowerCase().includes(term));
    };

    const jornadasFiltradas = jornadas.filter(
        j => (modalidad === 'Todos' || j.modalidad === modalidad) && partidoContieneParticipante(j)
    );

    const agrupadas = jornadasFiltradas.reduce((acc, j) => {
        if (!acc[j.jornada]) acc[j.jornada] = [];
        acc[j.jornada].push(j);
        return acc;
    }, {});

    const numeros = Object.keys(agrupadas).map(Number).sort((a, b) => a - b);

    return (
        <div className="jornadas-page">
            <h2 className="jornadas-titulo">Temporada {temporada}</h2>

            <div className="modalidad-filtro">
                <label>
                    <input type="radio" name="modalidad" value="Todos" onChange={() => setModalidad('Todos')} checked={modalidad === 'Todos'} />
                    Todas
                </label>
                {MODALIDADES.map(m => (
                    <label key={m}>
                        <input type="radio" name="modalidad" value={m} onChange={() => setModalidad(m)} checked={modalidad === m} />
                        {capitalize(m)}
                    </label>
                ))}
            </div>

            <div className="jornadas-busqueda">
                <input
                    type="search"
                    placeholder="Buscar participante..."
                    value={busqueda}
                    onChange={e => setBusqueda(e.target.value)}
                    className="jornadas-busqueda-input"
                />
            </div>

            {cargando && <p className="jornadas-mensaje">Cargando...</p>}
            {error && <p className="jornadas-mensaje jornadas-error">{error}</p>}
            {!cargando && !error && numeros.length === 0 && (
                <p className="jornadas-mensaje">No hay jornadas para esta temporada.</p>
            )}

            {numeros.map(num => (
                <div key={num} className="ronda">
                    <h4>Jornada {num}</h4>
                    {agrupadas[num].map(partido => {
                        const pL = partido.resultado?.puntos?.local;
                        const pV = partido.resultado?.puntos?.visitante;
                        const hayResultado = pL != null && pV != null;

                        return (
                            <div key={partido.id} className="partido">
                                <span className="modalidad-badge">
                                    {capitalize(partido.modalidad)}{partido.tipo ? ` · ${partido.tipo}` : ''}
                                </span>
                                <div className="partido-fila">
                                    <div className="equipo local">
                                        <div className="nombre-equipo">{partido.local.equipo}</div>
                                        {partido.resultado?.jugadores?.local?.map((j, i) => (
                                            <span key={i} className="jugador">{j}</span>
                                        ))}
                                    </div>
                                    <div className="marcador">
                                        {hayResultado ? (
                                            <>
                                                <span className={`puntos${pL > pV ? ' ganador' : ''}`}>{pL}</span>
                                                <span className="separador">-</span>
                                                <span className={`puntos${pV > pL ? ' ganador' : ''}`}>{pV}</span>
                                            </>
                                        ) : (
                                            <span className="pendiente">vs</span>
                                        )}
                                    </div>
                                    <div className="equipo visitante">
                                        <div className="nombre-equipo">{partido.visitante.equipo}</div>
                                        {partido.resultado?.jugadores?.visitante?.map((j, i) => (
                                            <span key={i} className="jugador">{j}</span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            ))}
        </div>
    );
};

export default Jornadas;
