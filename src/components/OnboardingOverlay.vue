<template>
  <div class="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
    <div class="glass-card max-w-md w-full p-6 sm:p-8 rounded-2xl shadow-2xl border border-white/20 text-center">
      <div class="mb-6 flex justify-center">
        <div class="w-16 h-16 bg-blue-500/20 rounded-full flex items-center justify-center text-3xl animate-bounce">
          🎉
        </div>
      </div>
      
      <h2 class="text-2xl sm:text-3xl font-bold text-white mb-4">Welcome to Standup Bingo!</h2>
      
      <div class="text-left space-y-4 mb-8">
        <div class="flex gap-3 items-start">
          <div class="w-6 h-6 rounded-full bg-blue-500 text-white flex-shrink-0 flex items-center justify-center text-xs font-bold">1</div>
          <p class="text-white/80 text-sm sm:text-text-base">
            <strong>Join a Room:</strong> Enter a team code to join your colleagues or create your own.
          </p>
        </div>
        <div class="flex gap-3 items-start">
          <div class="w-6 h-6 rounded-full bg-blue-500 text-white flex-shrink-0 flex items-center justify-center text-xs font-bold">2</div>
          <p class="text-white/80 text-sm sm:text-text-base">
            <strong>Pick a Theme:</strong> Choose a vibe that fits your team's culture for the bingo phrases.
          </p>
        </div>
        <div class="flex gap-3 items-start">
          <div class="w-6 h-6 rounded-full bg-blue-500 text-white flex-shrink-0 flex items-center justify-center text-xs font-bold">3</div>
          <p class="text-white/80 text-sm sm:text-text-base">
            <strong>Mark & Win:</strong> Mark off phrases as you hear them during your standup. First to BINGO wins!
          </p>
        </div>
      </div>

      <button
        @click="$emit('dismiss')"
        class="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 rounded-xl transition transform hover:scale-105 shadow-lg shadow-blue-500/30"
      >
        Got it!
      </button>
    </div>
  </div>
</template>

<script setup>
defineEmits(['dismiss'])
</script>
