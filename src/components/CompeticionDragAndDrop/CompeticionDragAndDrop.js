import React, { useEffect, useState } from 'react';
import Column from './Column';
import './CompeticionDragAndDrop.css';

const oldElementos = /* localStorage.getItem('elementos') ||  */JSON.stringify([
  { pista: '0', title: "CDC ALTATORRE A VS CDC ALTATORRE G" },
  { pista: '0', title: "CDC ALTATORRE C VS CDC ALTATORRE D" },
  { pista: '0', title: "CDS LEGANES VS CDC ALTATORRE E" },
  { pista: '0', title: "CDC ALTATORRE F VS CDC ALTATORRE B + ASM" },
]);

const CompeticionDragAndDrop = () => {

  const [elementos, setElementos] = useState(JSON.parse(oldElementos) || []);

  const [elementoActivo, setElementoActivo] = useState(null);

  useEffect(() => {
    localStorage.setItem('elementos', JSON.stringify(elementos))
  }, [elementos])

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
      {/* <div className='contenedor-competidores'>
        <Column
          pista="0"
          className="contenedor"
          title="Competidores"
          noDroppable
          elementos={elementos}
          setElementoActivo={setElementoActivo}
          onDrop={onDrop}
        ></Column>
      </div> */}
      <div className="contenedor-draggable">
      <Column
          pista="0"
          className="competidores"
          title="Competidores"
          noDroppable
          elementos={elementos}
          setElementoActivo={setElementoActivo}
          onDrop={onDrop}
        ></Column>
        <Column
          pista="1"
          className="contenedor"
          title="PISTA 1 / 1ª FASE"
          elementos={elementos}
          setElementoActivo={setElementoActivo}
          onDrop={onDrop}
        >
        </Column>
        <Column
          pista="2"
          className="contenedor"
          title="PISTA 2 / 1ª FASE"
          elementos={elementos}
          setElementoActivo={setElementoActivo}
          onDrop={onDrop}
        >
        </Column>
        <Column
          pista="3"
          className="contenedor"
          title="PISTA 3 / 1ª FASE"
          elementos={elementos}
          setElementoActivo={setElementoActivo}
          onDrop={onDrop}
        >
        </Column>
        <Column
          pista="4"
          className="contenedor"
          title="PISTA 4 / 1ª FASE"
          elementos={elementos}
          setElementoActivo={setElementoActivo}
          onDrop={onDrop}
        >
        </Column>
        <Column
          pista="5"
          className="contenedor"
          title="PISTA 1 / 2ª FASE"
          elementos={elementos}
          setElementoActivo={setElementoActivo}
          onDrop={onDrop}
        >
        </Column>
        <Column
          pista="6"
          className="contenedor"
          title="PISTA 2 / 2ª FASE"
          elementos={elementos}
          setElementoActivo={setElementoActivo}
          onDrop={onDrop}
        >
        </Column>
        <Column
          pista="7"
          className="contenedor"
          title="PISTA 3 / 2ª FASE"
          elementos={elementos}
          setElementoActivo={setElementoActivo}
          onDrop={onDrop}
        >
        </Column>
        <Column
          pista="8"
          className="contenedor"
          title="PISTA 4 / 2ª FASE"
          elementos={elementos}
          setElementoActivo={setElementoActivo}
          onDrop={onDrop}
        >
        </Column>
        <Column
          pista="9"
          className="contenedor"
          title="PISTA 1 / 3ª FASE"
          elementos={elementos}
          setElementoActivo={setElementoActivo}
          onDrop={onDrop}
        >
        </Column>
        <Column
          pista="10"
          className="contenedor"
          title="PISTA 2 / 3ª FASE"
          elementos={elementos}
          setElementoActivo={setElementoActivo}
          onDrop={onDrop}
        >
        </Column>
        <Column
          pista="11"
          className="contenedor"
          title="PISTA 3 / 3ª FASE"
          elementos={elementos}
          setElementoActivo={setElementoActivo}
          onDrop={onDrop}
        >
        </Column>
        <Column
          pista="12"
          className="contenedor"
          title="PISTA 4 / 3ª FASE"
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
