import React from 'react'
import './Card.css'
import Equipo from '../Equipo';

const Card = ({index, setElementoActivo, elemento}) => {
  return (
    <article draggable onDragStart={() => setElementoActivo(index)} onDragEnd={() => setElementoActivo(null)}>
        <Equipo elemento={elemento}/>

    </article>
  )
}

export default Card
