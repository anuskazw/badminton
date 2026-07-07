# Página: Ranking

**Ruta:** `/ranking`  
**Componente:** `src/components/Ranking.js`  
**CSS:** `src/components/Ranking.css`

---

## Descripción

Muestra los rankings de jugadores por modalidad para la temporada activa. Cada modalidad es una sección colapsable: solo se expande una a la vez. Hacer clic en una fila de jugador navega al detalle de ese jugador.

---

## Modalidades disponibles

| Etiqueta visible | Código interno (`tipo`) |
|-----------------|------------------------|
| Global | `RANKING` |
| Dobles Femenino | `RANK FEM DOB` |
| Dobles Masculino | `RANK MASC DOB` |
| Dobles Mixto | `RANK MIX DOB` |
| Individual Femenino | `RANK FEM IND` |
| Individual Masculino | `RANK MASC IND` |

---

## Comportamiento de la lista

- Se muestra un botón por cada modalidad.
- Al pulsar un botón, se expande esa sección y se cierra la que estuviera abierta (acordeón: solo una abierta a la vez).
- Dentro de cada sección se muestra una tabla con las columnas que vienen del servidor (excepto `id`, `tipo` e `ID`, que se excluyen).
- La columna `Total` se muestra en negrita.
- Hacer clic en una fila navega a `/jugadores?id=<ID>` usando el campo `ID` del registro.

---

## Fuente de datos

- Servicio: `getRankings(temporada)` — filtra por la temporada activa del contexto.
- Si el servidor no está disponible, muestra el mensaje: *"No se pudo cargar el ranking. ¿Está el servidor en marcha?"*

---

## Estado local

| Variable | Valor inicial | Uso |
|----------|--------------|-----|
| `rankings` | `[]` | Lista completa de entradas de ranking |
| `openSection` | `null` | Tipo (`tipo`) de la sección actualmente abierta |
| `error` | `null` | Mensaje de error si la carga falla |

**Contexto consumido:** `useTemporada()` → `{ temporada }`

---

## Navegación

- Entrada: desde `/dashboard`
- Salida: `/jugadores?id=<ID>` al hacer clic en una fila

---

## Notas

- Los campos excluidos de las cabeceras de la tabla son: `id`, `tipo`, `ID`.
- El componente se recarga automáticamente si cambia la temporada activa en el contexto.
