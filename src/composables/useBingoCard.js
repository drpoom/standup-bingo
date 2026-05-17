import { PHRASES } from '../data/phrases.js'
import { THEMES } from '../data/themes.js'
import { mulberry32, hashString } from '../utils/prng.js'

// Get all phrases as a flat array
function getAllPhrases() {
  const all = []
  for (const category of Object.values(PHRASES.categories)) {
    all.push(...category)
  }
  return all
}

// Merge custom phrases with theme phrases (deduplicate)
function mergePhrases(themePhrases, customPhrases) {
  if (!customPhrases || !customPhrases.categories) {
    return themePhrases
  }
  
  // Flatten custom phrases
  const customFlat = Object.values(customPhrases.categories).flat()
  
  // Deduplicate (case-insensitive)
  const seen = new Set(themePhrases.map(p => p.toLowerCase()))
  const uniqueCustom = customFlat.filter(p => !seen.has(p.toLowerCase()))
  
  return [...themePhrases, ...uniqueCustom]
}

// Generate a bingo card based on seed and theme
export function useBingoCard() {
  function generateCard(teamCode, playerName, dateISO, theme = 'default', customPhrases = null, seed = null, boardSharing = 'separate') {
    // If separate: include playerName in seed
    // If shared: use seed only (no playerName)
    const seedString = boardSharing === 'shared' && seed 
      ? String(seed) 
      : `${teamCode.toUpperCase()}${dateISO}${playerName}${theme}${seed || ''}`
    const seedValue = typeof seed === 'number' ? seed : hashString(seedString)
    const rng = mulberry32(seedValue)

    // Get phrases based on theme
    const themePhrases = getThemePhrases(theme)
    const mergedPhrases = mergePhrases(themePhrases, customPhrases)
    const allPhrases = mergedPhrases.length > 0 ? mergedPhrases : getAllPhrases()
    
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
            col,
            theme
          })
        } else {
          gridRow.push({
            phrase: selectedPhrases[phraseIndex++],
            marked: false,
            isFree: false,
            row,
            col,
            theme
          })
        }
      }
      grid.push(gridRow)
    }

    return grid
  }

  // Get phrases for a specific theme
  function getThemePhrases(themeId) {
    const theme = THEMES[themeId]
    if (!theme || !theme.phrases) return []
    
    // theme.phrases is a flat array
    return theme.phrases
  }

  return {
    generateCard,
    getThemePhrases,
    mergePhrases
  }
}
