---
name: obtener-calendario-escolar-madrid
description: Obtiene el calendario escolar de cualquier curso académico de la Comunidad de Madrid. Usar cuando el usuario pida el calendario escolar, inicio/fin de curso, vacaciones escolares, días no lectivos o fechas del curso escolar de Madrid.
argument-hint: [curso, ej: 2026-2027] [etapa, ej: primaria]
allowed-tools: [WebFetch, WebSearch, Bash]
---

# Obtener Calendario Escolar de la Comunidad de Madrid

Consulta las fuentes oficiales y extrae las fechas del curso escolar solicitado.

## Conceptos clave

- El calendario escolar se expresa en **curso académico** (ej. 2026-2027), no en año natural.
- Si el usuario indica un año natural (ej. "2027"), interpreta el curso que empieza ese año: 2027-2028.
- El argumento de etapa es opcional. Las etapas válidas son:
  - Educación Infantil
  - Educación Primaria
  - Educación Secundaria Obligatoria (ESO)
  - Bachillerato
  - Formación Profesional
  - Enseñanzas de idiomas, artísticas y deportivas
  - Educación de Personas Adultas / Educación Especial

## Estrategia de consulta según el curso

### Caso A — Curso actual o siguiente (publicado en la web oficial)

La web oficial muestra los dos últimos/próximos cursos. Úsala primero:

1. Usa WebFetch sobre:
   `https://www.comunidad.madrid/educacion/calendario-escolar`
2. Localiza el curso solicitado y extrae sus fechas.
3. Si la página no tiene el detalle completo, accede al calendario interactivo con el patrón:
   `https://www.educa2.madrid.org/web/calendario-escolar-de-la-comunidad-de-madrid/calendario-escolar-{YY}-{YY+1}`
   (ej. para 2026-2027 → `calendario-escolar-26-27`)

### Caso B — Cursos pasados o futuros no disponibles en la web oficial

1. Prueba el calendario interactivo de educa2 con el patrón de URL:
   `https://www.educa2.madrid.org/web/calendario-escolar-de-la-comunidad-de-madrid/calendario-escolar-{YY}-{YY+1}`

2. Si no funciona, usa WebSearch:
   - Query: `calendario escolar {CURSO} Comunidad de Madrid inicio fin vacaciones`
   - Elige fuentes oficiales (comunidad.madrid, educa2.madrid.org) o medios fiables.

3. Los PDFs oficiales tienen el patrón:
   `https://www.comunidad.madrid/docs/{AÑO}-{MES}/calendario-escolar_{YY}-{YY+1}.pdf`
   — pero los PDFs pueden estar cifrados y no ser legibles con WebFetch.

## Instrucciones de ejecución

1. Determina el curso académico solicitado (si no se indica, usa el curso en vigor según `$CURRENT_DATE`).
2. Aplica la estrategia A o B según corresponda.
3. Presenta el resultado con este formato:

### Formato de salida

```
## Calendario Escolar {CURSO} — Comunidad de Madrid

### Fechas clave
- Inicio de curso: DD/MM/AAAA
- Fin de curso:    DD/MM/AAAA
- Total días lectivos: N

### Vacaciones
- Navidad:    DD/MM – DD/MM
- Semana Santa: DD/MM – DD/MM
- Otras:      DD/MM – DD/MM (nombre)

### Días no lectivos destacados
- DD/MM — motivo

### Etapa: <Etapa>   ← solo si se indicó etapa
(diferencias respecto al calendario general, si las hay)
```

## Generar fichero HTML

Tras extraer los datos del calendario, genera el fichero `calendario-escolar-{CURSO}.html` usando Bash con Python. El HTML debe ser autocontenido (sin dependencias externas). Usa este esquema:

```bash
python3 << 'PYEOF'
curso = "AAAA-AAAA"
inicio_curso = "DD/MM/AAAA"
fin_curso    = "DD/MM/AAAA"
dias_lectivos = N

vacaciones = [
    # ("Navidad",       "DD/MM", "DD/MM"),
    # ("Semana Santa",  "DD/MM", "DD/MM"),
]
no_lectivos = [
    # ("DD/MM/AAAA", "Motivo"),
]

def filas_vac(lista):
    return "\n".join(f"<tr><td>{n}</td><td>{d} – {h}</td></tr>" for n, d, h in lista)

def filas_nl(lista):
    return "\n".join(f"<tr><td>{f}</td><td>{m}</td></tr>" for f, m in lista)

html = f"""<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Calendario escolar {curso} — Madrid</title>
  <style>
    body {{ font-family: sans-serif; max-width: 640px; margin: 2rem auto; padding: 0 1rem; color: #222; }}
    h1 {{ font-size: 1.3rem; border-bottom: 2px solid #222; padding-bottom: .4rem; }}
    h2 {{ font-size: .9rem; text-transform: uppercase; letter-spacing: .07em; color: #666; margin: 1.6rem 0 .5rem; }}
    .kv {{ display: grid; grid-template-columns: max-content 1fr; gap: .3rem 1rem; font-size: .95rem; }}
    .kv dt {{ color: #888; }}
    .kv dd {{ margin: 0; font-weight: 500; }}
    table {{ width: 100%; border-collapse: collapse; font-size: .95rem; margin-top: .3rem; }}
    th {{ text-align: left; font-size: .8rem; color: #888; border-bottom: 1px solid #ddd; padding: .3rem .5rem; }}
    td {{ padding: .35rem .5rem; border-bottom: 1px solid #eee; }}
    td:first-child {{ white-space: nowrap; color: #555; }}
    .fuente {{ margin-top: 2rem; font-size: .8rem; color: #aaa; }}
  </style>
</head>
<body>
  <h1>Calendario escolar {curso} — Comunidad de Madrid</h1>
  <h2>Fechas clave</h2>
  <dl class="kv">
    <dt>Inicio de curso</dt><dd>{inicio_curso}</dd>
    <dt>Fin de curso</dt><dd>{fin_curso}</dd>
    <dt>Días lectivos</dt><dd>{dias_lectivos}</dd>
  </dl>
  <h2>Vacaciones</h2>
  <table><thead><tr><th>Período</th><th>Fechas</th></tr></thead>
  <tbody>{filas_vac(vacaciones)}</tbody></table>
  <h2>Días no lectivos</h2>
  <table><thead><tr><th>Fecha</th><th>Motivo</th></tr></thead>
  <tbody>{filas_nl(no_lectivos)}</tbody></table>
  <p class="fuente">Fuente: comunidad.madrid/educacion/calendario-escolar</p>
</body>
</html>"""

nombre = f"calendario-escolar-{curso}.html"
with open(nombre, "w", encoding="utf-8") as f:
    f.write(html)
print(f"Fichero generado: {nombre}")
PYEOF
```

Rellena las variables con los datos obtenidos antes de ejecutar.

## Notas

- La fecha actual es: usa la variable de contexto `currentDate`.
- Indica siempre la fuente consultada.
- Si hay diferencias entre etapas, mencionarlo aunque no se haya pedido una etapa concreta.
- El fichero `calendario-escolar-{CURSO}.html` se genera en el directorio de trabajo actual, sin dependencias externas.
- Responde siempre en español.
