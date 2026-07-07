const fs = require('fs');
const path = require('path');

const TEMPORADA_INICIAL = '2024-2025';

const GENEROS = {
  1: 'M', 4: 'M', 6: 'M', 9: 'M', 11: 'M',
  16: 'M', 18: 'M', 19: 'M', 24: 'M',
};

const RANKINGS_RAW = require('../src/components/ficheros/RANKINGS.json');
const COMPETIDORES_RAW = require('../src/components/ficheros/MODALIDAD_EQUIPOS.json');
const JUGADORES_RAW = require('../src/components/ficheros/ID_JUGADORES.json');

const temporadas = [
  { id: '2024-2025', nombre: '2024-2025', estado: 'INICIADA', idaYVuelta: false, fechaInicio: '2024-09-01', fechaFin: null },
  { id: '2025-2026', nombre: '2025-2026', estado: 'PENDIENTE', idaYVuelta: false, fechaInicio: null, fechaFin: null },
];

const jugadores = JUGADORES_RAW.map(j => ({
  id: j.ID,
  nombre: j.PLAYER,
  genero: GENEROS[j.ID] || 'F',
}));

let rankingId = 1;
const rankings = [];
Object.entries(RANKINGS_RAW).forEach(([tipo, entries]) => {
  entries.forEach(entry => {
    rankings.push({ id: rankingId++, temporada: TEMPORADA_INICIAL, tipo, ...entry });
  });
});

const competidores = COMPETIDORES_RAW.map(c => ({
  ...c,
  temporada: TEMPORADA_INICIAL,
  pista: '0',
}));

const db = { temporadas, jugadores, competidores, rankings, jornadas: [], participantes: [] };

fs.writeFileSync(
  path.join(__dirname, '../db/database.json'),
  JSON.stringify(db, null, 2)
);

console.log('db/database.json generado:');
console.log(`  ${temporadas.length} temporadas`);
console.log(`  ${jugadores.length} jugadores (con genero)`);
console.log(`  ${competidores.length} competidores (temporada ${TEMPORADA_INICIAL})`);
console.log(`  ${rankings.length} entradas de ranking (temporada ${TEMPORADA_INICIAL})`);
console.log(`  participantes: colección vacía (se gestiona desde la UI)`);
