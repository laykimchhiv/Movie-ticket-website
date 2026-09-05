<script setup lang="ts">
const { user, favorites, removeFromFavorites, logout, isLoggedIn } = useAuth()
const activeTab = ref('profile')
const showLogin = ref(false)

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
  <div class="min-h-screen bg-[#0b0b0f] pt-20">
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

          <h2 class="text-2xl font-bold text-white">Profile</h2>
          <p class="mt-3 max-w-sm text-sm text-gray-400">
            Sign in to view and manage your profile, see your favorite movies,
            and track your watchlist.
          </p>

          <button
            @click="showLogin = true"
            class="mt-6 w-full max-w-xs rounded-xl bg-red-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-red-700 active:scale-[0.98]"
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

    <!-- ================= PROFILE CONTENT (logged in) ================= -->
    <div v-else>
    <!-- Profile Header / Banner -->
    <div class="relative h-48 w-full overflow-hidden sm:h-64">
      <img
        src="https://image.tmdb.org/t/p/original/jYEW5xZkZk2WTrdbMGAPFuBqbDc.jpg"
        alt="Profile banner"
        class="h-full w-full object-cover opacity-40"
      />
      <div class="absolute inset-0 bg-gradient-to-t from-[#0b0b0f] via-[#0b0b0f]/60 to-transparent"></div>

      <div class="absolute bottom-0 left-0 right-0">
        <div class="mx-auto max-w-5xl px-5 lg:px-8">
          <div class="flex flex-col items-center gap-4 pb-8 sm:flex-row sm:items-end sm:gap-6">
            <div class="relative -mt-16 sm:-mt-20">
              <img
                :src="user?.avatar"
                :alt="user?.username"
                class="h-28 w-28 rounded-full border-4 border-[#0b0b0f] object-cover shadow-2xl sm:h-36 sm:w-36"
              />
              <div class="absolute bottom-2 right-2 h-5 w-5 rounded-full border-4 border-[#0b0b0f] bg-green-500"></div>
            </div>
            <div class="text-center sm:text-left">
              <h1 class="text-2xl font-bold text-white sm:text-3xl ">{{ user?.username }}</h1>
              <p class="mt-1 text-sm text-gray-400">{{ user?.email }}</p>
              <div class="mt-3 ml-5 flex items-center justify-center gap-6 sm:justify-start">
                <div class="text-center">
                  <p class="text-xl font-bold text-red-500">{{ favoriteMovies.length }}</p>
                  <p class="text-xs text-gray-500">Favorites</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Content -->
    <div class="mx-auto max-w-5xl px-5 lg:px-8 pb-20">
      <!-- Tabs -->
      <div class="mb-8 flex gap-1 rounded-xl bg-[#15151b] p-1">
        <button
          :class="[
            'flex-1 rounded-lg py-3 text-sm font-medium transition',
            activeTab === 'profile'
              ? 'bg-red-600 text-white shadow-lg shadow-red-900/40'
              : 'text-gray-400 hover:text-white'
          ]"
          @click="setTab('profile')"
        >
          <div class="flex items-center justify-center gap-2">
            <svg class="h-5 w-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            <span>Profile</span>
          </div>
        </button>
        <button
          :class="[
            'flex-1 rounded-lg py-3 text-sm font-medium transition',
            activeTab === 'favorites'
              ? 'bg-red-600 text-white shadow-lg shadow-red-900/40'
              : 'text-gray-400 hover:text-white'
          ]"
          @click="setTab('favorites')"
        >
          <div class="flex items-center justify-center gap-2">
            <svg class="h-5 w-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
            </svg>
            <span>Favorites</span>
          </div>
        </button>
      </div>

      <!-- Profile Tab -->
      <div v-if="activeTab === 'profile'" class="rounded-2xl border border-white/10 bg-[#12121a] p-6 sm:p-8">
        <div class="mb-6 flex items-center justify-between">
          <h2 class="text-lg font-semibold text-white">My Data</h2>
          <span class="rounded-full bg-red-600/10 px-3 py-1 text-xs font-medium text-red-400 border border-red-500/20">Active</span>
        </div>

        <div class="grid gap-6 sm:grid-cols-2">
          <div class="rounded-xl border border-white/10 bg-white/5 p-5 sm:col-span-2">
            <div class="flex items-center gap-4">
              <img
                :src="user?.avatar"
                :alt="user?.username"
                class="h-16 w-16 rounded-full"
              />
              <div>
                <p class="font-semibold text-white">{{ user?.username }}</p>
                <p class="text-sm text-gray-400">{{ user?.email }}</p>
              </div>
            </div>
          </div>

          <div class="rounded-xl border border-white/10 bg-white/5 p-5">
            <div class="flex items-center gap-3">
              <div class="flex h-10 w-10 items-center justify-center rounded-lg bg-red-600/10">
                <svg class="h-5 w-5 text-red-400" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <div>
                <label class="text-xs text-gray-500">Username</label>
                <p class="font-medium text-white">{{ user?.username }}</p>
              </div>
            </div>
          </div>

          <div class="rounded-xl border border-white/10 bg-white/5 p-5">
            <div class="flex items-center gap-3">
              <div class="flex h-10 w-10 items-center justify-center rounded-lg bg-red-600/10">
                <svg class="h-5 w-5 text-red-400" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <label class="text-xs text-gray-500">Email</label>
                <p class="font-medium text-white">{{ user?.email }}</p>
              </div>
            </div>
          </div>

          <div class="rounded-xl border border-white/10 bg-white/5 p-5">
            <div class="flex items-center gap-3">
              <div class="flex h-10 w-10 items-center justify-center rounded-lg bg-red-600/10">
                <svg class="h-5 w-5 text-red-400" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <div>
                <label class="text-xs text-gray-500">Password</label>
                <p class="font-medium text-white">••••••••</p>
              </div>
            </div>
          </div>

          <div class="rounded-xl border border-white/10 bg-white/5 p-5">
            <div class="flex items-center gap-3">
              <div class="flex h-10 w-10 items-center justify-center rounded-lg bg-red-600/10">
                <svg class="h-5 w-5 text-red-400" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <label class="text-xs text-gray-500">Member Since</label>
                <p class="font-medium text-white">August 2026</p>
              </div>
            </div>
          </div>
        </div>

        <div class="mt-8 flex justify-center">
          <button
            @click="logout"
            class="rounded-xl bg-red-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-red-700 active:scale-[0.98]"
          >
            Logout
          </button>
        </div>
      </div>

      <!-- Favorites Tab -->
      <div v-if="activeTab === 'favorites'">
        <div v-if="favoriteMovies.length > 0" class="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4">
          <div
            v-for="movie in favoriteMovies"
            :key="movie.id"
            class="group overflow-hidden rounded-2xl bg-[#15151b] border border-white/10 transition hover:-translate-y-1 hover:border-red-500/50"
          >
            <div class="relative poster-aspect overflow-hidden">
              <img
                :src="movie.poster"
                :alt="movie.title"
                class="h-full w-full object-cover transition duration-300 group-hover:scale-105"
              />
              <button
                class="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-red-600 text-white opacity-0 transition group-hover:opacity-100"
                 @click="removeFromFavorites(movie.id)"
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
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
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
  </div>

  <UserLogin v-if="showLogin" @close="showLogin = false" />
</template>
