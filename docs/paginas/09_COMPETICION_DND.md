# Página: Competición Drag & Drop (versión propia)

**Ruta:** `/competicion-2`  
**Componente:** `src/components/CompeticionDragAndDrop/CompeticionDragAndDrop.js`  
**Subcomponentes:** `Column.js`, `Card.js`, `DropArea.js`  
**CSS:** `CompeticionDragAndDrop.css`, `Card.css`

---

## Descripción

Asignación de equipos a pistas para el día de competición, implementada con drag & drop nativo del navegador (sin librería de terceros). Los equipos se mueven desde la columna "Competidores" hacia las 12 pistas distribuidas en 3 fases. El estado se persiste en el servidor al mover un equipo. Incluye validación en tiempo real para detectar jugadores que aparecen en más de una pista del mismo tramo.

---

## Estructura visual

La pantalla se divide en columnas horizontales:

| Columna | Descripción |
|---------|-------------|
| Competidores | Lista de todos los equipos sin asignar (`pista === '0'`) y asignados |
| Pista 1–4 (1ª fase) | 4 columnas del tramo 1 |
| Pista 1–4 (2ª fase) | 4 columnas del tramo 2 (pistas 5–8 internamente) |
| Pista 1–4 (3ª fase) | 4 columnas del tramo 3 (pistas 9–12 internamente) |

---

## Pistas y fases

| Fase | Pistas visibles | Valores internos de `pista` |
|------|----------------|---------------------------|
| 1ª FASE | Pista 1–4 | `'1'`, `'2'`, `'3'`, `'4'` |
| 2ª FASE | Pista 1–4 | `'5'`, `'6'`, `'7'`, `'8'` |
| 3ª FASE | Pista 1–4 | `'9'`, `'10'`, `'11'`, `'12'` |

El valor `pista === '0'` significa "sin asignar" (columna Competidores).

---

## Comportamiento del drag & drop

- **Inicio:** al arrastrar un `Card`, se activa `setElementoActivo(index)` con el índice del elemento en el array.
- **Drop:** al soltar sobre una `Column` o `DropArea`, se llama a `onDrop(columna, position)`.
  - El elemento se elimina de su posición actual y se inserta en la nueva posición dentro de la columna destino.
  - La propiedad `pista` del elemento se actualiza al valor de la columna destino.
  - Se llama a `actualizarPista(id, columna)` para persistir el cambio en el servidor.

---

## Validación de tramos (jugadores repetidos)

Después de cada cambio de posición se ejecuta `comprobarTramo()` para cada fase:

- Agrupa los equipos de las pistas del tramo.
- Detecta si algún jugador (`nombre`) aparece en más de una pista dentro del mismo tramo.
- Si hay repeticiones, muestra un panel de alerta con el nombre del jugador y las pistas en conflicto.

```
⚠ Jugadores repetidos en el mismo tramo:
  Juan García — pistas 1, 3 (1ª fase)
```

| Estado | Variable |
|--------|----------|
| Repetidos en tramo 1 (pistas 1–4) | `tramosRepetidos.t1` |
| Repetidos en tramo 2 (pistas 5–8) | `tramosRepetidos.t2` |
| Repetidos en tramo 3 (pistas 9–12) | `tramosRepetidos.t3` |

---

## Subcomponentes

### `Column`

Renderiza una columna de pista. Muestra:
- Título de la columna.
- Los `Card` de los elementos cuya `pista` coincide con la de la columna.
- `DropArea` invisible entre cada par de cards y al principio/final.

### `Card`

Elemento arrastrable (`draggable`). Envuelve el componente `Equipo` con los manejadores de drag:
- `onDragStart` → activa el elemento.
- `onDragEnd` → desactiva el elemento activo.

### `DropArea`

Zona de drop invisible que se activa visualmente al pasar sobre ella. Llama a `onDrop` con la posición exacta donde insertar.

### `Equipo` (en `src/components/Equipo.js`)

Tarjeta visual reutilizada también en `/competicion`:
- Nombre del equipo en negrita.
- Badge con las 3 primeras letras de cada palabra de la modalidad (ej: `DOB-FEM`).
- Lista de jugadores separada por comas.

---

## Fuente de datos

- `getCompetidores(temporada)` → `GET participantes?temporada=` — carga los equipos de la temporada activa con su `pista` asignada.
- `actualizarPista(id, columna)` → `PATCH participantes/:id` — persiste el cambio de pista para un equipo.

---

## Estado local

| Variable | Valor inicial | Uso |
|----------|--------------|-----|
| `elementos` | `[]` | Lista de competidores con su pista asignada |
| `elementoActivo` | `null` | Índice del elemento que se está arrastrando |
| `tramosRepetidos` | `{ t1: [], t2: [], t3: [] }` | Jugadores duplicados por tramo |
| `error` | `null` | Mensaje de error si la carga o guardado falla |

**Contexto consumido:** `useTemporada()` → `{ temporada }`

---

## Navegación

- Entrada: desde `/dashboard` (etiqueta "Competición")
- No tiene salidas de navegación
