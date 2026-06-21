import { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import MapCanvas from "../components/MapCanva";
import Token from "../components/Token";

export function GMView() {
    const { sessionId } = useParams()
    const [session, setSession] = useState(null)
    const [connected, setConnected] = useState(false)
    const [tokens, setTokens] = useState([
      { id: 'tok1', x: 75, y: 75, name: 'Aria', color: '#4a90d9' },
      { id: 'tok2', x: 175, y: 175, name: 'Goblin', color: '#d94a4a' },
    ])
    const wsRef = useRef(null) 
    function handleTokenMove(id, x, y){
      setTokens(prev => prev.map(t => t.id === id ? { ...t, x, y } : t))

      // enviar via WebSocket pros outros
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
            // aqui vem outros eventos blz?
            if (msg.type === 'TOKEN_MOVE') {
              setTokens(prev => prev.map(t => 
                t.id === msg.payload.id ? {...t, x: msg.payload.x, y: msg.payload.y} : t
              ))
            }

        }
        ws.onclose = () => setConnected(false)

        wsRef.current = ws

        return () => ws.close()
    }, [sessionId])
    const playerLink = `${window.location.origin}/#/play/${sessionId}`
     return (
    <div>
      <h1>Sessão: {session?.name || 'Carregando...'}</h1>
      <p>Status: {connected ? '🟢 Conectado' : '🔴 Desconectado'}</p>
      // FIXME: playerLink está para localhost apenas coloque para ip valeu mano
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
      <MapCanvas 
      mapImageUrl="../assets/The Labyrinth of Damned Chaos 01 (51 x 65).png"
      tokens={tokens}
      gridSize={50}
      onTokenMove={handleTokenMove}
      />
    </div>
    
    
    )

}

export default GMView