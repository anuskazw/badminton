import React, { useEffect, useState } from 'react';
import Column from './Column';
import './CompeticionDragAndDrop.css';

const oldElementos = /* localStorage.getItem('elementos') ||  */JSON.stringify([
  {pista: '1', title: "CDC ALTATORRE A VS CDC ALTATORRE G"},
  {pista: '2', title: "CDC ALTATORRE C VS CDC ALTATORRE D"},
  {pista: '3', title: "CDS LEGANES VS CDC ALTATORRE E"},
  {pista: '0', title: "CDC ALTATORRE F VS CDC ALTATORRE B + ASM"},
]);

const CompeticionDragAndDrop = () => {

  const [elementos, setElementos] = useState(JSON.parse(oldElementos) || []);

  const [elementoActivo, setElementoActivo] = useState(null);

  useEffect(() => {
    localStorage.setItem('elementos', JSON.stringify(elementos))
  }, [elementos])

  const onDrop = (columna, position) => {
    // console.log(`${elementoActivo} se va a mover a la pista ${columna} en la posición ${position}`);

    if(elementoActivo === null || elementoActivo === undefined) return;

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
          pista="1"
          className="contenedor"
          title="PISTA 1"
          elementos={elementos}
          setElementoActivo={setElementoActivo}
          onDrop={onDrop}
        >
        </Column>
        <Column
          pista="2"
          className="contenedor"
          title="PISTA 2"
          elementos={elementos}
          setElementoActivo={setElementoActivo}
          onDrop={onDrop}
        >
        </Column>
        <Column
          pista="3"
          className="contenedor"
          title="PISTA 3"
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
