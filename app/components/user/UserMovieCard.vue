<template>
  <div
    class="group cursor-pointer overflow-hidden rounded-2xl border border-white/10 bg-[#15151b] transition duration-300 hover:-translate-y-2 hover:border-red-500/50"
    @click="$emit('click', movie)"
  >
    <div class="relative aspect-[2/3] min-h-[180px] overflow-hidden bg-[#1a1a24]">
      <img
        :src="movie.image || movie.poster"
        :alt="movie.title"
        class="h-full w-full object-cover transition duration-500 group-hover:scale-105"
      />
      <div
        v-if="movie.rating"
        class="absolute right-2 top-2 inline-flex items-center gap-1 rounded-lg bg-black/70 px-2 py-1 text-xs font-semibold backdrop-blur"
      >
        <svg class="h-3 w-3 text-yellow-400" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77 6.18 3.25 7 14.14 2 9.27 6.91 1.01L12 2z" />
        </svg>
        {{ movie.rating }}
      </div>
    </div>
    <div class="p-3">
      <h3 class="truncate font-semibold text-white text-sm">
        {{ movie.title }}
      </h3>
      <p class="mt-0.5 truncate text-xs text-gray-500">
        {{ movie.genre }}
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  movie: {
    id?: number | string
    title: string
    genre?: string
    rating?: number
    image?: string
    poster?: string
  }
}>()

defineEmits<{
  click: [movie: any]
}>()
</script>
