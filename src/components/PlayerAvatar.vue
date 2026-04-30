<template>
  <img
    :src="avatarUrl"
    :alt="playerName + ' avatar'"
    class="rounded-lg object-cover"
    :style="{ width: size + 'px', height: size + 'px' }"
    loading="lazy"
  />
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  name: {
    type: String,
    required: true
  },
  size: {
    type: Number,
    default: 40
  },
  theme: {
    type: String,
    default: 'default'
  }
})

// Map themes to DiceBear styles per CREATIVE.md
const themeToStyle = {
  'cyberpunk': 'bottts',
  'retro': 'pixel-art',
  'zen': 'lorelei',
  'embedded': 'identicon',
  'default': 'avataaars',
  'qa': 'avataaars'
}

const avatarStyle = computed(() => 
  themeToStyle[props.theme] || 'avataaars'
)

const avatarUrl = computed(() => 
  `https://api.dicebear.com/9.x/${avatarStyle.value}/svg?seed=${encodeURIComponent(props.name)}`
)
</script>
