<template>
  <div class="bg-[#0b0b0f] min-h-screen text-white">
    <!-- Header -->
    <header
      class="sticky top-0 z-40 border-b border-gray-800 bg-[#0b0b0f]/90 backdrop-blur-xl"
    >
      <div class="max-w-7xl mx-auto px-5 lg:px-8">
        <div class="flex flex-col md:flex-row md:items-center justify-between gap-6 py-5">
          <div class="flex items-center justify-between">
            <h2 class="text-2xl font-bold tracking-tight text-red-500">Movies</h2>
            <button
              @click="showAll = !showAll"
              class="md:hidden text-xs text-gray-400 border border-white/10 rounded-lg px-3 py-1.5"
            >
              {{ showAll ? 'Show Less' : 'Show All' }}
            </button>
          </div>

          <div class="w-full md:w-80 relative">
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Search movies..."
              class="w-full bg-gray-900 border border-gray-700 text-white placeholder-gray-500 px-4 py-3 rounded-xl focus:outline-none focus:border-red-500 text-sm transition-all"
            />
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
          @click="handleMovieClick"
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
    <UserLogin v-if="showLogin" @close="showLogin = false" />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
const { isLoggedIn } = useAuth()
const showLogin = ref(false)

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

const searchQuery = ref('')
const selectedCategory = ref('all')

const handleMovieClick = (movie: Movie) => {
  if (!isLoggedIn.value) {
    showLogin.value = true
    return
  }
  navigateTo(`/watch/${movie.id}`)
}

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
    const matchesSearch = movie.title.toLowerCase().includes(search)
    const matchesCategory =
      selectedCategory.value === 'all' ||
      movie.genre.includes(selectedCategory.value)

    return matchesSearch && matchesCategory
  })
})
</script>
