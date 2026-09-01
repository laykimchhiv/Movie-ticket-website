<script setup lang="ts">
const props = defineProps({
  movie: {
    type: Object,
    required: true,
  },
})

const emit = defineEmits<{
  click: [movie: any]
}>()

const { isFavorite, addFavorite, removeFavorite, isLoggedIn } = useAuth()

const toggleFavorite = (e: Event) => {
  e.stopPropagation()
  if (!isLoggedIn.value) return
  if (isFavorite(props.movie.id)) {
    removeFavorite(props.movie.id)
  } else {
    addFavorite(props.movie.id)
  }
}

const handleClick = () => {
  emit('click', props.movie)
}
</script>

<template>
  <div
    class="group cursor-pointer overflow-hidden rounded-2xl border border-white/10 bg-[#15151b] transition duration-300 hover:-translate-y-2 hover:border-red-500/50"
    @click="handleClick"
  >
    <!-- Poster -->
    <div class="relative aspect-3/4 overflow-hidden">
      <img
        :src="movie.image"
        :alt="movie.title"
        class="h-full w-full object-cover transition duration-500 group-hover:scale-105"
      />

      <!-- Rating -->
      <div
        class="absolute right-2 top-2 inline-flex items-center gap-1 rounded-lg bg-black/70 px-2 py-1 text-xs font-semibold backdrop-blur"
      >
        <svg class="h-3 w-3 text-yellow-400" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
        {{ movie.rating }}
      </div>

      <!-- Favorite Button -->
      <button
        class="absolute left-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-black/60 text-sm backdrop-blur transition hover:bg-black/80"
        :class="{ 'text-red-500': isFavorite(movie.id) }"
        @click="toggleFavorite"
      >
        <svg v-if="isFavorite(movie.id)" class="h-4 w-4 text-red-500" fill="currentColor" viewBox="0 0 24 24">
          <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
        <svg v-else class="h-4 w-4 text-white" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
      </button>
    </div>

    <!-- Movie Info -->
    <div class="p-4">
      <h3 class="truncate font-semibold text-white">
        {{ movie.title }}
      </h3>

      <p class="mt-1 truncate text-xs text-gray-500">
        {{ movie.genre }}
      </p>
    </div>
  </div>
</template>
