import React from 'react'
import './Card.css'
import Equipo from '../Equipo';

const Card = ({index, title, setElementoActivo, elemento}) => {

  const extraerPrimeraLetra = (texto) => {
    return texto.split(' ').map(palabra => palabra.substring(0, 3)).join('-');
  }

  return (
    <article draggable onDragStart={() => setElementoActivo(index)} onDragEnd={() => setElementoActivo(null)}>
        <Equipo elemento={elemento}/>

    </article>
  )
}

export default Card
