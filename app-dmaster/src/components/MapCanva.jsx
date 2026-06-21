// src/components/MapCanvas.jsx
import { Stage, Layer, Image as KonvaImage } from 'react-konva'
import { useState, useEffect, useRef } from 'react'
import MapGrid from './MapGrid'
import Token from './Token'

function MapCanvas({ mapImageUrl, tokens, gridSize = 50, onTokenMove }) {
  const [image, setImage] = useState(null)
  const stageRef = useRef(null)

  useEffect(() => {
    if (!mapImageUrl) return
    const img = new window.Image()
    img.src = mapImageUrl
    img.onload = () => setImage(img)
  }, [mapImageUrl])

  const width = image?.width || 1000
  const height = image?.height || 800

  return (
    <Stage width={width} height={height} ref={stageRef}>
      <Layer>
        {image && <KonvaImage image={image} width={width} height={height} />}
        <MapGrid width={width} height={height} gridSize={gridSize} />
      </Layer>

      <Layer>
        {tokens.map(token => (
          <Token
            key={token.id}
            {...token}
            gridSize={gridSize}
            onMove={onTokenMove}
          />
        ))}
      </Layer>
    </Stage>
  )
}

export default MapCanvas