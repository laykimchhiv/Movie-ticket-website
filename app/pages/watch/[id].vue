<template>
  <div class="min-h-screen bg-[#0b0b0f] text-white">
    <!-- Back -->
    <div class="mx-auto max-w-7xl px-5 pt-6 lg:px-8">
      <NuxtLink
        to="/movie"
        class="inline-flex items-center gap-2 text-sm text-gray-400 transition hover:text-red-400"
      >
        ← Back to Movies
      </NuxtLink>
    </div>

    <!-- Video Player -->
    <div v-if="item" class="mx-auto max-w-7xl px-5 py-6 lg:px-8">
      <!-- Player -->
      <div
        class="relative aspect-video w-full overflow-hidden rounded-2xl border border-white/10 bg-black"
      >
        <video
          :key="currentVideo"
          :src="currentVideo"
          controls
          autoplay
          class="h-full w-full"
        >
          Your browser does not support the video tag.
        </video>
      </div>

      <!-- Details -->
      <div class="mt-6 flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <h1 class="text-2xl font-bold sm:text-3xl">{{ item.title }}</h1>

          <div class="mt-2 flex flex-wrap items-center gap-2 text-xs">
            <span
              class="rounded bg-red-500/10 px-2 py-0.5 font-semibold uppercase text-red-400 border border-red-500/20"
            >
              {{ item.type }}
            </span>

            <span
              v-for="g in item.genre"
              :key="g"
              class="rounded bg-gray-800 px-2 py-0.5 text-gray-300"
            >
              {{ g }}
            </span>

            <span class="text-yellow-400 font-semibold">⭐ {{ item.rating }}</span>

            <span v-if="item.releaseDate" class="text-gray-400">
              • {{ item.releaseDate }}
            </span>
          </div>

          <p class="mt-4 max-w-3xl text-sm leading-relaxed text-gray-300">
            {{ item.description }}
          </p>
        </div>

        <!-- Favorite Button -->
        <div class="mt-6 lg:mt-0 lg:self-start">
          <button
            @click="toggleFavorite"
            :disabled="!isLoggedIn"
            :class="[
              'inline-flex items-center gap-2 rounded-xl border px-5 py-2.5 text-sm font-semibold transition',
              isFavorited
                ? 'border-red-500 bg-red-600 text-white hover:bg-red-700'
                : 'border-red-500/30 bg-red-500/10 text-red-400 hover:bg-red-500/20',
            ]"
          >
            <svg
              class="h-5 w-5"
              :fill="isFavorited ? 'currentColor' : 'none'"
              stroke="currentColor"
              stroke-width="2"
              viewBox="0 0 24 24"
            >
              <path
                d="M12 21.35l-1.45-.32C5.45 15.93 2 12.18 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.39.81 4.42 2.02L12 5.71l.58-.58C13.61 3.81 15.26 3 17 3 20.08 3 22.5 5.42 22.5 8.5c0 3.68-3.45 7.43-8.55 12.54L12 21.35z"
              />
            </svg>
            <span>{{ isFavorited ? 'Favorited' : 'Add to Favorites' }}</span>
          </button>
        </div>
      </div>

      <!-- Episodes -->
      <div v-if="item.parts && item.parts.length > 1" class="mt-8">
        <h2 class="mb-3 text-lg font-semibold">Episodes</h2>

        <div class="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <button
            v-for="part in item.parts"
            :key="part.id"
            @click="currentVideo = part.videoUrl"
            :class="[
              'rounded-xl border p-4 text-left transition',
              currentVideo === part.videoUrl
                ? 'border-red-500 bg-red-500/10'
                : 'border-white/10 bg-[#15151b] hover:border-red-500/50'
            ]"
          >
            <p class="font-medium text-white">{{ part.title }}</p>
            <p class="mt-1 text-xs text-gray-400">{{ part.description }}</p>
          </button>
        </div>
      </div>
    </div>

    <!-- Not found -->
    <div
      v-else-if="!pending"
      class="mx-auto max-w-7xl px-5 py-20 text-center lg:px-8"
    >
      <p class="text-gray-400">This title could not be found.</p>
      <NuxtLink to="/movie" class="mt-4 inline-block text-sm text-red-400 hover:underline">
        ← Back to Movies
      </NuxtLink>
    </div>

    <UserLogin v-if="showLogin" @close="showLogin = false" />
  </div>
</template>
<script setup>
import { ref, watch, computed } from 'vue'

const API_BASE = 'http://localhost:8000'

const route = useRoute()
const id = route.params.id

console.log('Movie ID:', id)
console.log('API URL:', `${API_BASE}/movies/${id}`)

const { isLoggedIn, addToFavorites, removeFromFavorites, isInFavorites } =
  useAuth()
const showLogin = ref(!isLoggedIn.value)

const isFavorited = computed(() => isInFavorites(Number(id)))

const toggleFavorite = () => {
  if (!isLoggedIn.value) {
    showLogin.value = true
    return
  }

  const movieId = Number(id)

  if (isFavorited.value) {
    removeFromFavorites(movieId)
  } else {
    addToFavorites(movieId)
  }
}

const { data: item, pending, error } = await useAsyncData(
  `watch-${id}`,
  async () => {
    try {
      const movie = await $fetch(`${API_BASE}/movies/${id}`)

      console.log('Movie from API:', movie)

      return movie
    } catch (err) {
      console.error('API ERROR:', err)
      return null
    }
  }
)

console.log('Final item:', item.value)
console.log('Final error:', error.value)

const currentVideo = ref('')

watch(
  () => item.value,
  (newItem) => {
    if (!newItem) return

    if (newItem.parts?.length > 0) {
      currentVideo.value = newItem.parts[0].videoUrl
    } else {
      currentVideo.value = newItem.videoUrl
    }
  },
  { immediate: true }
)
</script>