import React, { useState } from 'react'
import './DropArea.css'

const DropArea = ({ onDrop }) => {
    const [showDrop, setShowDrop] = useState(false)
    return (
        <section className={showDrop ? 'drop_area' : 'drop_hide'}
            onDragEnter={() => setShowDrop(true)}
            onDragLeave={() => setShowDrop(false)}
            onDrop={() => {
                onDrop();
                setShowDrop(false);
            }}
            onDragOver={e => e.preventDefault()}
        > Arrastrar aquí </section>
    )
}

export default DropArea
