import React, { useState, useEffect } from 'react';
import './Temporadas.css';
import { getJugadores, addJugador } from '../../services/jugadoresService';

const MAX_JUGADORES = { 'DOBLES MIXTO': 4, default: 3 };
const MODALIDADES_DOBLES = ['DOBLES FEMENINO', 'DOBLES MASCULINO', 'DOBLES MIXTO'];

function validarComposicion(jugadores, modalidad) {
  const errs = [];
  const max = MAX_JUGADORES[modalidad] ?? MAX_JUGADORES.default;
  if (jugadores.length < 2) errs.push('Se necesitan al menos 2 jugadores.');
  if (jugadores.length > max) errs.push(`Máximo ${max} jugadores para esta modalidad.`);
  if (modalidad === 'DOBLES MIXTO') {
    const titulares = jugadores.filter(j => j.rol === 'titular');
    const hT = titulares.filter(j => j.genero === 'M').length;
    const mT = titulares.filter(j => j.genero === 'F').length;
    if (hT !== 1 || mT !== 1) errs.push('Dobles Mixto: deben ser exactamente 1 hombre y 1 mujer titulares.');
  }
  if (modalidad === 'DOBLES FEMENINO' && jugadores.some(j => j.genero === 'M'))
    errs.push('Dobles Femenino: solo jugadoras (F).');
  if (modalidad === 'DOBLES MASCULINO' && jugadores.some(j => j.genero === 'F'))
    errs.push('Dobles Masculino: solo jugadores (M).');
  return errs;
}

export default function ModalEquipo({ modalidad, equipo, onGuardar, onCerrar }) {
  const editando = !!equipo;
  const esDobles = MODALIDADES_DOBLES.includes(modalidad);
  const [nombre, setNombre] = useState(equipo?.equipo ?? '');
  const [jugadores, setJugadores] = useState(
    equipo?.jugadores ?? [{ id: '', nombre: '', rol: 'titular', genero: 'F' }]
  );
  const [todosJugadores, setTodosJugadores] = useState([]);
  const [nuevoNombre, setNuevoNombre] = useState('');
  const [nuevoGenero, setNuevoGenero] = useState('F');
  const [errores, setErrores] = useState([]);

  useEffect(() => {
    getJugadores().then(lista =>
      setTodosJugadores([...lista].sort((a, b) => a.nombre.localeCompare(b.nombre, 'es')))
    );
  }, []);

  const cambiarJugador = (i, campo, valor) => {
    const arr = [...jugadores];
    arr[i] = { ...arr[i], [campo]: valor };
    if (campo === 'id') {
      const j = todosJugadores.find(j => String(j.id) === String(valor));
      if (j) { arr[i].nombre = j.nombre; arr[i].genero = j.genero; }
    }
    setJugadores(arr);
  };

  const agregarFila = () => setJugadores(j => [...j, { id: '', nombre: '', rol: 'suplente', genero: 'F' }]);
  const quitarFila = (i) => setJugadores(j => j.filter((_, idx) => idx !== i));

  const crearYAgregar = async () => {
    if (!nuevoNombre.trim()) return;
    const creado = await addJugador({ nombre: nuevoNombre.trim(), genero: nuevoGenero });
    setTodosJugadores(prev => [...prev, creado].sort((a, b) => a.nombre.localeCompare(b.nombre, 'es')));
    setJugadores(prev => [...prev, { id: creado.id, nombre: creado.nombre, rol: 'suplente', genero: creado.genero }]);
    setNuevoNombre(''); setNuevoGenero('F');
  };

  // Para individual: el nombre del equipo es automáticamente el nombre del jugador
  const seleccionarJugadorIndividual = (idSeleccionado) => {
    const j = todosJugadores.find(j => String(j.id) === String(idSeleccionado));
    if (j) {
      setJugadores([{ id: j.id, nombre: j.nombre, rol: 'titular', genero: j.genero }]);
      setNombre(j.nombre);
    } else {
      setJugadores([{ id: '', nombre: '', rol: 'titular', genero: 'F' }]);
      setNombre('');
    }
  };

  const crearJugadorIndividual = async () => {
    if (!nuevoNombre.trim()) return;
    const creado = await addJugador({ nombre: nuevoNombre.trim(), genero: nuevoGenero });
    setTodosJugadores(prev => [...prev, creado].sort((a, b) => a.nombre.localeCompare(b.nombre, 'es')));
    seleccionarJugadorIndividual(creado.id);
    setNuevoNombre(''); setNuevoGenero('F');
  };

  const guardar = () => {
    const errs = esDobles ? validarComposicion(jugadores, modalidad) : [];
    if (!esDobles && !jugadores[0]?.id) errs.push('Selecciona un jugador.');
    if (esDobles && !nombre.trim()) errs.unshift('El nombre del equipo es obligatorio.');
    if (errs.length) { setErrores(errs); return; }
    onGuardar({ equipo: esDobles ? nombre.trim() : jugadores[0].nombre, jugadores, modalidad });
  };

  const tituloAccion = esDobles
    ? (editando ? 'Editar equipo' : 'Añadir equipo')
    : (editando ? 'Editar jugador' : 'Añadir jugador');

  const generoFiltro = modalidad.includes('FEMENINO') ? 'F'
    : modalidad.includes('MASCULINO') ? 'M'
    : null;
  const jugadoresFiltrados = generoFiltro
    ? todosJugadores.filter(j => j.genero === generoFiltro)
    : todosJugadores;

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onCerrar()}>
      <div className="modal-box">
        <h3>{tituloAccion} — {modalidad}</h3>

        {esDobles && (
          <div className="form-row">
            <label>Nombre del equipo</label>
            <input value={nombre} onChange={e => setNombre(e.target.value)} placeholder="Ej: CDC ALTATORRE A" />
          </div>
        )}

        {esDobles && (
          <div className="jugadores-editor">
            <div className="jugadores-editor-header">
              <span>Jugadores</span>
              <button className="btn btn-secondary" style={{ fontSize: '.75rem', padding: '2px 8px' }} onClick={agregarFila}>+ Fila</button>
            </div>
            {jugadores.map((j, i) => (
              <div key={i} className="jugador-row">
                <select
                  style={{ flex: 1 }}
                  value={j.id}
                  onChange={e => cambiarJugador(i, 'id', e.target.value)}
                >
                  <option value="">Seleccionar jugador</option>
                  {jugadoresFiltrados.map(jj => (
                    <option key={jj.id} value={jj.id}>{jj.nombre} ({jj.genero})</option>
                  ))}
                </select>
                <select className="rol-select" value={j.rol} onChange={e => cambiarJugador(i, 'rol', e.target.value)}>
                  <option value="titular">Titular</option>
                  <option value="suplente">Suplente</option>
                </select>
                <button className="remove" onClick={() => quitarFila(i)}>✕</button>
              </div>
            ))}
            <div className="new-player-form">
              <input placeholder="Nuevo jugador..." value={nuevoNombre} onChange={e => setNuevoNombre(e.target.value)} />
              <select value={nuevoGenero} onChange={e => setNuevoGenero(e.target.value)}>
                <option value="F">F</option>
                <option value="M">M</option>
              </select>
              <button className="btn btn-secondary" style={{ fontSize: '.78rem' }} onClick={crearYAgregar}>+ Crear y añadir</button>
            </div>
          </div>
        )}

        {!esDobles && (
          <div className="jugadores-editor">
            <div className="jugadores-editor-header"><span>Jugador</span></div>
            <div className="jugador-row">
              <select
                style={{ flex: 1 }}
                value={jugadores[0]?.id ?? ''}
                onChange={e => seleccionarJugadorIndividual(e.target.value)}
              >
                <option value="">Seleccionar jugador</option>
                {jugadoresFiltrados.map(jj => (
                  <option key={jj.id} value={jj.id}>{jj.nombre} ({jj.genero})</option>
                ))}
              </select>
            </div>
            <div className="new-player-form">
              <input
                placeholder="Nuevo jugador..."
                value={nuevoNombre}
                onChange={e => setNuevoNombre(e.target.value)}
              />
              <select value={nuevoGenero} onChange={e => setNuevoGenero(e.target.value)}>
                <option value="F">F</option>
                <option value="M">M</option>
              </select>
              <button
                className="btn btn-secondary"
                style={{ fontSize: '.78rem' }}
                onClick={crearJugadorIndividual}
              >
                + Crear y seleccionar
              </button>
            </div>
          </div>
        )}

        {errores.length > 0 && (
          <ul style={{ color: '#c0392b', fontSize: '.83rem', paddingLeft: '1.2rem', marginBottom: '.8rem' }}>
            {errores.map((e, i) => <li key={i}>{e}</li>)}
          </ul>
        )}

        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={onCerrar}>Cancelar</button>
          <button className="btn btn-primary" onClick={guardar}>Guardar</button>
        </div>
      </div>
    </div>
  );
}
