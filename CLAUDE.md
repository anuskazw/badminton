# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Comandos

```bash
npm start          # Inicia la app en http://localhost:3000
npm test           # Lanza los tests en modo watch
npm run build      # Genera la build de producción
```

El backend (`json-server`) está configurado en `src/services/jugadores.js` pero no tiene script en `package.json`. Si se necesita, ejecutar por separado apuntando a `db/database.json`.

Para ejecutar un único test:
```bash
npm test -- --testPathPattern=NombreDelTest
```

## Arquitectura

Aplicación React (Create React App) para gestionar una liga de bádminton. El enrutado está definido en `src/App.js` usando React Router v7.

### Rutas

| Ruta | Componente | Descripción |
|------|-----------|-------------|
| `/` | `Login` | Formulario de acceso (sin autenticación real) |
| `/dashboard` | `Dashboard` | Menú principal con tarjetas de navegación |
| `/ranking` | `Ranking` | Rankings por modalidad (colapsables) |
| `/jugadores` | `Player` | Lista de jugadores; acepta `?id=` para filtrar |
| `/equipos` | `Teams` | Lista de equipos con jugadores; acepta `?id=` para filtrar |
| `/form` | `SetForm` | Formulario para introducir resultados de partidos |
| `/jornadas` | `Jornadas` | Vista de rondas con partidos local/visitante |
| `/competicion` | `Competicion` | Asignación de equipos a pistas con `@dnd-kit` |
| `/competicion-2` | `CompeticionDragAndDrop` | Alternativa sin librería de terceros |

### Datos estáticos

Toda la información de la liga vive en JSON dentro de `src/components/ficheros/`:

- `RANKINGS.json` — rankings por modalidad (`RANKING`, `RANK FEM DOB`, `RANK MASC DOB`, `RANK MIX DOB`, `RANK FEM IND`, `RANK MASC IND`)
- `MODALIDAD_EQUIPOS.json` — equipos con sus jugadores por modalidad (usado en `/competicion` y `/competicion-2`)
- `EQUIPOS_MODALIDAD.json` — equipos agrupados por modalidad (usado en `SetForm`)
- `ID_JUGADORES.json` — identificadores de jugadores

Los datos de `players` y `teams` en `App.js` están hardcodeados y se pasan como props a `Player` y `Teams`.

### Módulo CompeticionDragAndDrop

Implementación drag-and-drop propia (sin `@dnd-kit`) con tres componentes:

- `Column` — columna/pista que contiene Cards; renderiza `DropArea` entre cards
- `Card` — elemento arrastrable que representa un equipo
- `DropArea` — zona invisible donde soltar cards

Cada elemento tiene una propiedad `pista`: `'0'` significa sin asignar; valores `'1'`–`'12'` indican la pista asignada. Las 12 pistas se dividen en 3 tramos (fases) de 4 pistas cada uno. La función `comprobarTramo()` valida que ningún jugador aparezca en más de una pista dentro del mismo tramo. El estado se persiste en `localStorage`.

### Modalidades deportivas

Las modalidades son: Dobles Femenino, Dobles Masculino, Dobles Mixto, Individual Femenino, Individual Masculino. Cada equipo puede participar en varias modalidades con parejas de jugadores distintas.
