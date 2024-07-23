import React, { useState } from 'react'

const Drag = () => {
    const [drag, setDrag] = useState(false);
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [startPosition, setStartPosition] = useState({ x: 0, y: 0 });

    const handleMouseDown = (e) => {
        setStartPosition({ x: e.clientX - position.x, y: e.clientY - position.y })

    }

    const handleMouseMove = (e) => {
        if (drag) {
            setPosition({ x: e.clientX - startPosition.x, y: e.clientY - startPosition.y })
        };

    }

    const handleMouseUp = () => {
        setDrag(false)
    }

    return (
        <div>
            <div>

                <button onMouseDown={handleMouseDown} onMouseUp={handleMouseUp}>Click and drag me</button>

            </div>

        </div>
    )
}

export default Drag
