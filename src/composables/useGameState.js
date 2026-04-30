import { reactive, ref } from 'vue'

// Check for bingo patterns
function checkBingo(grid) {
  const wins = []

  // Check rows
  for (let row = 0; row < 5; row++) {
    if (grid[row].every(cell => cell.marked)) {
      wins.push({ type: 'row', index: row, cells: grid[row] })
    }
  }

  // Check columns
  for (let col = 0; col < 5; col++) {
    const column = grid.map(row => row[col])
    if (column.every(cell => cell.marked)) {
      wins.push({ type: 'column', index: col, cells: column })
    }
  }

  // Check diagonals
  const diag1 = [grid[0][0], grid[1][1], grid[2][2], grid[3][3], grid[4][4]]
  if (diag1.every(cell => cell.marked)) {
    wins.push({ type: 'diagonal', direction: 'main', cells: diag1 })
  }

  const diag2 = [grid[0][4], grid[1][3], grid[2][2], grid[3][1], grid[4][0]]
  if (diag2.every(cell => cell.marked)) {
    wins.push({ type: 'diagonal', direction: 'anti', cells: diag2 })
  }

  return wins
}

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

  function formatTime(startTime) {
    if (!startTime) return '0:00'
    const elapsed = Math.floor((Date.now() - startTime) / 1000)
    const mins = Math.floor(elapsed / 60)
    const secs = elapsed % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
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
