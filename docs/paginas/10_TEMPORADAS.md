# Página: Temporadas (lista)

**Ruta:** `/temporadas`  
**Componente:** `src/components/Temporadas/TemporadasList.js`  
**CSS:** `src/components/Temporadas/Temporadas.css`

---

## Descripción

Pantalla de gestión del ciclo de vida de las temporadas. Permite crear nuevas temporadas, ver su estado actual y acceder al detalle de cada una para configurarla. Es el punto de entrada para preparar una nueva liga.

---

## Estructura visual

| Sección | Contenido |
|---------|-----------|
| Cabecera | Título "Temporadas" + botón "+ Nueva temporada" |
| Formulario (colapsable) | Aparece al pulsar el botón; permite crear una temporada |
| Grid de tarjetas | Una tarjeta por temporada, ordenadas por estado |

---

## Formulario de nueva temporada

Campos:

| Campo | Tipo | Obligatorio | Ejemplo |
|-------|------|-------------|---------|
| Nombre | texto | sí | `2025-2026` |
| Fecha de inicio | fecha | no | `2025-09-01` |

Al crear, se asigna automáticamente `estado: 'PENDIENTE'` e `idaYVuelta: false`.

El formulario se cierra y la lista se recarga al crear correctamente. El botón "Cancelar" cierra el formulario sin crear.

---

## Tarjeta de temporada

Cada tarjeta muestra:

| Elemento | Contenido |
|----------|-----------|
| Nombre | Nombre de la temporada |
| Badge de estado | `PENDIENTE`, `INICIADA` o `FINALIZADA` (con color diferenciado) |
| Fecha de inicio | Solo si existe; formato: "Inicio: YYYY-MM-DD" |
| Botón "Gestionar" | Navega a `/temporadas/:id` |
| Botón "Borrar" | Solo visible si `estado === 'PENDIENTE'` |

---

## Orden de las tarjetas

Las temporadas se ordenan por estado:

| Estado | Orden |
|--------|-------|
| PENDIENTE | 0 (primeras) |
| INICIADA | 1 |
| FINALIZADA | 2 (últimas) |

---

## Borrar temporada

- Solo disponible en estado `PENDIENTE`.
- Si se intenta borrar una en otro estado, muestra un `alert`: *"Solo se pueden borrar temporadas en estado PENDIENTE."*
- Pide confirmación con `window.confirm` advirtiendo que también se borrarán jornadas y participantes.
- Tras borrar, recarga la lista.

---

## Fuente de datos

- `getTemporadas()` — lista de temporadas.
- `addTemporada(datos)` — crea una nueva temporada.
- `deleteTemporada(id)` — borra una temporada y su contenido asociado.

---

## Estado local

| Variable | Valor inicial | Uso |
|----------|--------------|-----|
| `temporadas` | `[]` | Lista cargada del servidor |
| `mostrarForm` | `false` | Visibilidad del formulario de creación |
| `nombre` | `''` | Campo nombre del formulario |
| `fechaInicio` | `''` | Campo fecha de inicio del formulario |

---

## Navegación

- Entrada: desde `/dashboard`
- Salida: `/temporadas/:id` al pulsar "Gestionar"
