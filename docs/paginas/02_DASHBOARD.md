# Página: Dashboard

**Ruta:** `/dashboard`  
**Componente:** `src/components/Dashboard.js`  
**CSS:** `src/components/Dashboard.css`

---

## Descripción

Menú principal de la aplicación. Sirve como punto de entrada a todas las secciones. Incluye un selector de temporada global que afecta a todas las demás páginas a través del contexto `TemporadaContext`.

---

## Estructura visual

La página tiene dos zonas:

### Barra lateral (`<aside class="sidebar">`)

| Sección | Contenido |
|---------|-----------|
| Marca | Icono "LB" + texto "Liga Bádminton" |
| Selector de temporada | `<select>` con todas las temporadas disponibles |
| Navegación | Lista de enlaces a todas las secciones |
| Footer | Enlace "Cerrar sesión" → `/` |

### Área principal (`<main class="dashboard-main">`)

| Sección | Contenido |
|---------|-----------|
| Cabecera | Título "Bienvenida a la Liga" + badge con nombre de temporada activa |
| Intro | Texto de instrucción |
| Tarjetas | Grid de tarjetas clicables, una por sección |

---

## Secciones disponibles (NAV_ITEMS)

| Etiqueta | Ruta destino |
|----------|-------------|
| Ranking | `/ranking` |
| Equipos | `/equipos` |
| Jugadores | `/jugadores` |
| Jornadas | `/jornadas` |
| Introducir resultado | `/form` |
| Competición | `/competicion-2` |
| Temporadas | `/temporadas` |

Los enlaces de la barra lateral marcan el ítem activo comparando `location.pathname` con la ruta de cada ítem.

---

## Lógica del selector de temporada

- Al cargar, llama a `getTemporadas()` para obtener la lista del servidor.
- Si no hay temporada seleccionada en el contexto (o la seleccionada ya no existe), selecciona automáticamente la que tenga `estado === 'INICIADA'`; si no hay ninguna iniciada, selecciona la última de la lista.
- El valor seleccionado se guarda en `TemporadaContext` y es global: todas las páginas que usen `useTemporada()` reflejarán el cambio.

---

## Estado local

| Variable | Valor inicial | Uso |
|----------|--------------|-----|
| `temporadas` | `[]` | Lista de temporadas cargadas del servidor |

**Contexto consumido:** `useTemporada()` → `{ temporada, setTemporada }`

---

## Navegación

- Entrada: desde `/` (Login)
- Salida: cualquier sección mediante los enlaces del sidebar o las tarjetas
- Cerrar sesión: vuelve a `/`
