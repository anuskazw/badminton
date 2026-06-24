import React from 'react'
import './Equipo.css'

const extraerPrimeraLetra = (texto) => {
    return texto.split(' ').map(palabra => palabra.substring(0, 3)).join('-');
  }

const Equipo = ({elemento}) => {
  return (
    <div className='equipo'>
    <div>
        <div className='flex'>
            <strong className='overflow-hidden'>{elemento.equipo}</strong>
            <span className={`badge`} >{extraerPrimeraLetra(elemento.modalidad)}</span>
        </div>
        <hr />
        {elemento.jugadores.map(j => j.nombre).join(', ')}
    </div>
</div>
  )
}

export default Equipo
