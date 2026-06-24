import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Temporadas.css';
import { getTemporadas, addTemporada, deleteTemporada } from '../../services/temporadasService';

const ESTADO_ORDEN = { PENDIENTE: 0, INICIADA: 1, FINALIZADA: 2 };

export default function TemporadasList() {
  const [temporadas, setTemporadas] = useState([]);
  const [mostrarForm, setMostrarForm] = useState(false);
  const [nombre, setNombre] = useState('');
  const [fechaInicio, setFechaInicio] = useState('');
  const navigate = useNavigate();

  const cargar = () => getTemporadas().then(ts =>
    setTemporadas([...ts].sort((a, b) => ESTADO_ORDEN[a.estado] - ESTADO_ORDEN[b.estado]))
  );

  useEffect(() => { cargar(); }, []);

  const crear = async (e) => {
    e.preventDefault();
    if (!nombre.trim()) return;
    await addTemporada({ id: nombre.trim(), nombre: nombre.trim(), estado: 'PENDIENTE', idaYVuelta: false, fechaInicio: fechaInicio || null, fechaFin: null });
    setNombre(''); setFechaInicio(''); setMostrarForm(false);
    cargar();
  };

  const borrar = async (id, estado) => {
    if (estado !== 'PENDIENTE') { alert('Solo se pueden borrar temporadas en estado PENDIENTE.'); return; }
    if (!window.confirm(`¿Borrar la temporada "${id}"? Se borrarán también sus jornadas y participantes.`)) return;
    await deleteTemporada(id);
    cargar();
  };

  return (
    <div className="page">
      <div className="page-header">
        <h2>Temporadas</h2>
        <button className="btn btn-primary" onClick={() => setMostrarForm(v => !v)}>
          {mostrarForm ? 'Cancelar' : '+ Nueva temporada'}
        </button>
      </div>

      {mostrarForm && (
        <form className="nueva-form" onSubmit={crear} style={{ marginBottom: '1.5rem' }}>
          <label>
            Nombre (ej: 2025-2026)
            <input value={nombre} onChange={e => setNombre(e.target.value)} placeholder="2025-2026" required />
          </label>
          <label>
            Fecha de inicio
            <input type="date" value={fechaInicio} onChange={e => setFechaInicio(e.target.value)} />
          </label>
          <button type="submit" className="btn btn-primary">Crear</button>
        </form>
      )}

      <div className="temporadas-grid">
        {temporadas.map(t => (
          <div key={t.id} className="temporada-card">
            <h3>{t.nombre}</h3>
            <span className={`badge-estado badge-${t.estado}`}>{t.estado}</span>
            {t.fechaInicio && <span style={{ fontSize: '.78rem', color: '#888' }}>Inicio: {t.fechaInicio}</span>}
            <div className="card-actions">
              <button className="prim" onClick={() => navigate(`/temporadas/${t.id}`)}>Gestionar</button>
              {t.estado === 'PENDIENTE' && (
                <button className="danger" onClick={() => borrar(t.id, t.estado)}>Borrar</button>
              )}
            </div>
          </div>
        ))}
        {!temporadas.length && <p className="info-msg">No hay temporadas. Crea una para empezar.</p>}
      </div>
    </div>
  );
}
