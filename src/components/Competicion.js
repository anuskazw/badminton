import { closestCorners, DndContext, useDroppable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import { arrayMove, SortableContext, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import React, { useState, useEffect } from 'react';
import './Competicion.css';
import { getCompetidores } from '../services/competidoresService';
import { useTemporada } from '../context/TemporadaContext';

const Equipo = ({ id, index, modalidad, equipo, jugadores }) => {

    const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id })

    const style = {
        transition,
        transform: CSS.Transform.toString(transform)
    }
    return (
        <div className='contenedor equipo'
            ref={setNodeRef}
            key={id}
            {...attributes}
            {...listeners}
            style={style}
        >
            <span className={`badge badge-${index}`} >{modalidad}</span>
            <div>
                <strong>{equipo}</strong>
                <hr />
                {jugadores.map(j => j.nombre).join(', ')}
            </div>
        </div>
    )
}


const Competicion = () => {

    const { setNodeRef1 } = useDroppable({ id: 'PISTA_1' });
    const { temporada } = useTemporada();

    const [equipos, setEquipos] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!temporada) return;
        getCompetidores(temporada)
            .then(setEquipos)
            .catch(() => setError('No se pudo cargar los competidores. ¿Está el servidor en marcha?'));
    }, [temporada]);

    const getPosicion = id => equipos.findIndex(eq => eq.id === id);

    function handleDragEnd(event) {
        const { active, over } = event;
        if (active.id === over.id) return;

        setEquipos((equipos) => {
            const originalPos = getPosicion(active.id);
            const newPos = getPosicion(over.id);
            return arrayMove(equipos, originalPos, newPos);
        })
    }



    if (error) return <div className="competicion-page"><p className="error">{error}</p></div>;

    return (
        <div className="competicion-page">
            <h1>Competicion</h1>
            <div className="caja">
                <DndContext onDragEnd={handleDragEnd} collisionDetection={closestCorners}>
                    <div className="contenedor principal-equipos">
                        <div id="1" ref={setNodeRef1}>
                            <SortableContext items={equipos} strategy={verticalListSortingStrategy}>
                                {equipos?.map((eq, index) => (
                                    <Equipo
                                        id={eq.id}
                                        index={eq.idModalidad}
                                        modalidad={eq.modalidad}
                                        equipo={eq.equipo}
                                        jugadores={eq.jugadores}
                                    />
                                ))}
                            </SortableContext>
                        </div>
                    </div>
                    <div className="contenedor pista">
                        <div id="1" className="contenedor">

                        </div>
                        <div id="2" className="contenedor">

                        </div>
                        <div id="3" className="contenedor">

                        </div>
                        <div id="4" className="contenedor">

                        </div>
                        <div id="5" className="contenedor">

                        </div>
                        <div id="6" className="contenedor">

                        </div>
                        <div id="7" className="contenedor">

                        </div>
                        <div id="8" className="contenedor">

                        </div>
                        <div id="9" className="contenedor">

                        </div>
                        <div id="10" className="contenedor">

                        </div>
                        <div id="11" className="contenedor">

                        </div>
                        <div id="12" className="contenedor">

                        </div>
                    </div>
                </DndContext>
            </div>
        </div>
    );
};

export default Competicion;

