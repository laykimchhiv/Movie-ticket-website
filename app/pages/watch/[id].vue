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
      <!-- Login Notice (only when not logged in) -->
      <div v-if="!isLoggedIn" class="mb-5 flex items-center justify-between gap-3 rounded-xl border border-yellow-500/20 bg-yellow-500/5 px-4 py-3 text-sm text-yellow-300">
        <span>You need to login to watch this movie.</span>
        <button
          @click="showLogin = true"
          class="rounded-lg bg-red-600 px-4 py-1.5 text-xs font-semibold text-white transition hover:bg-red-700"
        >
          Login
        </button>
      </div>

      <!-- Player -->
      <div
        class="relative aspect-video w-full overflow-hidden rounded-2xl border border-white/10 bg-black"
      >
        <video
          v-if="isLoggedIn"
          :key="currentVideo"
          :src="currentVideo"
          controls
          autoplay
          class="h-full w-full"
        ></video>
        <div v-else class="flex h-full w-full items-center justify-center text-sm text-gray-400">
          🔒 Video locked — please login to watch
        </div>
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

const auth = useAuth()
const isLoggedIn = auth.isLoggedIn
const user = auth.user
const showLogin = ref(false)

const id = computed(() => route.params.id)

const { data: item, pending, error, refresh } = await useAsyncData(
  `watch-${id.value}`,
  async () => {
    try {
      const movie = await $fetch(`${API_BASE}/movies/${id.value}`)
      return movie
    } catch (err) {
      console.error('API ERROR:', err)
      return null
    }
  },
  { watch: [id] }
)

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