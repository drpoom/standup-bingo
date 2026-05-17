<template>
  <div class="bg-slate-50 rounded-lg p-4">
    <h4 class="font-medium text-slate-700 mb-3">📝 Custom Phrases</h4>
    
    <!-- Import/Export Buttons -->
    <div class="flex gap-2 mb-4">
      <button
        @click="triggerFileUpload"
        class="flex-1 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition flex items-center justify-center gap-2"
      >
        📥 Import JSON
      </button>
      <button
        @click="handleExport"
        :disabled="!hasCustomPhrases"
        class="flex-1 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-lg font-medium transition disabled:opacity-50 disabled:cursor-not-allowed"
      >
        📤 Export JSON
      </button>
    </div>
    
    <!-- Hidden file input -->
    <input
      ref="fileInput"
      type="file"
      accept=".json"
      @change="handleFileUpload"
      class="hidden"
    />
    
    <p v-if="uploadError" class="text-xs text-red-500 mb-2">
      {{ uploadError }}
    </p>

    <!-- Add Category Button -->
    <div v-if="isHost" class="mb-4">
      <button
        @click="showAddCategory = true"
        class="w-full py-2 border-2 border-dashed border-slate-300 hover:border-blue-400 text-slate-500 hover:text-blue-500 rounded-lg font-medium transition flex items-center justify-center gap-2"
      >
        <span class="text-lg">+</span> Add Category
      </button>
    </div>

    <!-- Add Category Modal -->
    <div v-if="showAddCategory" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50" @click.self="showAddCategory = false">
      <div class="bg-white rounded-lg p-6 w-full max-w-md mx-4">
        <h5 class="font-medium text-slate-700 mb-4">Add New Category</h5>
        <input
          v-model="newCategoryName"
          type="text"
          placeholder="Category name"
          class="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400 outline-none mb-4"
          @keyup.enter="addCategory"
        />
        <div class="flex gap-2">
          <button
            @click="addCategory"
            :disabled="!newCategoryName.trim()"
            class="flex-1 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition disabled:opacity-50"
          >
            Add
          </button>
          <button
            @click="cancelAddCategory"
            class="flex-1 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-lg font-medium transition"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>

    <!-- Add Phrase Modal -->
    <div v-if="showAddPhrase" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50" @click.self="showAddPhrase = false">
      <div class="bg-white rounded-lg p-6 w-full max-w-md mx-4">
        <h5 class="font-medium text-slate-700 mb-4">Add Phrase to "{{ editingCategory }}"</h5>
        <textarea
          v-model="newPhraseText"
          placeholder="Enter phrase"
          rows="3"
          class="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400 outline-none mb-2"
        />
        <p v-if="duplicateWarning" class="text-xs text-orange-500 mb-2">
          ⚠️ {{ duplicateWarning }}
        </p>
        <p v-if="builtinDuplicateWarning" class="text-xs text-amber-500 mb-2">
          ⚠️ {{ builtinDuplicateWarning }}
        </p>
        <div class="flex gap-2">
          <button
            @click="addPhrase"
            :disabled="!newPhraseText.trim()"
            class="flex-1 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition disabled:opacity-50"
          >
            Add
          </button>
          <button
            @click="cancelAddPhrase"
            class="flex-1 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-lg font-medium transition"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>

    <!-- Edit Phrase Modal -->
    <div v-if="showEditPhrase" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50" @click.self="showEditPhrase = false">
      <div class="bg-white rounded-lg p-6 w-full max-w-md mx-4">
        <h5 class="font-medium text-slate-700 mb-4">Edit Phrase</h5>
        <textarea
          v-model="editingPhraseText"
          rows="3"
          class="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400 outline-none mb-2"
        />
        <p v-if="duplicateWarning" class="text-xs text-orange-500 mb-2">
          ⚠️ {{ duplicateWarning }}
        </p>
        <p v-if="builtinDuplicateWarning" class="text-xs text-amber-500 mb-2">
          ⚠️ {{ builtinDuplicateWarning }}
        </p>
        <div class="flex gap-2">
          <button
            @click="savePhraseEdit"
            :disabled="!editingPhraseText.trim()"
            class="flex-1 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition disabled:opacity-50"
          >
            Save
          </button>
          <button
            @click="cancelEditPhrase"
            class="flex-1 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-lg font-medium transition"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>

    <!-- Categories and Phrases List -->
    <div v-if="hasCustomPhrases" class="space-y-4">
      <div
        v-for="(phrases, category) in customPhrases.categories"
        :key="category"
        class="bg-white rounded-lg border border-slate-200 overflow-hidden"
      >
        <!-- Category Header -->
        <div class="bg-slate-100 px-4 py-2 flex items-center justify-between">
          <span class="font-medium text-slate-700">{{ category }}</span>
          <div class="flex items-center gap-1">
            <button
              @click="openAddPhrase(category)"
              class="p-1 hover:bg-slate-200 rounded transition"
              title="Add phrase"
            >
              <span class="text-blue-500 text-lg">+</span>
            </button>
            <button
              @click="deleteCategory(category)"
              class="p-1 hover:bg-red-100 rounded transition"
              title="Delete category"
            >
              <span class="text-red-500 text-lg">×</span>
            </button>
          </div>
        </div>
        
        <!-- Phrases List -->
        <div class="divide-y divide-slate-100">
          <div
            v-for="(phrase, index) in phrases"
            :key="index"
            class="px-4 py-2 flex items-center justify-between hover:bg-slate-50 group"
          >
            <span class="text-sm text-slate-600 flex-1">{{ phrase }}</span>
            <div class="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition">
              <button
                @click="openEditPhrase(category, phrase, index)"
                class="p-1 hover:bg-blue-100 rounded transition"
                title="Edit phrase"
              >
                <span class="text-blue-500 text-sm">✏️</span>
              </button>
              <button
                @click="deletePhrase(category, index)"
                class="p-1 hover:bg-red-100 rounded transition"
                title="Delete phrase"
              >
                <span class="text-red-500 text-sm">🗑️</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <div v-else class="text-sm text-slate-400 text-center py-8">
      <p>No custom phrases yet</p>
      <p class="mt-1">Import a JSON file or add categories manually</p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watchEffect } from 'vue'
import { PHRASES as BUILTIN_PHRASES } from '../data/phrases.js'

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

// Modal state
const showAddCategory = ref(false)
const showAddPhrase = ref(false)
const showEditPhrase = ref(false)
const newCategoryName = ref('')
const newPhraseText = ref('')
const editingPhraseText = ref('')
const editingCategory = ref('')
const editingPhraseIndex = ref(null)
const duplicateWarning = ref('')
const builtinDuplicateWarning = ref('')

const storageKey = computed(() => `standupBingo_customPhrases_${props.teamCode}`)

const hasCustomPhrases = computed(() => {
  return customPhrases.value && Object.keys(customPhrases.value.categories || {}).length > 0
})

const totalCustomPhrases = computed(() => {
  if (!customPhrases.value?.categories) return 0
  return Object.values(customPhrases.value.categories).reduce((sum, arr) => sum + arr.length, 0)
})

// Get all built-in phrases as a flat array for duplicate detection
const allBuiltinPhrases = computed(() => {
  const phrases = []
  if (BUILTIN_PHRASES?.categories) {
    for (const categoryPhrases of Object.values(BUILTIN_PHRASES.categories)) {
      phrases.push(...categoryPhrases)
    }
  }
  return phrases
})

// Get all custom phrases as a flat array (excluding current editing phrase)
const allCustomPhrases = computed(() => {
  if (!customPhrases.value?.categories) return []
  const phrases = []
  for (const [cat, catPhrases] of Object.entries(customPhrases.value.categories)) {
    // Skip the phrase being edited
    if (cat === editingCategory.value && editingPhraseIndex.value !== null) {
      phrases.push(...catPhrases.filter((_, i) => i !== editingPhraseIndex.value))
    } else {
      phrases.push(...catPhrases)
    }
  }
  return phrases
})

// Check for duplicates
function checkDuplicates(phrase, excludeIndex = null) {
  duplicateWarning.value = ''
  builtinDuplicateWarning.value = ''
  
  const normalizedPhrase = phrase.trim().toLowerCase()
  
  // Check against other custom phrases
  const customMatch = allCustomPhrases.value.find(p => p.trim().toLowerCase() === normalizedPhrase)
  if (customMatch) {
    duplicateWarning.value = `This phrase already exists in "${editingCategory.value}"`
  }
  
  // Check against built-in phrases
  const builtinMatch = allBuiltinPhrases.value.find(p => p.trim().toLowerCase() === normalizedPhrase)
  if (builtinMatch) {
    builtinDuplicateWarning.value = `This phrase exists in built-in phrases (may appear twice)`
  }
}

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

function triggerFileUpload() {
  fileInput.value?.click()
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
      saveToStorage()
      
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

function saveToStorage() {
  if (typeof localStorage !== 'undefined' && customPhrases.value) {
    localStorage.setItem(storageKey.value, JSON.stringify(customPhrases.value))
  }
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

// Category management
function addCategory() {
  const name = newCategoryName.value.trim()
  if (!name) return
  
  if (!customPhrases.value) {
    customPhrases.value = { categories: {} }
  }
  
  if (customPhrases.value.categories[name]) {
    uploadError.value = `Category "${name}" already exists`
    return
  }
  
  customPhrases.value.categories[name] = []
  saveToStorage()
  emit('phrases-updated', customPhrases.value)
  
  cancelAddCategory()
}

function cancelAddCategory() {
  showAddCategory.value = false
  newCategoryName.value = ''
  uploadError.value = ''
}

function deleteCategory(categoryName) {
  if (!confirm(`Delete category "${categoryName}" and all its phrases?`)) return
  
  delete customPhrases.value.categories[categoryName]
  saveToStorage()
  emit('phrases-updated', customPhrases.value)
}

// Phrase management
function openAddPhrase(category) {
  editingCategory.value = category
  newPhraseText.value = ''
  duplicateWarning.value = ''
  builtinDuplicateWarning.value = ''
  showAddPhrase.value = true
}

function cancelAddPhrase() {
  showAddPhrase.value = false
  newPhraseText.value = ''
  duplicateWarning.value = ''
  builtinDuplicateWarning.value = ''
}

function addPhrase() {
  const phrase = newPhraseText.value.trim()
  if (!phrase) return
  
  customPhrases.value.categories[editingCategory.value].push(phrase)
  saveToStorage()
  emit('phrases-updated', customPhrases.value)
  
  cancelAddPhrase()
}

function openEditPhrase(category, phrase, index) {
  editingCategory.value = category
  editingPhraseText.value = phrase
  editingPhraseIndex.value = index
  duplicateWarning.value = ''
  builtinDuplicateWarning.value = ''
  checkDuplicates(phrase)
  showEditPhrase.value = true
}

function cancelEditPhrase() {
  showEditPhrase.value = false
  editingPhraseText.value = ''
  editingCategory.value = ''
  editingPhraseIndex.value = null
  duplicateWarning.value = ''
  builtinDuplicateWarning.value = ''
}

function savePhraseEdit() {
  const phrase = editingPhraseText.value.trim()
  if (!phrase) return
  
  // Check for duplicates before saving
  checkDuplicates(phrase)
  if (duplicateWarning.value) {
    return // Don't save if duplicate in custom phrases
  }
  
  customPhrases.value.categories[editingCategory.value][editingPhraseIndex.value] = phrase
  saveToStorage()
  emit('phrases-updated', customPhrases.value)
  
  cancelEditPhrase()
}

function deletePhrase(category, index) {
  customPhrases.value.categories[category].splice(index, 1)
  
  // Remove empty categories
  if (customPhrases.value.categories[category].length === 0) {
    delete customPhrases.value.categories[category]
  }
  
  saveToStorage()
  emit('phrases-updated', customPhrases.value)
}

// Watch for phrase text changes to check duplicates
watchEffect(() => {
  if (showAddPhrase.value && newPhraseText.value) {
    checkDuplicates(newPhraseText.value)
  } else if (showEditPhrase.value && editingPhraseText.value) {
    checkDuplicates(editingPhraseText.value)
  }
})

onMounted(() => {
  loadFromStorage()
})
</script>
