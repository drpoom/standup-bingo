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
  style: {
    type: String,
    default: 'avataaars', // avataaars, bottts, lorelei, identicon
    validator: v => ['avataaars', 'bottts', 'lorelei', 'identicon'].includes(v)
  }
})

const avatarUrl = computed(() => 
  `https://api.dicebear.com/9.x/${props.style}/svg?seed=${encodeURIComponent(props.name)}`
)
</script>
