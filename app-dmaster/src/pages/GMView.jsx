import { useState, useEffect, useRef } from "react"
import { useParams } from "react-router-dom"
import MapCanvas from "../components/MapCanva"

export function GMView() {
  const { sessionId } = useParams()
  const [session, setSession] = useState(null)
  const [connected, setConnected] = useState(false)
  const wsRef = useRef(null)

  function handleTokenMove(id, x, y) {
    // atualiza dentro do session, não num state separado
    setSession(prev => ({
      ...prev,
      tokens: prev.tokens.map(t => t.id === id ? { ...t, x, y } : t)
    }))

    wsRef.current.send(JSON.stringify({
      type: 'TOKEN_MOVE',
      payload: { id, x, y }
    }))
  }

  useEffect(() => {
    const playerId = 'gm-' + sessionId
    const ws = new WebSocket(
      `ws://localhost:3000?session=${sessionId}&playerId=${playerId}&name=GM&role=gm`
    )

    ws.onopen = () => {
      setConnected(true)
      console.log("conectado como gm")
    }

    ws.onmessage = (event) => {
      const msg = JSON.parse(event.data)

      if (msg.type === 'SNAPSHOT') {
        setSession(msg.payload)
      }

      if (msg.type === 'TOKEN_MOVE') {
        setSession(prev => ({
          ...prev,
          tokens: prev.tokens.map(t =>
            t.id === msg.payload.id ? { ...t, x: msg.payload.x, y: msg.payload.y } : t
          )
        }))
      }
    }

    ws.onclose = () => setConnected(false)
    wsRef.current = ws

    return () => ws.close()
  }, [sessionId])

  // pega o IP do servidor (mesmo host que serviu a página)
  const serverHost = window.location.hostname
  const playerLink = `http://${serverHost}:3000/#/play/${sessionId}`

  return (
    <div>
      <h1>Sessão: {session?.name || 'Carregando...'}</h1>
      <p>Status: {connected ? '🟢 Conectado' : '🔴 Desconectado'}</p>

      <div>
        <p>Link para jogadores:</p>
        <input readOnly value={playerLink} onClick={(e) => e.target.select()} />
        <button onClick={() => navigator.clipboard.writeText(playerLink)}>
          Copiar Link
        </button>
      </div>

      <h2>Jogadores conectados</h2>
      <ul>
        {session && Object.entries(session.players).map(([id, player]) => (
          <li key={id}>{player.name} {player.connected ? '🟢' : '🔴'}</li>
        ))}
      </ul>

      {session && (
        <MapCanvas
          mapImageUrl={session.map.imageUrl}
          tokens={session.tokens}
          gridSize={session.map.gridSize}
          onTokenMove={handleTokenMove}
        />
      )}
    </div>
  )
}

export default GMView