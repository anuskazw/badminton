import React from 'react'
import './Card.css'

const Card = ({index, title, setElementoActivo}) => {
  return (
    <article draggable onDragStart={() => setElementoActivo(index)} onDragEnd={() => setElementoActivo(null)}>
        <div>
            {title}
        </div>

    </article>
  )
}

export default Card
