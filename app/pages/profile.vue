<script setup lang="ts">
const { user, token, favorites, removeFavorite } = useAuth()
const activeTab = ref('profile')

const API_BASE = 'http://localhost:8000'

interface Movie {
  id: number
  title: string
  genre: string[]
  rating: number
  poster: string
  description: string
}

const { data: movies } = await useFetch<Movie[]>(`${API_BASE}/movies`, {
  transform: (raw: any[]) =>
    raw.map((m) => ({
      id: m.id,
      title: m.title,
      genre: m.genre,
      rating: m.rating,
      poster: m.poster,
      description: m.description,
    })),
})

const favoriteMovies = computed(() => {
  if (!movies.value) return []
  return movies.value.filter((m) => favorites.value.includes(m.id))
})

const setTab = (tab: string) => {
  activeTab.value = tab
}
</script>

<template>
  <div class="min-h-screen bg-[#0b0b0f] pt-28 pb-20">
    <div class="mx-auto max-w-5xl px-5 lg:px-8">
      <!-- Profile Header -->
      <div class="mb-8 flex flex-col items-center gap-6 sm:flex-row sm:items-start">
        <div class="relative">
          <img
            :src="user?.avatar"
            :alt="user?.name"
            class="h-28 w-28 rounded-full border-4 border-red-600/30 object-cover"
          />
          <div class="absolute bottom-1 right-1 h-5 w-5 rounded-full border-2 border-[#0b0b0f] bg-green-500"></div>
        </div>
        <div class="text-center sm:text-left">
          <h1 class="text-2xl font-bold text-white">{{ user?.name }}</h1>
          <p class="mt-1 text-sm text-gray-400">{{ user?.email }}</p>
          <div class="mt-3 flex items-center justify-center gap-4 sm:justify-start">
            <div class="text-center">
              <p class="text-xl font-bold text-red-500">{{ favoriteMovies.length }}</p>
              <p class="text-xs text-gray-500">Favorites</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Tabs -->
      <div class="mb-8 flex gap-1 rounded-xl bg-[#15151b] p-1">
        <button
          :class="[
            'flex-1 rounded-lg py-3 text-sm font-medium transition',
            activeTab === 'profile'
              ? 'bg-red-600 text-white'
              : 'text-gray-400 hover:text-white'
          ]"
          @click="setTab('profile')"
        >
          <svg class="mx-auto h-5 w-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        </button>
        <button
          :class="[
            'flex-1 rounded-lg py-3 text-sm font-medium transition',
            activeTab === 'favorites'
              ? 'bg-red-600 text-white'
              : 'text-gray-400 hover:text-white'
          ]"
          @click="setTab('favorites')"
        >
          <svg class="mx-auto h-5 w-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
        </button>
      </div>

      <!-- Profile Tab -->
      <div v-if="activeTab === 'profile'" class="rounded-2xl border border-white/10 bg-[#12121a] p-8">
        <h2 class="mb-6 text-lg font-semibold text-white">My Data</h2>
        <div class="space-y-6">
          <div class="flex items-center gap-4 rounded-xl border border-white/10 bg-white/5 p-4">
            <img
              :src="user?.avatar"
              :alt="user?.name"
              class="h-14 w-14 rounded-full"
            />
            <div>
              <p class="font-semibold text-white">{{ user?.name }}</p>
              <p class="text-sm text-gray-400">{{ user?.email }}</p>
            </div>
          </div>
          <div>
            <label class="mb-2 block text-sm text-gray-400">Username</label>
            <p class="text-white">{{ user?.name }}</p>
          </div>
          <div>
            <label class="mb-2 block text-sm text-gray-400">Email</label>
            <p class="text-white">{{ user?.email }}</p>
          </div>
          <div>
            <label class="mb-2 block text-sm text-gray-400">Token</label>
            <p class="truncate text-sm text-green-400 font-mono">{{ token }}</p>
          </div>
          <div>
            <label class="mb-2 block text-sm text-gray-400">Password</label>
            <p class="text-white">••••••••</p>
          </div>
          <div>
            <label class="mb-2 block text-sm text-gray-400">Member Since</label>
            <p class="text-white">August 2026</p>
          </div>
        </div>
      </div>

      <!-- Favorites Tab -->
      <div v-if="activeTab === 'favorites'">
        <div v-if="favoriteMovies.length > 0" class="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4">
          <div
            v-for="movie in favoriteMovies"
            :key="movie.id"
            class="group overflow-hidden rounded-2xl bg-[#15151b] transition hover:-translate-y-1"
          >
            <div class="relative poster-aspect overflow-hidden">
              <img
                :src="movie.poster"
                :alt="movie.title"
                class="h-full w-full object-cover transition duration-300 group-hover:scale-105"
              />
              <button
                class="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-red-600 text-white opacity-0 transition group-hover:opacity-100"
                @click="removeFavorite(movie.id)"
              >
                <svg class="h-4 w-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div class="p-4">
              <h3 class="truncate text-sm font-semibold text-white">{{ movie.title }}</h3>
              <p class="mt-1 text-xs text-gray-500">{{ movie.genre.join(', ') }}</p>
              <div class="mt-2 flex items-center gap-1 text-xs text-yellow-500">
                <svg class="h-3 w-3 text-yellow-400" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                </svg>
                <span>{{ movie.rating }}</span>
              </div>
            </div>
          </div>
        </div>
        <div v-else class="rounded-2xl border border-white/10 bg-[#12121a] py-20 text-center">
          <svg class="mx-auto h-12 w-12 text-gray-600" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z" />
          </svg>
          <p class="mt-4 text-gray-400">No favorites yet.</p>
          <p class="mt-1 text-sm text-gray-600">Browse movies and add them to your favorites!</p>
          <NuxtLink
            to="/movie"
            class="mt-6 inline-block rounded-xl bg-red-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-red-700"
          >
            Browse Movies
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>
