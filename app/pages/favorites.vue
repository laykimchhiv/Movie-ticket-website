<script setup lang="ts">
const { isLoggedIn, favorites, removeFromFavorites } = useAuth()
const showLogin = ref(false)

const API_BASE = 'http://localhost:8000'

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

const favoriteMovies = computed(() => {
  if (!rawMovies.value) return []
  return movies.value.filter((m) =>
    favorites.value.includes(m.id as any)
  )
})

const search = ref('')

const filtered = computed(() => {
  if (!search.value) return favoriteMovies.value
  const q = search.value.toLowerCase().trim()
  return favoriteMovies.value.filter((m) =>
    m.title.toLowerCase().includes(q)
  )
})

const handleMovieClick = (movie: Movie) => {
  if (!isLoggedIn.value) {
    showLogin.value = true
    return
  }
  navigateTo(`/watch/${movie.id}`)
}

const clearFavorites = () => {
  favoriteMovies.value.forEach((m) => removeFromFavorites(m.id as any))
}
</script>

<template>
  <div class="min-h-screen bg-[#0b0b0f] text-white">
    <!-- ================= AUTH GATE ================= -->
    <div v-if="!isLoggedIn" class="min-h-screen pt-20">
      <div
        class="mx-auto flex min-h-[60vh] max-w-md items-center justify-center px-5 text-center"
      >
        <div>
          <div
            class="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-red-600/10"
          >
            <svg
              class="h-8 w-8 text-red-500"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>

          <h2 class="text-2xl font-bold text-white">My Favorites</h2>
          <p class="mt-3 text-sm text-gray-400">
            Sign in to save movies to your favorites and keep track of the ones you love.
          </p>

          <button
            @click="showLogin = true"
            class="mt-6 w-full rounded-xl bg-red-600 py-3 text-sm font-semibold text-white transition hover:bg-red-700 active:scale-[0.98]"
          >
            Log In
          </button>

          <p class="mt-5 text-xs text-gray-500">
            Don't have an account?
            <span
              class="font-semibold text-red-500 hover:text-red-400"
              @click="showLogin = true"
            >
              Sign Up
            </span>
          </p>
        </div>
      </div>
    </div>

    <!-- ================= HEADER ================= -->
    <section class="border-b border-white/5 bg-[#101014] pb-10 pt-24">
      <div class="mx-auto max-w-7xl px-5 lg:px-8">
        <div class="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p
              class="mb-2 text-sm font-semibold uppercase tracking-wider text-red-500"
            >
              Your List
            </p>
            <h1 class="text-3xl font-bold sm:text-4xl">My Favorites</h1>
          </div>

          <div class="relative w-full max-w-xs">
            <svg
              class="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <input
              v-model="search"
              type="text"
              placeholder="Search your favorites..."
              class="w-full rounded-full border border-white/10 bg-white/5 py-2.5 pl-10 pr-4 text-sm text-white placeholder-gray-500 outline-none focus:border-red-500"
            />
          </div>
        </div>

        <p class="mt-4 text-sm text-gray-400">
          {{ favoriteMovies.length }}
          {{ favoriteMovies.length === 1 ? 'movie' : 'movies' }} saved
        </p>
      </div>
    </section>

    <!-- ================= CONTENT ================= -->
    <main class="mx-auto max-w-7xl px-5 py-12 lg:px-8">
      <!-- Loading -->
      <div v-if="!rawMovies" class="py-20 text-center text-gray-500">
        <div
          class="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-2 border-red-500/20 border-t-red-500"
        />
        Loading your favorites...
      </div>

      <!-- Movies Grid -->
      <div
        v-else-if="filtered.length > 0"
        class="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-6"
      >
        <UserMovieCard
          v-for="movie in filtered"
          :key="movie.id"
          :movie="movie"
          @click="handleMovieClick"
        />
      </div>

      <!-- Empty State -->
      <div
        v-else
        class="rounded-2xl border border-white/10 bg-[#12121a] py-20 text-center"
      >
        <svg
          class="mx-auto h-12 w-12 text-gray-600"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
          />
        </svg>

        <p class="mt-4 text-sm text-gray-400">
          {{ search ? 'No movies match your search.' : 'Your favorites list is empty.' }}
        </p>

        <NuxtLink
          to="/movie"
          class="mt-6 inline-flex items-center gap-2 rounded-xl bg-red-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-red-700"
        >
          <svg
            class="h-4 w-4"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M12 4v16m8-8H4"
            />
          </svg>
          Browse Movies
        </NuxtLink>
      </div>
    </main>

    <UserLogin v-if="showLogin" @close="showLogin = false" />
  </div>
</template>
