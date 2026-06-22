import { randomUUID } from 'crypto'

const sessions = {}

export function createSession(name = 'Nova Sessão'){
    const id = randomUUID().slice(0,6)
    sessions[id] = {
        id, name, createdAt: Date.now(),
        map: {imageUrl: null, gridSize: 50, width: 1920, height:1080},
        tokens: [{ id: 'tok1', name: 'Herói', x: 75, y: 75, color: '#4a90d9', ownerId: null, size: 1 },
  { id: 'tok2', name: 'Goblin', x: 175, y: 175, color: '#d94a4a', ownerId: null, size: 1 },],
        fog: { revealedZones: [] },
        characters: {},
        players: {},
        chatLog: [],
        connections: new Map(),
    }
    return sessions[id]
}

export function getSession(sessionId) { 
    return sessions[sessionId] || null 
}

export function deleteSession(sessionId) {
    delete sessions[sessionId]
}

export function joinSession(sessionId, playerId, playerName, role = 'player') {
    const session = getSession(sessionId)
    if (!session) return null
    session.players[playerId] = { ...session.players[playerId], name: playerName, connected: true, role }
    if (role === 'player' && !session.characters[playerId]) {
        session.characters[playerId] = {name: playerName}
    }
    return session

}

export function leaveSession(sessionId, playerId){
    const session = getSession(sessionId)
    if (session?.players[playerId]) session.players[playerId].connected = false
}

export function addConnection(sessionId, wsId, ws, playerId, role){
    getSession(sessionId)?.connections.set(wsId, { ws, playerId, role })
}

export function removeConnection(sessionId, wsId) {
    const session = getSession(sessionId)
    if (!session) return
    const conn = session.connections.get(wsId)
    session.connections.delete(wsId)
    if (conn) leaveSession(sessionId, conn.playerId)
}

export function broadcast(sessionId, message, excludeWs = null) {
    const session = getSession(sessionId)
    if (!session) return
    const data = JSON.stringify(message)
    for (const { ws } of session.connections.values()) {
        if (ws !== excludeWs && ws.readyState == ws.OPEN) ws.send(data)
    }
}

export function getSnapshot(sessionId) {
    const session = getSession(sessionId)
    if (!session) return null
    const { connections, ...snapshot } = session
    return snapshot
}

export function listSessions() {
    return Object.values(sessions).map(s => ({
        id: s.id, name: s.name, playerCount: Object.keys(s.players).length, createdAt: s.createdAt,
    }))
}
