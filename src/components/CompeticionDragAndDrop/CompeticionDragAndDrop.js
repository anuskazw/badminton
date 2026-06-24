import React, { useEffect, useState } from 'react';
import Column from './Column';
import './CompeticionDragAndDrop.css';
import { getCompetidores, actualizarPista } from '../../services/competidoresService';
import { useTemporada } from '../../context/TemporadaContext';

const CompeticionDragAndDrop = () => {
  const [elementos, setElementos] = useState([]);
  const [elementoActivo, setElementoActivo] = useState(null);
  const [tramosRepetidos, setTramosRepetidos] = useState({ t1: [], t2: [], t3: [] });
  const [error, setError] = useState(null);
  const { temporada } = useTemporada();

  useEffect(() => {
    if (!temporada) return;
    getCompetidores(temporada)
      .then(data => setElementos(data.map(e => ({ ...e, title: e.equipo }))))
      .catch(() => setError('No se pudo cargar los competidores. ¿Está el servidor en marcha?'));
  }, [temporada]);

  useEffect(() => {
    if (elementos.length) {
      setTramosRepetidos({
        t1: comprobarTramo(elementos, 0, 4),
        t2: comprobarTramo(elementos, 4, 8),
        t3: comprobarTramo(elementos, 8, 12),
      });
    }
  }, [elementos]); // eslint-disable-line react-hooks/exhaustive-deps

  const comprobarTramo = (elems, min, max) => {
    const tramo = elems.filter(e => +e.pista > min && +e.pista <= max);
    const jugadoresPorPista = {};
    tramo.forEach(elem => {
      elem.jugadores.forEach(({ nombre }) => {
        jugadoresPorPista[nombre] = jugadoresPorPista[nombre] || [];
        jugadoresPorPista[nombre].push(elem.pista);
      });
    });
    return Object.entries(jugadoresPorPista)
      .filter(([, pistas]) => pistas.length > 1)
      .map(([jugador, pistas]) => ({ jugador, pistas }));
  };

  const onDrop = (columna, position) => {
    if (elementoActivo === null || elementoActivo === undefined) return;

    const elementoAMover = elementos[elementoActivo];
    const restantes = elementos.filter((_, i) => i !== elementoActivo);
    restantes.splice(position, 0, { ...elementoAMover, pista: columna });

    setElementos(restantes);
    actualizarPista(elementoAMover.id, columna).catch(() =>
      setError('Error al guardar la asignación de pista.')
    );
  };

  const hayRepetidos = tramosRepetidos.t1.length || tramosRepetidos.t2.length || tramosRepetidos.t3.length;

  const FASES = [
    { pista: '1', title: 'PISTA 1 - 1ª FASE' },
    { pista: '2', title: 'PISTA 2 - 1ª FASE' },
    { pista: '3', title: 'PISTA 3 - 1ª FASE' },
    { pista: '4', title: 'PISTA 4 - 1ª FASE' },
    { pista: '5', title: 'PISTA 1 - 2ª FASE' },
    { pista: '6', title: 'PISTA 2 - 2ª FASE' },
    { pista: '7', title: 'PISTA 3 - 2ª FASE' },
    { pista: '8', title: 'PISTA 4 - 2ª FASE' },
    { pista: '9', title: 'PISTA 1 - 3ª FASE' },
    { pista: '10', title: 'PISTA 2 - 3ª FASE' },
    { pista: '11', title: 'PISTA 3 - 3ª FASE' },
    { pista: '12', title: 'PISTA 4 - 3ª FASE' },
  ];

  if (error) return <main><p className="error">{error}</p></main>;

  return (
    <main>
      {!!hayRepetidos && (
        <div className="alerta-repetidos">
          <strong>⚠ Jugadores repetidos en el mismo tramo:</strong>
          {[tramosRepetidos.t1, tramosRepetidos.t2, tramosRepetidos.t3].map((tramo, ti) =>
            tramo.map(({ jugador, pistas }) => (
              <p key={`${ti}-${jugador}`}>{jugador} — pistas {pistas.join(', ')} ({ti + 1}ª fase)</p>
            ))
          )}
        </div>
      )}
      <div className="contenedor-draggable">
        <Column
          pista="0"
          className="competidores"
          title={`Competidores (${elementos.length})`}
          elementos={elementos}
          setElementoActivo={setElementoActivo}
          onDrop={onDrop}
        />
        {FASES.map(({ pista, title }) => (
          <Column
            key={pista}
            pista={pista}
            className="contenedor"
            title={title}
            elementos={elementos}
            setElementoActivo={setElementoActivo}
            onDrop={onDrop}
          />
        ))}
      </div>
    </main>
  );
};

export default CompeticionDragAndDrop;
