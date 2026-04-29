import { PHRASES } from '../data/phrases.js'

// Seeded PRNG - mulberry32
function mulberry32(seed) {
  return function () {
    seed |= 0
    seed = (seed + 0x6d2b79f5) | 0
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

// Hash function for strings
function hashString(str) {
  let h = 0
  for (let i = 0; i < str.length; i++) {
    h = Math.imul(31, h) + str.charCodeAt(i) | 0
  }
  return h
}

// Get all phrases as a flat array
function getAllPhrases() {
  const all = []
  for (const category of Object.values(PHRASES.categories)) {
    all.push(...category)
  }
  return all
}

// Generate a bingo card based on seed
export function useBingoCard() {
  function generateCard(teamCode, playerName, dateISO) {
    const seedString = `${teamCode.toUpperCase()}${dateISO}${playerName}`
    const seed = hashString(seedString)
    const rng = mulberry32(seed)

    const allPhrases = getAllPhrases()
    
    // Shuffle phrases deterministically
    const shuffled = [...allPhrases]
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(rng() * (i + 1))
      ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
    }

    // Pick first 24 phrases (center is FREE)
    const selectedPhrases = shuffled.slice(0, 24)

    // Create 5x5 grid
    const grid = []
    let phraseIndex = 0
    for (let row = 0; row < 5; row++) {
      const gridRow = []
      for (let col = 0; col < 5; col++) {
        if (row === 2 && col === 2) {
          gridRow.push({
            phrase: 'FREE',
            marked: true,
            isFree: true,
            row,
            col
          })
        } else {
          gridRow.push({
            phrase: selectedPhrases[phraseIndex++],
            marked: false,
            isFree: false,
            row,
            col
          })
        }
      }
      grid.push(gridRow)
    }

    return grid
  }

  return {
    generateCard
  }
}
