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
              placeholder="Search categories..."
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
              <span class="hidden sm:inline">Add Category</span>
            </button>
          </div>
        </div>
      </header>

      <!-- ==================== PAGE CONTENT ==================== -->
      <main class="p-4 sm:p-6 lg:p-8">

        <!-- Page Title -->
        <div class="mb-8">
          <h2 class="text-2xl sm:text-3xl font-bold">Categories</h2>
          <p class="text-gray-500 mt-1">Manage all movie and series categories</p>
        </div>

        <!-- Stats -->
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-8">
          <div
            class="bg-[#15151c] border border-gray-800 rounded-2xl p-5
                   hover:border-blue-500/40 transition"
          >
            <div class="flex items-start justify-between">
              <div>
                <p class="text-gray-500 text-sm">Total Categories</p>
                <h3 class="text-3xl font-bold mt-2">{{ categories.length }}</h3>
              </div>
              <div
                class="w-12 h-12 rounded-xl bg-blue-500/10
                       flex items-center justify-center text-xl text-blue-400"
              >
                <Icon name="mdi:tag" />
              </div>
            </div>
          </div>

          <div
            class="bg-[#15151c] border border-gray-800 rounded-2xl p-5
                   hover:border-purple-500/40 transition"
          >
            <div class="flex items-start justify-between">
              <div>
                <p class="text-gray-500 text-sm">Total Movies</p>
                <h3 class="text-3xl font-bold mt-2">{{ movies.length }}</h3>
              </div>
              <div
                class="w-12 h-12 rounded-xl bg-purple-500/10
                       flex items-center justify-center text-xl text-purple-400"
              >
                <Icon name="mdi:movie" />
              </div>
            </div>
          </div>

          <div
            class="bg-[#15151c] border border-gray-800 rounded-2xl p-5
                   hover:border-green-500/40 transition"
          >
            <div class="flex items-start justify-between">
              <div>
                <p class="text-gray-500 text-sm">Total Series</p>
                <h3 class="text-3xl font-bold mt-2">{{ seriesCount }}</h3>
              </div>
              <div
                class="w-12 h-12 rounded-xl bg-green-500/10
                       flex items-center justify-center text-xl text-green-400"
              >
                <Icon name="mdi:television" />
              </div>
            </div>
          </div>
        </div>

        <!-- Loading State -->
        <div v-if="pending" class="flex items-center justify-center py-20">
          <div class="w-10 h-10 border-4 border-red-500 border-t-transparent rounded-full animate-spin"></div>
        </div>

        <!-- Error State -->
        <div v-else-if="error" class="bg-red-500/10 border border-red-500/30 rounded-2xl p-6 text-center">
          <Icon name="mdi:alert-circle" class="text-4xl text-red-400 mb-3" />
          <p class="text-red-400">Failed to load categories</p>
        </div>

        <!-- Categories Table -->
        <section
          v-else
          class="bg-[#15151c] border border-gray-800 rounded-2xl"
        >
          <div class="overflow-x-auto">
            <table class="w-full min-w-[600px]">
              <thead>
                <tr
                  class="border-y border-gray-800
                         text-left text-xs uppercase text-gray-500"
                >
                  <th class="px-6 py-4">Category</th>
                  <th class="px-6 py-4">ID</th>
                  <th class="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="category in filteredCategories"
                  :key="category.id"
                  class="border-b border-gray-800/60 hover:bg-[#1b1b22] transition"
                >
                  <td class="px-6 py-4">
                    <div class="flex items-center gap-3">
                      <div
                        class="w-10 h-10 rounded-xl bg-blue-500/10
                               flex items-center justify-center text-blue-400"
                      >
                        <Icon name="mdi:tag" />
                      </div>
                      <div>
                        <p class="font-medium">{{ category.name }}</p>
                        <p class="text-xs text-gray-500 mt-1">
                          {{ getCategoryCount(category.name) }} item(s)
                        </p>
                      </div>
                    </div>
                  </td>
                  <td class="px-6 py-4 text-gray-400 text-sm font-mono">
                    {{ category.id }}
                  </td>
                  <td class="px-6 py-4">
                    <div class="flex items-center justify-end gap-2">
                      <button
                        @click="openEditModal(category)"
                        class="w-9 h-9 rounded-lg bg-blue-500/10 text-blue-400
                               hover:bg-blue-500/20 flex items-center justify-center transition"
                        title="Edit"
                      >
                        <Icon name="mdi:pencil" />
                      </button>
                      <button
                        @click="confirmDelete(category)"
                        class="w-9 h-9 rounded-lg bg-red-500/10 text-red-400
                               hover:bg-red-500/20 flex items-center justify-center transition"
                        title="Delete"
                      >
                        <Icon name="mdi:delete" />
                      </button>
                    </div>
                  </td>
                </tr>
                <tr v-if="filteredCategories.length === 0">
                  <td colspan="3" class="px-6 py-12 text-center text-gray-500">
                    <Icon name="mdi:tag-off" class="text-4xl mb-2" />
                    <p>No categories found</p>
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
      <div class="bg-[#15151c] border border-gray-800 rounded-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div class="p-6 border-b border-gray-800 flex items-center justify-between sticky top-0 bg-[#15151c]">
          <h3 class="text-lg font-semibold">
            {{ isEditing ? 'Edit Category' : 'Add New Category' }}
          </h3>
          <button @click="closeModal" class="text-gray-400 hover:text-white">
            <Icon name="mdi:close" class="text-xl" />
          </button>
        </div>

        <form @submit.prevent="saveCategory" class="p-6 space-y-4">
          <div>
            <label class="block text-sm text-gray-400 mb-2">Category Name</label>
            <input
              v-model="form.name"
              type="text"
              required
              class="w-full bg-[#0b0b0f] border border-gray-800 rounded-xl
                     px-4 py-2.5 text-sm focus:outline-none focus:border-red-500"
              placeholder="e.g. Hollywood, K-Drama, Anime"
            />
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
            <h3 class="font-semibold">Delete Category</h3>
            <p class="text-sm text-gray-500">This action cannot be undone</p>
          </div>
        </div>
        <p class="text-gray-300 mb-6">
          Are you sure you want to delete <span class="font-semibold">{{ categoryToDelete?.name }}</span>?
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
            @click="deleteCategory"
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

definePageMeta({ layout: 'admin', middleware: ['auth'], role: 'admin' })

const sidebarOpen = ref(false)
const searchQuery = ref('')
const showModal = ref(false)
const showDeleteConfirm = ref(false)
const isEditing = ref(false)
const saving = ref(false)
const deleting = ref(false)
const categoryToDelete = ref(null)

const API_BASE = 'http://localhost:8000'

const emptyForm = () => ({
  id: null,
  name: ''
})

const form = reactive(emptyForm())

const { data: categoriesData, pending, error, refresh } = await useFetch(`${API_BASE}/categories`)
const { data: moviesData } = await useFetch(`${API_BASE}/movies`)

const categories = computed(() => categoriesData.value || [])
const movies = computed(() => moviesData.value || [])

const seriesCount = computed(() => movies.value.filter(m => m.type === 'series').length)

const filteredCategories = computed(() => {
  let result = categories.value

  if (searchQuery.value) {
    const q = searchQuery.value.toLowerCase()
    result = result.filter(c =>
      c.name?.toLowerCase().includes(q)
    )
  }

  return result
})

const getCategoryCount = (categoryName) => {
  return movies.value.filter(m => m.category === categoryName).length
}

const openAddModal = () => {
  isEditing.value = false
  Object.assign(form, emptyForm())
  showModal.value = true
}

const openEditModal = (category) => {
  isEditing.value = true
  Object.assign(form, {
    id: category.id,
    name: category.name
  })
  showModal.value = true
}

const closeModal = () => {
  showModal.value = false
  Object.assign(form, emptyForm())
}

const saveCategory = async () => {
  saving.value = true
  try {
    const payload = {
      name: form.name
    }

    if (isEditing.value) {
      await $fetch(`${API_BASE}/categories/${form.id}`, {
        method: 'PUT',
        body: payload
      })
    } else {
      await $fetch(`${API_BASE}/categories`, {
        method: 'POST',
        body: payload
      })
    }

    await refresh()
    closeModal()
  } catch (e) {
    alert('Failed to save category: ' + e.message)
  } finally {
    saving.value = false
  }
}

const confirmDelete = (category) => {
  categoryToDelete.value = category
  showDeleteConfirm.value = true
}

const deleteCategory = async () => {
  if (!categoryToDelete.value) return
  deleting.value = true
  try {
    await $fetch(`${API_BASE}/categories/${categoryToDelete.value.id}`, {
      method: 'DELETE'
    })
    await refresh()
    showDeleteConfirm.value = false
    categoryToDelete.value = null
  } catch (e) {
    alert('Failed to delete category: ' + e.message)
  } finally {
    deleting.value = false
  }
}
</script>
