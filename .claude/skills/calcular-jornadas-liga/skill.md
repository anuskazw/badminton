---
name: calcular-jornadas-liga
description: Calcula los fines de semana disponibles para jornadas de liga de bádminton en cualquier temporada (sep–jun). Devuelve únicamente los fines de semana de la 2ª y 4ª semana de cada mes, excluyendo los que caen en puentes, y genera un fichero .html con los domingos disponibles.
argument-hint: [temporada, ej: 2027-2028]
allowed-tools: [Bash]
---

# Calcular jornadas de liga — cualquier temporada

## Objetivo

Obtener todos los fines de semana (sábado + domingo) de la **2ª y 4ª semana de cada mes** dentro de la temporada indicada (**1 septiembre – 30 junio**), descartando los que coincidan con un puente de alto riesgo.

Si no se indica temporada en `$ARGUMENTS`, usa la siguiente temporada a partir de la fecha actual (`$CURRENT_DATE`).

## Definición de "semana del mes"

Divide el mes en bloques de 7 días desde el día 1:
- 1ª semana: días 1–7
- 2ª semana: días 8–14
- 3ª semana: días 15–21
- 4ª semana: días 22–28
- 5ª semana: días 29–31 (si los hay)

Un fin de semana pertenece a la 2ª o 4ª semana si su **sábado** cae en los días 8–14 o 22–28 del mes respectivamente.

## Lógica de detección de puentes

Los puentes se detectan automáticamente a partir de los festivos fijos de España/Madrid. Para cada festivo se aplica esta regla según el día de la semana en que cae:

| Día del festivo | Ventana bloqueada                         |
|-----------------|-------------------------------------------|
| Viernes         | festivo + sábado + domingo siguientes     |
| Sábado          | sábado + domingo (el propio fin de semana)|
| Domingo         | sábado + domingo (el propio fin de semana)|
| Lunes           | sábado + domingo precedentes              |

**Caso especial — Reyes Magos (6 de enero):** independientemente del día en que caiga, siempre se bloquea el primer fin de semana posterior al 6 de enero (la semana siguiente es demasiado próxima a las fiestas).

Los festivos fijos que se evalúan son:
- 25 dic (año 1): Navidad
- 1 ene (año 2): Año Nuevo
- 6 ene (año 2): Reyes Magos
- 1 may (año 2): Día del Trabajo — si cae en sábado, también bloquea el lunes (traslado CAM)
- 2 may (año 2): Comunidad de Madrid — si el 1 may cae en sábado, el 2 se traslada al lunes, por lo que el bloqueo ya cubre el lunes; en otro caso evaluar por separado

## Instrucciones de ejecución

Sustituye `TEMPORADA` por el valor de `$ARGUMENTS` (ej. `2027-2028`) y ejecuta con Bash:

```bash
python3 << 'EOF'
import sys
from datetime import date, timedelta

# --- Parámetro de temporada ---
import re
raw = "$ARGUMENTS".strip()
match = re.search(r'(\d{4}-\d{4})', raw)
if match:
    season = match.group(1)
else:
    hoy = date.today()
    year1 = hoy.year if hoy.month >= 9 else hoy.year - 1
    season = f"{year1}-{year1+1}"

year1, year2 = map(int, season.split('-'))
temporada_inicio = date(year1, 9, 1)
temporada_fin    = date(year2, 6, 30)

# --- Detección de puentes ---
def next_sat_after(d):
    days = (5 - d.weekday()) % 7
    return d + timedelta(days=days if days else 7)

puentes = []  # lista de (inicio, fin, motivo)

def add_puente(festivo, nombre):
    dow = festivo.weekday()  # 0=lun … 4=vie, 5=sáb, 6=dom
    if dow == 4:   # viernes → bloquea el fin de semana siguiente
        puentes.append((festivo, festivo + timedelta(2), f"{nombre} (viernes)"))
    elif dow == 5:  # sábado
        puentes.append((festivo, festivo + timedelta(1), f"{nombre} (sábado)"))
    elif dow == 6:  # domingo
        puentes.append((festivo - timedelta(1), festivo, f"{nombre} (domingo)"))
    elif dow == 0:  # lunes → bloquea el fin de semana anterior
        puentes.append((festivo - timedelta(2), festivo, f"{nombre} (lunes)"))

# Navidad
navidad = date(year1, 12, 25)
if temporada_inicio <= navidad <= temporada_fin:
    add_puente(navidad, "Navidad")

# Año Nuevo
anyo_nuevo = date(year2, 1, 1)
if temporada_inicio <= anyo_nuevo <= temporada_fin:
    add_puente(anyo_nuevo, "Año Nuevo")

# Reyes Magos: siempre bloquea el fin de semana siguiente al 6 de enero
reyes = date(year2, 1, 6)
if temporada_inicio <= reyes <= temporada_fin:
    sat = next_sat_after(reyes + timedelta(1))
    puentes.append((reyes, sat + timedelta(1),
                    f"Reyes Magos → fin de semana {sat.day}/{sat.month}"))

# Día del Trabajo + Comunidad de Madrid
trabajo = date(year2, 5, 1)
if temporada_inicio <= trabajo <= temporada_fin:
    dow = trabajo.weekday()
    if dow == 5:  # sábado → CAM traslada el lunes
        puentes.append((trabajo, trabajo + timedelta(2),
                        "Día del Trabajo (sáb) + CAM trasladado al lunes"))
    else:
        add_puente(trabajo, "Día del Trabajo")
    # 2 de mayo (si no fue absorbido por el bloqueo anterior)
    cam = date(year2, 5, 2)
    if not any(i <= cam <= f for i, f, _ in puentes):
        add_puente(cam, "Comunidad de Madrid")

# --- Cálculo de fines de semana ---
def en_puente(sab, dom):
    return any(not (dom < i or sab > f) for i, f, _ in puentes)

resultados  = []
descartados = []
d = temporada_inicio
while d.weekday() != 5:
    d += timedelta(days=1)

while d <= temporada_fin:
    sab = d
    dom = d + timedelta(1)
    dia = sab.day
    es_2a = 8 <= dia <= 14
    es_4a = 22 <= dia <= 28
    if (es_2a or es_4a) and dom <= temporada_fin:
        num = "2ª" if es_2a else "4ª"
        if en_puente(sab, dom):
            motivo = next((m for i, f, m in puentes if not (dom < i or sab > f)), "puente")
            descartados.append((sab, dom, num, motivo))
        else:
            resultados.append((sab, dom, num))
    d += timedelta(weeks=1)

# --- Salida por consola ---
meses_es = {1:"enero",2:"febrero",3:"marzo",4:"abril",5:"mayo",6:"junio",
            7:"julio",8:"agosto",9:"septiembre",10:"octubre",11:"noviembre",12:"diciembre"}

print(f"\n## Jornadas disponibles — Liga Bádminton {season}\n")
mes_actual = None
for sab, dom, num in resultados:
    mes = (sab.year, sab.month)
    if mes != mes_actual:
        mes_actual = mes
        print(f"### {meses_es[sab.month].capitalize()} {sab.year}")
    print(f"- {num} semana — Sáb {sab.day:02d}/{sab.month:02d} · Dom {dom.day:02d}/{dom.month:02d}")
    if mes != (sab.year, sab.month):
        print()

print(f"\nTotal jornadas disponibles: {len(resultados)}")

if descartados:
    print("\n### Descartados por puente")
    for sab, dom, num, motivo in descartados:
        print(f"- {num} semana — Sáb {sab.day:02d}/{sab.month:02d} · Dom {dom.day:02d}/{dom.month:02d}  ({motivo})")

# --- Generar fichero .html con los domingos ---
nombre_fichero = f"jornadas-liga-{season}.html"

secciones_html = []
mes_actual = None
items_mes = []

def flush_mes(items, mes_key):
    y, m = mes_key
    filas = "\n      ".join(
        f'<li><span class="semana">{num} semana</span>domingo {dom.day:02d}/{dom.month:02d}/{dom.year}</li>'
        for _, dom, num in items
    )
    return f'<section>\n  <h2>{meses_es[m].capitalize()} {y}</h2>\n  <ul>\n      {filas}\n  </ul>\n</section>'

for item in resultados:
    _, dom, num = item
    mes = (dom.year, dom.month)
    if mes != mes_actual:
        if items_mes:
            secciones_html.append(flush_mes(items_mes, mes_actual))
        mes_actual = mes
        items_mes = [item]
    else:
        items_mes.append(item)
if items_mes:
    secciones_html.append(flush_mes(items_mes, mes_actual))

descartados_html = ""
if descartados:
    filas = "\n      ".join(
        f'<li><span class="semana">{num} semana</span>'
        f'sáb {sab.day:02d}/{sab.month:02d} · dom {dom.day:02d}/{dom.month:02d}'
        f' <em>({motivo})</em></li>'
        for sab, dom, num, motivo in descartados
    )
    descartados_html = f'''<div class="descartados">
  <h2>Descartados por puente</h2>
  <ul>
      {filas}
  </ul>
</div>'''

html = f"""<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Jornadas liga bádminton {season}</title>
  <style>
    body {{ font-family: sans-serif; max-width: 600px; margin: 2rem auto; padding: 0 1rem; color: #222; }}
    h1 {{ font-size: 1.3rem; border-bottom: 2px solid #222; padding-bottom: .4rem; margin-bottom: 1.5rem; }}
    h2 {{ font-size: .9rem; text-transform: uppercase; letter-spacing: .07em; color: #666; margin: 1.4rem 0 .4rem; }}
    ul {{ list-style: none; padding: 0; margin: 0; }}
    li {{ display: flex; gap: .75rem; padding: .3rem 0; border-bottom: 1px solid #eee; font-size: .95rem; }}
    .semana {{ color: #aaa; font-size: .8rem; min-width: 6rem; padding-top: .1rem; }}
    .total {{ margin-top: 1.5rem; font-weight: bold; }}
    .descartados {{ margin-top: 2rem; background: #fff8f0; border-left: 3px solid #f90; padding: .75rem 1rem; border-radius: 0 4px 4px 0; }}
    .descartados h2 {{ color: #c60; margin-top: 0; }}
    .descartados li {{ border-bottom-color: #fde8c8; }}
    em {{ color: #a60; font-style: normal; font-size: .85rem; }}
  </style>
</head>
<body>
  <h1>Jornadas liga bádminton {season}</h1>
  {"".join(secciones_html)}
  <p class="total">Total: {len(resultados)} jornadas disponibles</p>
  {descartados_html}
</body>
</html>"""

with open(nombre_fichero, "w", encoding="utf-8") as f:
    f.write(html)

print(f"\nFichero generado: {nombre_fichero}")
EOF
```

## Formato de salida esperado

```
## Jornadas disponibles — Liga Bádminton 2027-2028

### Septiembre 2027
- 2ª semana — Sáb 11/09 · Dom 12/09
- 4ª semana — Sáb 25/09 · Dom 26/09
...

Total jornadas disponibles: N

### Descartados por puente
- 2ª semana — Sáb 08/01 · Dom 09/01  (Reyes Magos → fin de semana 8/1)

Fichero generado: jornadas-liga-2027-2028.html
```

## Notas

- Responde siempre en español.
- El fichero `jornadas-liga-{temporada}.html` se genera en el directorio de trabajo actual, sin dependencias externas.
- Los festivos de martes/miércoles/jueves no se evalúan como puente salvo el caso especial de Reyes.
