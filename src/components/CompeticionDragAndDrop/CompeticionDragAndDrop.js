import React, { useEffect, useState } from 'react';
import Column from './Column';
import './CompeticionDragAndDrop.css';

import EQUIPOS from './../ficheros/MODALIDAD_EQUIPOS.json';
const Elementos = EQUIPOS.map(element => ({ pista: '0', title: element.equipo, ...element }))
const oldElementos = JSON.stringify(Elementos);

const CompeticionDragAndDrop = () => {

  const [elementos, setElementos] = useState(JSON.parse(oldElementos) || []);

  const [elementoActivo, setElementoActivo] = useState(null);

  useEffect(() => {
    localStorage.setItem('elementos', JSON.stringify(elementos))
    comprobar();
  }, [elementos])

  const comprobar = () => {
    // const tramo_2 = elementos.filter(e => +e.pista > 4 && +e.pista <= 8);
    // const tramo_3 = elementos.filter(e => +e.pista > 8 && +e.pista <= 12);
    const tramosRepetidos1 = comprobarTramo(0, 4);
    const tramosRepetidos2 = comprobarTramo(5, 8);
    const tramosRepetidos3 = comprobarTramo(9, 12);
    console.log({tramosRepetidos1, tramosRepetidos2, tramosRepetidos3});

  }

  const comprobarTramo = (min, max) => {
    const tramo = elementos.filter(e => +e.pista > min && +e.pista <= max);
    let jugadores_tramo = {};
    let pistasRepetidas = [];
    tramo.forEach(elemento => {
      elemento.jugadores.forEach(jugador => {
        if (jugadores_tramo[jugador.PLAYER]) {
          jugadores_tramo[jugador.PLAYER].push(elemento.pista);
        } else {
          jugadores_tramo[jugador.PLAYER] = [elemento.pista];
        }
      });
    });
    Object.entries(jugadores_tramo).forEach(([jugador, pistas]) => {
      if (pistas.length > 1) {
        pistasRepetidas.push(pistas);
      }
    });
    return pistasRepetidas;
  }


  const onDrop = (columna, position) => {
    // console.log(`${elementoActivo} se va a mover a la pista ${columna} en la posición ${position}`);

    if (elementoActivo === null || elementoActivo === undefined) return;

    const elementoAMover = elementos[elementoActivo];
    const elementosActualizar = elementos.filter((elemento, index) => index !== elementoActivo)

    elementosActualizar.splice(position, 0, {
      ...elementoAMover,
      pista: columna
    })

    setElementos(elementosActualizar);


  }

  return (
    <main>
      <div className="contenedor-draggable">
        <Column
          pista="0"
          className="competidores"
          title={'Competidores (' + elementos.length + ')'}
          // noDroppable
          elementos={elementos}
          setElementoActivo={setElementoActivo}
          onDrop={onDrop}
        ></Column>
        <Column
          pista="1"
          className="contenedor"
          title="PISTA 1 - 1ª FASE"
          elementos={elementos}
          setElementoActivo={setElementoActivo}
          onDrop={onDrop}
        >
        </Column>
        <Column
          pista="2"
          className="contenedor"
          title="PISTA 2 - 1ª FASE"
          elementos={elementos}
          setElementoActivo={setElementoActivo}
          onDrop={onDrop}
        >
        </Column>
        <Column
          pista="3"
          className="contenedor"
          title="PISTA 3 - 1ª FASE"
          elementos={elementos}
          setElementoActivo={setElementoActivo}
          onDrop={onDrop}
        >
        </Column>
        <Column
          pista="4"
          className="contenedor"
          title="PISTA 4 - 1ª FASE"
          elementos={elementos}
          setElementoActivo={setElementoActivo}
          onDrop={onDrop}
        >
        </Column>
        <Column
          pista="5"
          className="contenedor"
          title="PISTA 1 - 2ª FASE"
          elementos={elementos}
          setElementoActivo={setElementoActivo}
          onDrop={onDrop}
        >
        </Column>
        <Column
          pista="6"
          className="contenedor"
          title="PISTA 2 - 2ª FASE"
          elementos={elementos}
          setElementoActivo={setElementoActivo}
          onDrop={onDrop}
        >
        </Column>
        <Column
          pista="7"
          className="contenedor"
          title="PISTA 3 - 2ª FASE"
          elementos={elementos}
          setElementoActivo={setElementoActivo}
          onDrop={onDrop}
        >
        </Column>
        <Column
          pista="8"
          className="contenedor"
          title="PISTA 4 - 2ª FASE"
          elementos={elementos}
          setElementoActivo={setElementoActivo}
          onDrop={onDrop}
        >
        </Column>
        <Column
          pista="9"
          className="contenedor"
          title="PISTA 1 - 3ª FASE"
          elementos={elementos}
          setElementoActivo={setElementoActivo}
          onDrop={onDrop}
        >
        </Column>
        <Column
          pista="10"
          className="contenedor"
          title="PISTA 2 - 3ª FASE"
          elementos={elementos}
          setElementoActivo={setElementoActivo}
          onDrop={onDrop}
        >
        </Column>
        <Column
          pista="11"
          className="contenedor"
          title="PISTA 3 - 3ª FASE"
          elementos={elementos}
          setElementoActivo={setElementoActivo}
          onDrop={onDrop}
        >
        </Column>
        <Column
          pista="12"
          className="contenedor"
          title="PISTA 4 - 3ª FASE"
          elementos={elementos}
          setElementoActivo={setElementoActivo}
          onDrop={onDrop}
        >
        </Column>
      </div>
    </main>
  )
}

export default CompeticionDragAndDrop
