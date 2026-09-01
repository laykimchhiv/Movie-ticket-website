<template>
  <div class="bg-[#0b0b0f] min-h-screen p-6 md:p-10 text-white">
    <!-- Header -->
    <header
      class="max-w-7xl mx-auto mb-8 flex flex-col md:flex-row justify-between items-center gap-4 border-b border-gray-800 pb-6"
    >
      <div>
        <h1 class="text-3xl font-bold tracking-tight text-red-500">
          Movies
        </h1>
      </div>

      <!-- Search -->
      <div class="w-full md:w-80 relative">
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Search movies..."
          class="w-full bg-gray-900 border border-gray-700 text-white placeholder-gray-500 px-4 py-2.5 rounded-xl focus:outline-none focus:border-red-500 text-sm transition-all"
        />
      </div>
    </header>

    <!-- Main -->
    <main class="max-w-7xl mx-auto">

      <!-- Category Filter -->
      <nav class="flex flex-wrap gap-2 mb-8">
        <button
          v-for="cat in categoryFilters"
          :key="cat.id"
          @click="selectedCategory = cat.id"
          :class="[
            'px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200',
            selectedCategory === cat.id
              ? 'bg-red-600 text-white shadow-lg shadow-red-900/40'
              : 'bg-gray-900 text-gray-400 hover:bg-gray-800 hover:text-white'
          ]"
        >
          {{ cat.label }}
        </button>
      </nav>

      <!-- Movie Cards -->
      <div
        v-if="filteredMovies.length > 0"
        class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
      >
        <UserMovieCard
          v-for="movie in filteredMovies"
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

const { data: movies } = await useFetch<Movie[]>(`${API_BASE}/movies`, {
  transform: (raw: any[]) =>
    raw.map((m) => ({
      id: m.id,
      title: m.title,
      genre: Array.isArray(m.genre) ? m.genre.join(', ') : m.genre,
      rating: m.rating,
      image: m.poster,
    })),
})

/*
|--------------------------------------------------------------------------
| FILTER MOVIES
|--------------------------------------------------------------------------
*/

const filteredMovies = computed(() => {
  const search = searchQuery.value.toLowerCase().trim()
  const list = movies.value ?? []

  return list.filter((movie) => {
    // Search filter
    const matchesSearch = movie.title.toLowerCase().includes(search)

    // Category filter
    const matchesCategory =
      selectedCategory.value === 'all' ||
      movie.genre.includes(selectedCategory.value)

    return matchesSearch && matchesCategory
  })
})
</script>
