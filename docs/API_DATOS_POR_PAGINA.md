# API: datos que obtiene cada página de json-server

Base URL: `http://localhost:3001`  
Cliente HTTP: `src/services/api.js` (fetch con JSON)

---

## Resumen rápido

| Página | Colecciones que lee | Colecciones que escribe |
|--------|--------------------|-----------------------|
| Login | — | — |
| Dashboard | `temporadas` | — |
| Ranking | `rankings` | — |
| Jugadores | `jugadores`, `rankings` | — |
| Equipos | `participantes` | — |
| Introducir resultado | `participantes` | `jornadas` |
| Jornadas | `jornadas` | — |
| Competición (dnd-kit) | `participantes` | — |
| Competición DnD | `participantes` | `participantes` (campo `pista`) |
| Temporadas (lista) | `temporadas` | `temporadas` |
| Temporada detalle | `temporadas`, `participantes`, `jornadas` | `temporadas`, `participantes`, `jornadas` |

---

## Por página

---

### Login `/`

No hace ninguna llamada a json-server.

---

### Dashboard `/dashboard`

| Llamada | Endpoint | Parámetros | Uso |
|---------|----------|-----------|-----|
| GET | `temporadas` | — | Cargar lista de temporadas para el `<select>` del sidebar |

**Servicio:** `temporadasService.getTemporadas()`  
**Respuesta usada:** `id`, `nombre`, `estado` (para seleccionar la temporada INICIADA por defecto)

---

### Ranking `/ranking`

| Llamada | Endpoint | Parámetros | Uso |
|---------|----------|-----------|-----|
| GET | `rankings` | `?temporada=` | Todas las entradas de ranking de la temporada activa |

**Servicio:** `rankingsService.getRankings(temporada)`  
**Respuesta usada:** `tipo`, `ID`, `JUGADOR`, `J1`–`J14`, `Total`  
**Campos excluidos de la tabla:** `id`, `tipo`, `ID`

El campo `ID` se usa para navegar a `/jugadores?id=<ID>` al hacer clic en una fila.

---

### Jugadores `/jugadores`

| Llamada | Endpoint | Parámetros | Uso |
|---------|----------|-----------|-----|
| GET | `jugadores` | — | Lista completa de jugadores (sin filtro de temporada) |
| GET | `rankings` | `?temporada=` | Puntuaciones para ordenar la lista y mostrar el desglose |

**Servicios:** `jugadoresService.getJugadores()`, `rankingsService.getRankings(temporada)`

**Campos de `jugadores` usados:** `id`, `nombre`  
**Campos de `rankings` usados:** `tipo`, `ID`, `Total`  
- `tipo === 'RANKING'` → puntuación total (para ordenar y mostrar en la tarjeta)
- `tipo !== 'RANKING'` → desglose por modalidad

**Cruce de datos:** `jugadores.id === rankings.ID` (int–int)

---

### Equipos `/equipos`

| Llamada | Endpoint | Parámetros | Uso |
|---------|----------|-----------|-----|
| GET | `participantes` | `?temporada=` | Equipos y jugadores de la temporada activa |

**Servicio:** `participantesService.getParticipantes(temporada)`  
**Campos usados:** `modalidad`, `equipo`, `jugadores[].nombre`

Si se accede con `?id=`, el filtro se aplica en cliente: `jugadores.some(j => j.id === playerId)`.

---

### Introducir resultado `/form`

| Llamada | Endpoint | Parámetros | Uso |
|---------|----------|-----------|-----|
| GET | `participantes` | `?temporada=` | Cargar equipos y jugadores para los selectores |
| GET | `jornadas` | `?temporada=&modalidad=&jornada=` | Buscar si ya existe la jornada del round robin |
| PATCH | `jornadas/:id` | `{ resultado }` | Actualizar resultado de un partido existente |
| POST | `jornadas` | — | Crear partido amistoso si no existe la jornada |

**Servicios:** `participantesService.getParticipantes()`, `jornadasService.buscarPartido()`, `jornadasService.updatePartido()`, `jornadasService.addPartido()`

**Campos de `participantes` usados:** `id`, `modalidad`, `equipo`, `jugadores[].id`, `jugadores[].nombre`

**Objeto `resultado` enviado en el PATCH (o en el POST):**
```json
{
  "sets": [
    { "local": 21, "visitante": 15 },
    { "local": 18, "visitante": 21 },
    { "local": 15, "visitante": 10 }
  ],
  "puntos": { "local": 2, "visitante": 1 },
  "ganador": "CDC ALTATORRE A",
  "jugadores": {
    "local":     ["Jugador 1", "Jugador 2"],
    "visitante": ["Jugador 3", "Jugador 4"]
  }
}
```

**Objeto completo en el POST (partido amistoso sin jornada previa):**
```json
{
  "temporada": "2025-2026",
  "modalidad": "DOBLES FEMENINO",
  "jornada": 3,
  "tipo": "AMISTOSO",
  "local":     { "idParticipante": "615f", "equipo": "CDC ALTATORRE A" },
  "visitante": { "idParticipante": "9f62", "equipo": "CDC ALTATORRE B" },
  "resultado": { ... }
}
```

---

### Jornadas `/jornadas`

| Llamada | Endpoint | Parámetros | Uso |
|---------|----------|-----------|-----|
| GET | `jornadas` | `?temporada=` | Todos los partidos de la temporada activa |

**Servicio:** `jornadasService.getJornadas(temporada)`  
**Campos usados:** `jornada`, `modalidad`, `tipo`, `local.equipo`, `visitante.equipo`, `resultado.puntos.local`, `resultado.puntos.visitante`, `resultado.jugadores.local`, `resultado.jugadores.visitante`

---

### Competición `/competicion` (dnd-kit)

| Llamada | Endpoint | Parámetros | Uso |
|---------|----------|-----------|-----|
| GET | `participantes` | `?temporada=` | Lista de equipos de la temporada activa para mostrar y reordenar |

**Servicio:** `competidoresService.getCompetidores(temporada)` → apunta a `participantes`  
**Campos usados:** `id`, `modalidad`, `equipo`, `jugadores[].nombre`

No hay escritura: la reordenación es solo en memoria.

---

### Competición DnD `/competicion-2`

| Llamada | Endpoint | Parámetros | Uso |
|---------|----------|-----------|-----|
| GET | `participantes` | `?temporada=` | Lista de equipos con su asignación de pista |
| PATCH | `participantes/:id` | `{ pista }` | Persistir la pista asignada al mover un equipo |

**Servicios:** `competidoresService.getCompetidores()`, `competidoresService.actualizarPista(id, pista)` → ambos apuntan a `participantes`  
**Campos usados:** `id`, `modalidad`, `equipo`, `jugadores[].nombre`, `pista`

El campo `pista` puede ser `'0'` (sin asignar) o `'1'`–`'12'` (pista asignada).

---

### Temporadas (lista) `/temporadas`

| Llamada | Endpoint | Parámetros | Uso |
|---------|----------|-----------|-----|
| GET | `temporadas` | — | Listar todas las temporadas |
| POST | `temporadas` | — | Crear nueva temporada |
| DELETE | `temporadas/:id` | — | Borrar temporada |

**Servicio:** `temporadasService`  
**Campos usados:** `id`, `nombre`, `estado`, `fechaInicio`

---

### Temporada detalle `/temporadas/:id`

#### Lecturas iniciales (paralelas al cargar)

| Llamada | Endpoint | Parámetros | Uso |
|---------|----------|-----------|-----|
| GET | `temporadas/:id` | — | Datos de la temporada |
| GET | `participantes` | `?temporada=` | Lista de participantes |
| GET | `jornadas` | `?temporada=` | Partidos generados |

#### Pestaña Participantes — escrituras

| Acción | Llamada | Endpoint |
|--------|---------|----------|
| Añadir equipo/jugador | POST | `participantes` |
| Editar equipo/jugador | PATCH | `participantes/:id` |
| Reordenar (drag) | PATCH × N | `participantes/:id` (campo `orden`) |
| Descalificar / Reactivar | PATCH | `participantes/:id` (campo `estado`) |
| Eliminar | DELETE | `participantes/:id` |

#### Pestaña Jornadas — escrituras

| Acción | Llamada | Endpoint |
|--------|---------|----------|
| Calcular round robin | DELETE × N + POST × N | `jornadas/:id` + `jornadas` |
| Cambiar ida/vuelta | PATCH | `temporadas/:id` (campo `idaYVuelta`) |

**Objeto POST a `jornadas` (RoundRobin):**
```json
{
  "temporada": "2025-2026",
  "modalidad": "DOBLES FEMENINO",
  "jornada": 1,
  "tipo": "IDA",
  "local": { "idParticipante": "615f", "equipo": "CDC ALTATORRE A" },
  "visitante": { "idParticipante": "9f62", "equipo": "CDC ALTATORRE B" },
  "resultado": null
}
```

#### Cambios de estado

| Acción | Llamada | Endpoint |
|--------|---------|----------|
| Iniciar / Finalizar / Borrar | PATCH o DELETE | `temporadas/:id` |

#### Pestaña Descargar

Solo lectura del array `jornadas` ya cargado en memoria; no hace nuevas llamadas al servidor.
