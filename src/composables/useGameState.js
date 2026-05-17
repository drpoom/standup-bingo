import { reactive, ref } from 'vue'
import { checkBingo } from '../utils/bingoCheck.js'
import { formatTime } from '../utils/formatTime.js'

export function useGameState() {
  const gameState = reactive({
    phase: 'LOBBY', // 'LOBBY' | 'PLAYING' | 'WON' | 'FINISHED'
    teamCode: '',
    playerName: '',
    theme: 'default',
    grid: [],
    bingos: [],
    marksCount: 0,
    startTime: null,
    bingoTime: null,
    seed: null,
    customPhrases: null,
    hostPeerId: null
  })

  function enterLobby(teamCode = '', playerName = '') {
    gameState.phase = 'LOBBY'
    if (teamCode) gameState.teamCode = teamCode
    if (playerName) gameState.playerName = playerName
    gameState.grid = []
    gameState.bingos = []
    gameState.marksCount = 0
    gameState.startTime = null
    gameState.bingoTime = null
  }

  function startGame(teamCode, playerName, grid, theme = 'default', seed = null, customPhrases = null) {
    gameState.phase = 'PLAYING'
    gameState.teamCode = teamCode
    gameState.playerName = playerName
    gameState.theme = theme
    gameState.grid = grid
    gameState.bingos = []
    gameState.marksCount = 0
    gameState.startTime = Date.now()
    gameState.bingoTime = null
    gameState.seed = seed
    gameState.customPhrases = customPhrases
  }

  function toggleMark(row, col) {
    if (gameState.phase !== 'PLAYING') return null

    // Ensure grid is populated before accessing
    if (!gameState.grid || !gameState.grid[row] || !gameState.grid[row][col]) return null

    const cell = gameState.grid[row][col]
    if (cell.isFree) return null

    cell.marked = !cell.marked
    if (cell.marked) {
      gameState.marksCount++
    } else {
      gameState.marksCount--
    }

    // Check for bingo
    const wins = checkBingo(gameState.grid)
    if (wins.length > 0 && gameState.bingos.length === 0) {
      gameState.bingoTime = Date.now() - gameState.startTime
      gameState.phase = 'WON'
    }

    // Add new wins
    for (const win of wins) {
      if (!gameState.bingos.some(b => b.type === win.type && b.index === win.index)) {
        gameState.bingos.push(win)
      }
    }

    return wins
  }

  function finishGame() {
    gameState.phase = 'FINISHED'
  }

  function endGame() {
    // Return to lobby, keep player info
    gameState.phase = 'LOBBY'
    gameState.grid = []
    gameState.bingos = []
    gameState.marksCount = 0
    gameState.startTime = null
    gameState.bingoTime = null
    gameState.seed = null
    // Keep teamCode, playerName, theme, customPhrases
  }

  function resetGame() {
    gameState.phase = 'LOBBY'
    gameState.teamCode = ''
    gameState.playerName = ''
    gameState.theme = 'default'
    gameState.grid = []
    gameState.bingos = []
    gameState.marksCount = 0
    gameState.startTime = null
    gameState.bingoTime = null
    gameState.seed = null
    gameState.customPhrases = null
    gameState.hostPeerId = null
  }

  function setHostPeerId(peerId) {
    gameState.hostPeerId = peerId
  }

  function setCustomPhrases(phrases) {
    gameState.customPhrases = phrases
  }

  return {
    gameState,
    enterLobby,
    startGame,
    toggleMark,
    finishGame,
    endGame,
    resetGame,
    formatTime,
    setHostPeerId,
    setCustomPhrases
  }
}
