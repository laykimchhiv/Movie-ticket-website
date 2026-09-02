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

          <button
            @click="sidebarOpen = true"
            class="lg:hidden w-10 h-10 rounded-lg bg-[#15151c]
                   border border-gray-800 text-gray-300 flex items-center justify-center"
          >
            <Icon name="mdi:menu" class="text-lg" />
          </button>

          <div class="hidden sm:flex items-center relative w-64 lg:w-80">
            <span class="absolute left-4 text-gray-500">
              <Icon name="mdi:magnify" />
            </span>
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Search movies..."
              class="w-full bg-[#15151c] border border-gray-800
                     rounded-xl py-2.5 pl-11 pr-4
                     text-sm text-white placeholder-gray-500
                     focus:outline-none focus:border-red-500"
            />
          </div>

          <div class="flex items-center gap-3 ml-auto">
            <button
              @click="openAddModal"
              class="flex items-center gap-2 bg-red-600 hover:bg-red-500
                     px-4 py-2.5 rounded-xl text-sm font-medium transition"
            >
              <Icon name="mdi:plus" />
              <span class="hidden sm:inline">Add Movie</span>
            </button>
          </div>
        </div>
      </header>

      <!-- ==================== PAGE CONTENT ==================== -->
      <main class="p-4 sm:p-6 lg:p-8">

        <!-- Page Title -->
        <div class="mb-8">
          <h2 class="text-2xl sm:text-3xl font-bold">Movies</h2>
          <p class="text-gray-500 mt-1">Manage all movies and series in your library</p>
        </div>

        <!-- Filter Tabs -->
        <div class="flex flex-wrap gap-2 mb-6">
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
      <div class="bg-[#15151c] border border-gray-800 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
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
import { ref, computed, reactive } from 'vue'

definePageMeta({ layout: 'admin' })

const sidebarOpen = ref(false)
const searchQuery = ref('')
const activeFilter = ref('all')
const showModal = ref(false)
const showDeleteConfirm = ref(false)
const isEditing = ref(false)
const saving = ref(false)
const deleting = ref(false)
const movieToDelete = ref(null)

const API_BASE = 'http://localhost:3001'

const emptyForm = () => ({
  id: null,
  title: '',
  category: '',
  type: 'movie',
  rating: 0,
  releaseDate: '',
  genreInput: '',
  poster: '',
  description: ''
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
      m.category?.toLowerCase().includes(q)
    )
  }

  return result
})

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
    description: movie.description || ''
  })
  showModal.value = true
}

const closeModal = () => {
  showModal.value = false
  Object.assign(form, emptyForm())
}

const saveMovie = async () => {
  saving.value = true
  try {
    const payload = {
      title: form.title,
      category: form.category,
      genre: form.genreInput.split(',').map(g => g.trim()).filter(Boolean),
      rating: Number(form.rating),
      releaseDate: form.releaseDate,
      description: form.description,
      poster: form.poster,
      type: form.type
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
