# Plan de optimización de la API (json-server)

Principio rector: **todo dato de competición va filtrado por temporada**. Este plan solo aborda las colecciones que tienen campo `temporada` (`competidores`, `participantes`, `jornadas`, `rankings`). La colección `jugadores` es un maestro global sin temporada y queda fuera del alcance.

---

## Estado actual de las colecciones por temporada

| Colección | Tiene `temporada` | Temporada(s) en BD | Estado |
|-----------|:-----------------:|-------------------|--------|
| `temporadas` | — (es la entidad en sí) | — | — |
| `jugadores` | ❌ | — | Maestro global, fuera del alcance |
| `competidores` | ✅ | — | ✅ Vaciada (fase 1 completada) |
| `rankings` | ✅ | 2024-2025 | Sin cambios pendientes |
| `jornadas` | ✅ | 2025-2026 | Pendiente fase 3 |
| `participantes` | ✅ | 2025-2026 | ✅ Incluye campo `pista` (fase 1 completada) |

---

## Problemas detectados

### P1 — Dos colecciones para el mismo concepto: `competidores` y `participantes`

Ambas representan "equipo inscrito en una modalidad en una temporada", pero son completamente distintas en schema, temporada y páginas que las consumen:

| Aspecto | `competidores` | `participantes` |
|---------|---------------|-----------------|
| Temporada | 2024-2025 | 2025-2026 |
| Jugadores | `[{ PLAYER, ID }]` | `[{ id, nombre, rol, genero }]` |
| Campo `pista` | ✅ | ❌ |
| Campo `orden` | ❌ | ✅ |
| Campo `estado` | ❌ | ✅ |
| Campo `rol` / `genero` | ❌ | ✅ |
| Páginas | `/competicion`, `/competicion-2` | `/equipos`, `/form`, `/temporadas/:id` |

**Consecuencia directa:** `/competicion-2` (asignación de pistas) muestra los equipos de la temporada 2024-2025 mientras que `/equipos` y el resto de la app trabajan con 2025-2026. Son datos de temporadas distintas en la misma pantalla de competición.

---

### P2 — El formato embebido del jugador dentro de un equipo es inconsistente entre colecciones

Cuando se unifica P1, los componentes que actualmente leen `j.PLAYER` (formato de `competidores`) van a recibir `j.nombre` (formato de `participantes`). Hay cuatro referencias que cambiar.

| Componente | Campo actual | Campo tras unificación |
|------------|-------------|----------------------|
| `Equipo.js` | `j.PLAYER` | `j.nombre` |
| `Competicion.js` | `j.PLAYER` | `j.nombre` |
| `CompeticionDragAndDrop.js` — `comprobarTramo` | `j.PLAYER` | `j.nombre` |
| `CompeticionDragAndDrop.js` — render en `Column` | via `Equipo.js` | automático |

---

### P3 — El formato de partido en `jornadas` es diferente según quién lo creó

La misma colección `jornadas` (filtrada por temporada) puede contener dos estructuras distintas:

**Creado por `RoundRobinTab` (temporada detalle):**
```json
{
  "tipo": "IDA",
  "local":     { "idParticipante": "615f", "equipo": "CDC ALTATORRE A" },
  "visitante": { "idParticipante": "9f62", "equipo": "CDC ALTATORRE B" },
  "resultado": null
}
```

**Creado por `SetForm` (`/form`):**
```json
{
  "local": {
    "equipo": "CDC ALTATORRE A",
    "jugadores": ["Ana García", "Mónica López"],
    "sets": [21, 18, 15],
    "puntos": 2
  },
  "visitante": { "equipo": "...", "sets": [...], "puntos": 1 }
}
```

**Consecuencias:**

- `SetForm` no incluye `tipo`, `idParticipante` ni `resultado` → esos partidos no se pueden cruzar con los del round robin.
- `Jornadas.js` lee `local.puntos` directamente → solo puede mostrar resultados de partidos creados por `SetForm`; los del round robin siempre aparecen como pendientes aunque tengan resultado.
- Si se introduce un resultado para un partido del round robin desde `/form`, se crea un registro duplicado en lugar de actualizar el existente.

---

## Plan de acción

### ~~Fase 1 — Unificar `competidores` en `participantes`~~ ✅ Completada

**Objetivo:** que la asignación de pistas trabaje con los mismos datos que el resto de la app.

#### 1a. Añadir campo `pista` a `participantes`

Cada registro de `participantes` recibe `"pista": "0"` (sin asignar por defecto).

```json
{
  "id": "615f",
  "temporada": "2025-2026",
  "modalidad": "DOBLES FEMENINO",
  "equipo": "CDC ALTATORRE A",
  "jugadores": [...],
  "orden": 1,
  "estado": "ACTIVO",
  "pista": "0"
}
```

#### 1b. Redirigir `competidoresService.js` a `participantes`

```js
// src/services/competidoresService.js
import api from './api';

export const getCompetidores = (temporada) =>
  api.get(`participantes?temporada=${encodeURIComponent(temporada)}`);

export const actualizarPista = (id, pista) =>
  api.patch('participantes', id, { pista });
```

Los componentes `Competicion.js` y `CompeticionDragAndDrop.js` no necesitan cambios: siguen llamando a `getCompetidores` y `actualizarPista`, pero ahora apuntan a la colección correcta.

#### 1c. Vaciar / eliminar la colección `competidores`

Los 39 registros de 2024-2025 corresponden a una temporada FINALIZADA. Se puede archivar el JSON y dejar la colección vacía, o eliminarla del esquema si json-server no la necesita.

---

### ~~Fase 2 — Adaptar los componentes al formato de `participantes`~~ ✅ Completada

Después de la Fase 1, los componentes de competición reciben objetos con `j.nombre` en lugar de `j.PLAYER`. Cambios necesarios:

**`src/components/Equipo.js`**
```js
// antes
{elemento.jugadores.map(j => j.PLAYER).join(', ')}
// después
{elemento.jugadores.map(j => j.nombre).join(', ')}
```

**`src/components/Competicion.js`**
```js
// antes
{jugadores.map(j => j.PLAYER).join(', ')}
// después
{jugadores.map(j => j.nombre).join(', ')}
```

**`src/components/CompeticionDragAndDrop/CompeticionDragAndDrop.js` — `comprobarTramo`**
```js
// antes
elem.jugadores.forEach(({ PLAYER }) => { ... })
// después
elem.jugadores.forEach(({ nombre }) => { ... })
// y la clave del mapa: jugadoresPorPista[nombre]
```

---

### ~~Fase 3 — Unificar el formato de partido en `jornadas`~~ ✅ Completada

**Objetivo:** que introducir un resultado desde `/form` actualice el partido existente del round robin en lugar de crear uno nuevo; y que `/jornadas` pueda mostrar el resultado de cualquier partido.

#### 3a. Formato canónico de un registro de `jornadas`

```json
{
  "id": "c1e4",
  "temporada": "2025-2026",
  "modalidad": "DOBLES FEMENINO",
  "jornada": 1,
  "tipo": "IDA",
  "local":     { "idParticipante": "615f", "equipo": "CDC ALTATORRE A" },
  "visitante": { "idParticipante": "9f62", "equipo": "CDC ALTATORRE B" },
  "resultado": null
}
```

Cuando se registra el resultado, se hace PATCH sobre ese registro:

```json
"resultado": {
  "sets": [
    { "local": 21, "visitante": 15 },
    { "local": 18, "visitante": 21 },
    { "local": 15, "visitante": 10 }
  ],
  "puntos": { "local": 2, "visitante": 1 },
  "ganador": "CDC ALTATORRE A",
  "jugadores": {
    "local":     ["Ana García", "Mónica López"],
    "visitante": ["Laura Ruiz", "Carmen Pérez"]
  }
}
```

#### 3b. Cambios en `jornadasService.js`

Añadir función para actualizar resultado:

```js
export const updatePartido = (id, datos) => api.patch('jornadas', id, datos);

export const buscarPartido = (temporada, modalidad, jornada, idParticipanteLocal) =>
  api.get(
    `jornadas?temporada=${encodeURIComponent(temporada)}`
    + `&modalidad=${encodeURIComponent(modalidad)}`
    + `&jornada=${jornada}`
    + `&local.idParticipante=${encodeURIComponent(idParticipanteLocal)}`
  );
```

#### 3c. Cambios en `SetForm.js`

En lugar de hacer POST, el flujo pasa a ser:

1. Buscar la jornada existente con `buscarPartido(temporada, modalidad, jornada, idParticipanteLocal)`.
2. Si existe → PATCH del campo `resultado`.
3. Si no existe → POST con el formato canónico completo (incluyendo `tipo: 'AMISTOSO'` o similar para distinguirlo).

#### 3d. Cambios en `Jornadas.js`

```js
// antes
const pL = partido.local?.puntos;
const pV = partido.visitante?.puntos;

// después
const pL = partido.resultado?.puntos?.local;
const pV = partido.resultado?.puntos?.visitante;

// jugadores: antes partido.local.jugadores (array de strings)
// después: partido.resultado?.jugadores?.local
```

---

## Resumen de cambios

### Base de datos (`db/database.json`)

| Colección | Cambio | Estado |
|-----------|--------|--------|
| `participantes` | Añadir `"pista": "0"` a cada registro | ✅ Hecho |
| `competidores` | Vaciar | ✅ Hecho |
| `jornadas` | Los nuevos partidos usan el formato canónico | ✅ Hecho |

### Servicios (`src/services/`)

| Archivo | Cambio | Estado |
|---------|--------|--------|
| `competidoresService.js` | Redirigir a `participantes` | ✅ Hecho |
| `jornadasService.js` | Añadir `updatePartido` y `buscarPartido` | ✅ Hecho |

### Componentes (`src/components/`)

| Archivo | Cambio | Estado |
|---------|--------|--------|
| `Equipo.js` | `j.PLAYER` → `j.nombre` | ✅ Hecho |
| `Competicion.js` | `j.PLAYER` → `j.nombre` | ✅ Hecho |
| `CompeticionDragAndDrop.js` | `{ PLAYER }` → `{ nombre }` en `comprobarTramo` | ✅ Hecho |
| `ParticipantesTab.js` | `j.nombre \|\| j.PLAYER` → `j.nombre` | ✅ Hecho |
| `SetForm.js` | POST directo → buscar jornada existente + PATCH resultado | ✅ Hecho |
| `Jornadas.js` | `local.puntos` → `resultado?.puntos?.local` | ✅ Hecho |

---

## Orden de ejecución

```
✅ Fase 1 — Unificar competidores → participantes   (datos + servicio)
✅ Fase 2 — Adaptar componentes al nuevo formato de jugadores
✅ Fase 3 — Unificar formato de jornadas            (servicio + SetForm + Jornadas)
```

**Plan completado.** Todas las colecciones por temporada son coherentes entre páginas.
