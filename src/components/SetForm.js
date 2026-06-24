import React, { useState, useEffect } from 'react';
import './SetForm.css';
import { getParticipantes } from '../services/participantesService';
import { addPartido, buscarPartido, updatePartido } from '../services/jornadasService';
import { useTemporada } from '../context/TemporadaContext';

function SetForm() {
  const [competidores, setCompetidores] = useState([]);
  const [modalidad, setModalidad] = useState('');
  const [equiposDisponibles, setEquiposDisponibles] = useState([]);

  const [equipoLocal, setEquipoLocal] = useState('');
  const [equipoVisitante, setEquipoVisitante] = useState('');
  const [jugadoresLocal, setJugadoresLocal] = useState([]);
  const [jugadoresVisitante, setJugadoresVisitante] = useState([]);
  const [competidorLocal, setCompetidorLocal] = useState(['', '']);
  const [competidorVisitante, setCompetidorVisitante] = useState(['', '']);
  const [scoresLocal, setScoresLocal] = useState([0, 0, 0]);
  const [scoresVisitante, setScoresVisitante] = useState([0, 0, 0]);
  const [puntosLocal, setPuntosLocal] = useState(0);
  const [puntosVisitante, setPuntosVisitante] = useState(0);
  const [jornada, setJornada] = useState('');
  const [feedback, setFeedback] = useState(null);
  const { temporada } = useTemporada();

  useEffect(() => {
    if (!temporada) return;
    getParticipantes(temporada)
      .then(setCompetidores)
      .catch(() => setFeedback({ tipo: 'error', msg: 'No se pudo cargar los equipos.' }));
  }, [temporada]);

  useEffect(() => {
    setEquiposDisponibles(competidores.filter(c => c.modalidad === modalidad));
  }, [competidores, modalidad]);

  const seleccionarEquipo = (esLocal, idEquipo) => {
    const equipo = equiposDisponibles.find(e => e.id === idEquipo);
    if (!equipo) return;
    if (esLocal) {
      setEquipoLocal(idEquipo);
      setJugadoresLocal(equipo.jugadores);
      setCompetidorLocal(equipo.jugadores.slice(0, 2).map(j => j.nombre));
    } else {
      setEquipoVisitante(idEquipo);
      setJugadoresVisitante(equipo.jugadores);
      setCompetidorVisitante(equipo.jugadores.slice(0, 2).map(j => j.nombre));
    }
  };

  const cambiarJugador = (esLocal, index, valor) => {
    if (esLocal) {
      const arr = [...competidorLocal]; arr[index] = valor; setCompetidorLocal(arr);
    } else {
      const arr = [...competidorVisitante]; arr[index] = valor; setCompetidorVisitante(arr);
    }
  };

  const calcularPuntos = (locales, visitantes) => {
    let pL = 0, pV = 0;
    locales.forEach((s, i) => {
      if (+s > +visitantes[i]) pL++;
      else if (+visitantes[i] > +s) pV++;
    });
    setPuntosLocal(pL);
    setPuntosVisitante(pV);
  };

  const cambiarScore = (esLocal, index, valor) => {
    if (esLocal) {
      const arr = [...scoresLocal]; arr[index] = valor; setScoresLocal(arr);
      calcularPuntos(arr, scoresVisitante);
    } else {
      const arr = [...scoresVisitante]; arr[index] = valor; setScoresVisitante(arr);
      calcularPuntos(scoresLocal, arr);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!modalidad || !equipoLocal || !equipoVisitante || !jornada) {
      setFeedback({ tipo: 'error', msg: 'Por favor, rellene todos los campos obligatorios.' });
      return;
    }

    const equipoLocalObj     = equiposDisponibles.find(eq => eq.id === equipoLocal);
    const equipoVisitanteObj = equiposDisponibles.find(eq => eq.id === equipoVisitante);

    const resultado = {
      sets: scoresLocal.map((s, i) => ({ local: +s, visitante: +scoresVisitante[i] })),
      puntos: { local: puntosLocal, visitante: puntosVisitante },
      ganador: puntosLocal > puntosVisitante
        ? equipoLocalObj?.equipo
        : puntosVisitante > puntosLocal
          ? equipoVisitanteObj?.equipo
          : null,
      jugadores: { local: competidorLocal, visitante: competidorVisitante },
    };

    try {
      const existentes = await buscarPartido(temporada, modalidad, parseInt(jornada));
      const partido = existentes.find(p =>
        (p.local?.idParticipante === equipoLocal     && p.visitante?.idParticipante === equipoVisitante) ||
        (p.local?.idParticipante === equipoVisitante && p.visitante?.idParticipante === equipoLocal)
      );

      if (partido) {
        await updatePartido(partido.id, { resultado });
      } else {
        await addPartido({
          temporada,
          modalidad,
          jornada: parseInt(jornada),
          tipo: 'AMISTOSO',
          local:     { idParticipante: equipoLocal,     equipo: equipoLocalObj?.equipo },
          visitante: { idParticipante: equipoVisitante, equipo: equipoVisitanteObj?.equipo },
          resultado,
        });
      }
      setFeedback({ tipo: 'ok', msg: 'Partido guardado correctamente.' });
    } catch {
      setFeedback({ tipo: 'error', msg: 'Error al guardar. ¿Está el servidor en marcha?' });
    }
  };

  const modalidades = [...new Set(competidores.map(c => c.modalidad))];

  return (
    <div className="set-form-page">
    <form className="set-form" onSubmit={handleSubmit}>
      {feedback && <p className={`feedback feedback-${feedback.tipo}`}>{feedback.msg}</p>}

      <div className="form-group">
        <label className="form-label">MODALIDAD:</label>
        <select className="form-input" value={modalidad} onChange={e => { setModalidad(e.target.value); setFeedback(null); }} required>
          <option value="">Seleccione modalidad</option>
          {modalidades.map(m => <option key={m} value={m}>{m}</option>)}
        </select>
      </div>

      <div className="form-group">
        <label className="form-label">JORNADA:</label>
        <select className="form-input" value={jornada} onChange={e => setJornada(e.target.value)} required>
          <option value="">Nº JORNADA</option>
          {Array.from({ length: 14 }, (_, i) => (
            <option key={i} value={i + 1}>{`${i + 1}ª JORNADA`}</option>
          ))}
        </select>
      </div>

      <div className='d-flex'>
        {[true, false].map(esLocal => {
          const equipoId = esLocal ? equipoLocal : equipoVisitante;
          const jugadores = esLocal ? jugadoresLocal : jugadoresVisitante;
          const competidor = esLocal ? competidorLocal : competidorVisitante;
          const label = esLocal ? 'LOCAL' : 'VISITANTE';
          return (
            <div key={label} className={esLocal ? 'local' : 'visitante'}>
              <div className="form-group">
                <label className="form-label">EQUIPO {label}:</label>
                <select className="form-input" value={equipoId} onChange={e => seleccionarEquipo(esLocal, e.target.value)} required>
                  <option value="">Seleccione un equipo</option>
                  {equiposDisponibles.map(eq => (
                    <option key={eq.id} value={eq.id}>{eq.equipo}</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">JUGADORES {label}:</label>
                <div className='d-flex'>
                  {[0, 1].map(idx => (
                    <select key={idx} className="form-input" value={competidor[idx]} onChange={e => cambiarJugador(esLocal, idx, e.target.value)}>
                      <option value="">Jugador {idx + 1}</option>
                      {jugadores.map(j => <option key={j.id} value={j.nombre}>{j.nombre}</option>)}
                    </select>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className='sets'>
        <div className='header_local'><input type="number" disabled className="form-input" value={puntosLocal} /></div>
        <div className='header_vs'>VS</div>
        <div className='header_visitante'><input type="number" disabled className="form-input" value={puntosVisitante} /></div>
        {scoresLocal.map((_, i) => (
          <React.Fragment key={i}>
            <div className='sets_local' style={{ gridRow: i + 2 }}>
              <input type="number" min={0} className="form-input" placeholder={`Set ${i + 1}`} onChange={e => cambiarScore(true, i, e.target.value)} />
            </div>
            <div className='sets_visitante' style={{ gridRow: i + 2 }}>
              <input type="number" min={0} className="form-input" placeholder={`Set ${i + 1}`} onChange={e => cambiarScore(false, i, e.target.value)} />
            </div>
          </React.Fragment>
        ))}
      </div>

      <button type="submit" className="form-button">Enviar</button>
    </form>
    </div>
  );
}

export default SetForm;
