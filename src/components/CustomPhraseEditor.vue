<template>
  <div class="bg-slate-50 rounded-lg p-4">
    <h4 class="font-medium text-slate-700 mb-3">📝 Custom Phrases</h4>
    
    <!-- Upload Section (host only) -->
    <div v-if="isHost" class="mb-4">
      <label class="block text-sm text-slate-600 mb-2">
        Upload custom phrases (.json)
      </label>
      <div class="flex gap-2">
        <input
          ref="fileInput"
          type="file"
          accept=".json"
          @change="handleFileUpload"
          class="flex-1 text-sm text-slate-600 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-500 file:text-white hover:file:bg-blue-600"
        />
      </div>
      <p class="text-xs text-slate-500 mt-1">
        Format: { "categories": { "Category Name": ["phrase1", "phrase2"] } }
      </p>
      <p v-if="uploadError" class="text-xs text-red-500 mt-2">
        {{ uploadError }}
      </p>
    </div>

    <!-- Export Button -->
    <div class="mb-4">
      <button
        @click="handleExport"
        :disabled="!hasCustomPhrases"
        class="w-full py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-lg font-medium transition disabled:opacity-50 disabled:cursor-not-allowed"
      >
        📥 Export Phrases
      </button>
    </div>

    <!-- Preview -->
    <div v-if="hasCustomPhrases">
      <h5 class="text-sm font-medium text-slate-600 mb-2">
        Custom Phrases ({{ totalCustomPhrases }} phrases)
      </h5>
      <div class="max-h-48 overflow-y-auto text-sm text-slate-600 space-y-2">
        <div
          v-for="(phrases, category) in customPhrases?.categories"
          :key="category"
        >
          <span class="font-medium text-slate-700">{{ category }}:</span>
          <span class="text-slate-500 ml-2">{{ phrases.length }} phrases</span>
        </div>
      </div>
    </div>
    
    <div v-else class="text-sm text-slate-400 text-center py-4">
      No custom phrases uploaded yet
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'

const props = defineProps({
  teamCode: {
    type: String,
    required: true
  },
  isHost: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['phrases-updated'])

const fileInput = ref(null)
const customPhrases = ref(null)
const uploadError = ref('')

const storageKey = computed(() => `standupBingo_customPhrases_${props.teamCode}`)

const hasCustomPhrases = computed(() => {
  return customPhrases.value && Object.keys(customPhrases.value.categories || {}).length > 0
})

const totalCustomPhrases = computed(() => {
  if (!customPhrases.value?.categories) return 0
  return Object.values(customPhrases.value.categories).reduce((sum, arr) => sum + arr.length, 0)
})

// JSON Schema validation
function validatePhrases(data) {
  if (!data || typeof data !== 'object') {
    return 'Invalid format: must be a JSON object'
  }
  
  if (!data.categories || typeof data.categories !== 'object') {
    return 'Missing required "categories" object'
  }
  
  for (const [categoryName, phrases] of Object.entries(data.categories)) {
    if (!Array.isArray(phrases)) {
      return `Category "${categoryName}" must be an array`
    }
    if (phrases.length === 0) {
      return `Category "${categoryName}" is empty`
    }
    for (const phrase of phrases) {
      if (typeof phrase !== 'string' || phrase.trim().length === 0) {
        return `Category "${categoryName}" contains invalid phrase`
      }
    }
  }
  
  return null
}

function handleFileUpload(event) {
  const file = event.target.files?.[0]
  if (!file) return
  
  uploadError.value = ''
  
  const reader = new FileReader()
  reader.onload = (e) => {
    try {
      const data = JSON.parse(e.target.result)
      const error = validatePhrases(data)
      
      if (error) {
        uploadError.value = error
        return
      }
      
      customPhrases.value = data
      
      // Store in localStorage
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem(storageKey.value, JSON.stringify(data))
      }
      
      // Emit to parent for broadcast
      emit('phrases-updated', data)
      
      // Reset file input
      if (fileInput.value) {
        fileInput.value.value = ''
      }
    } catch (err) {
      uploadError.value = 'Invalid JSON file: ' + err.message
    }
  }
  reader.readAsText(file)
}

function handleExport() {
  if (!customPhrases.value) return
  
  const blob = new Blob([JSON.stringify(customPhrases.value, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `standup-bingo-phrases-${props.teamCode}.json`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

function loadFromStorage() {
  if (typeof localStorage !== 'undefined') {
    const stored = localStorage.getItem(storageKey.value)
    if (stored) {
      try {
        customPhrases.value = JSON.parse(stored)
      } catch (e) {
        console.warn('Failed to parse stored custom phrases:', e)
      }
    }
  }
}

onMounted(() => {
  loadFromStorage()
})
</script>
