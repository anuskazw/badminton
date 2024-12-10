import { closestCenter, closestCorners, DndContext, useDroppable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import { SortableContext, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import React, { useState } from 'react';
import './Competicion.css';
import EQUIPOS from './MODALIDAD_EQUIPOS.json'

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
                {jugadores.map(j => j.PLAYER).join(', ')}
            </div>
        </div>
    )
}


const Competicion = () => {

    const { setNodeRef1 } = useDroppable({ id: 'PISTA_1' });

    const [equipos/* , setEquipos */] = useState(EQUIPOS);


    function handleDragEnd(event) {
        const { active, over } = event;
        console.log(active.data);
        if (over && over.data.current?.accepts?.includes(active.data.current?.type)) {
            // do stuff
        }
    }

    // Ejecución



    return (
        <div>
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
                        <div id="2" className="contenedor">s

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

