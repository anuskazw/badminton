# Página: Introducir resultado

**Ruta:** `/form`  
**Componente:** `src/components/SetForm.js`  
**CSS:** `src/components/SetForm.css`

---

## Descripción

Formulario para registrar el resultado de un partido. El usuario selecciona la modalidad, la jornada, los equipos local y visitante, ajusta los jugadores que disputaron el partido, introduce los puntos de cada set, y envía. Si la jornada ya existe en la base de datos (generada por round robin), actualiza su campo `resultado`; si no existe, crea un partido nuevo de tipo `AMISTOSO`.

---

## Flujo de uso

1. Seleccionar **modalidad** → carga los equipos disponibles para esa modalidad.
2. Seleccionar **jornada** (1ª a 14ª).
3. Seleccionar **equipo local** → carga sus jugadores y los preasigna.
4. Seleccionar **equipo visitante** → carga sus jugadores y los preasigna.
5. (Opcional) Ajustar **jugadores** de cada lado si los titulares no fueron quienes jugaron.
6. Introducir puntos de cada **set** (máximo 3 sets).
7. El marcador de puntos (`puntosLocal` / `puntosVisitante`) se actualiza en tiempo real.
8. Pulsar **Enviar** para guardar el partido.

---

## Campos del formulario

### Modalidad

- `<select>` con las modalidades presentes en `participantes` para la temporada activa.
- Al cambiar, filtra los equipos disponibles.

### Jornada

- `<select>` del 1 al 14 (valores hardcodeados: `Array.from({ length: 14 }, …)`).

### Equipo local / visitante

- `<select>` con los equipos de la modalidad seleccionada.
- Al seleccionar, los dos primeros jugadores del equipo se preasignan como jugadores del partido.

### Jugadores local / visitante

- Dos `<select>` por lado, uno por jugador.
- Opciones: los jugadores del equipo seleccionado.
- Permite cambiar quién jugó realmente si fue distinto del titular.

### Sets

- 3 pares de inputs numéricos (Set 1, Set 2, Set 3), uno para local y otro para visitante.
- Cada cambio recalcula los puntos totales: se suman los sets que cada lado ganó.

### Marcador de puntos

- Dos campos deshabilitados que muestran los sets ganados por cada lado en tiempo real.

---

## Cálculo de puntos

```
puntosLocal     = número de sets en los que scoresLocal[i] > scoresVisitante[i]
puntosVisitante = número de sets en los que scoresVisitante[i] > scoresLocal[i]
```

---

## Lógica al enviar

1. Validar campos obligatorios.
2. Construir el objeto `resultado`.
3. Buscar la jornada existente con `buscarPartido(temporada, modalidad, jornada)`.
4. Si existe un partido que coincida con los dos equipos seleccionados (en cualquier orden) → **PATCH** solo el campo `resultado`.
5. Si no existe → **POST** de un partido nuevo con `tipo: 'AMISTOSO'`.

---

## Estructura del objeto `resultado`

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
    "local":     ["Ana García", "Mónica López"],
    "visitante": ["Laura Ruiz", "Carmen Pérez"]
  }
}
```

`ganador` es el nombre del equipo con más puntos, o `null` si hay empate.

---

## Formato POST cuando no existe la jornada (partido amistoso)

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

## Mensajes de feedback

| Situación | Mensaje |
|-----------|---------|
| Campos incompletos | "Por favor, rellene todos los campos obligatorios." |
| Guardado correctamente | "Partido guardado correctamente." |
| Error al guardar | "Error al guardar. ¿Está el servidor en marcha?" |
| Error al cargar equipos | "No se pudo cargar los equipos." |

---

## Fuente de datos

| Llamada | Servicio | Uso |
|---------|---------|-----|
| GET `participantes?temporada=` | `getParticipantes(temporada)` | Equipos y jugadores de la temporada activa |
| GET `jornadas?temporada=&modalidad=&jornada=` | `buscarPartido(temporada, modalidad, jornada)` | Buscar si ya existe la jornada |
| PATCH `jornadas/:id` | `updatePartido(id, { resultado })` | Actualizar resultado de partido existente |
| POST `jornadas` | `addPartido(partido)` | Crear partido amistoso nuevo |

---

## Estado local

| Variable | Valor inicial | Uso |
|----------|--------------|-----|
| `competidores` | `[]` | Todos los participantes de la temporada |
| `modalidad` | `''` | Modalidad seleccionada |
| `equiposDisponibles` | `[]` | Equipos filtrados por la modalidad |
| `equipoLocal` | `''` | ID del participante local |
| `equipoVisitante` | `''` | ID del participante visitante |
| `jugadoresLocal` | `[]` | Jugadores del equipo local |
| `jugadoresVisitante` | `[]` | Jugadores del equipo visitante |
| `competidorLocal` | `['', '']` | Nombres de los jugadores que jugaron por el lado local |
| `competidorVisitante` | `['', '']` | Nombres de los jugadores que jugaron por el lado visitante |
| `scoresLocal` | `[0, 0, 0]` | Puntos de cada set del local |
| `scoresVisitante` | `[0, 0, 0]` | Puntos de cada set del visitante |
| `puntosLocal` | `0` | Sets ganados por el local |
| `puntosVisitante` | `0` | Sets ganados por el visitante |
| `jornada` | `''` | Número de jornada seleccionado |
| `feedback` | `null` | Mensaje de éxito o error |

**Contexto consumido:** `useTemporada()` → `{ temporada }`
