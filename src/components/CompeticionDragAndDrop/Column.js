import React from 'react'
import Card from './Card'
import './Column.css';
import DropArea from './DropArea';

const Column = ({ title, elementos, pista, setElementoActivo, onDrop }) => {


    return (
        <section className='task_column'>
            <h2 className='task_column_header'>{title}</h2>
            <DropArea onDrop={ () => onDrop(pista, 0)} />

            {
                elementos?.map((item, index) => item.pista === pista && (
                    <React.Fragment key={index}>
                        <Card
                            index={index}
                            title={item.title}
                            setElementoActivo={setElementoActivo}
                        />
                        <DropArea onDrop={ () => onDrop(pista, index+1)} />
                    </React.Fragment>

                ))
            }

        </section>
    )
}

export default Column
