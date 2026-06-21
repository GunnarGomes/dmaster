import express from 'express'
import cors from 'cors'
import path from 'path'
import { fileURLToPath } from 'url'
import { createSession, getSession, joinSession, addConnection, removeConnection, broadcast, getSnapshot } from './sessions.js'
import { createServer } from 'http'
import { WebSocketServer } from 'ws'
import { randomUUID } from 'crypto'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()
const port = 3000
const server = createServer(app)
const websocketserver = new WebSocketServer({ server })

app.use(cors())
app.use(express.json())

// arquivos estáticos do build (JS, CSS, imagens)
app.use(express.static(path.join(__dirname, '../dist')))

// cria sessão
app.post('/api/session', (req, res) => {
  const session = createSession(req.body.name)
  res.json({ sessionId: session.id })
})

websocketserver.on('connection', (ws, req) => {
  const params = new URLSearchParams(req.url.split('?')[1])
  const sessionId = params.get('session')
  console.log('Player conectando na sessão:', sessionId)

  const playerId = params.get('playerId')
  const playerName = params.get('name')
  const role = params.get('role') || 'player'
  const webSocketId = randomUUID() // gerado pelo servidor, não recebido do cliente
  const session = getSession(sessionId)
  console.log('Sessão encontrada?', !!session)
  joinSession(sessionId, playerId, playerName, role)
  addConnection(sessionId, webSocketId, ws, playerId, role)

  ws.send(JSON.stringify({ type: 'SNAPSHOT', payload: getSnapshot(sessionId) }))

  ws.on('message', (data) => {
    const msg = JSON.parse(data)
    broadcast(sessionId, msg, ws)
  })

  ws.on('close', () => removeConnection(sessionId, webSocketId))
})

// fallback - PRECISA vir depois de todas as outras rotas
app.get('/*splat', (req, res) => {
  res.sendFile(path.join(__dirname, '../dist/index.html'))
})

export function start() {
  server.listen(port, '0.0.0.0', () => console.log(`server on ${port}`))
}