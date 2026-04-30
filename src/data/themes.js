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
    cssVars: {
      '--theme-bg': '#f8fafc',
      '--theme-primary': '#ffffff',
      '--theme-accent': '#3b82f6',
      '--theme-text': '#1e293b',
      '--theme-accent-light': '#dbeafe',
      '--theme-border': '#e2e8f0',
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
    cssVars: {
      '--theme-bg': '#0f172a',
      '--theme-primary': '#1e293b',
      '--theme-accent': '#38bdf8',
      '--theme-text': '#f1f5f9',
      '--theme-accent-light': '#0c4a6e',
      '--theme-border': '#38bdf8',
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
  }
};
