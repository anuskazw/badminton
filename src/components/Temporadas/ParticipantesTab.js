import React, { useState } from 'react';
import './Temporadas.css';
import ModalEquipo from './ModalEquipo';
import {
  addParticipante, updateParticipante, deleteParticipante,
} from '../../services/participantesService';

const MODALIDADES = [
  'DOBLES FEMENINO', 'DOBLES MASCULINO', 'DOBLES MIXTO',
  'INDIVIDUAL FEMENINO', 'INDIVIDUAL MASCULINO',
];
const MODALIDADES_DOBLES = new Set(['DOBLES FEMENINO', 'DOBLES MASCULINO', 'DOBLES MIXTO']);

export default function ParticipantesTab({ temporada, participantes, onRefresh, soloLectura }) {
  const [open, setOpen] = useState({});
  const [modalMod, setModalMod] = useState(null);
  const [editando, setEditando] = useState(null);
  const [drag, setDrag] = useState(null);
  const [dragOver, setDragOver] = useState(null);

  const deModalidad = (mod) =>
    [...participantes.filter(p => p.modalidad === mod)].sort((a, b) => a.orden - b.orden);

  const guardarEquipo = async (datos) => {
    const mod = modalMod || editando?.modalidad;
    if (editando) {
      await updateParticipante(editando.id, { equipo: datos.equipo, jugadores: datos.jugadores });
    } else {
      const lista = deModalidad(mod);
      await addParticipante({
        temporada,
        modalidad: mod,
        equipo: datos.equipo,
        jugadores: datos.jugadores,
        orden: lista.length + 1,
        estado: 'ACTIVO',
      });
    }
    setModalMod(null); setEditando(null);
    onRefresh();
  };

  const borrar = async (p) => {
    if (!window.confirm(`¿Quitar "${p.equipo}" de ${p.modalidad}?`)) return;
    await deleteParticipante(p.id);
    onRefresh();
  };

  const descalificar = async (p) => {
    const nuevoEstado = p.estado === 'DESCALIFICADO' ? 'ACTIVO' : 'DESCALIFICADO';
    const msg = nuevoEstado === 'DESCALIFICADO'
      ? `¿Descalificar "${p.equipo}"? Sus puntos contarán como 0 en el ranking.`
      : `¿Revertir descalificación de "${p.equipo}"?`;
    if (!window.confirm(msg)) return;
    await updateParticipante(p.id, { estado: nuevoEstado });
    onRefresh();
  };

  // Drag & drop para reordenar
  const onDragStart = (p) => setDrag(p);
  const onDragOver = (e, p) => { e.preventDefault(); setDragOver(p?.id); };
  const onDrop = async (e, target) => {
    e.preventDefault();
    if (!drag || drag.id === target.id) { setDrag(null); setDragOver(null); return; }
    const lista = deModalidad(drag.modalidad);
    const from = lista.findIndex(p => p.id === drag.id);
    const to = lista.findIndex(p => p.id === target.id);
    const reord = [...lista];
    reord.splice(from, 1);
    reord.splice(to, 0, drag);
    await Promise.all(reord.map((p, i) => updateParticipante(p.id, { orden: i + 1 })));
    setDrag(null); setDragOver(null);
    onRefresh();
  };

  return (
    <div>
      {MODALIDADES.map(mod => {
        const lista = deModalidad(mod);
        const abierto = open[mod] !== false;
        return (
          <div key={mod} className="modalidad-section">
            <div className="modalidad-header" onClick={() => setOpen(o => ({ ...o, [mod]: !abierto }))}>
              <h4>{mod}</h4>
              <span className="count">
                {lista.length} {MODALIDADES_DOBLES.has(mod) ? 'equipos' : 'jugadores'} {abierto ? '▲' : '▼'}
              </span>
            </div>
            {abierto && (
              <div className="modalidad-body">
                {lista.map(p => (
                  <div
                    key={p.id}
                    className={`equipo-card${drag?.id === p.id ? ' dragging' : ''}${dragOver === p.id ? ' drag-over' : ''}`}
                    draggable={!soloLectura}
                    onDragStart={() => onDragStart(p)}
                    onDragOver={e => onDragOver(e, p)}
                    onDrop={e => onDrop(e, p)}
                    onDragEnd={() => { setDrag(null); setDragOver(null); }}
                  >
                    {!soloLectura && <span className="drag-handle">⠿</span>}
                    <div className="equipo-info">
                      <div>
                        <span className="equipo-orden">#{p.orden}</span>
                        <span className="equipo-nombre">{p.equipo}</span>
                        {p.estado === 'DESCALIFICADO' && <span className="badge-descalificado">DESCALIFICADO</span>}
                      </div>
                      {MODALIDADES_DOBLES.has(p.modalidad) && (
                        <div className="jugadores-list">
                          {p.jugadores?.map((j, i) => (
                            <span key={i} className={`jugador-tag${j.rol === 'suplente' ? ' suplente' : ''}${p.estado === 'DESCALIFICADO' ? ' descalificado' : ''}`}>
                              {j.nombre} {j.rol === 'suplente' ? '(S)' : ''}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                    {!soloLectura && (
                      <div className="equipo-actions">
                        <button onClick={() => setEditando(p)}>Editar</button>
                        <button
                          onClick={() => descalificar(p)}
                          className={p.estado === 'DESCALIFICADO' ? '' : 'danger'}
                        >
                          {p.estado === 'DESCALIFICADO' ? 'Reactivar' : 'Descalificar'}
                        </button>
                        <button className="danger" onClick={() => borrar(p)}>✕</button>
                      </div>
                    )}
                  </div>
                ))}
                {!soloLectura && (
                  <button
                    className="btn btn-secondary"
                    style={{ marginTop: '.5rem', fontSize: '.82rem' }}
                    onClick={() => setModalMod(mod)}
                  >
                    {MODALIDADES_DOBLES.has(mod) ? '+ Añadir equipo' : '+ Añadir jugador'}
                  </button>
                )}
                {!lista.length && (
                  <p className="rr-empty">
                    Sin {MODALIDADES_DOBLES.has(mod) ? 'equipos' : 'jugadores'} para esta modalidad.
                  </p>
                )}
              </div>
            )}
          </div>
        );
      })}

      {(modalMod || editando) && (
        <ModalEquipo
          modalidad={modalMod || editando?.modalidad}
          equipo={editando}
          onGuardar={guardarEquipo}
          onCerrar={() => { setModalMod(null); setEditando(null); }}
        />
      )}
    </div>
  );
}
