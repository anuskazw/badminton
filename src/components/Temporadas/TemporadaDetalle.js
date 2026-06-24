import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './Temporadas.css';
import { getTemporada, updateTemporada, deleteTemporada } from '../../services/temporadasService';
import { getParticipantes } from '../../services/participantesService';
import { getJornadas } from '../../services/jornadasService';
import ParticipantesTab from './ParticipantesTab';
import RoundRobinTab from './RoundRobinTab';
import DescargaTab from './DescargaTab';

const MAX_JUG = { 'DOBLES MIXTO': 4, default: 3 };

function validar(participantes, jornadas) {
  const errs = [];

  if (!jornadas.length)
    errs.push('No hay jornadas generadas. Ejecuta el cálculo de Round Robin primero.');

  const modalidades = [...new Set(participantes.map(p => p.modalidad))];
  modalidades.forEach(mod => {
    const activos = participantes.filter(p => p.modalidad === mod && p.estado !== 'DESCALIFICADO');
    if (activos.length < 2)
      errs.push(`${mod}: se necesitan al menos 2 participantes (hay ${activos.length}).`);

    if (mod.includes('DOBLES')) {
      activos.forEach(p => {
        const max = MAX_JUG[mod] ?? MAX_JUG.default;
        if (p.jugadores.length > max)
          errs.push(`${mod} — "${p.equipo}": máximo ${max} jugadores (tiene ${p.jugadores.length}).`);
        if (p.jugadores.length < 2)
          errs.push(`${mod} — "${p.equipo}": mínimo 2 jugadores.`);
        if (mod === 'DOBLES MIXTO') {
          const tits = p.jugadores.filter(j => j.rol === 'titular');
          const hT = tits.filter(j => j.genero === 'M').length;
          const mT = tits.filter(j => j.genero === 'F').length;
          if (hT !== 1 || mT !== 1)
            errs.push(`Dobles Mixto — "${p.equipo}": los titulares deben ser 1H y 1M.`);
        }
      });
    }

    // R4: jugador duplicado
    if (mod.includes('DOBLES')) {
      const conteo = {};
      activos.forEach(p => p.jugadores.forEach(j => {
        const key = j.id ?? j.ID;
        conteo[key] = (conteo[key] || []);
        conteo[key].push(p.equipo);
      }));
      Object.entries(conteo).forEach(([, equipos]) => {
        if (equipos.length > 1)
          errs.push(`${mod}: jugador aparece en más de un equipo (${equipos.join(', ')}).`);
      });
    }
  });

  return errs;
}

export default function TemporadaDetalle() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [temporada, setTemporada] = useState(null);
  const [participantes, setParticipantes] = useState([]);
  const [jornadas, setJornadas] = useState([]);
  const [tab, setTab] = useState('participantes');
  const [erroresValidacion, setErroresValidacion] = useState([]);
  const [editNombre, setEditNombre] = useState(false);
  const [nuevoNombre, setNuevoNombre] = useState('');

  const cargar = useCallback(async () => {
    const [t, p, j] = await Promise.all([
      getTemporada(id),
      getParticipantes(id),
      getJornadas(id),
    ]);
    setTemporada(t);
    setParticipantes(p);
    setJornadas(j);
    setNuevoNombre(t.nombre);
  }, [id]);

  useEffect(() => { cargar(); }, [cargar]);

  const cambiarEstado = async (nuevoEstado) => {
    if (nuevoEstado === 'INICIADA') {
      const errs = validar(participantes, jornadas);
      if (errs.length) { setErroresValidacion(errs); return; }
    }
    setErroresValidacion([]);
    await updateTemporada(id, { estado: nuevoEstado });
    cargar();
  };

  const guardarNombre = async () => {
    if (!nuevoNombre.trim()) return;
    await updateTemporada(id, { nombre: nuevoNombre.trim() });
    setEditNombre(false); cargar();
  };

  const toggleIdaVuelta = async (val) => {
    await updateTemporada(id, { idaYVuelta: val });
    cargar();
  };

  const borrar = async () => {
    if (!window.confirm(`¿Borrar temporada "${temporada.nombre}"? Esta acción no se puede deshacer.`)) return;
    await deleteTemporada(id);
    navigate('/dashboard/temporadas');
  };

  if (!temporada) return <div className="page"><p>Cargando...</p></div>;

  const esPendiente = temporada.estado === 'PENDIENTE';
  const esIniciada = temporada.estado === 'INICIADA';
  const esFinalizada = temporada.estado === 'FINALIZADA';
  const soloLectura = esFinalizada;

  return (
    <div className="page">
      <div className="page-header">
        <button className="back-btn" onClick={() => navigate('/dashboard/temporadas')}>← Temporadas</button>

        {editNombre && esPendiente ? (
          <div style={{ display: 'flex', gap: '.5rem', alignItems: 'center', flex: 1 }}>
            <input
              value={nuevoNombre}
              onChange={e => setNuevoNombre(e.target.value)}
              style={{ fontSize: '1.2rem', fontWeight: 700, padding: '4px 8px', border: '1px solid #ccc', borderRadius: 6 }}
            />
            <button className="btn btn-primary" onClick={guardarNombre}>Guardar</button>
            <button className="btn btn-secondary" onClick={() => setEditNombre(false)}>Cancelar</button>
          </div>
        ) : (
          <h2 style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '.6rem' }}>
            {temporada.nombre}
            {esPendiente && (
              <button className="btn btn-secondary" style={{ fontSize: '.75rem' }} onClick={() => setEditNombre(true)}>
                ✎ Editar
              </button>
            )}
            <span className={`badge-estado badge-${temporada.estado}`}>{temporada.estado}</span>
          </h2>
        )}

        <div className="detalle-actions">
          {esPendiente && (
            <>
              <button className="btn btn-success" onClick={() => cambiarEstado('INICIADA')}>
                ▶ Iniciar temporada
              </button>
              <button className="btn btn-danger" onClick={borrar}>Borrar</button>
            </>
          )}
          {esIniciada && (
            <button className="btn btn-warning" onClick={() => cambiarEstado('FINALIZADA')}>
              ■ Finalizar temporada
            </button>
          )}
          {esFinalizada && (
            <span style={{ fontSize: '.85rem', color: '#888' }}>Temporada cerrada</span>
          )}
        </div>
      </div>

      {erroresValidacion.length > 0 && (
        <div className="validaciones-panel">
          <h4>⚠ No se puede iniciar — revisa lo siguiente:</h4>
          <ul>{erroresValidacion.map((e, i) => <li key={i}>{e}</li>)}</ul>
        </div>
      )}

      <div className="tabs">
        {[
          { key: 'participantes', label: `Participantes (${participantes.length})` },
          { key: 'jornadas', label: `Jornadas (${jornadas.length})` },
          { key: 'descarga', label: 'Descargar' },
        ].map(t => (
          <button
            key={t.key}
            className={`tab-btn${tab === t.key ? ' active' : ''}`}
            onClick={() => setTab(t.key)}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === 'participantes' && (
        <ParticipantesTab
          temporada={id}
          participantes={participantes}
          onRefresh={cargar}
          soloLectura={soloLectura}
        />
      )}
      {tab === 'jornadas' && (
        <RoundRobinTab
          temporada={id}
          participantes={participantes}
          jornadas={jornadas}
          idaYVuelta={temporada.idaYVuelta}
          onChangeIdaVuelta={toggleIdaVuelta}
          onRefresh={cargar}
          soloLectura={soloLectura || esIniciada}
        />
      )}
      {tab === 'descarga' && (
        <DescargaTab temporada={id} jornadas={jornadas} participantes={participantes} onRefresh={cargar} />
      )}
    </div>
  );
}
