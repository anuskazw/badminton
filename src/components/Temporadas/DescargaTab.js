import React, { useState } from 'react';
import './Temporadas.css';
import { descargarCSV } from '../../utils/download';

export default function DescargaTab({ temporada, jornadas }) {
  const [modFiltro, setModFiltro] = useState('TODAS');
  const [jornadaFiltro, setJornadaFiltro] = useState('TODAS');

  const modalidades = ['TODAS', ...new Set(jornadas.map(j => j.modalidad))];
  const numJornadas = jornadas.length ? Math.max(...jornadas.map(j => j.jornada)) : 0;

  const filtradas = jornadas.filter(j =>
    (modFiltro === 'TODAS' || j.modalidad === modFiltro) &&
    (jornadaFiltro === 'TODAS' || j.jornada === parseInt(jornadaFiltro))
  );

  const descargar = () => {
    const filas = filtradas.map(j => ({
      temporada: j.temporada,
      jornada: j.jornada,
      tipo: j.tipo,
      modalidad: j.modalidad,
      local: j.local.equipo,
      visitante: j.visitante.equipo,
      set1_local: j.resultado?.sets?.[0]?.local ?? '',
      set1_visitante: j.resultado?.sets?.[0]?.visitante ?? '',
      set2_local: j.resultado?.sets?.[1]?.local ?? '',
      set2_visitante: j.resultado?.sets?.[1]?.visitante ?? '',
      set3_local: j.resultado?.sets?.[2]?.local ?? '',
      set3_visitante: j.resultado?.sets?.[2]?.visitante ?? '',
      ganador: j.resultado?.ganador ?? '',
    }));
    const mod = modFiltro === 'TODAS' ? 'todas' : modFiltro.toLowerCase().replace(/ /g, '-');
    const jorn = jornadaFiltro === 'TODAS' ? 'completo' : `jornada-${jornadaFiltro}`;
    descargarCSV(filas, `${temporada}_${mod}_${jorn}.csv`);
  };

  return (
    <div>
      <div className="descarga-form">
        <label>
          Modalidad
          <select value={modFiltro} onChange={e => setModFiltro(e.target.value)}>
            {modalidades.map(m => <option key={m} value={m}>{m}</option>)}
          </select>
        </label>
        <label>
          Jornada
          <select value={jornadaFiltro} onChange={e => setJornadaFiltro(e.target.value)}>
            <option value="TODAS">Todas las jornadas</option>
            {Array.from({ length: numJornadas }, (_, i) => (
              <option key={i + 1} value={i + 1}>Jornada {i + 1}</option>
            ))}
          </select>
        </label>
        <button className="btn btn-primary" onClick={descargar} disabled={!filtradas.length}>
          ⬇ Descargar CSV ({filtradas.length} partidos)
        </button>
      </div>

      {!jornadas.length && <p className="rr-empty">Genera el Round Robin primero para poder descargar.</p>}

      {filtradas.length > 0 && (
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '.82rem' }}>
          <thead>
            <tr style={{ background: '#f8f9fa' }}>
              {['J.', 'Tipo', 'Modalidad', 'Local', 'Visitante', 'Resultado'].map(h => (
                <th key={h} style={{ padding: '6px 8px', textAlign: 'left', borderBottom: '2px solid #e0e0e0' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtradas.map((j, i) => (
              <tr key={i} style={{ borderBottom: '1px solid #f0f0f0' }}>
                <td style={{ padding: '5px 8px' }}>{j.jornada}</td>
                <td style={{ padding: '5px 8px' }}><span className={`tipo-badge${j.tipo === 'VUELTA' ? ' vuelta' : ''}`}>{j.tipo}</span></td>
                <td style={{ padding: '5px 8px' }}>{j.modalidad}</td>
                <td style={{ padding: '5px 8px' }}>{j.local.equipo}</td>
                <td style={{ padding: '5px 8px' }}>{j.visitante.equipo}</td>
                <td style={{ padding: '5px 8px', color: '#888' }}>{j.resultado ? j.resultado.ganador : '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
