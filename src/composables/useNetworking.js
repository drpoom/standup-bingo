import { ref, onMounted, onUnmounted } from 'vue'
import Peer from 'peerjs'

export function useNetworking() {
  const peer = ref(null)
  const connections = ref([])
  const isHost = ref(false)
  const roomId = ref(null)
  const connected = ref(false)
  const players = ref([])
  const myPeerId = ref(null)
  const hostPeerId = ref(null)
  const lobbyGamePhase = ref('LOBBY') // 'LOBBY' | 'PLAYING'

  // Settings sync refs
  const lobbySeed = ref(null)
  const lobbyBoardSharing = ref('separate')
  const lobbyTheme = ref('default')

  // Player tracking
  const playerJoinTimes = ref({})

  function initializeAsHost(teamCode, dateISO, playerName) {
    roomId.value = `${teamCode.toUpperCase()}-${dateISO}`
    isHost.value = true
    hostPeerId.value = null // Will be set when peer opens
    
    peer.value = new Peer(roomId.value, {
      debug: 2,
      config: {
        iceServers: [
          { urls: 'stun:stun.l.google.com:19302' },
          { urls: 'stun:stun1.l.google.com:19302' }
        ]
      }
    })

    peer.value.on('open', (id) => {
      console.log('Host peer opened:', id)
      myPeerId.value = id
      hostPeerId.value = id
      connected.value = true
      
      // Add self to players list
      addPlayer({
        peerId: id,
        name: playerName,
        joinTime: Date.now(),
        ready: false,
        isHost: true
      })
      
      // Broadcast initial player list
      broadcastPlayerList()
    })

    peer.value.on('connection', (conn) => {
      setupConnection(conn)
    })

    peer.value.on('error', (err) => {
      console.error('PeerJS error:', err)
    })

    peer.value.on('disconnected', () => {
      console.log('Host disconnected')
    })

    peer.value.on('close', () => {
      console.log('Host peer closed')
      handleHostDisconnect()
    })
  }

  function initializeAsClient(teamCode, dateISO, playerName) {
    roomId.value = `${teamCode.toUpperCase()}-${dateISO}`
    isHost.value = false
    
    peer.value = new Peer({
      debug: 2,
      config: {
        iceServers: [
          { urls: 'stun:stun.l.google.com:19302' },
          { urls: 'stun:stun1.l.google.com:19302' }
        ]
      }
    })

    peer.value.on('open', (id) => {
      console.log('Client peer opened:', id)
      myPeerId.value = id
      
      // Connect to host
      const conn = peer.value.connect(roomId.value)
      conn.on('open', () => {
        setupConnection(conn)
        connected.value = true
        // Send join event
        sendToPeers({ 
          type: 'JOIN', 
          playerName,
          peerId: id,
          timestamp: Date.now()
        })
      })
      conn.on('error', (err) => {
        console.error('Connection error:', err)
      })
    })

    peer.value.on('error', (err) => {
      console.error('PeerJS error:', err)
      // If the host peer is unavailable, mark as not connected so fallback can trigger
      if (err.type === 'peer-unavailable') {
        connected.value = false
      }
    })

    peer.value.on('disconnected', () => {
      console.log('Client disconnected')
    })

    peer.value.on('close', () => {
      console.log('Client peer closed')
    })
  }

  function setupConnection(conn) {
    // Check if connection already exists
    const existing = connections.value.find(c => c.peer === conn.peer)
    if (existing) {
      conn.close()
      return
    }
    
    connections.value.push(conn)

    conn.on('data', (data) => {
      handlePeerData(data)
    })

    conn.on('close', () => {
      connections.value = connections.value.filter(c => c !== conn)
      // Remove player from list
      removePlayer(conn.peer)
      
      // Check if disconnected player was host
      if (conn.peer === hostPeerId.value) {
        handleHostDisconnect()
      }
    })

    conn.on('error', (err) => {
      console.error('Connection error:', err)
    })
  }

  function handlePeerData(data) {
    // PeerJS may deliver data as a string if sender used JSON.stringify,
    // or as an object if sent directly. Normalize to object.
    if (typeof data === 'string') {
      try {
        data = JSON.parse(data)
      } catch (e) {
        console.error('Failed to parse peer data:', data)
        return
      }
    }
    
    // Emit custom event for parent to handle
    window.dispatchEvent(new CustomEvent('peer-data', { detail: data }))
    
    // Handle internal networking events
    switch (data.type) {
      case 'JOIN':
        handleJoin(data)
        break
      case 'PLAYER_READY':
        handlePlayerReady(data)
        break
      case 'HOST_TRANSFER':
        handleHostTransfer(data)
        break
      case 'GAME_START':
        // Handled by parent
        break
      case 'GAME_END':
        // Handled by parent
        break
      case 'CUSTOM_PHRASES':
        // Handled by parent
        break
      case 'BINGO':
      case 'MARK_UPDATE':
        // Existing events, handled by parent
        break
      case 'REQUEST_GAME_STATE':
        // Late joiner requesting current game state - emit for parent to handle
        // Host should respond with current game state via sendGameStateToPeer
        window.dispatchEvent(new CustomEvent('peer-request-game-state', { detail: data }))
        break
    }
  }

  function handleJoin(data) {
    const { playerName, peerId, timestamp } = data
    addPlayer({
      peerId: peerId,
      name: playerName,
      joinTime: timestamp || Date.now(),
      ready: false,
      isHost: false
    })
    
    // Broadcast updated player list
    broadcastPlayerList()
  }

  function handlePlayerReady(data) {
    const player = players.value.find(p => p.peerId === data.peerId)
    if (player) {
      player.ready = data.ready
    }
    broadcastPlayerList()
  }

  function handleHostTransfer(data) {
    hostPeerId.value = data.newHostPeerId
    isHost.value = (myPeerId.value === data.newHostPeerId)
    
    // Update player list
    players.value.forEach(p => {
      p.isHost = (p.peerId === data.newHostPeerId)
    })
  }

  function handleHostDisconnect() {
    if (!isHost.value) {
      // Auto-transfer: find next oldest player
      const remainingPlayers = players.value.filter(p => p.peerId !== hostPeerId.value)
      if (remainingPlayers.length > 0) {
        remainingPlayers.sort((a, b) => a.joinTime - b.joinTime)
        const nextHost = remainingPlayers[0]
        
        hostPeerId.value = nextHost.peerId
        isHost.value = (myPeerId.value === nextHost.peerId)
        
        // Update player list
        players.value.forEach(p => {
          p.isHost = (p.peerId === nextHost.peerId)
        })
        
        // Broadcast transfer if we became the new host
        if (isHost.value) {
          broadcast({
            type: 'HOST_TRANSFER',
            newHostPeerId: nextHost.peerId,
            timestamp: Date.now()
          })
        }
      }
    }
  }

  function addPlayer(playerInfo) {
    const existing = players.value.find(p => p.peerId === playerInfo.peerId)
    if (!existing) {
      players.value.push(playerInfo)
    }
  }

  function updatePlayerGrid(peerId, grid) {
    const player = players.value.find(p => p.peerId === peerId)
    if (player) {
      player.grid = grid
    }
  }

  function updatePlayerSeed(peerId, seed) {
    const player = players.value.find(p => p.peerId === peerId)
    if (player) {
      player.seed = seed
    }
  }

  function updateLobbySettings(settings) {
    if (settings.seed !== undefined) lobbySeed.value = settings.seed
    if (settings.boardSharing !== undefined) lobbyBoardSharing.value = settings.boardSharing
    if (settings.theme !== undefined) lobbyTheme.value = settings.theme
    
    // Broadcast updated settings to everyone in the lobby
    if (isHost.value) {
      broadcastPlayerList()
    }
  }

  function removePlayer(peerId) {
    players.value = players.value.filter(p => p.peerId !== peerId)
  }

  function broadcastPlayerList() {
    // Include grid and seed for each player if available
    const playersWithGrid = players.value.map(p => ({
      ...p,
      grid: p.grid || null,
      seed: p.seed || null
    }))
    
    broadcast({
      type: 'PLAYER_LIST',
      players: playersWithGrid,
      gamePhase: lobbyGamePhase.value,
      seed: lobbySeed.value,
      boardSharing: lobbyBoardSharing.value,
      theme: lobbyTheme.value,
      timestamp: Date.now()
    })
  }

  function sendToPeers(data, excludePeerId) {
    connections.value.forEach(conn => {
      if (excludePeerId && conn.peer === excludePeerId) {
        return
      }
      conn.send(data)
    })
  }

  function broadcast(data) {
    // Host broadcasts to all clients
    if (isHost.value) {
      sendToPeers(data)
    }
  }

  function broadcastBingo(playerName, bingoType) {
    sendToPeers({
      type: 'BINGO',
      playerName,
      bingoType,
      timestamp: Date.now()
    })
  }

  function broadcastMarkUpdate(row, col, marked, peerId) {
    sendToPeers({
      type: 'MARK_UPDATE',
      row,
      col,
      marked,
      peerId,
      timestamp: Date.now()
    })
  }

  function broadcastGameStart(theme, seed, dateISO, boardSharing) {
    lobbyGamePhase.value = 'PLAYING'
    broadcast({
      type: 'GAME_START',
      theme,
      seed,
      dateISO,
      boardSharing: boardSharing || lobbyBoardSharing.value,
      timestamp: Date.now()
    })
  }

  function broadcastGameEnd() {
    lobbyGamePhase.value = 'LOBBY'
    broadcast({
      type: 'GAME_END',
      timestamp: Date.now()
    })
  }

  function broadcastHostTransfer(newHostPeerId) {
    broadcast({
      type: 'HOST_TRANSFER',
      newHostPeerId,
      timestamp: Date.now()
    })
  }

  function broadcastPlayerReady(ready) {
    sendToPeers({
      type: 'PLAYER_READY',
      peerId: myPeerId.value,
      ready,
      timestamp: Date.now()
    })
  }

  function broadcastCustomPhrases(phrases) {
    broadcast({
      type: 'CUSTOM_PHRASES',
      phrases,
      timestamp: Date.now()
    })
  }

  function sendGameStateToPeer(peerId, gameStateData) {
    // Send game state to a specific peer (e.g., late joiner)
    const conn = connections.value.find(c => c.peer === peerId)
    if (conn && conn.open) {
      conn.send({
        type: 'GAME_STATE',
        ...gameStateData,
        timestamp: Date.now()
      })
    }
  }

  function toggleReady(ready) {
    // Update local player
    const myPlayer = players.value.find(p => p.peerId === myPeerId.value)
    if (myPlayer) {
      myPlayer.ready = ready
    }
    broadcastPlayerReady(ready)
    broadcastPlayerList()
  }

  function transferHost(newHostPeerId) {
    if (isHost.value) {
      broadcastHostTransfer(newHostPeerId)
      handleHostTransfer({ newHostPeerId })
    }
  }

  function startGame(theme, seed, dateISO, boardSharing) {
    if (isHost.value) {
      broadcastGameStart(theme, seed, dateISO, boardSharing)
    }
  }

  function endGame() {
    if (isHost.value) {
      broadcastGameEnd()
    }
  }

  function sendCustomPhrases(phrases) {
    if (isHost.value) {
      broadcastCustomPhrases(phrases)
    }
  }

  function disconnect() {
    if (peer.value) {
      connections.value.forEach(conn => conn.close())
      peer.value.destroy()
      peer.value = null
    }
    connections.value = []
    connected.value = false
    players.value = []
    isHost.value = false
    hostPeerId.value = null
    myPeerId.value = null
  }

  onUnmounted(() => {
    disconnect()
  })

  return {
    peer,
    connections,
    isHost,
    roomId,
    connected,
    players,
    myPeerId,
    hostPeerId,
    lobbyGamePhase,
    lobbySeed,
    lobbyBoardSharing,
    lobbyTheme,
    initializeAsHost,
    initializeAsClient,
    sendToPeers,
    broadcast,
    broadcastBingo,
    broadcastMarkUpdate,
    broadcastGameStart,
    broadcastGameEnd,
    broadcastHostTransfer,
    broadcastPlayerReady,
    broadcastCustomPhrases,
    toggleReady,
    transferHost,
    startGame,
    endGame,
    sendCustomPhrases,
    sendGameStateToPeer,
    updatePlayerGrid,
    updatePlayerSeed,
    updateLobbySettings,
    disconnect
  }
}
