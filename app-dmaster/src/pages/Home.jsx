import { useState } from "react";
import { useNavigate } from 'react-router-dom'

export function Home() {
    const [name, setName] = useState('')
    const navigate = useNavigate()

    async function handleCreateSession() {
        const res = await fetch('http://192.168.1.112/api/session', {
            method: 'POST',
            headers: { 'Content-type': 'application/json' },
            body: JSON.stringify({ name }),
        })
        const data = await res.json()
        navigate(`/gm/${data.sessionId}`)
    }

    return (
        <div>
            <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Nome da campanha" />
            <button onClick={handleCreateSession}>Criar Sessão</button>
        </div>
    )
}