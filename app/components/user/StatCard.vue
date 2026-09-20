<template>
  <div
    :class="[
      'rounded-xl border border-white/10 bg-[#12121a] p-5 backdrop-blur-sm flex flex-col gap-2',
      customClass
    ]"
    :style="delay ? { animationDelay: delay + 'ms' } : {}"
  >
    <div class="flex h-10 w-10 items-center justify-center rounded-lg"
      :class="{
        'bg-red-600/10 border border-red-500/20': color === 'red',
        'bg-blue-600/10 border border-blue-500/20': color === 'blue',
        'bg-purple-600/10 border border-purple-500/20': color === 'purple',
      }"
    >
      <svg class="h-5 w-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
        <path v-if="icon === 'heart'" stroke-linecap="round" stroke-linejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        <path v-else-if="icon === 'film'" stroke-linecap="round" stroke-linejoin="round" d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1z" />
        <path v-else-if="icon === 'database'" stroke-linecap="round" stroke-linejoin="round" d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" />
        <path v-else stroke-linecap="round" stroke-linejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    </div>
    <div>
      <p class="text-2xl font-bold text-white">{{ value }}</p>
      <p class="text-xs text-gray-500">{{ label }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  value: number | string
  label: string
  icon: string
  color?: string
  customClass?: string
  delay?: number
}>()
</script>
