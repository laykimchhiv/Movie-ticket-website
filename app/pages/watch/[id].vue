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
      </div>

      <!-- Series Parts -->
      <div v-if="item.parts && item.parts.length" class="mt-8">
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
  </div>
</template>

<script setup lang="ts">
const API_BASE = 'http://localhost:8000'

const route = useRoute()
const id = route.params.id

const { data: item, pending } = await useAsyncData(`watch-${id}`, async () => {
  try {
    return await $fetch(`${API_BASE}/movies/${id}`)
  } catch {
    try {
      return await $fetch(`${API_BASE}/series/${id}`)
    } catch {
      return null
    }
  }
})

const currentVideo = ref(
  item.value?.type === 'series'
    ? item.value?.parts?.[0]?.videoUrl
    : item.value?.videoUrl
)
</script>
