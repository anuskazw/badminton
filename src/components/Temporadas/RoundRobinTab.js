import React, { useState } from 'react';
import './Temporadas.css';
import { generarCuadroRondas } from '../../utils/roundRobin';
import { addPartido, deleteJornada } from '../../services/jornadasService';

const MODALIDADES = [
  'DOBLES FEMENINO', 'DOBLES MASCULINO', 'DOBLES MIXTO',
  'INDIVIDUAL FEMENINO', 'INDIVIDUAL MASCULINO',
];
const MAX_JORNADAS = 14;

function jornadasEsperadas(n, idaYVuelta) {
  const rondas = n % 2 === 0 ? n - 1 : n;
  return idaYVuelta ? rondas * 2 : rondas;
}

export default function RoundRobinTab({ temporada, participantes, jornadas, idaYVuelta, onChangeIdaVuelta, onRefresh, soloLectura }) {
  const [generando, setGenerando] = useState(false);
  const [msg, setMsg] = useState(null);

  const jornadasPorModalidad = (mod) => jornadas.filter(j => j.modalidad === mod);

  const calcularModalidad = async (mod) => {
    const lista = [...participantes.filter(p => p.modalidad === mod && p.estado !== 'DESCALIFICADO')]
      .sort((a, b) => a.orden - b.orden);
    if (lista.length < 2) {
      setMsg({ tipo: 'error', texto: `${mod}: se necesitan al menos 2 participantes.` });
      return;
    }

    // Borrar jornadas existentes para esta modalidad
    const existentes = jornadasPorModalidad(mod);
    const tieneResultados = existentes.some(j => j.resultado !== null);
    if (tieneResultados) {
      setMsg({ tipo: 'error', texto: `${mod}: hay resultados registrados. No se puede regenerar.` });
      return;
    }
    await Promise.all(existentes.map(j => deleteJornada(j.id)));

    // Si ida y vuelta superaría el límite, se fuerza solo ida
    let usarIdaVuelta = idaYVuelta;
    const nEsperadas = jornadasEsperadas(lista.length, true);
    if (idaYVuelta && nEsperadas > MAX_JORNADAS) {
      usarIdaVuelta = false;
      setMsg({ tipo: 'aviso', texto: `${mod}: ida y vuelta generaría ${nEsperadas} jornadas (máx. ${MAX_JORNADAS}). Se ha generado solo ida.` });
    }

    const rondas = generarCuadroRondas(lista);
    const numRondas = rondas.length;

    // Aplanar rondas al formato que espera addPartido
    const partidos = [];
    for (const { ronda, partidos: ps } of rondas) {
      for (const { local, visitante } of ps) {
        partidos.push({
          jornada: ronda,
          tipo: 'IDA',
          local: { idParticipante: local.id, equipo: local.equipo },
          visitante: { idParticipante: visitante.id, equipo: visitante.equipo },
          resultado: null,
        });
      }
    }
    if (usarIdaVuelta) {
      const vuelta = partidos.map(p => ({
        ...p,
        jornada: p.jornada + numRondas,
        tipo: 'VUELTA',
        local: p.visitante,
        visitante: p.local,
      }));
      partidos.push(...vuelta);
    }

    for (const p of partidos) {
      await addPartido({ ...p, temporada, modalidad: mod });
    }
    if (!(!usarIdaVuelta && idaYVuelta && nEsperadas > MAX_JORNADAS)) {
      setMsg({ tipo: 'ok', texto: `${mod}: ${partidos.length} partidos generados.` });
    }
    onRefresh();
  };

  const calcularTodo = async () => {
    setGenerando(true); setMsg(null);
    const mods = MODALIDADES.filter(m => participantes.some(p => p.modalidad === m));
    for (const m of mods) await calcularModalidad(m);
    setGenerando(false);
  };

  const agruparPorJornada = (lista) => {
    const mapa = {};
    lista.forEach(j => {
      if (!mapa[j.jornada]) mapa[j.jornada] = [];
      mapa[j.jornada].push(j);
    });
    return mapa;
  };

  return (
    <div>
      {!soloLectura && (
        <div className="rr-toolbar">
          <label className="rr-toggle">
            <input
              type="checkbox"
              checked={idaYVuelta}
              onChange={e => onChangeIdaVuelta(e.target.checked)}
            />
            Ida y vuelta
          </label>
          <button className="btn btn-primary" onClick={calcularTodo} disabled={generando}>
            {generando ? 'Calculando...' : '⟳ Calcular Round Robin (todas las modalidades)'}
          </button>
        </div>
      )}

      {idaYVuelta && (() => {
        const avisos = MODALIDADES
          .map(mod => {
            const n = participantes.filter(p => p.modalidad === mod && p.estado !== 'DESCALIFICADO').length;
            if (n < 2) return null;
            const ne = jornadasEsperadas(n, true);
            return ne > MAX_JORNADAS ? `${mod}: ${ne} jornadas` : null;
          })
          .filter(Boolean);
        return avisos.length > 0 ? (
          <p className="error-msg" style={{ marginBottom: '.5rem' }}>
            ⚠ Con ida y vuelta estas modalidades superarían {MAX_JORNADAS} jornadas y se generarán solo ida: {avisos.join(' / ')}
          </p>
        ) : null;
      })()}

      {msg && <p className={msg.tipo === 'ok' ? 'success-msg' : 'error-msg'}>{msg.texto}</p>}

      {MODALIDADES.map(mod => {
        const lista = jornadasPorModalidad(mod);
        if (!lista.length) return null;
        const porJornada = agruparPorJornada(lista);
        return (
          <div key={mod} className="modalidad-block">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <h3>{mod}</h3>
              {!soloLectura && (
                <button
                  className="btn btn-secondary"
                  style={{ fontSize: '.78rem' }}
                  onClick={() => calcularModalidad(mod)}
                >
                  Regenerar
                </button>
              )}
            </div>
            {Object.entries(porJornada).map(([j, partidos]) => (
              <div key={j} className="jornada-block">
                <h4>Jornada {j}</h4>
                {partidos.map((p, i) => (
                  <div key={i} className="partido-row">
                    <span className="equipo-label">{p.local.equipo}</span>
                    <span className="vs">vs</span>
                    <span className="equipo-label">{p.visitante.equipo}</span>
                    <span className={`tipo-badge${p.tipo === 'VUELTA' ? ' vuelta' : ''}`}>{p.tipo}</span>
                  </div>
                ))}
              </div>
            ))}
          </div>
        );
      })}

      {!jornadas.length && <p className="rr-empty">No hay jornadas generadas todavía.</p>}
    </div>
  );
}
