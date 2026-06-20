import { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";

export function GMView() {
    const { sessionId } = useParams()
    const [session, setSession] = useState(null)
    const [connected, setConnected] = useState(false)
    const wsRef = useRef(null)

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
      // FIXME: playerLink está para localhost apenas coloque para ip vale mano
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
    </div>
    )

}

export default GMView