/**
 * Genera el cuadro de rondas según las tablas de la federación (método de Berger).
 * Para n impar se usa n+1 (el jugador extra representa un "bye"/descanso).
 *
 * @param {Array} participantes - Array de participantes en orden (posición 0 = puesto 1)
 * @returns {Array<{ronda: number, partidos: Array<{local, visitante}>}>}
 */
export function generarCuadroRondas(participantes) {
  if (participantes.length < 2) return [];

  const lista =
    participantes.length % 2 === 0
      ? [...participantes]
      : [...participantes, null]; // null = bye/descanso

  const n = lista.length;
  const rotacion = n / 2 - 1;

  // Círculo de posiciones 0..n-2; la posición n-1 (fija) es siempre lista[n-1]
  let circulo = lista.slice(0, n - 1);
  const fijo = lista[n - 1];

  const rondas = [];

  for (let r = 1; r <= n - 1; r++) {
    const partidos = [];

    // Primer partido: orden según ronda par/impar
    const par0 = r % 2 === 1
      ? { local: circulo[0], visitante: fijo }
      : { local: fijo, visitante: circulo[0] };

    if (par0.local !== null && par0.visitante !== null) {
      partidos.push(par0);
    }

    // Resto de partidos: circulo[i] vs circulo[n-1-i]
    for (let i = 1; i <= n / 2 - 1; i++) {
      const local = circulo[i];
      const visitante = circulo[n - 1 - i];
      if (local !== null && visitante !== null) {
        partidos.push({ local, visitante });
      }
    }

    rondas.push({ ronda: r, partidos });

    // Rotar el círculo hacia la derecha 'rotacion' posiciones
    if (rotacion > 0) {
      circulo = [
        ...circulo.slice(circulo.length - rotacion),
        ...circulo.slice(0, circulo.length - rotacion),
      ];
    }
  }

  return rondas;
}

export function generarRoundRobin(participantes, idaYVuelta = false) {
  if (participantes.length < 2) return [];

  const lista =
    participantes.length % 2 === 0
      ? [...participantes]
      : [...participantes, { id: 'BYE', equipo: 'DESCANSO' }];

  const total = lista.length;
  const numRondas = total - 1;
  const fijo = lista[0];
  let rot = lista.slice(1);
  const partidos = [];

  for (let r = 0; r < numRondas; r++) {
    const grupo = [fijo, ...rot];
    for (let i = 0; i < total / 2; i++) {
      const a = grupo[i];
      const b = grupo[total - 1 - i];
      if (a.id === 'BYE' || b.id === 'BYE') continue;
      partidos.push({
        jornada: r + 1,
        tipo: 'IDA',
        local: { idParticipante: a.id, equipo: a.equipo },
        visitante: { idParticipante: b.id, equipo: b.equipo },
        resultado: null,
      });
    }
    rot = [...rot.slice(1), rot[0]];
  }

  if (idaYVuelta) {
    const vuelta = partidos.map(p => ({
      ...p,
      jornada: p.jornada + numRondas,
      tipo: 'VUELTA',
      local: p.visitante,
      visitante: p.local,
    }));
    return [...partidos, ...vuelta];
  }

  return partidos;
}
