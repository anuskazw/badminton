import React from 'react'
import Card from './Card'
import './Column.css';
import DropArea from './DropArea';

const Column = ({ title, elementos, pista, setElementoActivo, onDrop, noDroppable, className }) => {


    return (
        <section className={'task_column '+ className}>
            <h4 className='task_column_header'>{title}</h4>
            <div className={!noDroppable ? 'no-droppable': ''}>
            {!noDroppable && <DropArea onDrop={ () => onDrop(pista, 0)} />}
            {
                elementos?.map((item, index) => item.pista === pista && (
                    <React.Fragment key={index}>
                        <Card
                            elemento={item}
                            index={index}
                            title={item.title}
                            setElementoActivo={setElementoActivo}
                        />
                        {!noDroppable && <DropArea onDrop={ () => onDrop(pista, index+1)} />}
                    </React.Fragment>

                ))
            }
            </div>
        </section>
    )
}

export default Column
