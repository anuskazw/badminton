import React, { useRef, useState } from 'react';
import * as XLSX from 'xlsx';
import './Temporadas.css';
import { descargarPartidosExcel, descargarExcel } from '../../utils/download';
import { updatePartido } from '../../services/jornadasService';

const COLUMNAS_REQUERIDAS = [
  'Jornada', 'Modalidad', 'Local', 'Visitante',
  'Set 1 Local', 'Set 1 Visitante',
];

function validarEstructura(filas) {
  if (!filas.length) return ['El archivo está vacío o no tiene filas de datos.'];
  const cabeceras = Object.keys(filas[0]);
  const faltantes = COLUMNAS_REQUERIDAS.filter(c => !cabeceras.includes(c));
  if (faltantes.length) {
    return [
      'Faltan las siguientes columnas obligatorias:',
      ...faltantes.map(c => `  • ${c}`),
      '',
      `Columnas encontradas en el archivo: ${cabeceras.join(', ') || '(ninguna)'}`,
    ];
  }
  return [];
}

function validarFilas(filas, jornadas) {
  const errores = [];
  filas.forEach((f, i) => {
    const nFila = i + 2;
    const ref = `Fila ${nFila}`;

    const vacios = ['Jornada', 'Modalidad', 'Local', 'Visitante']
      .filter(c => f[c] === undefined || f[c] === null || String(f[c]).trim() === '');
    if (vacios.length) {
      errores.push(`${ref}: campo${vacios.length > 1 ? 's' : ''} vac${vacios.length > 1 ? 'ios' : 'io'} — ${vacios.join(', ')}.`);
      return;
    }

    const set1L = Number(f['Set 1 Local'] ?? 0);
    const set1V = Number(f['Set 1 Visitante'] ?? 0);
    const set2L = Number(f['Set 2 Local'] ?? 0);
    const set2V = Number(f['Set 2 Visitante'] ?? 0);
    const set3L = Number(f['Set 3 Local'] ?? 0);
    const set3V = Number(f['Set 3 Visitante'] ?? 0);
    const haySet1 = set1L > 0 || set1V > 0;
    const haySet2 = set2L > 0 || set2V > 0;
    const haySet3 = set3L > 0 || set3V > 0;

    if (haySet2 && !haySet1) {
      errores.push(`${ref} (${f['Local']} vs ${f['Visitante']}): Set 2 relleno con Set 1 vacío.`);
      return;
    }
    if (haySet3 && !haySet2) {
      errores.push(`${ref} (${f['Local']} vs ${f['Visitante']}): Set 3 relleno con Set 2 vacío.`);
      return;
    }
    if (haySet3) {
      const ganSet1 = set1L > set1V ? 'local' : set1V > set1L ? 'visitante' : null;
      const ganSet2 = set2L > set2V ? 'local' : set2V > set2L ? 'visitante' : null;
      if (ganSet1 !== null && ganSet2 !== null && ganSet1 === ganSet2) {
        errores.push(
          `${ref} (${f['Local']} vs ${f['Visitante']}): Set 3 no válido — ` +
          `un mismo equipo ya ganó los dos primeros sets.`
        );
        return;
      }
    }

    const existe = jornadas.some(j =>
      j.modalidad === String(f['Modalidad']).trim() &&
      Number(j.jornada) === Number(f['Jornada']) &&
      j.local.equipo === String(f['Local']).trim() &&
      j.visitante.equipo === String(f['Visitante']).trim()
    );
    if (!existe) {
      const jornadaMod = jornadas.filter(j =>
        j.modalidad === String(f['Modalidad']).trim() &&
        Number(j.jornada) === Number(f['Jornada'])
      );
      if (!jornadaMod.length) {
        errores.push(
          `${ref}: no existe la jornada ${f['Jornada']} para la modalidad "${f['Modalidad']}".`
        );
      } else {
        const equiposEsperados = jornadaMod.map(j => `${j.local.equipo} vs ${j.visitante.equipo}`).join(', ');
        errores.push(
          `${ref}: "${f['Local']} vs ${f['Visitante']}" no coincide con ningun partido ` +
          `en jornada ${f['Jornada']} (${f['Modalidad']}). ` +
          `Partidos esperados: ${equiposEsperados}.`
        );
      }
    }
  });
  return errores;
}

function parsearFilas(filas, jornadas) {
  return filas.map(f => {
    const partido = jornadas.find(j =>
      j.modalidad === String(f['Modalidad']).trim() &&
      Number(j.jornada) === Number(f['Jornada']) &&
      j.local.equipo === String(f['Local']).trim() &&
      j.visitante.equipo === String(f['Visitante']).trim()
    );
    if (!partido) return null;

    const pares = [
      [Number(f['Set 1 Local'] ?? 0), Number(f['Set 1 Visitante'] ?? 0)],
      [Number(f['Set 2 Local'] ?? 0), Number(f['Set 2 Visitante'] ?? 0)],
      [Number(f['Set 3 Local'] ?? 0), Number(f['Set 3 Visitante'] ?? 0)],
    ];
    const sets = pares
      .filter(([l, v]) => l > 0 || v > 0)
      .map(([l, v]) => ({ local: l, visitante: v }));

    if (!sets.length) return null;

    let pL = 0, pV = 0;
    sets.forEach(s => { if (s.local > s.visitante) pL++; else if (s.visitante > s.local) pV++; });

    const resultado = {
      sets,
      puntos: { local: pL, visitante: pV },
      ganador: pL > pV ? String(f['Local']).trim() : pV > pL ? String(f['Visitante']).trim() : null,
    };

    return {
      id: partido.id,
      local: String(f['Local']).trim(),
      visitante: String(f['Visitante']).trim(),
      jornada: f['Jornada'],
      modalidad: String(f['Modalidad']).trim(),
      resultado,
    };
  }).filter(Boolean);
}

function ModalError({ titulo, lineas, onClose }) {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box" onClick={e => e.stopPropagation()}>
        <h3 style={{ color: 'var(--c-danger)', marginTop: 0 }}>{titulo}</h3>
        <div style={{
          background: '#fdf0f0',
          border: '1px solid #f5c6cb',
          borderRadius: 'var(--radius-md)',
          padding: '.75rem 1rem',
          marginBottom: '1rem',
          maxHeight: '320px',
          overflowY: 'auto',
        }}>
          {lineas.map((l, i) => (
            <p key={i} style={{
              margin: '3px 0',
              fontSize: '.83rem',
              color: l === '' ? undefined : '#721c24',
              fontFamily: (l.startsWith('  ') || l.startsWith('Fila')) ? 'monospace' : 'inherit',
            }}>
              {l || ' '}
            </p>
          ))}
        </div>
        <p style={{ fontSize: '.8rem', color: 'var(--c-muted)', margin: '0 0 1.25rem' }}>
          La importacion solo actualiza partidos existentes — no crea partidos nuevos.
          Descarga la plantilla con <strong>Partidos Excel</strong>, corrigela y vuelve a subirla.
        </p>
        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={onClose}>Cerrar</button>
        </div>
      </div>
    </div>
  );
}

export default function DescargaTab({ temporada, jornadas, participantes, onRefresh }) {
  const [modFiltro, setModFiltro] = useState('TODAS');
  const [jornadaFiltro, setJornadaFiltro] = useState('TODAS');
  const [preview, setPreview] = useState(null);
  const [importando, setImportando] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const [errorModal, setErrorModal] = useState(null);
  const fileRef = useRef();

  const modalidades = ['TODAS', ...new Set(jornadas.map(j => j.modalidad))];
  const numJornadas = jornadas.length ? Math.max(...jornadas.map(j => j.jornada)) : 0;

  const filtradas = jornadas.filter(j =>
    (modFiltro === 'TODAS' || j.modalidad === modFiltro) &&
    (jornadaFiltro === 'TODAS' || j.jornada === parseInt(jornadaFiltro))
  );

  const nombreBase = () => {
    const mod = modFiltro === 'TODAS' ? 'todas' : modFiltro.toLowerCase().replace(/ /g, '-');
    const jorn = jornadaFiltro === 'TODAS' ? 'completo' : `jornada-${jornadaFiltro}`;
    return `${temporada}_${mod}_${jorn}`;
  };

  const descargarPartidos = async () => {
    const filas = filtradas.map(j => ({
      Temporada: j.temporada,
      Jornada: j.jornada,
      Tipo: j.tipo,
      Modalidad: j.modalidad,
      Local: j.local.equipo,
      Visitante: j.visitante.equipo,
      'Set 1 Local': j.resultado?.sets?.[0]?.local ?? '',
      'Set 1 Visitante': j.resultado?.sets?.[0]?.visitante ?? '',
      'Set 2 Local': j.resultado?.sets?.[1]?.local ?? '',
      'Set 2 Visitante': j.resultado?.sets?.[1]?.visitante ?? '',
      'Set 3 Local': j.resultado?.sets?.[2]?.local ?? '',
      'Set 3 Visitante': j.resultado?.sets?.[2]?.visitante ?? '',
      Ganador: j.resultado?.ganador ?? '',
    }));
    await descargarPartidosExcel(filas, 'Partidos', `${nombreBase()}.xlsx`);
  };

  const descargarParticipantesFiltrados = () => {
    const lista = (participantes ?? []).filter(
      p => modFiltro === 'TODAS' || p.modalidad === modFiltro
    );
    const filas = lista.map(p => ({
      Modalidad: p.modalidad,
      Equipo: p.equipo,
      Jugadores: p.jugadores.map(j => j.nombre).join(', '),
      Estado: p.estado ?? '',
    }));
    descargarExcel(filas, 'Participantes', `${temporada}_participantes.xlsx`);
  };

  const leerExcel = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setFeedback(null);
    setPreview(null);
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const libro = XLSX.read(ev.target.result, { type: 'array' });
        const hoja = libro.Sheets[libro.SheetNames[0]];
        const filas = XLSX.utils.sheet_to_json(hoja);

        const erroresEstructura = validarEstructura(filas);
        if (erroresEstructura.length) {
          setErrorModal({ titulo: 'Estructura incorrecta', lineas: erroresEstructura });
          return;
        }

        const erroresFilas = validarFilas(filas, jornadas);
        if (erroresFilas.length) {
          setErrorModal({
            titulo: `${erroresFilas.length} fila${erroresFilas.length > 1 ? 's' : ''} con error`,
            lineas: [
              'No se guardara ningun partido hasta corregir los siguientes problemas:',
              '',
              ...erroresFilas,
            ],
          });
          return;
        }

        setPreview(parsearFilas(filas, jornadas));
      } catch {
        setErrorModal({
          titulo: 'Error al leer el archivo',
          lineas: ['No se pudo leer el archivo. Asegurate de que es un Excel valido (.xlsx o .xls).'],
        });
      }
    };
    reader.readAsArrayBuffer(file);
    e.target.value = '';
  };

  const aplicarCambios = async () => {
    if (!preview?.length) return;
    setImportando(true);
    setFeedback(null);
    try {
      await Promise.all(preview.map(p => updatePartido(p.id, { resultado: p.resultado })));
      setFeedback({ tipo: 'ok', msg: `${preview.length} partido${preview.length > 1 ? 's' : ''} actualizado${preview.length > 1 ? 's' : ''} correctamente.` });
      setPreview(null);
      onRefresh?.();
    } catch {
      setFeedback({ tipo: 'error', msg: 'Error al guardar. Esta el servidor en marcha?' });
    } finally {
      setImportando(false);
    }
  };

  return (
    <div>
      {errorModal && (
        <ModalError
          titulo={errorModal.titulo}
          lineas={errorModal.lineas}
          onClose={() => setErrorModal(null)}
        />
      )}

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
      </div>

      <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
        <button className="btn btn-primary" onClick={descargarPartidos} disabled={!filtradas.length}>
          Partidos Excel ({filtradas.length})
        </button>
        <button className="btn btn-secondary" onClick={descargarParticipantesFiltrados} disabled={!(participantes ?? []).length}>
          Participantes Excel
        </button>
      </div>

      {!jornadas.length && (
        <p className="rr-empty">Genera el Round Robin primero para poder descargar partidos.</p>
      )}

      {jornadas.length > 0 && (
        <div className="import-section">
          <h4 className="import-title">Importar resultados desde Excel</h4>
          <p className="import-desc">
            Descarga la plantilla, rellena los sets y vuelve a subir el archivo.
          </p>
          <input
            ref={fileRef}
            type="file"
            accept=".xlsx,.xls"
            style={{ display: 'none' }}
            onChange={leerExcel}
          />
          <button className="btn btn-secondary" onClick={() => fileRef.current.click()}>
            Seleccionar Excel
          </button>

          {preview && preview.length === 0 && (
            <p className="import-warn">No se encontraron partidos coincidentes en el archivo.</p>
          )}

          {preview && preview.length > 0 && (
            <div className="import-preview">
              <p className="import-preview-info">
                Se van a actualizar <strong>{preview.length}</strong> partido{preview.length > 1 ? 's' : ''}:
              </p>
              <table className="import-table">
                <thead>
                  <tr>
                    <th>J.</th><th>Modalidad</th><th>Local</th><th>Visitante</th><th>Sets</th><th>Ganador</th>
                  </tr>
                </thead>
                <tbody>
                  {preview.map((p, i) => (
                    <tr key={i}>
                      <td>{p.jornada}</td>
                      <td>{p.modalidad}</td>
                      <td>{p.local}</td>
                      <td>{p.visitante}</td>
                      <td>{p.resultado.sets.map(s => `${s.local}-${s.visitante}`).join(' / ')}</td>
                      <td><strong>{p.resultado.ganador ?? 'Empate'}</strong></td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1rem' }}>
                <button className="btn btn-success" onClick={aplicarCambios} disabled={importando}>
                  {importando ? 'Guardando...' : `Guardar ${preview.length} cambio${preview.length > 1 ? 's' : ''}`}
                </button>
                <button className="btn btn-secondary" onClick={() => setPreview(null)}>
                  Cancelar
                </button>
              </div>
            </div>
          )}

          {feedback && (
            <p className={feedback.tipo === 'ok' ? 'success-msg' : 'error-msg'} style={{ marginTop: '0.75rem' }}>
              {feedback.msg}
            </p>
          )}
        </div>
      )}

      {filtradas.length > 0 && (
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '.82rem', marginTop: '1.5rem' }}>
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
                <td style={{ padding: '5px 8px' }}>
                  <span className={`tipo-badge${j.tipo === 'VUELTA' ? ' vuelta' : ''}`}>{j.tipo}</span>
                </td>
                <td style={{ padding: '5px 8px' }}>{j.local.equipo}</td>
                <td style={{ padding: '5px 8px' }}>{j.visitante.equipo}</td>
                <td style={{ padding: '5px 8px', color: '#888' }}>
                  {j.resultado ? j.resultado.ganador : 'Pendiente'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
