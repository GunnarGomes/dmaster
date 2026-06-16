import express from 'express'
import { createSession, getSession, joinSession, addConnection, removeConnection, broadcast, getSnapshot } from './sessions.js'
import { createServer } from 'http'
import { WebSocketServer } from 'ws'
import { randomUUID } from 'crypto'

const app = express()
const port = 3000
const server = createServer(app)
const websocketserver = new WebSocketServer({server})

app.use(express.json())

// cria sessão
app.post('/api/session', (req, res) => {
    const session = createSession(req.body.name)
    res.json({ sessionId: session.id })
})

websocketserver.on('connection', (ws, req) => {
    const params = new URLSearchParams(req.url.split('?')[1])
    const sessionId = params.get('session')
    const playerId = params.get('playerId')
    const playerName = params.get('name')
    const role = params.get('role') || 'player'
    const webSocketId = params.get('wsId')

    joinSession(sessionId, playerId, playerName, role)
    addConnection(sessionId,webSocketId, ws, playerId, role)

    ws.send(JSON.stringify({ type: 'SNAPSHOT', payload: getSnapshot(sessionId) }))

    ws.on('message', (data) => {
        const msg = JSON.parse(data)

        broadcast(sessionId, msg, ws)

    })

    ws.on('close', () => removeConnection(sessionId, webSocketId))
})