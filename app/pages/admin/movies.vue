<template>
  <div class="min-h-screen bg-[#0b0b0f] text-white">

    <!-- ==================== OVERLAY ==================== -->
    <div
      v-if="sidebarOpen"
      class="fixed inset-0 bg-black/50 z-40"
      @click="sidebarOpen = false"
    ></div>

    <!-- ==================== SIDEBAR ==================== -->
    <AdminSidebar :open="sidebarOpen" @toggle="sidebarOpen = !sidebarOpen" />

    <!-- ==================== MAIN CONTENT ==================== -->
    <div class="transition-margin duration-300">

      <!-- ==================== TOP NAVBAR ==================== -->
      <AdminHeader @toggle="sidebarOpen = !sidebarOpen" />

      <!-- ==================== PAGE CONTENT ==================== -->
      <main class="p-4 sm:p-6 lg:p-8 ml-3 mr-3">

        <!-- Page Title -->
        <div class="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 class="text-2xl sm:text-3xl font-bold">Movies</h2>
            <p class="text-gray-500 mt-1">Manage all movies and series in your library</p>
          </div>

          <!-- Search -->
          <div class="relative w-full sm:w-72">
            <span class="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">
              <Icon name="mdi:magnify" />
            </span>
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Search movies by title..."
              class="w-full bg-[#15151c] border border-gray-800
                     rounded-xl py-2.5 pl-11 pr-4
                     text-sm text-white placeholder-gray-500
                     focus:outline-none focus:border-red-500"
            />
          </div>
        </div>

        <!-- Filter Bar -->
        <div class="flex flex-wrap items-center gap-3 mb-6">
          <select
            v-model="selectedCategory"
            class="bg-[#15151c] border border-gray-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-red-500"
          >
            <option value="">All Categories</option>
            <option v-for="cat in categories" :key="cat.id" :value="cat.name">
              {{ cat.name }}
            </option>
          </select>

          <select
            v-model="selectedYear"
            class="bg-[#15151c] border border-gray-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-red-500"
          >
            <option value="">All Years</option>
            <option v-for="year in availableYears" :key="year" :value="year">
              {{ year }}
            </option>
          </select>

          <select
            v-model="minRating"
            class="bg-[#15151c] border border-gray-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-red-500"
          >
            <option value="0">Min Rating</option>
            <option v-for="r in [6, 7, 8, 9]" :key="r" :value="r">
              {{ r }}.0+
            </option>
          </select>

          <button
            v-if="hasActiveFilters"
            @click="clearFilters"
            class="ml-auto text-sm text-gray-400 hover:text-white transition flex items-center gap-1"
          >
            <Icon name="mdi:close-circle" />
            Clear filters
          </button>
        </div>

        <!-- Filter Tabs -->
        <div class="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div class="flex flex-wrap gap-2">
            <button
              v-for="tab in tabs"
              :key="tab.value"
              @click="activeFilter = tab.value"
              :class="[
                'px-4 py-2 rounded-xl text-sm font-medium transition',
                activeFilter === tab.value
                  ? 'bg-red-600 text-white'
                  : 'bg-[#15151c] text-gray-400 hover:text-white border border-gray-800'
              ]"
            >
              {{ tab.label }}
              <span class="ml-1 text-xs opacity-70">({{ tab.count }})</span>
            </button>
          </div>
          <button
            @click="openAddModal"
            class="flex items-center gap-2 bg-red-600 hover:bg-red-500
                   px-4 py-2.5 rounded-xl text-sm font-medium transition"
          >
            <Icon name="mdi:plus" />
            <span class="hidden sm:inline">Add Movie</span>
          </button>
        </div>

        <!-- Loading State -->
        <div v-if="pending" class="flex items-center justify-center py-20">
          <div class="w-10 h-10 border-4 border-red-500 border-t-transparent rounded-full animate-spin"></div>
        </div>

        <!-- Error State -->
        <div v-else-if="error" class="bg-red-500/10 border border-red-500/30 rounded-2xl p-6 text-center">
          <Icon name="mdi:alert-circle" class="text-4xl text-red-400 mb-3" />
          <p class="text-red-400">Failed to load movies</p>
        </div>

        <!-- Movies Table -->
        <section
          v-else
          class="bg-[#15151c] border border-gray-800 rounded-2xl"
        >
          <div class="p-6 flex items-center justify-between flex-wrap gap-3">
            <div>
              <h3 class="text-lg font-semibold">All Movies & Series</h3>
              <p class="text-sm text-gray-500">
                Showing {{ filteredMovies.length }} of {{ movies.length }} titles
              </p>
            </div>
          </div>
          <div class="overflow-x-auto">
            <table class="w-full min-w-[800px]">
              <thead>
                <tr
                  class="border-y border-gray-800
                         text-left text-xs uppercase text-gray-500"
                >
                  <th class="px-6 py-4">Movie</th>
                  <th class="px-6 py-4">Category</th>
                  <th class="px-6 py-4">Rating</th>
                  <th class="px-6 py-4">Type</th>
                  <th class="px-6 py-4">Year</th>
                  <th class="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="movie in filteredMovies"
                  :key="movie.id"
                  class="border-b border-gray-800/60 hover:bg-[#1b1b22] transition"
                >
                  <td class="px-6 py-4">
                    <div class="flex items-center gap-3">
                      <img
                        :src="movie.poster"
                        :alt="movie.title"
                        class="w-12 h-16 object-cover rounded-lg"
                      />
                      <div>
                        <p class="font-medium">{{ movie.title }}</p>
                        <p class="text-xs text-gray-500 mt-1">
                          {{ movie.genre?.join(', ') }}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td class="px-6 py-4 text-gray-400">{{ movie.category }}</td>
                  <td class="px-6 py-4">
                    <span class="text-yellow-400"><Icon name="mdi:star" /></span>
                    {{ movie.rating }}
                  </td>
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
                  <td class="px-6 py-4 text-gray-400">
                    {{ movie.releaseDate?.substring(0, 4) }}
                  </td>
                  <td class="px-6 py-4">
                    <div class="flex items-center justify-end gap-2">
                      <button
                        @click="openEditModal(movie)"
                        class="w-9 h-9 rounded-lg bg-blue-500/10 text-blue-400
                               hover:bg-blue-500/20 flex items-center justify-center transition"
                        title="Edit"
                      >
                        <Icon name="mdi:pencil" />
                      </button>
                      <button
                        @click="confirmDelete(movie)"
                        class="w-9 h-9 rounded-lg bg-red-500/10 text-red-400
                               hover:bg-red-500/20 flex items-center justify-center transition"
                        title="Delete"
                      >
                        <Icon name="mdi:delete" />
                      </button>
                    </div>
                  </td>
                </tr>
                <tr v-if="filteredMovies.length === 0">
                  <td colspan="6" class="px-6 py-12 text-center text-gray-500">
                    <Icon name="mdi:movie-off" class="text-4xl mb-2" />
                    <p>No movies found</p>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </div>

    <!-- ==================== MODAL ==================== -->
    <div
      v-if="showModal"
      class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70"
      @click.self="closeModal"
    >
      <div class="bg-[#15151c] border border-gray-800 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto scrollbar-hide">
        <div class="p-6 border-b border-gray-800 flex items-center justify-between sticky top-0 bg-[#15151c]">
          <h3 class="text-lg font-semibold">
            {{ isEditing ? 'Edit Movie' : 'Add New Movie' }}
          </h3>
          <button @click="closeModal" class="text-gray-400 hover:text-white">
            <Icon name="mdi:close" class="text-xl" />
          </button>
        </div>

        <form @submit.prevent="saveMovie" class="p-6 space-y-4">
          <div>
            <label class="block text-sm text-gray-400 mb-2">Title</label>
            <input
              v-model="form.title"
              type="text"
              required
              class="w-full bg-[#0b0b0f] border border-gray-800 rounded-xl
                     px-4 py-2.5 text-sm focus:outline-none focus:border-red-500"
              placeholder="Movie title"
            />
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm text-gray-400 mb-2">Category</label>
              <select
                v-model="form.category"
                required
                class="w-full bg-[#0b0b0f] border border-gray-800 rounded-xl
                       px-4 py-2.5 text-sm focus:outline-none focus:border-red-500"
              >
                <option value="">Select category</option>
                <option v-for="cat in categories" :key="cat.id" :value="cat.name">
                  {{ cat.name }}
                </option>
                <option value="Hollywood">Hollywood</option>
                <option value="K-Drama">K-Drama</option>
                <option value="C-Drama">C-Drama</option>
                <option value="BL Series">BL Series</option>
                <option value="Anime">Anime</option>
              </select>
            </div>

            <div>
              <label class="block text-sm text-gray-400 mb-2">Type</label>
              <select
                v-model="form.type"
                required
                class="w-full bg-[#0b0b0f] border border-gray-800 rounded-xl
                       px-4 py-2.5 text-sm focus:outline-none focus:border-red-500"
              >
                <option value="movie">Movie</option>
                <option value="series">Series</option>
              </select>
            </div>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm text-gray-400 mb-2">Rating (0-10)</label>
              <input
                v-model.number="form.rating"
                type="number"
                step="0.1"
                min="0"
                max="10"
                required
                class="w-full bg-[#0b0b0f] border border-gray-800 rounded-xl
                       px-4 py-2.5 text-sm focus:outline-none focus:border-red-500"
              />
            </div>

            <div>
              <label class="block text-sm text-gray-400 mb-2">Release Date</label>
              <input
                v-model="form.releaseDate"
                type="date"
                required
                class="w-full bg-[#0b0b0f] border border-gray-800 rounded-xl
                       px-4 py-2.5 text-sm focus:outline-none focus:border-red-500"
              />
            </div>
          </div>

          <div>
            <label class="block text-sm text-gray-400 mb-2">Genre (comma separated)</label>
            <input
              v-model="form.genreInput"
              type="text"
              class="w-full bg-[#0b0b0f] border border-gray-800 rounded-xl
                     px-4 py-2.5 text-sm focus:outline-none focus:border-red-500"
              placeholder="Action, Drama, Romance"
            />
          </div>

          <div>
            <label class="block text-sm text-gray-400 mb-2">Poster URL</label>
            <input
              v-model="form.poster"
              type="url"
              required
              class="w-full bg-[#0b0b0f] border border-gray-800 rounded-xl
                     px-4 py-2.5 text-sm focus:outline-none focus:border-red-500"
              placeholder="https://..."
            />
          </div>

          <div>
            <label class="block text-sm text-gray-400 mb-2">Video URL</label>
            <input
              v-model="form.videoUrl"
              type="url"
              class="w-full bg-[#0b0b0f] border border-gray-800 rounded-xl
                     px-4 py-2.5 text-sm focus:outline-none focus:border-red-500"
              placeholder="https://..."
            />
          </div>

          <div v-if="form.type === 'series'">
            <label class="block text-sm text-gray-400 mb-2">Parts / Episodes</label>
            <div class="space-y-3">
              <div
                v-for="(part, index) in form.parts"
                :key="index"
                class="bg-[#0b0b0f] border border-gray-800 rounded-xl p-4 space-y-3"
              >
                <div class="flex items-center justify-between">
                  <span class="text-sm font-medium text-gray-300">Part {{ index + 1 }}</span>
                  <button
                    @click="removePart(index)"
                    type="button"
                    class="text-red-400 hover:text-red-300 transition"
                    title="Remove part"
                  >
                    <Icon name="mdi:trash" class="text-base" />
                  </button>
                </div>
                <input
                  v-model="part.title"
                  type="text"
                  placeholder="Part title"
                  class="w-full bg-[#15151c] border border-gray-800 rounded-xl
                         px-4 py-2 text-sm focus:outline-none focus:border-red-500"
                />
                <input
                  v-model="part.description"
                  type="text"
                  placeholder="Part description"
                  class="w-full bg-[#15151c] border border-gray-800 rounded-xl
                         px-4 py-2 text-sm focus:outline-none focus:border-red-500"
                />
                <input
                  v-model="part.videoUrl"
                  type="url"
                  placeholder="Part video URL"
                  class="w-full bg-[#15151c] border border-gray-800 rounded-xl
                         px-4 py-2 text-sm focus:outline-none focus:border-red-500"
                />
              </div>
              <button
                @click="addPart"
                type="button"
                class="flex items-center gap-2 w-full justify-center py-2.5 rounded-xl
                       text-sm font-medium border border-gray-800 text-gray-400
                       hover:bg-[#1b1b22] hover:text-white transition"
              >
                <Icon name="mdi:plus" />
                Add Part
              </button>
            </div>
          </div>

          <div>
            <label class="block text-sm text-gray-400 mb-2">Description</label>
            <textarea
              v-model="form.description"
              rows="3"
              class="w-full bg-[#0b0b0f] border border-gray-800 rounded-xl
                     px-4 py-2.5 text-sm focus:outline-none focus:border-red-500 resize-none"
              placeholder="Movie description"
            ></textarea>
          </div>

          <div class="flex items-center justify-end gap-3 pt-4">
            <button
              type="button"
              @click="closeModal"
              class="px-5 py-2.5 rounded-xl text-sm font-medium
                     border border-gray-800 hover:bg-[#1b1b22] transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              :disabled="saving"
              class="px-5 py-2.5 rounded-xl text-sm font-medium
                     bg-red-600 hover:bg-red-500 transition disabled:opacity-50"
            >
              {{ saving ? 'Saving...' : (isEditing ? 'Update' : 'Create') }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- ==================== DELETE CONFIRM ==================== -->
    <div
      v-if="showDeleteConfirm"
      class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70"
      @click.self="showDeleteConfirm = false"
    >
      <div class="bg-[#15151c] border border-gray-800 rounded-2xl w-full max-w-md p-6">
        <div class="flex items-center gap-3 mb-4">
          <div class="w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center">
            <Icon name="mdi:alert" class="text-2xl text-red-400" />
          </div>
          <div>
            <h3 class="font-semibold">Delete Movie</h3>
            <p class="text-sm text-gray-500">This action cannot be undone</p>
          </div>
        </div>
        <p class="text-gray-300 mb-6">
          Are you sure you want to delete <span class="font-semibold">{{ movieToDelete?.title }}</span>?
        </p>
        <div class="flex items-center justify-end gap-3">
          <button
            @click="showDeleteConfirm = false"
            class="px-5 py-2.5 rounded-xl text-sm font-medium
                   border border-gray-800 hover:bg-[#1b1b22] transition"
          >
            Cancel
          </button>
          <button
            @click="deleteMovie"
            :disabled="deleting"
            class="px-5 py-2.5 rounded-xl text-sm font-medium
                   bg-red-600 hover:bg-red-500 transition disabled:opacity-50"
          >
            {{ deleting ? 'Deleting...' : 'Delete' }}
          </button>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, computed, reactive, onMounted } from 'vue'

definePageMeta({ layout: 'admin', middleware: ['auth'], role: 'admin' })

const sidebarOpen = ref(false)
const searchQuery = ref('')
const activeFilter = ref('all')
const selectedCategory = ref('')
const selectedYear = ref('')
const minRating = ref(0)
const showModal = ref(false)
const showDeleteConfirm = ref(false)
const isEditing = ref(false)
const saving = ref(false)
const deleting = ref(false)
const movieToDelete = ref(null)

onMounted(() => {
  sidebarOpen.value = false
})

const API_BASE = 'http://localhost:8000'

const emptyForm = () => ({
  id: null,
  title: '',
  category: '',
  type: 'movie',
  rating: 0,
  releaseDate: '',
  genreInput: '',
  poster: '',
  videoUrl: '',
  description: '',
  parts: []
})

const form = reactive(emptyForm())

const { data: moviesData, pending, error, refresh } = await useFetch(`${API_BASE}/movies`)
const { data: categoriesData } = await useFetch(`${API_BASE}/categories`)

const movies = computed(() => moviesData.value || [])
const categories = computed(() => categoriesData.value || [])

const filteredMovies = computed(() => {
  let result = movies.value

  if (activeFilter.value === 'movie') {
    result = result.filter(m => m.type !== 'series')
  } else if (activeFilter.value === 'series') {
    result = result.filter(m => m.type === 'series')
  }

  if (searchQuery.value) {
    const q = searchQuery.value.toLowerCase()
    result = result.filter(m =>
      m.title?.toLowerCase().includes(q) ||
      m.category?.toLowerCase().includes(q) ||
      (Array.isArray(m.genre) ? m.genre.join(', ').toLowerCase().includes(q) : false)
    )
  }

  if (selectedCategory.value) {
    result = result.filter(m => m.category === selectedCategory.value)
  }

  if (selectedYear.value) {
    result = result.filter(m => {
      const year = m.releaseDate ? String(m.releaseDate).substring(0, 4) : ''
      return year === selectedYear.value
    })
  }

  if (minRating.value > 0) {
    result = result.filter(m => Number(m.rating) >= minRating.value)
  }

  return result
})

const availableYears = computed(() => {
  const years = new Set()
  movies.value.forEach(m => {
    if (m.releaseDate) years.add(String(m.releaseDate).substring(0, 4))
  })
  return [...years].sort((a, b) => Number(b) - Number(a))
})

const hasActiveFilters = computed(() => {
  return selectedCategory.value || selectedYear.value || minRating.value > 0 || searchQuery.value
})

const clearFilters = () => {
  searchQuery.value = ''
  selectedCategory.value = ''
  selectedYear.value = ''
  minRating.value = 0
}

const tabs = computed(() => [
  { label: 'All', value: 'all', count: movies.value.length },
  { label: 'Movies', value: 'movie', count: movies.value.filter(m => m.type !== 'series').length },
  { label: 'Series', value: 'series', count: movies.value.filter(m => m.type === 'series').length }
])

const openAddModal = () => {
  isEditing.value = false
  Object.assign(form, emptyForm())
  showModal.value = true
}

const openEditModal = (movie) => {
  isEditing.value = true
  Object.assign(form, {
    id: movie.id,
    title: movie.title,
    category: movie.category,
    type: movie.type || 'movie',
    rating: movie.rating,
    releaseDate: movie.releaseDate,
    genreInput: Array.isArray(movie.genre) ? movie.genre.join(', ') : '',
    poster: movie.poster,
    videoUrl: movie.videoUrl || '',
    description: movie.description || '',
    parts: movie.parts ? movie.parts.map(p => ({ ...p })) : []
  })
  showModal.value = true
}

const closeModal = () => {
  showModal.value = false
  Object.assign(form, emptyForm())
}

const addPart = () => {
  form.parts.push({ title: '', description: '', videoUrl: '' })
}

const removePart = (index) => {
  form.parts.splice(index, 1)
}

const saveMovie = async () => {
  saving.value = true
  try {
    const isNew = !isEditing.value
    const nextId = isNew
      ? String(
          (movies.value || []).reduce((max, m) => {
            const n = Number(m.id)
            return Number.isFinite(n) && n > max ? n : max
          }, 0) + 1
        )
      : String(form.id)

    const payload = {
      id: nextId,
      title: form.title,
      category: form.category,
      genre: form.genreInput.split(',').map(g => g.trim()).filter(Boolean),
      rating: Number(form.rating),
      releaseDate: form.releaseDate,
      description: form.description,
      poster: form.poster,
      backdrop: '',
      type: form.type,
      videoUrl: form.videoUrl || ''
    }

    if (form.type === 'series') {
      payload.parts = form.parts.map((p, i) => ({
        id: p.id || i + 1,
        part: i + 1,
        title: p.title || `Part ${i + 1}`,
        description: p.description || '',
        videoUrl: p.videoUrl || ''
      }))
    }

    if (isEditing.value) {
      await $fetch(`${API_BASE}/movies/${form.id}`, {
        method: 'PUT',
        body: payload
      })
    } else {
      await $fetch(`${API_BASE}/movies`, {
        method: 'POST',
        body: payload
      })
    }

    await refresh()
    closeModal()
  } catch (e) {
    alert('Failed to save movie: ' + e.message)
  } finally {
    saving.value = false
  }
}

const confirmDelete = (movie) => {
  movieToDelete.value = movie
  showDeleteConfirm.value = true
}

const deleteMovie = async () => {
  if (!movieToDelete.value) return
  deleting.value = true
  try {
    await $fetch(`${API_BASE}/movies/${movieToDelete.value.id}`, {
      method: 'DELETE'
    })
    await refresh()
    showDeleteConfirm.value = false
    movieToDelete.value = null
  } catch (e) {
    alert('Failed to delete movie: ' + e.message)
  } finally {
    deleting.value = false
  }
}
</script>
