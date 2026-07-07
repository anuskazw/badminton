# Funcional: Gestión del inicio de temporada

## Índice

1. [Visión general](#1-visión-general)
2. [Estados de la temporada](#2-estados-de-la-temporada)
3. [Flujo completo](#3-flujo-completo)
4. [Funcionalidades por estado](#4-funcionalidades-por-estado)
   - 4.1 [Crear y gestionar temporada](#41-crear-y-gestionar-temporada)
   - 4.2 [Gestión de jugadores y equipos](#42-gestión-de-jugadores-y-equipos)
   - 4.3 [Ordenación de participantes](#43-ordenación-de-participantes)
   - 4.4 [Cálculo de jornadas — Round Robin](#44-cálculo-de-jornadas--round-robin)
5. [Requisitos para iniciar temporada](#5-requisitos-para-iniciar-temporada)
6. [Funcionalidades en temporada INICIADA](#6-funcionalidades-en-temporada-iniciada)
   - 6.1 [Edición de equipos](#61-edición-de-equipos)
   - 6.2 [Descalificación de jugador o equipo](#62-descalificación-de-jugador-o-equipo)
   - 6.3 [Descarga de jornadas](#63-descarga-de-jornadas)
7. [Modelo de datos](#7-modelo-de-datos)
8. [Reglas de negocio consolidadas](#8-reglas-de-negocio-consolidadas)

---

## 1. Visión general

Este flujo cubre la preparación y puesta en marcha de una temporada de liga de bádminton. El administrador puede crear una temporada, configurar los participantes por modalidad, generar automáticamente el calendario de partidos mediante round robin, y finalmente activar la temporada.

Una vez iniciada, la temporada permite gestionar incidencias (lesiones, descalificaciones) y descargar el calendario.

---

## 2. Estados de la temporada

| Estado | Código | Descripción |
|--------|--------|-------------|
| Sin iniciar | `PENDIENTE` | Temporada creada pero no activa. Permite configuración completa. |
| Iniciada | `INICIADA` | Liga en curso. Solo se permiten cambios de incidencia (lesiones, descalificaciones). |
| Finalizada | `FINALIZADA` | Temporada cerrada. Solo lectura. |

**Transiciones permitidas:**

```
PENDIENTE ──► INICIADA ──► FINALIZADA
PENDIENTE ──► (borrar)
INICIADA  ──► PENDIENTE  ← solo si no hay resultados registrados
```

---

## 3. Flujo completo

```
[Crear temporada]
       │
       ▼
[Añadir jugadores / equipos por modalidad]
       │
       ▼
[Ordenar participantes por modalidad]
       │
       ▼
[Ejecutar cálculo Round Robin]
       │  ← genera jornadas automáticamente
       ▼
[Validar requisitos] ──✗──► mostrar errores bloqueantes
       │ ✓
       ▼
[Cambiar estado a INICIADA]
       │
       ▼
[Gestión en curso: editar equipos, descalificar, descargar]
       │
       ▼
[Cambiar estado a FINALIZADA]
```

---

## 4. Funcionalidades por estado

### 4.1 Crear y gestionar temporada

**Disponible en:** cualquier estado (con restricciones de borrado).

#### Crear temporada

| Campo | Tipo | Obligatorio | Notas |
|-------|------|-------------|-------|
| Nombre | texto | sí | Ej.: `2025-2026` |
| Fecha de inicio | fecha | no | Referencial |
| Fecha de fin estimada | fecha | no | Referencial |

- El sistema asigna el estado `PENDIENTE` automáticamente al crear.
- No pueden existir dos temporadas con el mismo nombre.

#### Editar temporada

- Permitido solo en estado `PENDIENTE`.
- Se pueden modificar nombre y fechas.

#### Borrar temporada

- Permitido solo en estado `PENDIENTE`.
- Si la temporada tiene jornadas generadas, se pide confirmación explícita advirtiendo que se borrarán también las jornadas.
- No se puede borrar una temporada en estado `INICIADA` o `FINALIZADA`.

---

### 4.2 Gestión de jugadores y equipos

**Disponible en:** estado `PENDIENTE`.

Los participantes se gestionan **por modalidad** dentro de la temporada. Una misma persona puede participar en varias modalidades.

#### Añadir participante a una modalidad

El administrador selecciona la modalidad y puede:

**a) Seleccionar un jugador existente**
- Buscador por nombre sobre el listado global de jugadores (`/jugadores`).
- Selección múltiple para añadir varios a la vez.

**b) Crear un jugador nuevo**
- Formulario rápido inline: nombre, apellidos, género (`M` / `F`).
- El jugador se crea en el listado global y se añade a la modalidad simultáneamente.

#### Configuración por modalidad

| Modalidad | Tipo | Participantes por equipo | Mín. equipos |
|-----------|------|--------------------------|--------------|
| Dobles Femenino | Dobles | 2 titulares + 1 suplente (máx. 3) | 2 |
| Dobles Masculino | Dobles | 2 titulares + 1 suplente (máx. 3) | 2 |
| Dobles Mixto | Dobles | 2 titulares + 2 suplentes (máx. 4: 2H + 2M) | 2 |
| Individual Femenino | Individual | 1 | 2 |
| Individual Masculino | Individual | 1 | 2 |

> **Dobles Mixto:** el equipo debe tener siempre un hombre y una mujer como titulares. Los suplentes, si existen, deben ser también un hombre y una mujer.

#### Quitar participante

- Permitido solo en estado `PENDIENTE`.
- Si ya se han generado jornadas, quitar un participante **invalida el calendario** y obliga a regenerarlo. Se muestra un aviso.

---

### 4.3 Ordenación de participantes

**Disponible en:** estado `PENDIENTE`.

- La lista de participantes de cada modalidad se puede reordenar mediante drag-and-drop.
- El orden inicial puede ser:
  - **Manual:** el administrador arrastra y posiciona.
  - **Por ranking anterior:** botón "Ordenar por ranking" que usa las puntuaciones de la temporada anterior.
  - **Aleatorio:** botón "Orden aleatorio" que mezcla los participantes.
- El orden afecta al emparejamiento del round robin (el participante 1 siempre se enfrenta al último, el 2 al penúltimo, etc., según el sistema Berger).

---

### 4.4 Cálculo de jornadas — Round Robin

**Disponible en:** estado `PENDIENTE`.

El cálculo se ejecuta **por modalidad**. El administrador puede lanzarlo para todas a la vez o modalidad a modalidad.

#### Algoritmo: Sistema Berger (rotación circular)

Sea `N` el número de participantes en una modalidad.

**Si N es par:**
- Número de jornadas: `N − 1`
- Partidos por jornada: `N / 2`
- El participante en posición 1 queda fijo. El resto rota en sentido horario.

**Si N es impar:**
- Se añade un participante ficticio `BYE`.
- `N` pasa a ser `N + 1` (par), se aplica el mismo algoritmo.
- El equipo que queda emparejado con `BYE` en cada jornada descansa esa semana.

**Ejemplo con N = 4 (participantes: A, B, C, D):**

| Jornada | Partido 1 | Partido 2 |
|---------|-----------|-----------|
| J1 | A – D | B – C |
| J2 | A – C | D – B |
| J3 | A – B | C – D |

**Rotación:** se fija A en posición 1; el resto [B, C, D] rota: cada jornada el último de la lista pasa al segundo lugar.

#### Opción ida y vuelta

Si se activa, el número de jornadas se duplica. La segunda mitad replica los emparejamientos de la primera pero invirtiendo local y visitante.

| Jornada | Partido | Tipo |
|---------|---------|------|
| J1–J3 | según tabla anterior | Ida |
| J4 | D – A | C – B | Vuelta |
| J5 | C – A | B – D | Vuelta |
| J6 | B – A | D – C | Vuelta |

#### Referencia: ANEXO_01_Cuadro_de_Rondas.pdf

El script de generación debe validar los emparejamientos contra las tablas del Anexo 01 para los tamaños de grupo predefinidos en el documento. Si el número de participantes coincide con un tamaño de tabla del Anexo, se usa esa tabla directamente; si no, se usa el algoritmo Berger genérico.

> ⚠️ **Pendiente de revisión:** cuando poppler esté disponible en el entorno (`brew install poppler`), ejecutar `pdftotext ANEXO_01_Cuadro_de_Rondas.pdf` para extraer las tablas exactas e incorporarlas al script.

#### Regenerar jornadas

- Si ya existen jornadas generadas para esa modalidad, se puede volver a calcular.
- Si hay resultados registrados en esas jornadas, el sistema **impide** la regeneración y muestra un error.

---

## 5. Requisitos para iniciar temporada

El botón "Iniciar temporada" ejecuta todas estas validaciones antes de cambiar el estado. Si alguna falla, se muestra el listado de errores bloqueantes.

### R1 — Jornadas generadas

- Debe existir al menos una jornada calculada (round robin ejecutado) en al menos una modalidad.
- **Error:** `"No se han generado jornadas. Ejecute el cálculo de round robin antes de iniciar."`

### R2 — Mínimo de participantes

- Cada modalidad que tiene participantes debe tener al menos **2**.
- Una modalidad sin ningún participante no bloquea (simplemente no tiene liga ese año).
- **Error:** `"La modalidad [X] tiene solo [N] participante(s). Se necesitan al menos 2."`

### R3 — Composición de equipos en modalidades de dobles

| Modalidad | Mín. jugadores/equipo | Máx. jugadores/equipo | Restricción adicional |
|-----------|----------------------|----------------------|----------------------|
| Dobles Femenino | 2 | 3 | Todos deben ser de género F |
| Dobles Masculino | 2 | 3 | Todos deben ser de género M |
| Dobles Mixto | 2 | 4 | Exactamente 1H + 1M titulares; suplentes opcionales: 1H + 1M |

- **Error (composición):** `"El equipo [X] en [Modalidad] tiene [N] jugadores. Máximo permitido: [M]."`
- **Error (género):** `"El equipo [X] en Dobles Mixto no cumple la composición de género."`

### R4 — Sin participantes duplicados en la misma modalidad

- Un jugador no puede aparecer en dos equipos distintos dentro de la misma modalidad.
- **Error:** `"[Jugador] aparece en más de un equipo en la modalidad [X]."`

---

## 6. Funcionalidades en temporada INICIADA

### 6.1 Edición de equipos

**Caso de uso principal: sustitución por lesión.**

El administrador puede entrar en la edición de cualquier equipo y:

- **Sustituir un jugador:** seleccionar un jugador existente del listado global o crear uno nuevo, y reemplazar al lesionado. El jugador sustituido queda marcado como `inactivo` en ese equipo para esa temporada (no se borra del sistema global).
- **Las jornadas ya jugadas** conservan el nombre del jugador que jugó realmente.
- **Las jornadas pendientes** mostrarán el nuevo jugador.

> La sustitución no regenera el calendario; solo actualiza quién representa al equipo de ahí en adelante.

### 6.2 Descalificación de jugador o equipo

Accesible desde la pantalla de edición del jugador o del equipo.

**Comportamiento:**

- El jugador/equipo queda marcado con estado `DESCALIFICADO` para la temporada activa.
- Sus resultados históricos **no se borran**.
- En el ranking, sus puntuaciones se muestran como `0` (o con un indicador visual de descalificación), pero el registro existe.
- Los partidos pendientes contra ese equipo quedan como `W.O.` (walkover) a favor del rival automáticamente, salvo configuración manual del administrador.
- La descalificación es **reversible** (el administrador puede quitar la descalificación si fue un error), restaurando las puntuaciones al valor original.

### 6.3 Descarga de jornadas

El administrador puede descargar el calendario de partidos en dos modos:

#### Descarga completa (todas las jornadas)

- Botón: **"Descargar temporada completa"**
- Formato: CSV o PDF (seleccionable)
- Contenido por fila: `Jornada | Modalidad | Local | Visitante | Fecha (si existe) | Resultado (si existe)`

#### Descarga por jornada

- Selector de jornada (1, 2, 3…) y botón **"Descargar jornada"**
- Mismo formato que la descarga completa pero filtrado por jornada
- Útil para imprimir la hoja del día de competición

**Columnas del fichero descargado:**

| Campo | Descripción |
|-------|-------------|
| `temporada` | Ej.: `2025-2026` |
| `jornada` | Número de jornada |
| `modalidad` | Ej.: `DOBLES FEMENINO` |
| `local` | Nombre del equipo/jugador local |
| `visitante` | Nombre del equipo/jugador visitante |
| `set1_local` | Puntos set 1 local (vacío si no jugado) |
| `set1_visitante` | Puntos set 1 visitante |
| `set2_local` | Puntos set 2 local |
| `set2_visitante` | Puntos set 2 visitante |
| `set3_local` | Puntos set 3 local (si aplica) |
| `set3_visitante` | Puntos set 3 visitante |
| `resultado` | `[local] X – Y [visitante]` o vacío |
| `tipo` | `IDA` / `VUELTA` |

---

## 7. Modelo de datos

### Temporada

```json
{
  "id": "2025-2026",
  "nombre": "2025-2026",
  "estado": "PENDIENTE",
  "idaYVuelta": true,
  "fechaInicio": "2025-09-01",
  "fechaFin": null
}
```

### Participante en temporada

```json
{
  "id": 1,
  "temporada": "2025-2026",
  "modalidad": "DOBLES FEMENINO",
  "idEquipo": 5,
  "equipo": "CDC ALTATORRE A",
  "jugadores": [
    { "ID": 8, "PLAYER": "MÓNICA RODRÍGUEZ VARELA", "rol": "titular", "genero": "F" },
    { "ID": 10, "PLAYER": "ANA MARÍA CABALLERO GÓMEZ", "rol": "titular", "genero": "F" },
    { "ID": 28, "PLAYER": "MARÍA JOSÉ LÓPEZ ESPEJO", "rol": "suplente", "genero": "F" }
  ],
  "orden": 1,
  "estado": "ACTIVO",
  "pista": "0"
}
```

> `estado` del participante: `ACTIVO` | `DESCALIFICADO` | `RETIRADO`

### Jugador global

```json
{
  "id": 10,
  "nombre": "ANA MARÍA CABALLERO GÓMEZ",
  "genero": "F"
}
```

> Se añade el campo `genero` al modelo global para poder validar la composición de equipos mixtos.

### Jornada generada

```json
{
  "id": 1,
  "temporada": "2025-2026",
  "modalidad": "DOBLES FEMENINO",
  "jornada": 1,
  "tipo": "IDA",
  "local": { "idEquipo": 1, "equipo": "CDC ALTATORRE A" },
  "visitante": { "idEquipo": 2, "equipo": "CDC ALTATORRE B" },
  "resultado": null
}
```

---

## 8. Reglas de negocio consolidadas

| # | Regla | Estado en que aplica |
|---|-------|---------------------|
| RN-01 | No se puede borrar una temporada en estado `INICIADA` o `FINALIZADA` | Siempre |
| RN-02 | Solo se puede editar nombre/fechas de la temporada en estado `PENDIENTE` | `PENDIENTE` |
| RN-03 | Añadir/quitar participantes solo en estado `PENDIENTE` | `PENDIENTE` |
| RN-04 | La ordenación de participantes solo en estado `PENDIENTE` | `PENDIENTE` |
| RN-05 | El cálculo de round robin solo en estado `PENDIENTE` | `PENDIENTE` |
| RN-06 | No se puede regenerar el calendario si hay resultados registrados | `PENDIENTE` |
| RN-07 | Para pasar a `INICIADA`: deben existir jornadas generadas | `PENDIENTE` → `INICIADA` |
| RN-08 | Para pasar a `INICIADA`: mínimo 2 participantes por modalidad con participantes | `PENDIENTE` → `INICIADA` |
| RN-09 | Dobles no mixto: máx. 3 jugadores/equipo | `PENDIENTE` → `INICIADA` |
| RN-10 | Dobles Mixto: máx. 4 jugadores (2H + 2M) | `PENDIENTE` → `INICIADA` |
| RN-11 | Un jugador no puede estar en 2 equipos de la misma modalidad | `PENDIENTE` → `INICIADA` |
| RN-12 | Sustitución por lesión: los resultados pasados conservan al jugador original | `INICIADA` |
| RN-13 | Descalificación: puntuaciones se mantienen en BD pero cuentan como 0 en ranking | `INICIADA` |
| RN-14 | La descalificación es reversible mientras la temporada esté `INICIADA` | `INICIADA` |
| RN-15 | Partidos pendientes contra equipo descalificado → W.O. automático | `INICIADA` |
| RN-16 | Descarga de jornadas disponible desde que existen jornadas generadas | `PENDIENTE` / `INICIADA` / `FINALIZADA` |
