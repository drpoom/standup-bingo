import { reactive, computed, ref } from 'vue'
import { checkBingo } from '../utils/bingoCheck.js'
import { formatTime } from '../utils/formatTime.js'

export function useGameState() {
  const timer = ref(0)
  let timerInterval = null

  function startTimer() {
    if (timerInterval) clearInterval(timerInterval)
    timer.value = 0
    timerInterval = setInterval(() => {
      timer.value++
    }, 1000)
  }

  function stopTimer() {
    if (timerInterval) {
      clearInterval(timerInterval)
      timerInterval = null
    }
  }
  const gameState = reactive({
    phase: 'LOBBY', // 'LOBBY' | 'PLAYING' | 'WON' | 'FINISHED'
    teamCode: '',
    playerName: '',
    theme: 'default',
    grid: [],
    bingos: [],
    startTime: null,
    bingoTime: null,
    seed: null,
    customPhrases: null,
    hostPeerId: null,
    boardSharing: 'separate', // 'separate' or 'shared'
    dateISO: ''
  })

  function enterLobby(teamCode = '', playerName = '') {
    gameState.phase = 'LOBBY'
    if (teamCode) gameState.teamCode = teamCode
    if (playerName) gameState.playerName = playerName
    gameState.grid = []
    gameState.bingos = []
    gameState.startTime = null
    gameState.bingoTime = null
  }

  function startGame(teamCode, playerName, grid, theme = 'default', seed = null, customPhrases = null, dateISO = null) {
    gameState.phase = 'PLAYING'
    gameState.teamCode = teamCode
    gameState.playerName = playerName
    gameState.theme = theme
    // Reset all cell marks to ensure marksCount starts at 0
    if (grid && Array.isArray(grid)) {
      for (const row of grid) {
        if (Array.isArray(row)) {
          for (const cell of row) {
            if (cell && !cell.isFree) {
              cell.marked = false
            }
          }
        }
      }
    }
    gameState.grid = grid
    gameState.bingos = []
    gameState.startTime = Date.now()
    gameState.bingoTime = null
    gameState.seed = seed
    gameState.customPhrases = customPhrases
    if (dateISO) gameState.dateISO = dateISO
    startTimer()
  }

  function toggleMark(row, col) {
    if (gameState.phase !== 'PLAYING') return null

    // Ensure grid is populated before accessing
    if (!gameState.grid || !gameState.grid[row] || !gameState.grid[row][col]) return null

    const cell = gameState.grid[row][col]
    if (cell.isFree) return null

    cell.marked = !cell.marked

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
    stopTimer()
  }

  function endGame() {
    // Return to lobby, keep player info
    gameState.phase = 'LOBBY'
    gameState.grid = []
    gameState.bingos = []
    gameState.startTime = null
    gameState.bingoTime = null
    gameState.seed = null
    gameState.dateISO = ''
    stopTimer()
    // Keep teamCode, playerName, theme, customPhrases
  }

  function resetGame() {
    gameState.phase = 'LOBBY'
    gameState.teamCode = ''
    gameState.playerName = ''
    gameState.theme = 'default'
    gameState.grid = []
    gameState.bingos = []
    gameState.startTime = null
    gameState.bingoTime = null
    gameState.seed = null
    gameState.customPhrases = null
    gameState.hostPeerId = null
    stopTimer()
  }

  function setHostPeerId(peerId) {
    gameState.hostPeerId = peerId
  }

  function setCustomPhrases(phrases) {
    gameState.customPhrases = phrases
  }

  const marksCount = computed(() => {
    if (!gameState.grid || !Array.isArray(gameState.grid)) return 0
    let count = 0
    for (const row of gameState.grid) {
      if (!Array.isArray(row)) continue
      for (const cell of row) {
        if (cell && cell.marked) count++
      }
    }
    return count
  })

  return {
    gameState,
    timer,
    marksCount,
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
