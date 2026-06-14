import { randomUUID } from 'crypto'

const sessions = {}

export function createSession(name = 'Nova Sessão'){
    const id = randomUUID().slice(0,6)
    sessions[id] = {
        id, name, createdAt: Date.now(),
        map: {imageUrl: null, gridSize: 50, width: 1920, height:1080},
        tokens: [],
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

