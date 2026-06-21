import { Line } from 'react-konva'

function MapGrid({width, height, gridSize}) {
    const lines = []

    for (let x = 0; x <= width; x += gridSize) {
        lines.push(
            <Line 
                key={`v${x}`}
                points={[x,0,x,height]}
                stroke="rgba(255,255,255,0.3)"
                strokeWidth={1}
            />
        )
    }

    for (let y = 0; y <= height; y += gridSize) {
            lines.push(<Line 
                key={`h${y}`}
                points={[0,y,width,y]}
                stroke="rgba(255,255,255,0.3)"
                strokeWidth={1}
            />
        )
    }
    return lines
}

export default MapGrid