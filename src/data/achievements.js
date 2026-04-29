export const ACHIEVEMENTS = [
  {
    id: 'early-bird',
    name: 'Early Bird',
    description: 'Get a Bingo in the first 5 minutes of the standup.',
    requirement: 'bingo_time < 300', // seconds
    reward: 'Badge: 🌅'
  },
  {
    id: 'marathon',
    name: 'Marathon',
    description: 'Maintain a 7-day bingo streak.',
    requirement: 'streak >= 7',
    reward: 'Theme: Zen Garden'
  },
  {
    id: 'speed-demon',
    name: 'Speed Demon',
    description: 'Complete a Bingo in under 3 minutes.',
    requirement: 'bingo_time < 180',
    reward: 'Badge: ⚡'
  },
  {
    id: 'completionist',
    name: 'Completionist',
    description: 'Mark all 24 squares in a single game.',
    requirement: 'squares_marked === 24',
    reward: 'Badge: 🏆'
  },
  {
    id: 'lucky-strike',
    name: 'Lucky Strike',
    description: 'Get a Bingo on your very first mark.',
    requirement: 'marks_count === 5', // (Assuming center is free)
    reward: 'Badge: 🍀'
  },
  {
    id: 'consistent',
    name: 'Consistent',
    description: 'Play 10 games in a row without missing a day.',
    requirement: 'streak >= 10',
    reward: 'Card Back: Silver'
  },
  {
    id: 'veteran',
    name: 'Veteran',
    description: 'Achieve 50 total Bingos across all time.',
    requirement: 'total_bingos >= 50',
    reward: 'Card Back: Gold'
  },
  {
    id: 'social-butterfly',
    name: 'Social Butterfly',
    description: 'Share your Bingo result to the team channel 5 times.',
    requirement: 'shares >= 5',
    reward: 'Badge: 🦋'
  },
  {
    id: 'perfect-game',
    name: 'Perfect Game',
    description: 'Get 3 or more Bingos in a single session.',
    requirement: 'session_bingos >= 3',
    reward: 'Badge: 💎'
  },
  {
    id: 'clutch',
    name: 'Clutch',
    description: 'Get a Bingo in the final 60 seconds of the timer.',
    requirement: 'bingo_time_remaining < 60',
    reward: 'Badge: ⏱️'
  },
  {
    id: 'iron-will',
    name: 'Iron Will',
    description: 'Mark 10 squares without getting a Bingo.',
    requirement: 'marks_without_bingo >= 10',
    reward: 'Badge: 🛡️'
  },
  {
    id: 'unlucky',
    name: 'Unlucky',
    description: 'Almost get a Bingo (4 squares in a row) 3 times in one game.',
    requirement: 'near_misses >= 3',
    reward: 'Badge: 🕯️'
  }
];
