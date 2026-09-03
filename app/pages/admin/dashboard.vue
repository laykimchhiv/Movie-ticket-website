<template>
  <div class="min-h-screen bg-[#0b0b0f] text-white">

    <!-- ==================== MOBILE OVERLAY ==================== -->
    <div
      v-if="sidebarOpen"
      class="fixed inset-0 bg-black/60 z-40 lg:hidden"
      @click="sidebarOpen = false"
    ></div>

    <!-- ==================== SIDEBAR ==================== -->
    <AdminSidebar :open="sidebarOpen" @close="sidebarOpen = false" />

    <!-- ==================== MAIN CONTENT ==================== -->
    <div class="lg:ml-64">

      <!-- ==================== TOP NAVBAR ==================== -->
      <header
        class="h-20 sticky top-0 z-30 bg-[#0b0b0f]/90 backdrop-blur-xl
               border-b border-gray-800"
      >
        <div class="h-full px-4 sm:px-6 lg:px-8 flex items-center justify-between">

          <!-- Mobile menu -->
          <button
            @click="sidebarOpen = true"
            class="lg:hidden w-10 h-10 rounded-lg bg-[#15151c]
                   border border-gray-800 text-gray-300 flex items-center justify-center"
          >
            <Icon name="mdi:menu" class="text-lg" />
          </button>

          <!-- Search -->
          <div class="hidden sm:flex items-center relative w-64 lg:w-80">
            <span class="absolute left-4 text-gray-500">
              <Icon name="mdi:magnify" />
            </span>

            <input
              type="text"
              placeholder="Search..."
              class="w-full bg-[#15151c] border border-gray-800
                     rounded-xl py-2.5 pl-11 pr-4
                     text-sm text-white placeholder-gray-500
                     focus:outline-none focus:border-red-500"
            />
          </div>

          <!-- Right side -->
          <div class="flex items-center gap-3 ml-auto">

            <!-- Notification -->
            <button
              class="relative w-10 h-10 rounded-xl bg-[#15151c]
                     border border-gray-800 hover:border-gray-700
                     flex items-center justify-center"
            >
              <Icon name="mdi:bell" />

              <span
                class="absolute top-2 right-2 w-2 h-2
                       bg-red-500 rounded-full"
              ></span>
            </button>

            <!-- Admin Profile -->
            <div class="hidden sm:flex items-center gap-3 ml-2">
              <div
                class="w-9 h-9 rounded-full bg-red-600
                       flex items-center justify-center font-semibold"
              >
                A
              </div>

              <div>
                <p class="text-sm font-medium">Admin</p>
                <p class="text-xs text-gray-500">Administrator</p>
              </div>
            </div>

          </div>
        </div>
      </header>

      <!-- ==================== PAGE CONTENT ==================== -->
      <main class="p-4 sm:p-6 lg:p-8">

        <!-- Loading State -->
        <div v-if="pending" class="flex items-center justify-center py-20">
          <div class="w-10 h-10 border-4 border-red-500 border-t-transparent rounded-full animate-spin"></div>
        </div>

        <!-- Error State -->
        <div v-else-if="error" class="bg-red-500/10 border border-red-500/30 rounded-2xl p-6 text-center">
          <Icon name="mdi:alert-circle" class="text-4xl text-red-400 mb-3" />
          <p class="text-red-400 font-semibold">Failed to load dashboard data</p>
          <p class="text-gray-500 text-sm mt-1">Please make sure the API server (JSON Server on port 8000) is running.</p>
        </div>

        <template v-else>

          <!-- Page Title -->
          <div class="mb-8">
            <h2 class="text-2xl sm:text-3xl font-bold">
              Dashboard
            </h2>

            <p class="text-gray-500 mt-1">
              Welcome back, Admin. Here's what's happening with MovieFlix.
            </p>
          </div>

          <!-- ==================== STATISTICS ==================== -->
          <section
            class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 mb-8"
          >

            <!-- Movies -->
            <div
              class="bg-[#15151c] border border-gray-800 rounded-2xl p-5
                     hover:border-red-500/40 transition"
            >
              <div class="flex items-start justify-between">

                <div>
                  <p class="text-gray-500 text-sm">
                    Total Movies
                  </p>

                  <h3 class="text-3xl font-bold mt-2">
                    {{ stats.movies }}
                  </h3>

                  <p class="text-gray-500 text-sm mt-2">
                    All movies in database
                  </p>
                </div>

                <div
                  class="w-12 h-12 rounded-xl bg-red-500/10
                         flex items-center justify-center text-xl text-red-400"
                >
                  <Icon name="mdi:movie-open" />
                </div>

              </div>
            </div>

            <!-- Series -->
            <div
              class="bg-[#15151c] border border-gray-800 rounded-2xl p-5
                     hover:border-purple-500/40 transition"
            >
              <div class="flex items-start justify-between">

                <div>
                  <p class="text-gray-500 text-sm">
                    Total Series
                  </p>

                  <h3 class="text-3xl font-bold mt-2">
                    {{ stats.series }}
                  </h3>

                  <p class="text-gray-500 text-sm mt-2">
                    All series in database
                  </p>
                </div>

                <div
                  class="w-12 h-12 rounded-xl bg-purple-500/10
                         flex items-center justify-center text-xl text-purple-400"
                >
                  <Icon name="mdi:television" />
                </div>

              </div>
            </div>

            <!-- Categories -->
            <div
              class="bg-[#15151c] border border-gray-800 rounded-2xl p-5
                     hover:border-blue-500/40 transition"
            >
              <div class="flex items-start justify-between">

                <div>
                  <p class="text-gray-500 text-sm">
                    Categories
                  </p>

                  <h3 class="text-3xl font-bold mt-2">
                    {{ stats.categories }}
                  </h3>

                  <p class="text-gray-500 text-sm mt-2">
                    Movie genres
                  </p>
                </div>

                <div
                  class="w-12 h-12 rounded-xl bg-blue-500/10
                         flex items-center justify-center text-xl text-blue-400"
                >
                  <Icon name="mdi:tag" />
                </div>

              </div>
            </div>

            <!-- Average Rating -->
            <div
              class="bg-[#15151c] border border-gray-800 rounded-2xl p-5
                     hover:border-green-500/40 transition"
            >
              <div class="flex items-start justify-between">

                <div>
                  <p class="text-gray-500 text-sm">
                    Average Rating
                  </p>

                  <h3 class="text-3xl font-bold mt-2">
                    {{ stats.avgRating }}
                  </h3>

                  <p class="text-gray-500 text-sm mt-2">
                    Across all titles
                  </p>
                </div>

                <div
                  class="w-12 h-12 rounded-xl bg-green-500/10
                         flex items-center justify-center text-xl text-green-400"
                >
                  <Icon name="mdi:star" />
                </div>

              </div>
            </div>

          </section>

          <!-- ==================== CHART + QUICK STATS ==================== -->
          <section class="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-8">

            <!-- Movies by Category Chart -->
            <div
              class="xl:col-span-2 bg-[#15151c] border border-gray-800
                     rounded-2xl p-6"
            >

              <div class="flex flex-col sm:flex-row sm:items-center
                          justify-between gap-4 mb-6">

                <div>
                  <h3 class="text-lg font-semibold">
                    Movies by Category
                  </h3>

                  <p class="text-sm text-gray-500">
                    Distribution of content by category
                  </p>
                </div>

              </div>

              <!-- Chart -->
              <div class="h-64 flex items-end gap-2 sm:gap-4">

                <div
                  v-for="item in categoryStats"
                  :key="item.name"
                  class="flex-1 h-full flex flex-col justify-end items-center gap-2"
                >

                  <div class="w-full h-full flex items-end justify-center">

                    <div
                      class="w-full max-w-12 bg-red-500 rounded-t-lg
                             hover:bg-red-400 transition cursor-pointer"
                      :style="{ height: item.height + '%', minHeight: '8px' }"
                      :title="item.count + ' items'"
                    ></div>

                  </div>

                  <span class="text-xs text-gray-500 text-center truncate w-full">
                    {{ item.name }}
                  </span>

                </div>

              </div>

            </div>

            <!-- Quick Statistics -->
            <div
              class="bg-[#15151c] border border-gray-800
                     rounded-2xl p-6"
            >

              <h3 class="text-lg font-semibold">
                Quick Statistics
              </h3>

              <p class="text-sm text-gray-500 mb-6">
                Content overview
              </p>

              <div class="space-y-5">

                <div class="flex items-center justify-between">
                  <div class="flex items-center gap-3">
                    <div
                      class="w-10 h-10 rounded-lg bg-red-500/10
                             flex items-center justify-center text-red-400"
                    >
                      <Icon name="mdi:movie" />
                    </div>

                    <div>
                      <p class="text-sm">Movies</p>
                      <p class="text-xs text-gray-500">
                        Type: movie
                      </p>
                    </div>
                  </div>

                  <p class="font-semibold">
                    {{ stats.movies }}
                  </p>
                </div>

                <div class="flex items-center justify-between">
                  <div class="flex items-center gap-3">
                    <div
                      class="w-10 h-10 rounded-lg bg-purple-500/10
                             flex items-center justify-center text-purple-400"
                    >
                      <Icon name="mdi:television" />
                    </div>

                    <div>
                      <p class="text-sm">Series</p>
                      <p class="text-xs text-gray-500">
                        Type: series
                      </p>
                    </div>
                  </div>

                  <p class="font-semibold">
                    {{ stats.series }}
                  </p>
                </div>

                <div class="flex items-center justify-between">
                  <div class="flex items-center gap-3">
                    <div
                      class="w-10 h-10 rounded-lg bg-blue-500/10
                             flex items-center justify-center text-blue-400"
                    >
                      <Icon name="mdi:tag" />
                    </div>

                    <div>
                      <p class="text-sm">Categories</p>
                      <p class="text-xs text-gray-500">
                        Genres available
                      </p>
                    </div>
                  </div>

                  <p class="font-semibold">
                    {{ stats.categories }}
                  </p>
                </div>

                <div class="flex items-center justify-between">
                  <div class="flex items-center gap-3">
                    <div
                      class="w-10 h-10 rounded-lg bg-green-500/10
                             flex items-center justify-center text-green-400"
                    >
                      <Icon name="mdi:star" />
                    </div>

                    <div>
                      <p class="text-sm">Avg Rating</p>
                      <p class="text-xs text-gray-500">
                        Out of 10
                      </p>
                    </div>
                  </div>

                  <p class="font-semibold">
                    {{ stats.avgRating }}
                  </p>
                </div>

              </div>

            </div>

          </section>

          <!-- ==================== MOVIES TABLE ==================== -->
          <section
            class="bg-[#15151c] border border-gray-800
                   rounded-2xl mb-8"
          >

            <div
              class="p-6 flex flex-col sm:flex-row
                     sm:items-center justify-between gap-3"
            >

              <div>
                <h3 class="text-lg font-semibold">
                  All Movies & Series
                </h3>

                <p class="text-sm text-gray-500">
                  Showing {{ movies.length }} titles
                </p>
              </div>

            </div>

            <!-- Table -->
            <div class="overflow-x-auto">

              <table class="w-full min-w-[700px]">

                <thead>
                  <tr
                    class="border-y border-gray-800
                           text-left text-xs uppercase
                           text-gray-500"
                  >
                    <th class="px-6 py-4">Title</th>
                    <th class="px-6 py-4">Category</th>
                    <th class="px-6 py-4">Rating</th>
                    <th class="px-6 py-4">Type</th>
                    <th class="px-6 py-4">Year</th>
                  </tr>
                </thead>

                <tbody>

                  <tr
                    v-for="movie in movies"
                    :key="movie.id"
                    class="border-b border-gray-800/60
                           hover:bg-[#1b1b22] transition"
                  >

                    <!-- Title -->
                    <td class="px-6 py-4">

                      <div class="flex items-center gap-3">

                        <img
                          :src="movie.poster || 'https://via.placeholder.com/48x64'"
                          :alt="movie.title"
                          class="w-12 h-16 object-cover rounded-lg bg-gray-800"
                        />

                        <div>
                          <p class="font-medium">
                            {{ movie.title }}
                          </p>

                          <p class="text-xs text-gray-500 mt-1">
                            {{ Array.isArray(movie.genre) ? movie.genre.join(', ') : movie.genre }}
                          </p>
                        </div>

                      </div>

                    </td>

                    <!-- Category -->
                    <td class="px-6 py-4 text-gray-400">
                      {{ movie.category || 'N/A' }}
                    </td>

                    <!-- Rating -->
                    <td class="px-6 py-4">
                      <span class="text-yellow-400 mr-1">
                        <Icon name="mdi:star" />
                      </span>
                      {{ movie.rating || '0.0' }}
                    </td>

                    <!-- Type -->
                    <td class="px-6 py-4">
                      <span
                        :class="[
                          'inline-flex px-3 py-1 rounded-full text-xs font-medium',
                          movie.type === 'series'
                            ? 'bg-purple-500/10 text-purple-400'
                            : 'bg-red-500/10 text-red-400'
                        ]"
                      >
                        {{ movie.type === 'series' ? 'Series' : 'Movie' }}
                      </span>
                    </td>

                    <!-- Year -->
                    <td class="px-6 py-4 text-gray-400">
                      {{ movie.releaseDate ? movie.releaseDate.substring(0, 4) : 'N/A' }}
                    </td>

                  </tr>

                </tbody>

              </table>

            </div>

          </section>

        </template>

      </main>

    </div>

  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

definePageMeta({ 
  layout: 'admin', 
  middleware: ['auth'], 
  role: 'admin' 
})

/*
|--------------------------------------------------------------------------
| Mobile Sidebar State
|--------------------------------------------------------------------------
*/
const sidebarOpen = ref(false)

/*
|--------------------------------------------------------------------------
| API Base URL (Port 8000 for JSON Server)
|--------------------------------------------------------------------------
*/
const API_BASE = 'http://localhost:8000'

/*
|--------------------------------------------------------------------------
| Fetch Data from JSON Server
|--------------------------------------------------------------------------
*/
const { data: moviesData, pending, error } = await useFetch(`${API_BASE}/movies`)
const { data: categoriesData } = await useFetch(`${API_BASE}/categories`)

const movies = computed(() => moviesData.value || [])
const categories = computed(() => categoriesData.value || [])

/*
|--------------------------------------------------------------------------
| Derived Statistics Calculations
|--------------------------------------------------------------------------
*/
const stats = computed(() => {
  const allMovies = movies.value
  const movieCount = allMovies.filter(m => m.type !== 'series').length
  const seriesCount = allMovies.filter(m => m.type === 'series').length
  const totalRating = allMovies.reduce((sum, m) => sum + (Number(m.rating) || 0), 0)
  const avg = allMovies.length ? (totalRating / allMovies.length).toFixed(1) : '0.0'

  return {
    movies: movieCount,
    series: seriesCount,
    categories: categories.value.length,
    avgRating: avg
  }
})

/*
|--------------------------------------------------------------------------
| Category Distribution Stats for Chart
|--------------------------------------------------------------------------
*/
const categoryStats = computed(() => {
  const allMovies = movies.value
  if (!allMovies.length) return []

  const counts = {}

  allMovies.forEach(m => {
    const cat = m.category || 'Uncategorized'
    counts[cat] = (counts[cat] || 0) + 1
  })

  const entries = Object.entries(counts)
  const max = Math.max(...entries.map(([, c]) => c), 1)

  return entries.map(([name, count]) => ({
    name,
    count,
    height: Math.round((count / max) * 90)
  }))
})
</script>