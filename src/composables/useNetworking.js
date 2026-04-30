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

  // Player tracking
  const playerJoinTimes = ref({})

  function initializeAsHost(teamCode, dateISO, playerName) {
    roomId.value = `${teamCode.toUpperCase()}-${dateISO}`
    isHost.value = true
    hostPeerId.value = null // Will be set when peer opens
    
    peer.value = new Peer(roomId.value, {
      debug: 2
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
      debug: 2
    })

    peer.value.on('open', (id) => {
      console.log('Client peer opened:', id)
      myPeerId.value = id
      
      // Connect to host
      const conn = peer.value.connect(roomId.value)
      conn.on('open', () => {
        setupConnection(conn)
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
    }
  }

  function handleJoin(data) {
    const { playerName, peerId, timestamp } = data
    addPlayer({
      peerId: peerId || conn.peer,
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

  function removePlayer(peerId) {
    players.value = players.value.filter(p => p.peerId !== peerId)
  }

  function broadcastPlayerList() {
    broadcast({
      type: 'PLAYER_LIST',
      players: players.value,
      timestamp: Date.now()
    })
  }

  function sendToPeers(data) {
    const message = JSON.stringify(data)
    connections.value.forEach(conn => {
      if (conn.open) {
        conn.send(message)
      }
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

  function broadcastMarkUpdate(row, col, marked) {
    sendToPeers({
      type: 'MARK_UPDATE',
      row,
      col,
      marked,
      timestamp: Date.now()
    })
  }

  function broadcastGameStart(theme, seed) {
    broadcast({
      type: 'GAME_START',
      theme,
      seed,
      timestamp: Date.now()
    })
  }

  function broadcastGameEnd() {
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

  function startGame(theme, seed) {
    if (isHost.value) {
      broadcastGameStart(theme, seed)
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
    disconnect
  }
}
