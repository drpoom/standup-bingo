export const THEMES = {
  default: {
    id: 'default',
    name: 'General Dev',
    description: 'Standard development team phrases for daily standups.',
    colors: {
      background: '#f8fafc',
      card: '#ffffff',
      text: '#1e293b',
      accent: '#3b82f6',
      marked: '#dbeafe',
      border: '#e2e8f0',
    },
    font: 'Inter, system-ui, sans-serif',
    vibe: 'Modern SaaS / Enterprise',
    phrases: {
      common: [
        'Fixed a bug',
        'Working on PR',
        'Code review',
        'Deployed to staging',
        'Blocked by API',
        'Refactoring legacy code',
        'Updated dependencies',
        'Writing tests',
        'Debugging issue',
        'Merged to main'
      ],
      meetings: [
        'Sprint planning',
        'Retrospective',
        'Backlog grooming',
        'Stakeholder demo',
        'Architecture review'
      ],
      blockers: [
        'Waiting for review',
        'Need clarification',
        'Environment issues',
        'Third-party downtime',
        'Merge conflicts'
      ]
    }
  },
  embedded: {
    id: 'embedded',
    name: 'Embedded Dev',
    description: 'Specialized phrases for embedded systems and IoT development.',
    colors: {
      background: '#0f172a',
      card: '#1e293b',
      text: '#f1f5f9',
      accent: '#38bdf8',
      marked: '#0c4a6e',
      border: '#38bdf8',
    },
    font: 'JetBrains Mono, monospace',
    vibe: 'Embedded Systems / IoT',
    phrases: {
      common: [
        'Flashed firmware',
        'Debugging UART',
        'Hardware bring-up',
        'Sensor integration',
        'Memory optimization',
        'Real-time debugging',
        'Peripheral config',
        'Power management',
        'Bootloader update',
        'GPIO testing'
      ],
      hardware: [
        'Oscilloscope session',
        'Logic analyzer',
        'PCB revision',
        'Component shortage',
        'Thermal testing'
      ],
      blockers: [
        'Waiting for hardware',
        'JTAG issues',
        'Datasheet unclear',
        'Toolchain problems',
        'Flash memory full'
      ]
    }
  },
  qa: {
    id: 'qa',
    name: 'QA/Test',
    description: 'Quality assurance and testing focused phrases.',
    colors: {
      background: '#fdfbf7',
      card: '#ffffff',
      text: '#4a4a4a',
      accent: '#22c55e',
      marked: '#dcfce7',
      border: '#86efac',
    },
    font: 'Georgia, serif',
    vibe: 'Quality Assurance / Testing',
    phrases: {
      common: [
        'Writing test cases',
        'Regression testing',
        'Bug verification',
        'Test automation',
        'Performance testing',
        'API testing',
        'Cross-browser testing',
        'Test data setup',
        'Exploratory testing',
        'Test report'
      ],
      automation: [
        'Selenium scripts',
        'CI pipeline',
        'Test coverage',
        'Mock services',
        'Load testing'
      ],
      blockers: [
        'Environment not ready',
        'Bug not reproducible',
        'Missing test data',
        'Flaky tests',
        'Access permissions'
      ]
    }
  },
  cyberpunk: {
    id: 'cyberpunk',
    name: 'Neon Night',
    description: 'High contrast, glowing accents, and a futuristic feel.',
    colors: {
      background: '#0f172a',
      card: '#1e293b',
      text: '#f1f5f9',
      accent: '#f0abfc',
      marked: '#4c1d95',
      border: '#f0abfc',
    },
    font: 'JetBrains Mono, monospace',
    vibe: 'Cyberpunk 2077 / Synthwave',
    phrases: {
      common: [
        'Neural network trained',
        'Cyberdeck synced',
        'Matrix breach',
        'Data extraction',
        'Encryption layer',
        'AI model tuning',
        'Quantum computing',
        'Hologram rendering',
        'Neural interface',
        'Code injection'
      ]
    }
  },
  retro: {
    id: 'retro',
    name: 'CRT Terminal',
    description: 'Classic green-on-black terminal aesthetic.',
    colors: {
      background: '#000000',
      card: '#0a0a0a',
      text: '#00ff41',
      accent: '#00ff41',
      marked: '#003300',
      border: '#00ff41',
    },
    font: 'Courier New, monospace',
    vibe: '80s Mainframe / Fallout',
    phrases: {
      common: [
        'Terminal access',
        'Mainframe connection',
        'Batch processing',
        'COBOL debugging',
        'Punch card error',
        'System reboot',
        'Disk space low',
        'Memory dump',
        'Kernel panic',
        'Root access'
      ]
    }
  },
  zen: {
    id: 'zen',
    name: 'Zen Garden',
    description: 'Calming tones to reduce standup stress.',
    colors: {
      background: '#fdfbf7',
      card: '#ffffff',
      text: '#4a4a4a',
      accent: '#86efac',
      marked: '#dcfce7',
      border: '#e2e8f0',
    },
    font: 'Georgia, serif',
    vibe: 'Minimalist / Organic',
    phrases: {
      common: [
        'Mindful coding',
        'Balanced workload',
        'Peaceful merge',
        'Harmonious API',
        'Tranquil deployment',
        'Serene debugging',
        'Calm refactoring',
        'Zen documentation',
        'Mindful testing',
        'Balanced sprint'
      ]
    }
  }
};
