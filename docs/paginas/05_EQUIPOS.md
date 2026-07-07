# Página: Equipos

**Ruta:** `/equipos` (todos) | `/equipos?id=<ID>` (equipos de un jugador)  
**Componente:** `src/components/Teams.js`  
**CSS:** `src/components/Teams.css`

---

## Descripción

Muestra los equipos participantes en la temporada activa, agrupados por modalidad. Cada modalidad es una sección colapsable. Si se accede con `?id=`, filtra y muestra solo los equipos en los que participa ese jugador.

---

## Modos de uso

### Modo lista completa (sin parámetro)

- Muestra todos los competidores agrupados por modalidad.
- Todas las secciones comienzan expandidas.

### Modo filtrado (`?id=<ID>`)

- Filtra los competidores en los que algún jugador tenga `id === ID`.
- Útil para ver en qué modalidades y equipos participa un jugador concreto.

---

## Estructura visual

Cada sección de modalidad tiene:

| Elemento | Contenido |
|----------|-----------|
| Cabecera clicable | Nombre de la modalidad + contador de equipos + chevron ▲/▼ |
| Cuerpo (colapsable) | Grid de tarjetas de equipo |

Cada tarjeta de equipo muestra:

| Elemento | Contenido |
|----------|-----------|
| Nombre del equipo | `equipo` |
| Jugadores | Lista de tags con el nombre de cada jugador |

---

## Comportamiento del acordeón

- Todas las secciones empiezan abiertas (se inicializa `openModalities` con todas las modalidades).
- Hacer clic en la cabecera alterna el estado abierto/cerrado de esa sección independientemente de las demás (no es acordeón exclusivo: pueden estar varias abiertas a la vez).

---

## Fuente de datos

- `getParticipantes(temporada)` — devuelve los competidores de la temporada activa con sus jugadores.
- Si falla, muestra: *"No se pudo cargar los equipos. ¿Está el servidor en marcha?"*

---

## Estado local

| Variable | Valor inicial | Uso |
|----------|--------------|-----|
| `competidores` | `[]` | Lista de participantes cargados |
| `openModalities` | `new Set(todas)` | Set con las modalidades que están expandidas |
| `error` | `null` | Mensaje de error si la carga falla |

**Contexto consumido:** `useTemporada()` → `{ temporada }`

---

## Navegación

- Entrada: desde `/dashboard`
- Botón "← Volver" → `/dashboard`
- No tiene salidas de navegación a otras páginas
