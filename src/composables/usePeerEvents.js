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
    burstConfetti
  } = deps

  // Reactive state for peer events
  const networkPlayers = ref([])
  const toastMessage = ref('')
  const lobbyGamePhase = ref('LOBBY') // 'LOBBY' | 'PLAYING' for host controls visibility

  /**
   * Handle remote game start from host
   * @param {Object} data - Game start data with theme and seed
   */
  function handleRemoteGameStart(data) {
    const { theme, seed, dateISO } = data
    const teamCode = gameState.value.teamCode
    const playerName = gameState.value.playerName

    // Generate card with same seed
    const grid = generateCard(teamCode, playerName, dateISO, theme, gameState.value.customPhrases, seed)
    startGame(teamCode, playerName, grid, theme, seed, gameState.value.customPhrases)
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
    if (gameState.value.grid[row] && gameState.value.grid[row][col]) {
      gameState.value.grid[row][col].marked = marked
    }
  }

  /**
   * Handle peer bingo notification
   * @param {Object} data - Bingo data with playerName
   */
  function handlePeerBingo(data) {
    // Play bingo sound for peer bingo too
    playBingoSound()

    // Show toast notification
    toastMessage.value = `${data.playerName} got BINGO! 🎉`
    burstConfetti()

    // Clear toast after 3 seconds
    setTimeout(() => {
      toastMessage.value = ''
    }, 3000)
  }

  /**
   * Main peer data event handler - routes events to appropriate handlers
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
