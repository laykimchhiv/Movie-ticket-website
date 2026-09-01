<template>
  <div class="bg-[#0b0b0f] min-h-screen text-white">
    <!-- Header -->
    <header
      class="sticky top-0 z-40 border-b border-gray-800 bg-[#0b0b0f]/90 backdrop-blur-xl"
    >
      <div class="max-w-7xl mx-auto px-5 lg:px-8">
        <div class="flex flex-col md:flex-row md:items-center justify-between gap-6 py-5">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-3">
              <button
                @click="navigateTo('/')"
                class="text-sm text-gray-400 transition hover:text-white"
              >
                ← Back
              </button>
              <h2 class="text-2xl font-bold tracking-tight text-red-500">Movies</h2>
            </div>
            <button
              @click="showAll = !showAll"
              class="md:hidden text-xs text-gray-400 border border-white/10 rounded-lg px-3 py-1.5"
            >
              {{ showAll ? 'Show Less' : 'Show All' }}
            </button>
          </div>

          <div class="relative w-full md:w-96">
            <div class="flex w-full items-center gap-2">
              <input
                ref="searchInput"
                v-model="searchQuery"
                @focus="showSearchDropdown = true"
                @click="showSearchDropdown = true"
                @blur="setTimeout(() => showSearchDropdown = false, 200)"
                type="text"
                placeholder="Search movies..."
                class="w-full bg-gray-900 border border-gray-700 text-white placeholder-gray-500 px-4 py-3 rounded-xl focus:outline-none focus:border-red-500 text-sm transition-all"
              />
              <button
                class="rounded-xl bg-red-600 px-4 py-3 text-sm font-semibold transition hover:bg-red-700"
              >
                Search
              </button>
            </div>

            <div
              v-if="showSearchDropdown && searchQuery.trim() && searchResults.length > 0"
              class="absolute left-0 right-0 top-full z-50 mt-2 max-h-80 overflow-y-auto rounded-xl border border-white/10 bg-[#15151b] shadow-2xl"
            >
              <button
                v-for="movie in searchResults"
                :key="movie.id"
                @mousedown="searchQuery = movie.title; showSearchDropdown = false"
                class="flex w-full items-center gap-3 px-4 py-3 text-left transition hover:bg-white/5"
              >
                <span class="text-sm">🎬</span>
                <span class="truncate text-sm font-medium text-white">{{ movie.title }}</span>
              </button>
            </div>

            <div
              v-else-if="showSearchDropdown && searchQuery.trim() && searchResults.length === 0"
              class="absolute left-0 right-0 top-full z-50 mt-2 rounded-xl border border-white/10 bg-[#15151b] p-4 text-center"
            >
              <p class="text-sm text-gray-400">No movies found starting with "{{ searchQuery }}"</p>
            </div>
          </div>
        </div>

        <nav class="flex gap-2 pb-5 overflow-x-auto scrollbar-hide">
          <button
            v-for="cat in categoryFilters"
            :key="cat.id"
            @click="selectedCategory = cat.id"
            :class="[
              'px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 whitespace-nowrap',
              selectedCategory === cat.id
                ? 'bg-red-600 text-white shadow-lg shadow-red-900/40'
                : 'bg-gray-900 text-gray-400 hover:bg-gray-800 hover:text-white'
            ]"
          >
            {{ cat.label }}
          </button>
        </nav>
      </div>
    </header>

    <!-- Main -->
    <main class="max-w-7xl mx-auto px-5 lg:px-8 pb-20">

      <!-- Movie Cards -->
      <div
        v-if="filteredMovies.length > 0"
        class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-5"
      >
        <UserMovieCard
          v-for="movie in (showAll ? filteredMovies : filteredMovies.slice(0, 6))"
          :key="movie.id"
          :movie="movie"
          @click="selectedMovie = movie"
        />
      </div>

      <!-- No Results -->
      <div
        v-else
        class="text-center py-20 bg-gray-900/40 rounded-2xl border border-gray-800"
      >
        <p class="text-gray-400 text-base">
          No movies found in this category matching your search.
        </p>
      </div>
    </main>

    <!-- Trailer Modal -->
    <div
      v-if="selectedMovie"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm"
      @click.self="selectedMovie = null"
    >
        <div class="flex h-full w-full max-w-6xl flex-col items-start justify-center p-4">
          <button
            @click="selectedMovie = null"
            class="absolute right-4 top-4 z-10 rounded-full bg-white/10 px-3 py-2 text-sm hover:bg-white/20"
          >
            ✕
          </button>

          <div class="aspect-video w-full max-w-5xl overflow-hidden rounded-2xl border border-white/10 bg-black">
            <video
              :src="selectedMovie.videoUrl"
              controls
              autoplay
              class="h-full w-full"
            >
              Your browser does not support the video tag.
            </video>
          </div>

          <div class="mt-6 flex flex-col items-start gap-3 text-left">
            <h2 class="text-2xl font-bold sm:text-3xl">{{ selectedMovie.title }}</h2>
            <div class="flex flex-wrap items-center gap-2 text-xs">
              <span
                v-for="g in selectedMovie.genre.split(', ')"
                :key="g"
                class="rounded bg-gray-800 px-2 py-0.5 text-gray-300"
              >
                {{ g }}
              </span>
              <span class="text-yellow-400 font-semibold">⭐ {{ selectedMovie.rating }}</span>
            </div>
            <p class="text-sm text-gray-400">
              {{ selectedMovie.releaseDate || '' }}
            </p>
            <p class="max-w-2xl text-sm leading-relaxed text-gray-300 mb-10">
              {{ selectedMovie.description }}
            </p>
          </div>
        </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

interface Movie {
  id: number | string
  title: string
  genre: string
  rating: number
  image: string
  videoUrl?: string
  releaseDate?: string
  description?: string
}

const API_BASE = 'http://localhost:8000'
const route = useRoute()

const searchQuery = ref((route.query.q as string) || '')
const selectedCategory = ref('all')
const showAll = ref(true)
const showSearchDropdown = ref(false)
const selectedMovie = ref<Movie | null>(null)

const { data: categories } = await useFetch<{ id: string; name: string }[]>(
  `${API_BASE}/categories`
)

const categoryFilters = computed(() => [
  { id: 'all', label: 'All Movies' },
  ...(categories.value ?? []).map((c) => ({ id: c.name, label: c.name })),
])

const { data: rawMovies } = await useFetch<any[]>(`${API_BASE}/movies`)

const movies = computed<Movie[]>(() =>
  (rawMovies.value ?? []).map((m) => ({
    id: m.id,
    title: m.title,
    genre: Array.isArray(m.genre) ? m.genre.join(', ') : m.genre,
    rating: m.rating,
    image: m.poster,
    videoUrl: m.videoUrl,
    releaseDate: m.releaseDate,
    description: m.description,
  }))
)

const filteredMovies = computed(() => {
  const search = searchQuery.value.toLowerCase().trim()
  const list = movies.value ?? []

  return list.filter((movie) => {
    const matchesSearch = search === '' || movie.title.toLowerCase().startsWith(search)
    const matchesCategory =
      selectedCategory.value === 'all' ||
      movie.genre.includes(selectedCategory.value)

    return matchesSearch && matchesCategory
  })
})

const searchResults = computed(() => {
  const search = searchQuery.value.toLowerCase().trim()
  if (!search) return []
  return (movies.value ?? [])
    .filter((movie) => movie.title.toLowerCase().startsWith(search))
    .slice(0, 8)
})
</script>
