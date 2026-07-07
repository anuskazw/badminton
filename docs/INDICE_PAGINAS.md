# Índice de páginas — Liga Bádminton

Documentación funcional de cada pantalla de la aplicación React.

---

## Rutas y páginas

| # | Ruta | Página | Documento |
|---|------|--------|-----------|
| 1 | `/` | Login | [01_LOGIN.md](paginas/01_LOGIN.md) |
| 2 | `/dashboard` | Dashboard / Menú principal | [02_DASHBOARD.md](paginas/02_DASHBOARD.md) |
| 3 | `/ranking` | Ranking de jugadores | [03_RANKING.md](paginas/03_RANKING.md) |
| 4 | `/jugadores` | Lista de jugadores | [04_JUGADORES.md](paginas/04_JUGADORES.md) |
| 5 | `/equipos` | Equipos por modalidad | [05_EQUIPOS.md](paginas/05_EQUIPOS.md) |
| 6 | `/form` | Introducir resultado | [06_INTRODUCIR_RESULTADO.md](paginas/06_INTRODUCIR_RESULTADO.md) |
| 7 | `/jornadas` | Calendario de jornadas | [07_JORNADAS.md](paginas/07_JORNADAS.md) |
| 8 | `/competicion` | Competición (dnd-kit, incompleto) | [08_COMPETICION.md](paginas/08_COMPETICION.md) |
| 9 | `/competicion-2` | Competición drag & drop | [09_COMPETICION_DND.md](paginas/09_COMPETICION_DND.md) |
| 10 | `/temporadas` | Lista de temporadas | [10_TEMPORADAS.md](paginas/10_TEMPORADAS.md) |
| 11 | `/temporadas/:id` | Detalle de temporada | [11_TEMPORADA_DETALLE.md](paginas/11_TEMPORADA_DETALLE.md) |

---

## Documentación funcional

- [FUNCIONAL_GESTION_TEMPORADA.md](FUNCIONAL_GESTION_TEMPORADA.md) — Flujo completo de inicio de temporada, reglas de negocio y modelo de datos.

## API y datos

- [API_DATOS_POR_PAGINA.md](API_DATOS_POR_PAGINA.md) — Qué colecciones y campos lee/escribe cada página en json-server.
- [PLAN_OPTIMIZACION_API.md](PLAN_OPTIMIZACION_API.md) — Problemas de incoherencia detectados y plan de corrección por fases.

---

## Contexto global

Todas las páginas (excepto Login) leen la **temporada activa** del contexto `TemporadaContext` (`src/context/TemporadaContext.js`). Se selecciona en el Dashboard y persiste durante la sesión. Cambiar la temporada en el selector del sidebar recarga los datos en todas las páginas que usen `useTemporada()`.
