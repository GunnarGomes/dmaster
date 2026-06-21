import { Circle, Text, Group } from "react-konva"

function Token({id, x, y, name, color, gridSize, onMove}) {
    function handleDragEnd(e) {
        // arredonda para a célula mais próxima do grid matematica maluca hehehehehhehehe
        const newX = Math.round(e.target.x() / gridSize) * gridSize + gridSize / 2
        const newY = Math.round(e.target.y() / gridSize) * gridSize + gridSize / 2

        e.target.position({x:newX, y: newY})
        onMove(id, newX, newY)
    }

    return (
        <Group
            x={x}
            y={y}
            draggable
            onDragEnd={handleDragEnd}
        >
            <Circle radius={gridSize / 2 - 4} fill={color} stroke="black" strokeWidth={2} />
            <Text text={name} fontSize={12} y={gridSize / 2} x={-gridSize / 2} width={gridSize} align="center" />
        </Group>
    )
}

export default Token