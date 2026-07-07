# Página: Detalle de temporada

**Ruta:** `/temporadas/:id`  
**Componente principal:** `src/components/Temporadas/TemporadaDetalle.js`  
**Subcomponentes:**
- `src/components/Temporadas/ParticipantesTab.js`
- `src/components/Temporadas/RoundRobinTab.js`
- `src/components/Temporadas/DescargaTab.js`
- `src/components/Temporadas/ModalEquipo.js`

**CSS:** `src/components/Temporadas/Temporadas.css`

---

## Descripción

Página central de configuración y gestión de una temporada. Organizada en tres pestañas: participantes, jornadas (round robin) y descarga. La disponibilidad de acciones depende del estado de la temporada.

---

## Cabecera

| Elemento | Descripción |
|----------|-------------|
| Botón "← Temporadas" | Vuelve a `/temporadas` |
| Nombre de temporada | Editable solo en estado `PENDIENTE` (botón ✎ Editar) |
| Badge de estado | `PENDIENTE` / `INICIADA` / `FINALIZADA` |
| Acciones de estado | Ver tabla de acciones por estado |

### Acciones de estado

| Estado actual | Acción disponible | Resultado |
|---------------|------------------|-----------|
| PENDIENTE | ▶ Iniciar temporada | Pasa a `INICIADA` (con validación previa) |
| PENDIENTE | Borrar | Elimina la temporada |
| INICIADA | ■ Finalizar temporada | Pasa a `FINALIZADA` |
| FINALIZADA | — | "Temporada cerrada" (solo lectura) |

---

## Panel de errores de validación

Visible solo si se intenta iniciar y hay errores. Muestra lista de errores bloqueantes:

- No hay jornadas generadas.
- Modalidad con menos de 2 participantes activos.
- Equipo dobles con número incorrecto de jugadores.
- Dobles Mixto con titulares que no cumplen composición 1H+1M.
- Jugador duplicado en dos equipos de la misma modalidad.

---

## Pestañas

### Pestaña "Participantes"

Componente: `ParticipantesTab`

Muestra los participantes agrupados por modalidad (acordeón, todos abiertos por defecto).

**Por cada modalidad:**

| Elemento | Descripción |
|----------|-------------|
| Cabecera clicable | Nombre de modalidad + contador de equipos/jugadores |
| Tarjeta de equipo | Orden #N, nombre, jugadores con rol, badge DESCALIFICADO |
| Drag handle | Solo en estado no `FINALIZADA`; permite reordenar arrastrando |
| Botones de acción | Editar / Descalificar (o Reactivar) / ✕ Eliminar |
| Botón añadir | "+ Añadir equipo" o "+ Añadir jugador" según modalidad |

**Acciones sobre participante:**

| Acción | Disponibilidad | Comportamiento |
|--------|---------------|----------------|
| Editar | Solo si no `FINALIZADA` | Abre `ModalEquipo` con los datos actuales |
| Descalificar | Solo si no `FINALIZADA` | Pide confirmación; cambia `estado` a `DESCALIFICADO` |
| Reactivar | Si está descalificado | Pide confirmación; vuelve a `ACTIVO` |
| Eliminar (✕) | Solo si no `FINALIZADA` | Pide confirmación; borra el participante |
| Añadir | Solo si no `FINALIZADA` | Abre `ModalEquipo` vacío |

**Drag & drop de orden:**

Dentro de cada modalidad se puede reordenar arrastrando las tarjetas. El orden se persiste inmediatamente (llama a `updateParticipante` para cada posición).

**`ModalEquipo`:**

Modal para crear o editar un participante. Los campos varían según la modalidad (dobles: nombre equipo + jugadores; individual: solo nombre).

---

### Pestaña "Jornadas"

Componente: `RoundRobinTab`

Permite generar y visualizar el calendario de partidos por round robin.

**Barra de herramientas** (solo si no `soloLectura`):

| Control | Descripción |
|---------|-------------|
| Checkbox "Ida y vuelta" | Duplica las jornadas invirtiendo local/visitante |
| Botón "⟳ Calcular Round Robin" | Genera partidos para todas las modalidades |

**Aviso automático:** Si ida y vuelta supera 14 jornadas en alguna modalidad, avisa que se generará solo ida.

**Por modalidad**, muestra los partidos agrupados por número de jornada:

```
Equipo A  vs  Equipo B  [IDA]
Equipo C  vs  Equipo D  [IDA]
```

Botón "Regenerar" por modalidad (solo si no `soloLectura`): regenera solo esa modalidad. Bloqueado si ya tiene resultados registrados.

**Algoritmo de generación:**

- Usa `generarCuadroRondas(lista)` de `src/utils/roundRobin.js`.
- Sistema Berger: fija el primer elemento, rota el resto.
- Si N es impar, añade un `BYE` ficticio.
- Máximo de jornadas: 14. Si ida y vuelta supera el límite, se genera solo ida.

---

### Pestaña "Descargar"

Componente: `DescargaTab`

Permite exportar el calendario de partidos a CSV.

**Filtros:**

| Filtro | Opciones |
|--------|----------|
| Modalidad | "TODAS" + cada modalidad con jornadas |
| Jornada | "Todas las jornadas" + jornadas 1 a N |

**Vista previa:** tabla con los partidos filtrados.

**Columnas del CSV exportado:**

| Campo | Descripción |
|-------|-------------|
| `temporada` | ID de la temporada |
| `jornada` | Número de jornada |
| `tipo` | `IDA` o `VUELTA` |
| `modalidad` | Modalidad del partido |
| `local` | Nombre del equipo local |
| `visitante` | Nombre del equipo visitante |
| `set1_local` … `set3_visitante` | Puntos de cada set (vacío si no jugado) |
| `ganador` | Equipo ganador (vacío si pendiente) |

**Nombre del fichero:** `<temporada>_<modalidad>_<jornada>.csv`

---

## Fuentes de datos

- `getTemporada(id)`, `updateTemporada(id, datos)`, `deleteTemporada(id)`
- `getParticipantes(id)`, `addParticipante`, `updateParticipante`, `deleteParticipante`
- `getJornadas(id)`, `addPartido`, `deleteJornada`

---

## Estado local (TemporadaDetalle)

| Variable | Valor inicial | Uso |
|----------|--------------|-----|
| `temporada` | `null` | Datos de la temporada |
| `participantes` | `[]` | Lista de participantes |
| `jornadas` | `[]` | Lista de partidos generados |
| `tab` | `'participantes'` | Pestaña activa |
| `erroresValidacion` | `[]` | Errores bloqueantes al intentar iniciar |
| `editNombre` | `false` | Modo edición del nombre |
| `nuevoNombre` | `''` | Valor del campo de edición de nombre |

---

## Reglas de solo lectura

| Estado | `soloLectura` (ParticipantesTab) | `soloLectura` (RoundRobinTab) |
|--------|----------------------------------|-------------------------------|
| PENDIENTE | `false` | `false` |
| INICIADA | `false` | `true` |
| FINALIZADA | `true` | `true` |

En `INICIADA` se puede editar/descalificar participantes pero no regenerar el calendario.
