---
name: obtener-calendario-laboral-madrid
description: Obtiene los festivos oficiales de cualquier año de la Comunidad de Madrid. Usar cuando el usuario pida los festivos de Madrid, el calendario laboral, días festivos de la comunidad de Madrid, o días no laborables.
argument-hint: [año] [municipio]
allowed-tools: [WebFetch, WebSearch, Bash]
---

# Obtener Calendario Laboral de la Comunidad de Madrid

Consulta las fuentes oficiales y extrae los festivos del año solicitado.

## Estrategia de consulta según el año

### Caso A — Año en curso o próximo (publicado en la web oficial)

La web oficial solo muestra el año en curso. Úsala cuando el año coincida con `$CURRENT_YEAR` o el siguiente:

1. Usa WebFetch sobre:
   `https://www.comunidad.madrid/empleo/calendario-laboral-comunidad-madrid-municipios`
2. Extrae festivos nacionales y autonómicos de Madrid.

### Caso B — Años pasados o futuros no publicados aún en la web oficial

La web oficial no tiene datos de otros años. **Usa este flujo en su lugar:**

1. **Ir directamente** a calendarioslaborales.com, que sí mantiene histórico:
   `https://calendarioslaborales.com/calendario-laboral-madrid-{AÑO}.htm`
   (sustituye `{AÑO}` por el año solicitado, ej. `madrid-2024.htm`, `madrid-2027.htm`)

2. Si esa URL no funciona (404), usa WebSearch:
   - Query: `calendario laboral {AÑO} Comunidad de Madrid festivos nacionales autonómicos lista completa`
   - Elige el resultado de `calendarioslaborales.com` o fuente oficial equivalente.

3. Como fuente de contraste oficial, los decretos del BOCM están en:
   `https://www.bocm.es/` — pero los PDFs suelen estar cifrados y no son legibles con WebFetch.

### Caso C — Festivos locales de un municipio

Si el usuario indica un municipio (`$ARGUMENTS`):
- Busca en WebSearch: `festivos locales {MUNICIPIO} Madrid {AÑO}`
- O consulta la resolución del BOCM de diciembre del año anterior.

## Instrucciones de ejecución

1. Determina el año solicitado (si no se indica, usa `$CURRENT_YEAR`).
2. Aplica la estrategia A o B según corresponda.
3. Presenta el resultado con este formato:

### Formato de salida

```
## Festivos {AÑO} — Comunidad de Madrid

### Festivos nacionales
- DD/MM — Nombre del festivo
...

### Festivos de la Comunidad de Madrid
- DD/MM — Nombre del festivo
...

### Festivos locales: <Municipio>   ← solo si se indicó municipio
- DD/MM — Nombre del festivo
...

**Total días festivos**: N
```

## Generar fichero HTML

Tras extraer los festivos, genera el fichero `calendario-laboral-madrid-{AÑO}.html` usando Bash con Python. El HTML debe ser autocontenido (sin dependencias externas). Usa este esquema:

```bash
python3 << 'PYEOF'
festivos_nacionales = [
    # ("DD/MM", "Nombre del festivo"),
]
festivos_autonomicos = [
    # ("DD/MM", "Nombre del festivo"),
]
festivos_locales = [
    # ("DD/MM", "Nombre del festivo"),  # solo si se indicó municipio
]
anyo = "AAAA"
municipio = ""  # vacío si no se indicó

def filas(lista):
    return "\n".join(f"<tr><td>{d}</td><td>{n}</td></tr>" for d, n in lista)

locales_section = ""
if festivos_locales and municipio:
    locales_section = f"""
<h2>Festivos locales: {municipio}</h2>
<table><thead><tr><th>Fecha</th><th>Festivo</th></tr></thead>
<tbody>{filas(festivos_locales)}</tbody></table>"""

html = f"""<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Festivos {anyo} — Comunidad de Madrid</title>
  <style>
    body {{ font-family: sans-serif; max-width: 640px; margin: 2rem auto; padding: 0 1rem; color: #222; }}
    h1 {{ font-size: 1.3rem; border-bottom: 2px solid #222; padding-bottom: .4rem; }}
    h2 {{ font-size: .9rem; text-transform: uppercase; letter-spacing: .07em; color: #666; margin: 1.6rem 0 .5rem; }}
    table {{ width: 100%; border-collapse: collapse; font-size: .95rem; }}
    th {{ text-align: left; font-size: .8rem; color: #888; border-bottom: 1px solid #ddd; padding: .3rem .5rem; }}
    td {{ padding: .35rem .5rem; border-bottom: 1px solid #eee; }}
    td:first-child {{ white-space: nowrap; color: #555; width: 4.5rem; }}
    .total {{ margin-top: 1.2rem; font-size: .85rem; color: #666; }}
    .fuente {{ margin-top: 2rem; font-size: .8rem; color: #aaa; }}
  </style>
</head>
<body>
  <h1>Festivos {anyo} — Comunidad de Madrid</h1>
  <h2>Festivos nacionales</h2>
  <table><thead><tr><th>Fecha</th><th>Festivo</th></tr></thead>
  <tbody>{filas(festivos_nacionales)}</tbody></table>
  <h2>Festivos de la Comunidad de Madrid</h2>
  <table><thead><tr><th>Fecha</th><th>Festivo</th></tr></thead>
  <tbody>{filas(festivos_autonomicos)}</tbody></table>
  {locales_section}
  <p class="total">Total: {len(festivos_nacionales) + len(festivos_autonomicos) + len(festivos_locales)} días festivos</p>
  <p class="fuente">Fuente: calendarioslaborales.com</p>
</body>
</html>"""

nombre = f"calendario-laboral-madrid-{anyo}.html"
with open(nombre, "w", encoding="utf-8") as f:
    f.write(html)
print(f"Fichero generado: {nombre}")
PYEOF
```

Rellena las listas `festivos_nacionales`, `festivos_autonomicos` y `festivos_locales` con los datos obtenidos antes de ejecutar.

## Notas

- El año actual es: usa la variable de contexto `currentDate`.
- Indica siempre la fuente consultada.
- Si algún municipio no ha comunicado sus festivos locales, indícalo explícitamente.
- El fichero `calendario-laboral-madrid-{AÑO}.html` se genera en el directorio de trabajo actual, sin dependencias externas.
- Responde siempre en español.
