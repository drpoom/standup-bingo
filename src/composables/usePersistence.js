import { reactive, watch } from 'vue'
import { ACHIEVEMENTS } from '../data/achievements.js'

const STORAGE_KEY = 'standup-bingo-stats'

function loadStats() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) {
      return JSON.parse(saved)
    }
  } catch (e) {
    console.error('Failed to load stats:', e)
  }
  return {
    totalBingos: 0,
    totalGames: 0,
    currentStreak: 0,
    longestStreak: 0,
    lastPlayedDate: null,
    achievements: [],
    unlockedThemes: ['default'],
    bestBingoTime: null
  }
}

function saveStats(stats) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(stats))
  } catch (e) {
    console.error('Failed to save stats:', e)
  }
}

export function usePersistence() {
  const stats = reactive(loadStats())

  // Auto-save on changes
  watch(
    () => ({ ...stats }),
    () => saveStats(stats),
    { deep: true }
  )

  function recordGame(bingoTime, achievedBingo) {
    const today = new Date().toISOString().split('T')[0]
    
    stats.totalGames++
    
    if (achievedBingo) {
      stats.totalBingos++
      
      // Update streak
      if (stats.lastPlayedDate) {
        const lastDate = new Date(stats.lastPlayedDate)
        const todayDate = new Date(today)
        const diffDays = Math.floor((todayDate - lastDate) / (1000 * 60 * 60 * 24))
        
        if (diffDays === 1) {
          stats.currentStreak++
        } else if (diffDays > 1) {
          stats.currentStreak = 1
        }
        // diffDays === 0 means same day, streak unchanged
      } else {
        stats.currentStreak = 1
      }
      
      stats.longestStreak = Math.max(stats.longestStreak, stats.currentStreak)
      stats.lastPlayedDate = today
      
      // Update best time
      if (!stats.bestBingoTime || bingoTime < stats.bestBingoTime) {
        stats.bestBingoTime = bingoTime
      }

      // Check achievements
      checkAchievements(bingoTime)
    }
  }

  function checkAchievements(bingoTime) {
    const newAchievements = []
    
    for (const achievement of ACHIEVEMENTS) {
      if (stats.achievements.includes(achievement.id)) continue
      
      let unlocked = false
      
      switch (achievement.id) {
        case 'early-bird':
          unlocked = bingoTime < 300
          break
        case 'speed-demon':
          unlocked = bingoTime < 180
          break
        case 'marathon':
          unlocked = stats.currentStreak >= 7
          break
        case 'consistent':
          unlocked = stats.currentStreak >= 10
          break
        case 'veteran':
          unlocked = stats.totalBingos >= 50
          break
      }
      
      if (unlocked) {
        newAchievements.push(achievement.id)
        stats.achievements.push(achievement.id)
        
        // Unlock theme rewards
        if (achievement.reward && achievement.reward.includes('Theme:')) {
          const themeId = achievement.reward.split(': ')[1].toLowerCase().replace(' ', '-')
          if (!stats.unlockedThemes.includes(themeId)) {
            stats.unlockedThemes.push(themeId)
          }
        }
      }
    }
    
    return newAchievements
  }

  function unlockTheme(themeId) {
    if (!stats.unlockedThemes.includes(themeId)) {
      stats.unlockedThemes.push(themeId)
    }
  }

  return {
    stats,
    recordGame,
    unlockTheme
  }
}
