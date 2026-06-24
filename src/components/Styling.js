import React, { useState } from 'react';
import './Styling.css';

const MODALIDADES = ['Dobles Femenino', 'Dobles Masculino', 'Dobles Mixto'];

function MiniTabla() {
  return (
    <table className="styling-table">
      <thead>
        <tr><th>Jugador</th><th>PJ</th><th>Total</th></tr>
      </thead>
      <tbody>
        <tr><td>Ana García</td><td>8</td><td>124</td></tr>
        <tr><td>Laura Pérez</td><td>7</td><td>98</td></tr>
        <tr><td>María López</td><td>6</td><td>81</td></tr>
      </tbody>
    </table>
  );
}

function Variante({ nombre, descripcion, children }) {
  const [open, setOpen] = useState(null);
  return (
    <div className="styling-variante">
      <div className="styling-variante-meta">
        <span className="styling-variante-nombre">{nombre}</span>
        <span className="styling-variante-desc">{descripcion}</span>
      </div>
      <div className="styling-variante-preview">
        {MODALIDADES.map(m => (
          <div key={m}>
            {children({
              label: m,
              isOpen: open === m,
              toggle: () => setOpen(open === m ? null : m),
            })}
            {open === m && <MiniTabla />}
          </div>
        ))}
      </div>
    </div>
  );
}

export default function Styling() {
  return (
    <div className="styling-page">
      <h2>Estilos de cabecera — Ranking</h2>
      <p className="styling-intro">Haz clic en los botones para ver cómo quedan desplegados.</p>

      {/* 1. Borde izquierdo (actual) */}
      <Variante nombre="A · Borde izquierdo" descripcion="Fondo gris claro · franja roja izquierda · texto navy">
        {({ label, isOpen, toggle }) => (
          <button className="rbtn rbtn-a" onClick={toggle}>
            {label} <span className="rbtn-chevron">{isOpen ? '▲' : '▼'}</span>
          </button>
        )}
      </Variante>

      {/* 2. Underline minimalista */}
      <Variante nombre="B · Underline minimalista" descripcion="Sin caja · texto en mayúsculas · línea roja fina inferior">
        {({ label, isOpen, toggle }) => (
          <button className="rbtn rbtn-b" onClick={toggle}>
            {label.toUpperCase()} <span className="rbtn-chevron">{isOpen ? '▲' : '▼'}</span>
          </button>
        )}
      </Variante>

      {/* 3. Tinte rojo suave */}
      <Variante nombre="C · Tinte rojo suave" descripcion="Fondo rosa muy pálido · texto granate · sin borde">
        {({ label, isOpen, toggle }) => (
          <button className="rbtn rbtn-c" onClick={toggle}>
            {label} <span className="rbtn-chevron">{isOpen ? '▲' : '▼'}</span>
          </button>
        )}
      </Variante>

      {/* 4. Pill con sombra */}
      <Variante nombre="D · Pill con sombra" descripcion="Fondo blanco · sombra leve · sin acento de color">
        {({ label, isOpen, toggle }) => (
          <button className="rbtn rbtn-d" onClick={toggle}>
            {label} <span className="rbtn-chevron">{isOpen ? '▲' : '▼'}</span>
          </button>
        )}
      </Variante>

      {/* 5. Navy sólido */}
      <Variante nombre="E · Navy sólido" descripcion="Fondo navy oscuro · texto blanco · acento rojo al abrir">
        {({ label, isOpen, toggle }) => (
          <button className={`rbtn rbtn-e${isOpen ? ' rbtn-e--open' : ''}`} onClick={toggle}>
            {label} <span className="rbtn-chevron">{isOpen ? '▲' : '▼'}</span>
          </button>
        )}
      </Variante>

      {/* 6. Chip tipo badge */}
      <Variante nombre="F · Chip / badge" descripcion="Etiqueta compacta · texto mayúsculas pequeñas · punto rojo">
        {({ label, isOpen, toggle }) => (
          <button className="rbtn rbtn-f" onClick={toggle}>
            <span className="rbtn-f-dot" /> {label.toUpperCase()}
            <span className="rbtn-chevron">{isOpen ? '▲' : '▼'}</span>
          </button>
        )}
      </Variante>
    </div>
  );
}
