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
    phase: 'join', // 'join' | 'playing' | 'won' | 'finished'
    teamCode: '',
    playerName: '',
    grid: [],
    bingos: [],
    marksCount: 0,
    startTime: null,
    bingoTime: null,
    timerSeconds: 20 * 60, // 20 minutes
    timerRunning: false
  })

  const timerInterval = ref(null)

  function startGame(teamCode, playerName, grid) {
    gameState.phase = 'playing'
    gameState.teamCode = teamCode
    gameState.playerName = playerName
    gameState.grid = grid
    gameState.bingos = []
    gameState.marksCount = 0
    gameState.startTime = Date.now()
    gameState.bingoTime = null
    gameState.timerSeconds = 20 * 60
    gameState.timerRunning = true

    // Start timer
    if (timerInterval.value) {
      clearInterval(timerInterval.value)
    }
    timerInterval.value = setInterval(() => {
      if (gameState.timerSeconds > 0) {
        gameState.timerSeconds--
      } else {
        gameState.timerRunning = false
        gameState.phase = 'finished'
        clearInterval(timerInterval.value)
      }
    }, 1000)
  }

  function toggleMark(row, col) {
    if (gameState.phase !== 'playing') return

    const cell = gameState.grid[row][col]
    if (cell.isFree) return

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
      gameState.phase = 'won'
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
    gameState.timerRunning = false
    gameState.phase = 'finished'
    if (timerInterval.value) {
      clearInterval(timerInterval.value)
    }
  }

  function resetGame() {
    gameState.phase = 'join'
    gameState.teamCode = ''
    gameState.playerName = ''
    gameState.grid = []
    gameState.bingos = []
    gameState.marksCount = 0
    gameState.startTime = null
    gameState.bingoTime = null
    gameState.timerSeconds = 20 * 60
    gameState.timerRunning = false
    if (timerInterval.value) {
      clearInterval(timerInterval.value)
    }
  }

  function formatTime(seconds) {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  return {
    gameState,
    startGame,
    toggleMark,
    finishGame,
    resetGame,
    formatTime
  }
}
