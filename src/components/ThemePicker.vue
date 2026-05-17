<template>
  <div class="space-y-4">
    <label class="block text-sm font-medium text-slate-700 mb-2">
      Choose a Theme
    </label>
    <div class="grid grid-cols-2 gap-3">
      <button
        v-for="theme in themes"
        :key="theme.id"
        @click="selectTheme(theme.id)"
        :class="[
          'p-4 min-h-[44px] rounded-lg border-2 transition transform hover:scale-105',
          selectedTheme === theme.id
            ? 'border-blue-500 bg-blue-50'
            : 'border-slate-200 bg-white hover:border-slate-300'
        ]"
      >
        <div class="flex items-center gap-2 mb-2">
          <span class="text-2xl">{{ getThemeEmoji(theme.id) }}</span>
          <span class="font-semibold text-slate-800">{{ theme.name }}</span>
        </div>
        <p class="text-xs text-slate-500 text-left">{{ theme.description }}</p>
      </button>
    </div>
  </div>
</template>

<script setup>
import { THEMES } from '../data/themes.js'

const emit = defineEmits(['select'])

const themes = Object.values(THEMES)
const selectedTheme = defineModel('theme', { type: String, required: true })

function selectTheme(themeId) {
  selectedTheme.value = themeId
  emit('select', themeId)
}

function getThemeEmoji(themeId) {
  const emojis = {
    default: '💼',
    embedded: '🔧'
  }
  return emojis[themeId] || '🎨'
}
</script>
