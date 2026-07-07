# Página: Jornadas

**Ruta:** `/jornadas`  
**Componente:** `src/components/Jornadas.js`  
**CSS:** `src/components/Jornadas.css`

---

## Descripción

Vista del calendario de partidos de la temporada activa. Muestra todos los partidos agrupados por número de jornada, con un filtro por modalidad. Para cada partido se muestran los equipos, los jugadores, y el resultado si ya se ha jugado.

---

## Filtro por modalidad

Radio buttons en la parte superior:

| Opción | Valor |
|--------|-------|
| Todas | `'Todos'` (valor por defecto) |
| Dobles femenino | `'DOBLES FEMENINO'` |
| Dobles masculino | `'DOBLES MASCULINO'` |
| Dobles mixto | `'DOBLES MIXTO'` |
| Individual femenino | `'INDIVIDUAL FEMENINO'` |
| Individual masculino | `'INDIVIDUAL MASCULINO'` |

Las etiquetas se muestran con la primera letra en mayúscula y el resto en minúscula (función `capitalize`).

---

## Estructura de un partido

```
[Badge modalidad · tipo]
┌─────────────────────────────────┐
│  Equipo local                   │
│  Jugador 1 · Jugador 2          │
│          X - Y                  │
│           vs (si no hay result) │
│  Equipo visitante               │
│  Jugador 3 · Jugador 4          │
└─────────────────────────────────┘
```

| Elemento | Descripción |
|----------|-------------|
| Badge | Modalidad + tipo de partido (`IDA` / `VUELTA` / `AMISTOSO`) si existe |
| Nombre equipo | `partido.local.equipo` / `partido.visitante.equipo` |
| Jugadores | `partido.resultado?.jugadores?.local` / `?.visitante` (solo si hay resultado) |
| Marcador | `partido.resultado?.puntos?.local` - `?.visitante`; "vs" si está pendiente |
| Ganador | El marcador del ganador se muestra en negrita (clase `ganador`) |

---

## Agrupación de partidos

Los partidos se agrupan por `jornada` y se muestran en orden numérico ascendente. Dentro de cada jornada se muestran todos los partidos de las modalidades que pasan el filtro.

---

## Estados de carga

| Situación | Mensaje mostrado |
|-----------|-----------------|
| Cargando | "Cargando..." |
| Error de red | "No se pudieron cargar las jornadas. ¿Está el servidor en marcha?" |
| Sin datos | "No hay jornadas para esta temporada." |

---

## Fuente de datos

- `getJornadas(temporada)` — partidos de la temporada activa. Se recarga cuando cambia la temporada en el contexto.

---

## Estado local

| Variable | Valor inicial | Uso |
|----------|--------------|-----|
| `modalidad` | `'Todos'` | Filtro activo de modalidad |
| `jornadas` | `[]` | Lista de partidos cargados del servidor |
| `cargando` | `false` | Indicador de carga |
| `error` | `null` | Mensaje de error si la carga falla |

**Contexto consumido:** `useTemporada()` → `{ temporada }`

---

## Navegación

- Entrada: desde `/dashboard`
- No tiene salidas de navegación a otras páginas
