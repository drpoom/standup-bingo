export const THEMES = {
  default: {
    id: 'default',
    name: 'Corporate Clean',
    description: 'Professional, minimal, and safe for any meeting.',
    colors: {
      background: '#f8fafc', // slate-50
      card: '#ffffff',
      text: '#1e293b', // slate-800
      accent: '#3b82f6', // blue-500
      marked: '#dbeafe', // blue-100
      border: '#e2e8f0', // slate-200
    },
    font: 'Inter, system-ui, sans-serif',
    vibe: 'Modern SaaS / Enterprise'
  },
  cyberpunk: {
    id: 'cyberpunk',
    name: 'Neon Night',
    description: 'High contrast, glowing accents, and a futuristic feel.',
    colors: {
      background: '#0f172a', // slate-900
      card: '#1e293b', // slate-800
      text: '#f1f5f9', // slate-100
      accent: '#f0abfc', // fuchsia-300
      marked: '#4c1d95', // violet-900
      border: '#f0abfc', // fuchsia-300
    },
    font: 'JetBrains Mono, monospace',
    vibe: 'Cyberpunk 2077 / Synthwave'
  },
  retro: {
    id: 'retro',
    name: 'CRT Terminal',
    description: 'Classic green-on-black terminal aesthetic.',
    colors: {
      background: '#000000',
      card: '#0a0a0a',
      text: '#00ff41', // Matrix green
      accent: '#00ff41',
      marked: '#003300',
      border: '#00ff41',
    },
    font: 'Courier New, monospace',
    vibe: '80s Mainframe / Fallout'
  },
  zen: {
    id: 'zen',
    name: 'Zen Garden',
    description: 'Calming tones to reduce standup stress.',
    colors: {
      background: '#fdfbf7', // warm white
      card: '#ffffff',
      text: '#4a4a4a',
      accent: '#86efac', // green-300
      marked: '#dcfce7', // green-100
      border: '#e2e8f0',
    },
    font: 'Georgia, serif',
    vibe: 'Minimalist / Organic'
  }
};
