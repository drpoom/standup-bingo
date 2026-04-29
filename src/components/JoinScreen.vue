<template>
  <div class="min-h-screen flex items-center justify-center bg-slate-50 px-4">
    <div class="max-w-md w-full bg-white rounded-2xl shadow-xl p-8">
      <div class="text-center mb-8">
        <h1 class="text-4xl font-bold text-slate-800 mb-2">🎯 Standup Bingo</h1>
        <p class="text-slate-500">Make your daily standup more fun!</p>
      </div>

      <form @submit.prevent="handleSubmit" class="space-y-6">
        <div>
          <label for="teamCode" class="block text-sm font-medium text-slate-700 mb-2">
            Team Code
          </label>
          <input
            id="teamCode"
            v-model="teamCode"
            type="text"
            placeholder="e.g., ACME"
            class="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition text-lg uppercase"
            required
            maxlength="10"
          />
        </div>

        <div>
          <label for="playerName" class="block text-sm font-medium text-slate-700 mb-2">
            Your Name
          </label>
          <input
            id="playerName"
            v-model="playerName"
            type="text"
            placeholder="e.g., Alice"
            class="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition text-lg"
            required
            maxlength="20"
          />
        </div>

        <button
          type="submit"
          class="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-4 rounded-lg transition transform hover:scale-105 text-lg"
        >
          🎮 Start Playing
        </button>
      </form>

      <div class="mt-6 text-center text-sm text-slate-400">
        <p>Enter your team code to get started</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const emit = defineEmits(['join'])

const teamCode = ref('')
const playerName = ref('')

function handleSubmit() {
  if (teamCode.value.trim() && playerName.value.trim()) {
    emit('join', teamCode.value.trim().toUpperCase(), playerName.value.trim())
  }
}
</script>
