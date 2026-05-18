import { ref } from 'vue'

/**
 * Composable for handling peer data events in the bingo game.
 * Manages network player list, remote game state synchronization,
 * and peer bingo notifications.
 *
 * @param {Object} deps - Dependencies injected from parent component
 * @param {Object} deps.networking - Networking composable with connection state and methods
 * @param {Object} deps.gameState - Game state composable with state and actions
 * @param {Function} deps.generateCard - Card generation function
 * @param {Function} deps.startGame - Start game action
 * @param {Function} deps.endGame - End game action
 * @param {Function} deps.setHostPeerId - Set host peer ID action
 * @param {Function} deps.setCustomPhrases - Set custom phrases action
 * @param {Function} deps.playBingoSound - Play bingo sound effect
 * @param {Function} deps.burstConfetti - Trigger confetti effect
 * @returns {Object} Event handlers and reactive state
 */
export function usePeerEvents(deps) {
  const {
    networking,
    gameState,
    generateCard,
    startGame,
    endGame,
    setHostPeerId,
    setCustomPhrases,
    playBingoSound,
    playBingoVoice,
    burstConfetti
  } = deps

  // Reactive state for peer events
  const networkPlayers = ref([])
  const toastMessage = ref('')
  const peerBingo = ref(null)
  const lobbyGamePhase = ref('LOBBY') // 'LOBBY' | 'PLAYING' for host controls visibility

  /**
   * Handle remote game start from host
   * @param {Object} data - Game start data with theme and seed
   */
  function handleRemoteGameStart(data) {
    const { theme, seed, dateISO } = data
    const teamCode = gameState.teamCode
    const playerName = gameState.playerName

    // Generate card with same seed
    const grid = generateCard(teamCode, playerName, dateISO, theme, gameState.customPhrases, seed, gameState.boardSharing)
    startGame(teamCode, playerName, grid, theme, seed, gameState.customPhrases, dateISO)
    lobbyGamePhase.value = 'PLAYING'
  }

  /**
   * Handle remote game end from host
   */
  function handleRemoteGameEnd() {
    endGame()
    lobbyGamePhase.value = 'LOBBY'
    networkPlayers.value = []
  }

  /**
   * Handle host transfer notification
   * @param {Object} data - Host transfer data with newHostPeerId
   */
  function handleRemoteHostTransfer(data) {
    setHostPeerId(data.newHostPeerId)
  }

  /**
   * Handle custom phrases update from host
   * @param {Object} data - Custom phrases data
   */
  function handleRemoteCustomPhrases(data) {
    setCustomPhrases(data.phrases)
  }

  /**
   * Handle remote mark update from peer
   * @param {Object} data - Mark update data with row, col, marked
   */
  function handleRemoteMarkUpdate(data) {
    const { row, col, marked } = data
    if (gameState.grid[row] && gameState.grid[row][col]) {
      gameState.grid[row][col].marked = marked
    }
  }

  /**
   * Handle peer bingo notification
   * @param {Object} data - Bingo data with playerName
   */
  function handlePeerBingo(data) {
    // Play bingo sound for peer bingo too
    playBingoSound()
    
    // Play BINGO! voice
    playBingoVoice()

    // Set peer bingo state for celebration overlay
    peerBingo.value = {
      playerName: data.playerName,
      bingoType: data.bingoType || null
    }

    // Show toast notification
    toastMessage.value = `${data.playerName} got BINGO! 🎉`
    burstConfetti()

    // Clear toast after 3 seconds
    setTimeout(() => {
      toastMessage.value = ''
    }, 3000)
  }

  /**
   * Handle peer data event - routes events to appropriate handlers
   * @param {Event} event - Custom event with detail data
   */
  function handlePeerData(event) {
    const data = event.detail

    switch (data.type) {
      case 'PLAYER_LIST':
        networkPlayers.value = data.players
        // Update host peer ID if provided
        const host = data.players.find(p => p.isHost)
        if (host) {
          setHostPeerId(host.peerId)
        }
        
        // Update lobby game phase from host
        if (data.gamePhase) {
          lobbyGamePhase.value = data.gamePhase
        }
        
        // LATE JOIN: If game is PLAYING/WON and we just connected, request game state
        if ((data.gamePhase === 'PLAYING' || data.gamePhase === 'WON') && !gameState.grid.length) {
          // Request current game state from host
          if (networking.peer.value && networking.peer.value.open) {
            const conn = networking.connections.value.find(c => c.open)
            if (conn && conn.open) {
              conn.send({
                type: 'REQUEST_GAME_STATE',
                peerId: networking.myPeerId.value
              })
            }
          }
        }
        break

      case 'GAME_START':
        handleRemoteGameStart(data)
        break

      case 'GAME_END':
        handleRemoteGameEnd()
        break

      case 'HOST_TRANSFER':
        handleRemoteHostTransfer(data)
        break

      case 'CUSTOM_PHRASES':
        handleRemoteCustomPhrases(data)
        break

      case 'BINGO':
        handlePeerBingo(data)
        break

      case 'MARK_UPDATE':
        handleRemoteMarkUpdate(data)
        // Rebroadcast to all peers except sender if host
        if (networking.isHost.value && data.peerId) {
          networking.sendToPeers(data, data.peerId)
        }
        break

      case 'REQUEST_GAME_STATE':
        // Host receives this from late joiners - send current game state with full grid
        if (networking.isHost.value && gameState.phase === 'PLAYING') {
          // Extract marked state from grid - which cells are marked
          const gridMarks = gameState.grid.map(row => 
            row.map(cell => ({ marked: cell.marked, isFree: cell.isFree }))
          )
          
          networking.sendGameStateToPeer(data.peerId, {
            phase: gameState.phase,
            theme: gameState.theme,
            seed: gameState.seed,
            startTime: gameState.startTime,
            dateISO: gameState.dateISO || new Date().toISOString().split('T')[0],
            boardSharing: gameState.boardSharing,
            customPhrases: gameState.customPhrases,
            gridMarks: gridMarks
          })
        }
        break

      case 'GAME_STATE':
        // Late joiner receives game state from host - sync and join game
        if (gameState.phase === 'LOBBY') {
          const teamCode = gameState.teamCode
          const playerName = gameState.playerName
          const dateISO = data.dateISO || new Date().toISOString().split('T')[0]
          
          // Generate card with same seed
          const grid = generateCard(teamCode, playerName, dateISO, data.theme, data.customPhrases, data.seed, data.boardSharing)
          
          // Apply marked state from host
          if (data.gridMarks && grid.length === data.gridMarks.length) {
            for (let row = 0; row < grid.length; row++) {
              for (let col = 0; col < grid[row].length; col++) {
                if (data.gridMarks[row][col]) {
                  grid[row][col].marked = data.gridMarks[row][col].marked
                  // Don't override isFree, but ensure consistency
                  if (data.gridMarks[row][col].isFree !== undefined) {
                    grid[row][col].isFree = data.gridMarks[row][col].isFree
                  }
                }
              }
            }
          }
          
          startGame(teamCode, playerName, grid, data.theme, data.seed, data.customPhrases, dateISO)
          lobbyGamePhase.value = 'PLAYING'
        }
        break
    }
  }

  /**
   * Set up event listener for peer data events
   */
  function setupPeerListener() {
    window.addEventListener('peer-data', handlePeerData)
  }

  /**
   * Remove event listener for peer data events
   */
  function cleanupPeerListener() {
    window.removeEventListener('peer-data', handlePeerData)
  }

  return {
    // Reactive state
    networkPlayers,
    toastMessage,
    peerBingo,
    lobbyGamePhase,

    // Event handlers
    handlePeerData,
    handlePeerBingo,
    handleRemoteGameStart,
    handleRemoteGameEnd,
    handleRemoteHostTransfer,
    handleRemoteCustomPhrases,
    handleRemoteMarkUpdate,

    // Lifecycle methods
    setupPeerListener,
    cleanupPeerListener
  }
}
