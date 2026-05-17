// Check for bingo patterns
export function checkBingo(grid) {
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
