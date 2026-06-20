import { useState, useEffect, useRef } from "react"
import { useParams } from "react-router-dom"

export function PLView() {
    const sessionId = useParams()
    const [name, setName] = useState('')
    const [joined, setJoined] = useState(false)
    const [session, setSession] = useState(null)
    const [playerId, setPlayerId] = useState(null)
    const wsRef = useRef(null)

    function generateId() {
        return Date.now().toString(36) + Math.random().toString(36).slice(2)
    }

    // gera ou recupera playerId persistente
    useEffect(() => {
        let id = localStorage.getItem(`playerId_${sessionId}`)
        if (!id) {
            id = generateId()
            localStorage.setItem(`playerId_${sessionId}`, id)
        }
        setPlayerId(id)

        // se nome salvo tinha, reconecta ja
        const savedName = localStorage.getItem(`playerName_${sessionId}`)
        if (savedName) {
            setName(savedName)
            connect(id, savedName)
        }
    }, [sessionId])

    function connect(id, playerName) {
        const ws = new WebSocket(
            `ws://${window.location.hostname}:3000?session=${sessionId}&playerId=${id}&name=${encodeURIComponent(playerName)}&role=player`
        )
        ws.onopen = () => setJoined(true)

        ws.onmessage = (event) => {
            const msg = JSON.parse(event.data)

            if (msg.type === 'SNAPSHOT') {
                setSession(msg.payload)
            }
        }
        ws.onclose = () => setJoined(false)
        wsRef.current = ws

    }
    function handleJoin() {
        if (!name.trim()) return
        localStorage.setItem(`playerName_${sessionId}`, name)
        connect(playerId, name)
    }

    // depois adicionar movimentação de tokens

    if (!joined) {
    return (
      <div>
        <h1>Entrar na sessão</h1>
        <input
          value={name}
          onChange={e => setName(e.target.value)}
          placeholder="Seu nome"
          onKeyDown={e => e.key === 'Enter' && handleJoin()}
        />
        <button onClick={handleJoin}>Entrar</button>
      </div>
    )
  }

  // tela principal do jogador
  return (
    <div>
      <h1>{session?.name}</h1>
      <p>Conectado como {name}</p>

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

export default PLView