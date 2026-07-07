# Página: Jugadores

**Ruta:** `/jugadores` (lista) | `/jugadores?id=<ID>` (detalle de uno)  
**Componente:** `src/components/Player.js`  
**CSS:** `src/components/Player.css`

---

## Descripción

Muestra la lista de jugadores ordenada por puntuación total descendente. Si se accede con el parámetro `?id=`, filtra y muestra solo ese jugador. Hacer clic en un jugador expande su ficha con el desglose de puntos por modalidad.

---

## Modos de uso

### Modo lista (sin parámetro `?id`)

- Título: "Lista de Jugadores"
- Muestra todos los jugadores ordenados por puntuación total (`RANKING`) de mayor a menor.

### Modo detalle (`?id=<ID>`)

- Título: "Jugador"
- Filtra la lista para mostrar únicamente al jugador cuyo `id` coincide con el parámetro.
- Se accede desde la página de Ranking al hacer clic en una fila.

---

## Ficha de jugador

Cada jugador se muestra como una tarjeta clicable:

| Elemento | Contenido |
|----------|-----------|
| Nombre | Nombre completo del jugador |
| Puntos totales | Valor `Total` del tipo `RANKING` |

Al expandir (clic), se muestra el desglose de modalidades:

| Modalidad | Código `tipo` |
|-----------|--------------|
| Individual femenino | `RANK FEM IND` |
| Individual masculino | `RANK MASC IND` |
| Dobles femenino | `RANK FEM DOB` |
| Dobles masculino | `RANK MASC DOB` |
| Dobles mixto | `RANK MIX DOB` |

Solo se muestran las modalidades en las que el jugador tiene puntuación registrada.

---

## Fuentes de datos

- `getJugadores()` — lista global de jugadores (independiente de temporada).
- `getRankings(temporada)` — puntuaciones de la temporada activa.

Si alguna de las dos llamadas falla, muestra: *"No se pudo cargar los datos. ¿Está el servidor en marcha?"*

---

## Estado local

| Variable | Valor inicial | Uso |
|----------|--------------|-----|
| `jugadores` | `[]` | Lista de jugadores del servidor |
| `rankings` | `[]` | Entradas de ranking de la temporada activa |
| `openPlayerId` | `null` | ID del jugador cuya ficha está expandida |
| `error` | `null` | Mensaje de error si la carga falla |

**Contexto consumido:** `useTemporada()` → `{ temporada }`

---

## Navegación

- Entrada: desde `/ranking` (con `?id`) o desde `/dashboard`
- No tiene salidas de navegación propias
