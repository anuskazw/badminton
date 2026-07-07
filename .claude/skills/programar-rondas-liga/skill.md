---
name: programar-rondas-liga
description: Genera el cuadro de rondas (round-robin) por equipos para una categoría de liga de bádminton. Aplica el sistema Berger del Anexo 01 FMDS. Si el total de jornadas en ida y vuelta supera 12, genera solo ida. Soporta de 3 a 20 equipos.
argument-hint: "[Categoría], [N] equipos: Equipo1, Equipo2, ..."
allowed-tools: [Bash]
---

# Programar rondas de liga — sistema Berger (Anexo 01 FMDS)

## Objetivo

Dado un nombre de categoría y una lista de equipos, generar el cuadro de rondas completo aplicando el **sistema Berger** tal como aparece en el Anexo 01 de la FMDS.

**Regla de ida/vuelta:**
- Si `(n_rondas_ida × 2) ≤ 12` → generar **ida y vuelta** (duplicar rondas invirtiendo local/visitante)
- Si `(n_rondas_ida × 2) > 12` → generar **solo ida**

Donde `n_rondas_ida = n_par - 1` y `n_par` es el número de equipos redondeado al siguiente par (si hay número impar de equipos, el equipo imaginario es "LIBRE").

## Parseo de $ARGUMENTS

El argumento llega en cualquiera de estos formatos:
- `"Dobles femenino, 7 equipos: Alfa, Beta, Gamma, Delta, Épsilon, Zeta, Eta"`
- `"Dobles femenino, 7 equipos (Alfa, Beta, Gamma, Delta, Épsilon, Zeta, Eta)"`
- `"Dobles masculino: Equipo A, Equipo B, Equipo C, Equipo D"`

Extraer: categoría, número de equipos (o contarlos) y lista de nombres.

## Instrucciones de ejecución

Ejecuta el siguiente script con Bash:

```bash
python3 << 'PYEOF'
import re, textwrap

# ── Parsear argumentos ────────────────────────────────────────────────────────
raw = """$ARGUMENTS"""

# Separar categoría de la lista de equipos
# Intentar extraer nombres entre paréntesis o después de ":"
nombres_match = re.search(r'[\(\[:]([^\)\]]+)[\)\]]?$', raw)
if nombres_match:
    nombres_raw = nombres_match.group(1)
else:
    # Dividir en "categoría" + "lista de equipos" separados por ", [N] equipos[:]"
    partes = re.split(r',\s*(?:\d+\s*)?equipos?\s*[:\(]?\s*', raw, flags=re.I)
    nombres_raw = partes[-1] if len(partes) > 1 else raw

equipos = [e.strip() for e in re.split(r'[,;]', nombres_raw) if e.strip()]

# Extraer categoría (texto antes de "[N] equipos", ":", o "(")
cat_match = re.match(r'^([^,:\(]+?)(?:\s*,\s*(?:\d+\s*)?equipos?|\s*:|\s*\()', raw.strip(), re.I)
categoria = cat_match.group(1).strip() if cat_match else "Liga"

n = len(equipos)
if n < 3:
    print("ERROR: Se necesitan al menos 3 equipos.")
    raise SystemExit(1)
if n > 20:
    print("ERROR: El cuadro soporta hasta 20 equipos.")
    raise SystemExit(1)

# ── Algoritmo Berger (sistema del Anexo 01 FMDS) ──────────────────────────────
# n_par: redondear al siguiente par
n_par = n if n % 2 == 0 else n + 1
n_rondas_ida = n_par - 1

# Equipos numerados 1..n; si n es impar, el n_par es "LIBRE"
def nombre_equipo(num, equipos, n_par):
    if num == n_par and len(equipos) < n_par:
        return "LIBRE"
    return equipos[num - 1]

# Secuencia base para rondas impares: [1, 2, ..., n_par-1]
odd_base = list(range(1, n_par))

# Secuencia base para rondas pares: [n_par/2+1, ..., n_par-1, 1, ..., n_par/2]
mitad = n_par // 2
even_base = list(range(mitad + 1, n_par)) + list(range(1, mitad + 1))

def rotar_izq(seq, k):
    k = k % len(seq)
    return seq[k:] + seq[:k]

def generar_rondas_ida(n_par, odd_base, even_base):
    rondas = []
    n_r = n_par - 1
    turno_impar = 0
    turno_par   = 0
    for r in range(1, n_r + 1):
        if r % 2 == 1:  # ronda impar
            seq = rotar_izq(odd_base, turno_impar)
            turno_impar += 1
            partidos = [(seq[0], n_par)]  # local, visitante
            for i in range(1, n_par // 2):
                partidos.append((seq[i], seq[n_par - 2 - i + 1 - 1]))
                # índice: pos i vs pos (n_par-2-i) → en lista de n_par-1 elems
        else:  # ronda par
            seq = rotar_izq(even_base, turno_par)
            turno_par += 1
            partidos = [(n_par, seq[0])]  # local, visitante (n_par es local en par)
            for i in range(1, n_par // 2):
                partidos.append((seq[i], seq[n_par - 2 - i + 1 - 1]))
        rondas.append(partidos)
    return rondas

# Reconstruir índice de pares correctamente
def generar_rondas_ida_v2(n_par, odd_base, even_base):
    rondas = []
    n_r = n_par - 1
    L = n_par - 1  # longitud de la secuencia rotante
    turno_impar = 0
    turno_par   = 0
    for r in range(1, n_r + 1):
        if r % 2 == 1:
            seq = rotar_izq(odd_base, turno_impar)
            turno_impar += 1
            # pos 0 vs n_par (fijo); pos i vs pos L-1-i para i=1..(L-1)//2
            partidos = [(seq[0], n_par)]
            for i in range(1, L // 2 + 1):
                j = L - i  # índice espejo
                if i < j:
                    partidos.append((seq[i], seq[j]))
        else:
            seq = rotar_izq(even_base, turno_par)
            turno_par += 1
            # n_par (fijo, local) vs pos 0; pos i vs pos L-1-i
            partidos = [(n_par, seq[0])]
            for i in range(1, L // 2 + 1):
                j = L - i
                if i < j:
                    partidos.append((seq[i], seq[j]))
        rondas.append(partidos)
    return rondas

rondas_ida = generar_rondas_ida_v2(n_par, odd_base, even_base)

# ── Decisión ida / ida+vuelta ─────────────────────────────────────────────────
hacer_vuelta = (n_rondas_ida * 2) <= 12
tipo = "IDA Y VUELTA" if hacer_vuelta else "SOLO IDA"

# ── Formato de salida ─────────────────────────────────────────────────────────
MESES_ES = {1:"ene",2:"feb",3:"mar",4:"abr",5:"may",6:"jun",
            7:"jul",8:"ago",9:"sep",10:"oct",11:"nov",12:"dic"}

def ordinal(n):
    sufijos = {1:"ª",2:"ª",3:"ª"}
    return f"{n}{sufijos.get(n % 10, 'ª')}"

linea = "─" * 60

print(f"\n{'═'*60}")
print(f"  CUADRO DE RONDAS — {categoria.upper()}")
print(f"{'═'*60}")
print(f"  Equipos   : {n}")
print(f"  Modalidad : {tipo}")
print(f"  Jornadas  : {n_rondas_ida * (2 if hacer_vuelta else 1)}")
print(f"{'═'*60}\n")

# Calcular ancho máximo de nombre para alineación
max_nom = max(len(nombre_equipo(i, equipos, n_par)) for i in range(1, n_par + 1))
col = max(max_nom, 12)

def fmt_partido(local, visitante, equipos, n_par, col):
    l = nombre_equipo(local, equipos, n_par)
    v = nombre_equipo(visitante, equipos, n_par)
    return f"  {l:<{col}}  vs  {v}"

# IDA
print(f"{'─'*60}")
print(f"  ◆ IDA")
print(f"{'─'*60}")
for idx, partidos in enumerate(rondas_ida, 1):
    print(f"\n  {ordinal(idx)} Jornada")
    for local, visitante in partidos:
        print(fmt_partido(local, visitante, equipos, n_par, col))

# VUELTA (si aplica)
if hacer_vuelta:
    print(f"\n{'─'*60}")
    print(f"  ◆ VUELTA (local y visitante invertidos)")
    print(f"{'─'*60}")
    for idx, partidos in enumerate(rondas_ida, 1):
        jornada_vuelta = n_rondas_ida + idx
        print(f"\n  {ordinal(jornada_vuelta)} Jornada")
        for local, visitante in partidos:
            print(fmt_partido(visitante, local, equipos, n_par, col))

print(f"\n{'═'*60}\n")

# ── Validación: cada par se enfrenta exactamente una vez ─────────────────────
pares = []
for partidos in rondas_ida:
    for a, b in partidos:
        par = tuple(sorted([a, b]))
        pares.append(par)
pares_unicos = set(pares)
n_esperados = (n_par * (n_par - 1)) // 2
ok = len(pares) == len(pares_unicos) == n_esperados
if not ok:
    print(f"⚠ ADVERTENCIA: validación fallida ({len(pares)} partidos, {len(pares_unicos)} únicos, esperados {n_esperados})")

# ── Generar HTML ──────────────────────────────────────────────────────────────
slug = re.sub(r'[^a-z0-9]+', '-', categoria.lower()).strip('-')
nombre_html = f"cuadro-rondas-{slug}.html"

def html_jornadas(rondas, offset, etiqueta_fase, equipos, n_par):
    secciones = []
    for idx, partidos in enumerate(rondas, 1):
        num = offset + idx
        filas = []
        for local, visitante in partidos:
            l = nombre_equipo(local, equipos, n_par)
            v = nombre_equipo(visitante, equipos, n_par)
            libre_class = ' libre' if 'LIBRE' in (l, v) else ''
            filas.append(
                f'<li class="partido{libre_class}">'
                f'<span class="local">{l}</span>'
                f'<span class="sep">vs</span>'
                f'<span class="visitante">{v}</span>'
                f'</li>'
            )
        filas_html = "\n        ".join(filas)
        secciones.append(f'''  <section class="jornada">
    <h2><span class="num">{num}ª Jornada</span><span class="fase">{etiqueta_fase}</span></h2>
    <ul>
        {filas_html}
    </ul>
  </section>''')
    return "\n".join(secciones)

bloques_html = html_jornadas(rondas_ida, 0, "IDA", equipos, n_par)
if hacer_vuelta:
    rondas_vuelta = [[(b, a) for a, b in ps] for ps in rondas_ida]
    bloques_html += "\n" + html_jornadas(rondas_vuelta, n_rondas_ida, "VUELTA", equipos, n_par)

nota_impar = (f'<p class="nota">⚠ Número impar de equipos: el equipo que figura vs <strong>LIBRE</strong> descansa esa jornada.</p>'
              if n % 2 == 1 else '')

html = f"""<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Cuadro de rondas — {categoria}</title>
  <style>
    *, *::before, *::after {{ box-sizing: border-box; }}
    body {{
      font-family: sans-serif;
      max-width: 680px;
      margin: 2rem auto;
      padding: 0 1rem;
      color: #222;
      background: #fafafa;
    }}
    header {{
      border-bottom: 3px solid #c00;
      padding-bottom: .6rem;
      margin-bottom: 2rem;
    }}
    h1 {{
      font-size: 1.35rem;
      margin: 0 0 .25rem;
      color: #c00;
    }}
    .meta {{
      font-size: .85rem;
      color: #666;
      display: flex;
      gap: 1.5rem;
      flex-wrap: wrap;
    }}
    .meta span strong {{ color: #333; }}
    .nota {{
      background: #fff8e1;
      border-left: 3px solid #f9a825;
      padding: .5rem .75rem;
      font-size: .85rem;
      margin-bottom: 1.5rem;
      border-radius: 0 4px 4px 0;
    }}
    .jornada {{
      background: #fff;
      border: 1px solid #e5e5e5;
      border-radius: 6px;
      margin-bottom: 1rem;
      overflow: hidden;
    }}
    .jornada h2 {{
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin: 0;
      padding: .5rem .85rem;
      background: #c00;
      color: #fff;
      font-size: .9rem;
    }}
    .jornada h2 .num {{ font-weight: 700; }}
    .jornada h2 .fase {{
      font-size: .75rem;
      font-weight: 400;
      background: rgba(255,255,255,.2);
      padding: .15rem .5rem;
      border-radius: 3px;
      letter-spacing: .06em;
    }}
    ul {{
      list-style: none;
      margin: 0;
      padding: 0;
    }}
    .partido {{
      display: grid;
      grid-template-columns: 1fr auto 1fr;
      align-items: center;
      padding: .45rem .85rem;
      border-bottom: 1px solid #f0f0f0;
      font-size: .9rem;
    }}
    .partido:last-child {{ border-bottom: none; }}
    .partido.libre {{ background: #f9f9f9; color: #aaa; font-style: italic; }}
    .local {{ text-align: right; }}
    .visitante {{ text-align: left; }}
    .sep {{
      text-align: center;
      font-size: .75rem;
      color: #bbb;
      font-weight: 700;
      padding: 0 .75rem;
    }}
    footer {{
      margin-top: 2rem;
      font-size: .78rem;
      color: #aaa;
      text-align: center;
    }}
  </style>
</head>
<body>
  <header>
    <h1>Cuadro de rondas — {categoria}</h1>
    <div class="meta">
      <span><strong>Equipos:</strong> {n}</span>
      <span><strong>Modalidad:</strong> {tipo}</span>
      <span><strong>Total jornadas:</strong> {n_rondas_ida * (2 if hacer_vuelta else 1)}</span>
    </div>
  </header>
  {nota_impar}
{bloques_html}
  <footer>Sistema Berger · Anexo 01 FMDS</footer>
</body>
</html>"""

with open(nombre_html, "w", encoding="utf-8") as f:
    f.write(html)

print(f"Fichero generado: {nombre_html}")

PYEOF
```

## Verificación del algoritmo Berger

El sistema Berger fija el equipo con número más alto (`n_par`) y rota los demás:

- **Rondas impares**: secuencia `[1, 2, ..., n_par-1]` rotada `(r-1)//2` posiciones a la izquierda. El fijo es **visitante**.
- **Rondas pares**: secuencia `[n_par/2+1, ..., n_par-1, 1, ..., n_par/2]` rotada `(r-2)//2` posiciones. El fijo es **local**.
- Emparejamiento en cada secuencia: posición `i` vs posición `L-i` (espejo), donde `L = n_par-1`.

## Regla ida/vuelta

| Equipos | n_par | Rondas ida | Total i+v | Modalidad      |
|---------|-------|-----------|-----------|----------------|
| 3–4     | 4     | 3         | 6         | Ida y vuelta   |
| 5–6     | 6     | 5         | 10        | Ida y vuelta   |
| 7–8     | 8     | 7         | 14        | **Solo ida**   |
| 9–20    | …     | ≥9        | ≥18       | **Solo ida**   |

## Notas

- Si el número de equipos es impar, se añade un rival ficticio "LIBRE". El equipo que enfrenta a "LIBRE" descansa esa jornada.
- Responde siempre en español.
- El resultado se muestra en consola **y** se genera un fichero `cuadro-rondas-{slug}.html` en el directorio de trabajo actual.
- El HTML incluye todas las jornadas divididas en secciones, con etiqueta IDA / VUELTA y estilo visual coherente con el resto de ficheros del proyecto.
