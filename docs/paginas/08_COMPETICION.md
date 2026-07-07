# Página: Competición (versión @dnd-kit)

**Ruta:** `/competicion`  
**Componente:** `src/components/Competicion.js`  
**CSS:** `src/components/Competicion.css`

---

## Descripción

Vista experimental de asignación de equipos a pistas usando la librería `@dnd-kit`. Muestra la lista de competidores y 12 pistas vacías donde arrastrarlos. **Esta versión está incompleta**: las pistas son contenedores vacíos sin lógica de drop funcional (solo se implementó la lista draggable de equipos con reordenación interna).

> Esta página no aparece en el menú de navegación del Dashboard. La versión funcional es `/competicion-2`.

---

## Estructura visual

| Zona | Descripción |
|------|-------------|
| Lista de competidores | Columna izquierda con todos los equipos ordenables por drag |
| Pistas (1–12) | 12 contenedores vacíos a la derecha, sin lógica de drop |

---

## Componente `Equipo` (interno)

Tarjeta arrastrable con `useSortable` de `@dnd-kit/sortable`:

| Elemento | Contenido |
|----------|-----------|
| Badge de modalidad | Badge con color según `idModalidad` |
| Nombre del equipo | `equipo` en negrita |
| Jugadores | Lista separada por comas (`jugadores.map(j => j.nombre)`) |

---

## Lógica de drag & drop

- Usa `DndContext` con `closestCorners` como estrategia de colisión.
- `SortableContext` con `verticalListSortingStrategy` para la lista de equipos.
- Al soltar (`handleDragEnd`), reordena la lista con `arrayMove` de `@dnd-kit/sortable`.
- Las 12 pistas tienen `id` duplicado (todas con `id="1"`) — error pendiente de corrección.
- No hay lógica de mover equipos entre la lista y las pistas.

---

## Fuente de datos

- `getCompetidores(temporada)` → `GET participantes?temporada=` — carga los equipos de la temporada activa con su modalidad y jugadores.
- Si falla, muestra: *"No se pudo cargar los competidores. ¿Está el servidor en marcha?"*

---

## Estado local

| Variable | Valor inicial | Uso |
|----------|--------------|-----|
| `equipos` | `[]` | Lista de competidores |
| `error` | `null` | Mensaje de error si la carga falla |

**Contexto consumido:** `useTemporada()` → `{ temporada }`

---

## Estado de desarrollo

Esta página está **incompleta**. La funcionalidad equivalente y completa está implementada en `/competicion-2` (`CompeticionDragAndDrop`).
