<script setup lang="ts">
import { ref, computed, watch, onMounted, nextTick } from 'vue'
import AccountFieldCard from '~/components/user/AccountFieldCard.vue'

const {
  user,
  favorites,
  removeFromFavorites,
  logout,
  isLoggedIn,
  isLoaded,
  role,
  updateAbout,
  updateUsername,
  updateEmail,
  updateAvatar,
  updatePassword,
} = useAuth()

const activeTab = ref('profile')
const showLogin = ref(false)
const showLogoutConfirm = ref(false)
const tabIndicator = ref({ left: 0, width: 0 })
const about = ref(user.value?.about || '')
const editingAbout = ref(false)
const aboutInput = ref('')

const editingUsername = ref(false)
const usernameInput = ref('')
const editingEmail = ref(false)
const emailInput = ref('')
const editingAvatar = ref(false)
const avatarPreview = ref(user.value?.avatar || '')
const avatarFileInput = ref<HTMLInputElement | null>(null)
const savingAvatar = ref(false)
const removingAvatar = ref(false)

const API_BASE = 'http://localhost:8000'

interface Movie {
  id: number | string
  title: string
  genre: string[]
  rating: number
  poster: string
  description: string
  releaseDate?: string
}

const { data: rawMovies, pending: moviesPending } = await useFetch<any[]>(`${API_BASE}/movies`)

const movies = computed<Movie[]>(() =>
  (rawMovies.value ?? []).map((m) => ({
    id: m.id,
    title: m.title,
    genre: m.genre,
    rating: m.rating,
    poster: m.poster,
    image: m.poster,
    description: m.description,
    releaseDate: m.releaseDate,
  }))
)

const favoriteMovies = computed(() =>
  movies.value.filter((m) => favorites.value.includes(Number(m.id)))
)

const searchQuery = ref('')

const filteredFavorites = computed(() => {
  const query = searchQuery.value.trim().toLowerCase()
  return query
    ? favoriteMovies.value.filter((m) =>
        m.title.toLowerCase().includes(query) ||
        m.description.toLowerCase().includes(query) ||
        m.genre.some((genre) => genre.toLowerCase().includes(query)),
      )
    : favoriteMovies.value
})

const handleTabChange = (tab: string) => {
  activeTab.value = tab
  nextTick(() => updateTabIndicator())
}

const updateTabIndicator = () => {
  const container = document.querySelector('.tab-container') as HTMLElement
  const activeBtn = container?.querySelector('.tab-btn.active') as HTMLElement
  if (container && activeBtn) {
    tabIndicator.value = {
      left: activeBtn.offsetLeft,
      width: activeBtn.offsetWidth,
    }
  }
}

onMounted(() => {
  nextTick(() => updateTabIndicator())
})

watch(activeTab, () => {
  nextTick(() => updateTabIndicator())
})

const handleLogout = () => {
  showLogoutConfirm.value = true
}

const handleLogoutConfirm = () => {
  logout()
  showLogoutConfirm.value = false
  navigateTo('/')
}

const handleMovieClick = (movie: Movie) => {
  if (!isLoggedIn.value) {
    showLogin.value = true
    return
  }
  navigateTo(`/watch/${movie.id}`)
}

const clearFavorites = () => {
  favoriteMovies.value.forEach((m) => removeFromFavorites(m.id))
}

const updateUserAbout = async (newAbout: string) => {
    try {
      await updateAbout(newAbout)
    } catch (e) {
      console.error('Failed to update about:', e)
    }
  }

  const startEditAbout = () => {
    aboutInput.value = about.value
    editingAbout.value = true
  }

  const saveAbout = async () => {
    try {
      await updateUserAbout(aboutInput.value)
      editingAbout.value = false
    } catch (e) {
      console.error('Failed to save about:', e)
    }
  }

  const cancelEditAbout = () => {
    aboutInput.value = ''
    editingAbout.value = false
  }

  const startEditUsername = () => {
    usernameInput.value = user.value?.username || ''
    editingUsername.value = true
  }

  const saveUsername = async () => {
    const newUsername = usernameInput.value.trim()
    if (!newUsername) return

    try {
      await updateUsername(newUsername)
      editingUsername.value = false
    } catch (e: any) {
      alert(e.message || 'Failed to update username. Please try again.')
    }
  }

  const cancelEditUsername = () => {
    usernameInput.value = ''
    editingUsername.value = false
  }

  const startEditEmail = () => {
    emailInput.value = user.value?.email || ''
    editingEmail.value = true
  }

  const saveEmail = async () => {
    const newEmail = emailInput.value.trim()
    if (!newEmail) return

    try {
      await updateEmail(newEmail)
      editingEmail.value = false
    } catch (e: any) {
      alert(e.message || 'Failed to update email. Please try again.')
    }
  }

  const cancelEditEmail = () => {
    emailInput.value = ''
    editingEmail.value = false
  }

const startEditAvatar = () => {
  avatarPreview.value = user.value?.avatar || ''
  editingAvatar.value = true
}

const onAvatarFileChange = (event: Event) => {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  if (!file || !file.type.startsWith('image/')) return

  const reader = new FileReader()
  reader.onload = (e) => {
    avatarPreview.value = (e.target?.result as string) || ''
  }
  reader.readAsDataURL(file)
}

const saveAvatar = async () => {
  const avatar = avatarPreview.value.trim()
  if (!avatar || savingAvatar.value) return

  savingAvatar.value = true
  const saved = await updateAvatar(avatar)
  savingAvatar.value = false

  if (saved) {
    editingAvatar.value = false
  }
}

const removeAvatar = async () => {
  if (removingAvatar.value) return

  removingAvatar.value = true
  const removed = await updateAvatar('')
  removingAvatar.value = false

  if (removed) {
    avatarPreview.value = ''
    editingAvatar.value = false
  }
}

const cancelEditAvatar = () => {
  avatarPreview.value = user.value?.avatar || ''
  editingAvatar.value = false
}

const showPassword = ref(false)
const passwordValue = ref('••••••••')

const fetchPassword = async () => {
  if (!user.value) return
  try {
    const res = await fetch(`${API_BASE}/users`)
    if (!res.ok) throw new Error('Failed to fetch')
    const users: Array<{ id: number; password: string }> = await res.json()
    const found = users.find((u) => u.id === user.value!.id)
    if (found?.password) {
      passwordValue.value = found.password
    } else {
      passwordValue.value = '(not found)'
    }
  } catch (e) {
    console.error('Fetch password error:', e)
    passwordValue.value = '(error)'
  }
}

const toggleShowPassword = async () => {
  showPassword.value = !showPassword.value
  if (showPassword.value && passwordValue.value === '••••••••') {
    await fetchPassword()
  }
}

// ============ CHANGE PASSWORD ============
const showChangePassword = ref(false)
const currentPassword = ref('')
const newPassword = ref('')
const confirmPassword = ref('')
const showCurrentPassword = ref(false)
const showNewPassword = ref(false)
const showConfirmPassword = ref(false)
const passwordError = ref('')
const passwordSuccess = ref(false)
const changingPassword = ref(false)

const toggleChangePassword = () => {
  showChangePassword.value = !showChangePassword.value
  currentPassword.value = ''
  newPassword.value = ''
  confirmPassword.value = ''
  passwordError.value = ''
  passwordSuccess.value = false
}

const validatePassword = (pw: string): string => {
  if (pw.length < 6) return 'Must be at least 6 characters'
  if (!/[A-Z]/.test(pw)) return 'Must include an uppercase letter'
  if (!/[a-z]/.test(pw)) return 'Must include a lowercase letter'
  if (!/[0-9]/.test(pw)) return 'Must include a number'
  return ''
}

const handleChangePassword = async () => {
  passwordError.value = ''
  passwordSuccess.value = false

  if (!currentPassword.value) {
    passwordError.value = 'Please enter your current password.'
    return
  }
  const newErr = validatePassword(newPassword.value)
  if (newErr) {
    passwordError.value = newErr
    return
  }
  if (newPassword.value !== confirmPassword.value) {
    passwordError.value = 'New passwords do not match.'
    return
  }
  if (currentPassword.value === newPassword.value) {
    passwordError.value = 'New password must be different from the current one.'
    return
  }

  changingPassword.value = true
  const ok = await updatePassword(currentPassword.value, newPassword.value)
  changingPassword.value = false

  if (ok) {
    passwordSuccess.value = true
    currentPassword.value = ''
    newPassword.value = ''
    confirmPassword.value = ''
    // Refresh the visible password value
    passwordValue.value = '••••••••'
    showPassword.value = false
    setTimeout(() => {
      passwordSuccess.value = false
      showChangePassword.value = false
    }, 2000)
  } else {
    passwordError.value = 'Current password is incorrect. Please try again.'
  }
}

const roleLabel = computed(() => {
  return role.value === 'admin' ? 'Administrator' : 'Standard User'
})

const memberSince = computed(() => {
  return 'August 2026'
})

const totalMoviesTracked = computed(() => favoriteMovies.value.length)

const tabs = [
  { id: 'profile', label: 'Profile', icon: 'profile' },
  { id: 'favorites', label: 'Favorites', icon: 'favorites' },
]

const iconPath = (name: string) => {
  const paths: Record<string, string> = {
    profile:
      'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z',
    favorites:
      'M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z',
    bookmark: 'M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3-7 3V5z',
    'message-square':
      'M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2v10z',
  }
  return paths[name] ?? paths.bookmark
}

const preferences = ref({
  emailNotifications: true,
  watchHistory: true,
  publicProfile: false,
  autoPlayTrailers: true,
})
</script>

<template>
  <div class="min-h-screen bg-[#0b0b0f] text-white">
    <!-- ================= LOADING ================= -->
    <div
      v-if="!isLoaded"
      class="flex min-h-screen items-center justify-center pt-20"
    >
      <div class="text-center">
        <div
          class="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-2 border-red-600/20 border-t-red-600"
        />
        <p class="text-sm text-gray-400">Loading profile...</p>
      </div>
    </div>

    <!-- ================= AUTH GATE ================= -->
    <div
      v-else-if="!isLoggedIn"
      class="min-h-screen pt-20"
    >
      <div
        class="mx-auto flex min-h-[60vh] max-w-md items-center justify-center px-5 text-center"
      >
        <div class="animate-fade-in-up">
          <div
            class="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-red-600/20 to-red-900/20 border border-red-500/30"
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
            and track your favorites.
          </p>

          <button
            @click="showLogin = true"
            class="mt-6 w-full rounded-xl bg-gradient-to-r from-red-600 to-red-700 px-6 py-3 text-sm font-semibold text-white transition hover:from-red-700 hover:to-red-800 active:scale-[0.98] shadow-lg shadow-red-500/30"
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
    <div v-else class="animate-fade-in">
      <!-- ================= HERO / BANNER ================= -->
      <div class="relative h-60 w-full overflow-hidden sm:h-72 lg:h-80">
        <img
          src="https://image.tmdb.org/t/p/original/jYEW5xZkZk2WTrdbMGAPFuBqbDc.jpg"
          alt="Profile banner"
          class="h-full w-full object-cover"
        />
        <div
          class="absolute inset-0 bg-gradient-to-t from-[#0b0b0f] via-[#0b0b0f]/80 to-[#0b0b0f]/40"
        />
        <div
          class="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-red-900/20 via-transparent to-transparent"
        />

        <div class="absolute bottom-0 left-0 right-0">
          <div class="mx-auto max-w-5xl px-5 lg:px-8">
            <div class="flex flex-col items-center gap-4 pb-8 sm:flex-row sm:flex-wrap sm:items-end sm:gap-8">
              <div class="relative -mt-16 sm:-mt-20">
                <div class="absolute -inset-1 bg-gradient-to-r from-red-500 to-red-700 rounded-full opacity-30 blur-xl -z-10 animate-pulse-slow" />
                <img
                  :src="editingAvatar ? (avatarPreview || user?.avatar) : (user?.avatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=' + user?.username)"
                  :alt="user?.username"
                  class="h-28 w-28 rounded-full border-4 border-[#0b0b0f] object-cover shadow-2xl ring-2 ring-red-500/30 sm:h-36 sm:w-36 transition-transform duration-300 hover:scale-105"
                />
                <div
                  class="absolute bottom-1 right-1 flex h-5 w-5 items-center justify-center rounded-full border-2 border-[#0b0b0f] bg-green-500 shadow-lg"
                >
                  <span class="h-2 w-2 rounded-full bg-white animate-pulse" />
                </div>
                <button
                  v-if="!editingAvatar"
                  @click="startEditAvatar"
                  class="absolute bottom-1 left-1 flex h-7 w-7 items-center justify-center rounded-full bg-[#15151b]/90 text-gray-400 hover:text-white hover:bg-red-600 transition shadow-lg ring-2 ring-[#0b0b0f]"
                >
                  <svg class="h-3 w-3" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                  </svg>
                </button>
              </div>

              <div class="text-center sm:text-left">
                <h1 class="text-2xl font-bold text-white sm:text-3xl lg:text-4xl">
                  {{ user?.username }}
                </h1>
                <p class="mt-1 text-sm text-gray-400">
                  {{ user?.email }}
                </p>
                <div class="mt-3 flex flex-wrap items-center justify-center gap-2 sm:justify-start">
                  <span
                    class="inline-flex items-center gap-1.5 rounded-full bg-red-600/10 px-3 py-1 text-xs font-medium text-red-400 border border-red-500/20 backdrop-blur-sm"
                  >
                    <span class="h-1.5 w-1.5 rounded-full bg-red-400 animate-pulse" />
                    {{ roleLabel }}
                  </span>
                  <span
                    class="inline-flex items-center gap-1.5 rounded-full bg-white/5 px-3 py-1 text-xs font-medium text-gray-400 border border-white/10 backdrop-blur-sm"
                  >
                    <svg class="h-3 w-3" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    Member since {{ memberSince }}
                  </span>
                </div>
</div>
        </div>
      </div>
    </div>
  </div>

      <!-- ================= TABS ================= -->
      <div class="mx-auto max-w-5xl px-5 lg:px-8 py-8">
        <div class="tab-container relative">
          <!-- Animated indicator -->
          <div
            class="absolute bottom-0 h-0.5 bg-gradient-to-r from-red-500 to-red-600 rounded-full transition-all duration-300 ease-out"
            :style="{ left: tabIndicator.left + 'px', width: tabIndicator.width + 'px' }"
          />
          <div
            class="flex gap-1 rounded-xl bg-[#15151b] p-1 border border-white/5"
            role="tablist"
          >
<button
              v-for="tab in tabs"
              :key="tab.id"
              :class="[
                'tab-btn relative flex-1 rounded-lg py-3 text-sm font-medium transition-all duration-200 flex items-center justify-center gap-2 z-10 border',
                activeTab === tab.id
                  ? 'bg-gradient-to-r from-red-600 to-red-700 text-white border-red-500/60 shadow-lg shadow-red-500/20'
                  : 'text-gray-400 border-transparent hover:text-white hover:bg-white/5',
              ]"
              @click="handleTabChange(tab.id)"
              :aria-selected="activeTab === tab.id"
              role="tab"
            >
              <svg
                class="h-5 w-5"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  :d="iconPath(tab.icon)"
                />
              </svg>
              <span>{{ tab.label }}</span>
              <span
                v-if="tab.id === 'favorites' && favoriteMovies.length > 0"
                class="hidden sm:inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-white/20 text-xs font-semibold text-white"
              >
                {{ favoriteMovies.length }}
              </span>
            </button>
          </div>
        </div>

        <!-- ================= PROFILE TAB ================= -->
        <div
          v-if="activeTab === 'profile'"
          class="animate-fade-in"
        >

          <!-- Account Information -->
          <div
            class="mb-8 rounded-2xl border border-white/10 bg-[#12121a] p-6 sm:p-8 backdrop-blur-xl mt-3"
          >
            <div class="mb-6 flex items-center justify-between flex-wrap gap-3">
              <h2 class="text-lg font-semibold text-white">
                Account Information
              </h2>
            </div>

            <div class="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              <!-- Username Card -->
              <AccountFieldCard
                icon="profile"
                label="Username"
                :value="user?.username ?? ''"
                :editing="editingUsername"
                :inputValue="usernameInput"
                @edit="startEditUsername"
                @save="saveUsername"
                @cancel="cancelEditUsername"
                @input="usernameInput = $event"
              />

              <!-- Email Card -->
              <AccountFieldCard
                icon="mail"
                label="Email"
                :value="user?.email ?? ''"
                :editing="editingEmail"
                :inputValue="emailInput"
                @edit="startEditEmail"
                @save="saveEmail"
                @cancel="cancelEditEmail"
                @input="emailInput = $event"
                type="email"
              />

              <!-- Password Card -->
              <div class="group relative rounded-xl bg-[#0b0b0f] border border-white/10 p-5 transition hover:border-red-500/30 hover:bg-white/[0.02]">
                <div class="flex items-start gap-4">
                  <div class="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-red-600/10 border border-red-500/20">
                    <svg class="h-5 w-5 text-red-400" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                  <div class="flex-1 min-w-0 pt-0.5">
                    <p class="text-[11px] text-gray-500 uppercase tracking-wider font-medium mb-2">Password</p>
                    <div class="flex flex-col gap-3">
                      <div class="flex items-center justify-between">
                        <span class="text-sm font-semibold text-white tracking-widest font-mono bg-[#12121a] px-3 py-1.5 rounded-lg border border-white/10 min-w-[120px] text-center">
                          {{ showPassword ? passwordValue : '••••••••' }}
                        </span>
                      </div>
                      <div class="flex justify-end gap-2">
                        <button
                          @click="toggleShowPassword"
                          class="shrink-0 whitespace-nowrap text-[11px] px-3 py-1.5 rounded-lg border border-white/10 bg-white/5 text-gray-300 transition hover:bg-white/10 hover:border-white/20"
                        >
                          {{ showPassword ? 'Hide' : 'Show' }}
                        </button>
                        <button
                          @click="toggleChangePassword"
                          class="shrink-0 whitespace-nowrap text-[11px] px-3 py-1.5 rounded-lg border border-white/10 bg-white/5 text-gray-300 transition hover:bg-white/10 hover:border-white/20"
                        >
                          Change
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- About Section (Full Width) -->
            <div class="mt-5">
              <AccountFieldCard
                icon="message-square"
                label="About"
                :value="about || 'No bio yet. Click to add one.'"
                :editing="editingAbout"
                :inputValue="aboutInput"
                @edit="startEditAbout"
                @save="saveAbout"
                @cancel="cancelEditAbout"
                @input="aboutInput = $event"
                :multiline="true"
                placeholder="Tell us about yourself..."
                class="sm:col-span-2 lg:col-span-3"
              />
            </div>

            <div class="mt-6 flex items-center justify-end gap-3 border-t border-white/10 pt-6">
              <button
                @click="handleLogout"
                class="rounded-xl border border-red-500/30 bg-red-500/10 px-5 py-2.5 text-sm font-semibold text-red-400 transition hover:bg-red-500/20 hover:border-red-500/50"
              >
                Log Out
              </button>
            </div>
          </div>
          
        </div>

        <!-- ================= FAVORITES TAB ================= -->
        <div
          v-else-if="activeTab === 'favorites'"
          class="animate-fade-in"
        >
          <div class="mb-4 flex items-center gap-3 mt-3">
            <div>
              <h2 class="text-lg font-bold text-white">Favorites</h2>
            </div>
          </div>

          <!-- Header + Controls -->
          <div class="mb-6 flex flex-wrap items-center justify-between gap-4">
            <div class="flex items-center gap-3">
              <span
                class="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-red-600/20 to-red-900/20 px-4 py-2 text-sm font-semibold text-red-300 border border-red-500/30 shadow-lg shadow-red-500/10"
              >
                <svg class="h-4 w-4 text-red-400" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                </svg>
                {{ favoriteMovies.length }} saved
              </span>
              <span
                v-if="searchQuery"
                class="inline-flex items-center gap-1.5 rounded-full bg-white/5 px-3 py-2 text-xs font-medium text-gray-400 border border-white/10"
              >
                <svg class="h-3 w-3" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                {{ filteredFavorites.length }} matching
              </span>
            </div>

            <button
              v-if="favoriteMovies.length > 1"
              @click="clearFavorites"
              class="inline-flex items-center gap-1.5 rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-1.5 text-xs font-medium text-red-400 transition hover:bg-red-500/20 hover:border-red-500/50"
            >
              <svg class="h-3.5 w-3.5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              Clear All
            </button>
          </div>

          <!-- Empty State -->
          <div
            v-if="filteredFavorites.length === 0"
            class="rounded-2xl border border-white/10 bg-[#12121a] py-20 text-center relative overflow-hidden"
          >
            <div class="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-red-900/10 via-transparent to-transparent" />
            <div class="relative">
              <div class="mx-auto flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-red-600/20 to-red-900/20 border border-red-500/30">
                <svg
                  class="h-10 w-10 text-red-400"
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
              </div>
              <p class="mt-5 text-sm font-medium text-gray-300">
                {{ searchQuery ? 'No favorites match your search.' : 'No movies in your favorites yet.' }}
              </p>
              <p class="mt-1 text-xs text-gray-500">
                {{ searchQuery ? 'Try a different search term.' : 'Click the heart on any movie to add it here.' }}
              </p>
              <button
                v-if="searchQuery"
                @click="searchQuery = ''"
                class="mt-4 text-xs text-red-400 hover:text-red-300"
              >
                Clear search
              </button>
              <button
                v-else
                @click="handleTabChange('profile')"
                class="mt-5 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-red-600 to-red-700 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-red-500/20 transition hover:from-red-700 hover:to-red-800"
              >
                <svg class="h-4 w-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M4 6h16M4 12h16M4 18h7" />
                </svg>
                Browse Movies
              </button>
            </div>
          </div>

          <!-- Favorites Grid -->
          <div
            v-else
            class="movie-grid grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6"
          >
            <UserMovieCard
              v-for="movie in filteredFavorites"
              :key="movie.id"
              :movie="movie"
              @click="handleMovieClick"
            />
          </div>
        </div>
      </div>
    </div>

    <!-- Logout Confirmation -->
    <div
      v-if="showLogoutConfirm"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
      @click.self="showLogoutConfirm = false"
    >
      <div class="w-full max-w-sm rounded-2xl border border-white/10 bg-[#15151b] p-6 text-center shadow-2xl">
        <h3 class="text-lg font-bold text-white">Log Out</h3>
        <p class="mt-2 text-sm text-gray-400">Are you sure you want to log out?</p>
        <div class="mt-5 flex items-center justify-center gap-3">
          <button
            @click="showLogoutConfirm = false"
            class="rounded-xl border border-white/10 bg-white/5 px-5 py-2 text-sm font-medium text-gray-300 transition hover:bg-white/10"
          >
            Cancel
          </button>
          <button
            @click="handleLogoutConfirm"
            class="rounded-xl bg-red-600 px-5 py-2 text-sm font-semibold text-white transition hover:bg-red-700"
          >
            Log Out
          </button>
        </div>
      </div>
    </div>

    <!-- ============ FLOATING AVATAR MODAL ============ -->
    <div
      v-if="editingAvatar"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-5 backdrop-blur-sm animate-fade-in"
      @click.self="cancelEditAvatar"
    >
      <div
        class="w-full max-w-sm animate-fade-in-up rounded-2xl border border-white/10 bg-[#12121a] p-6 shadow-2xl"
      >
        <div class="mb-5 flex items-center gap-3">
          <div class="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-red-600/10 border border-red-500/20">
            <svg class="h-5 w-5 text-red-400" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <div>
            <h3 class="text-base font-semibold text-white">Change Avatar</h3>
            <p class="text-[11px] text-gray-500">Upload a photo from your device</p>
          </div>
        </div>

        <label class="cursor-pointer block">
          <input
            ref="avatarFileInput"
            type="file"
            accept="image/*"
            class="hidden"
            @change="onAvatarFileChange"
          />
          <div class="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-white/15 bg-[#0b0b0f] px-4 py-8 text-center transition hover:border-red-500/40 hover:bg-red-600/5">
            <svg class="mb-3 h-10 w-10 text-gray-500" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M3 12a9 9 0 019-9 9 9 0 019 9 9 9 0 01-9 9 9 9 0 01-9-9zm0 0l9-9m-9 9l9 9" />
            </svg>
            <span class="text-sm font-medium text-gray-300">Choose photo</span>
            <span class="mt-1 text-[11px] text-gray-500">PNG, JPG or GIF up to 5MB</span>
          </div>
        </label>

        <div v-if="avatarPreview" class="mt-4 flex items-center gap-3 rounded-xl border border-white/10 bg-[#0b0b0f] p-3">
          <img
            :src="avatarPreview"
            alt="Preview"
            class="h-14 w-14 rounded-full border-2 border-white/10 object-cover"
          />
          <div class="min-w-0 flex-1">
            <p class="text-sm font-medium text-white truncate">
              {{ avatarPreview.startsWith('data:') ? 'Selected image' : 'URL preview' }}
            </p>
            <p class="text-[11px] text-gray-500">Preview of your new avatar</p>
          </div>
        </div>

        <div class="mt-5 flex flex-wrap justify-end gap-2">
          <button
            v-if="user?.avatar"
            type="button"
            @click="removeAvatar"
            :disabled="removingAvatar || savingAvatar"
            class="rounded-lg border border-red-500/30 bg-red-500/10 px-5 py-2 text-sm font-medium text-red-400 transition hover:bg-red-500/20 hover:border-red-500/50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {{ removingAvatar ? 'Removing...' : 'Remove Avatar' }}
          </button>
          <button
            type="button"
            @click="cancelEditAvatar"
            :disabled="savingAvatar || removingAvatar"
            class="rounded-lg border border-white/10 bg-white/5 px-5 py-2 text-sm font-medium text-gray-300 transition hover:bg-white/10 hover:border-white/20 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="button"
            @click="saveAvatar"
            :disabled="savingAvatar || removingAvatar || !avatarPreview.trim()"
            class="rounded-lg bg-gradient-to-r from-red-600 to-red-700 px-5 py-2 text-sm font-semibold text-white transition hover:from-red-700 hover:to-red-800 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {{ savingAvatar ? 'Saving...' : 'Save' }}
          </button>
        </div>
      </div>
    </div>

    <!-- ============ CHANGE PASSWORD MODAL ============ -->
    <div
      v-if="showChangePassword"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-5 backdrop-blur-sm animate-fade-in"
      @click.self="toggleChangePassword"
    >
      <div
        class="w-full max-w-sm animate-fade-in-up rounded-2xl border border-white/10 bg-[#12121a] p-6 shadow-2xl"
      >
        <div class="mb-5 flex items-center gap-3">
          <div class="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-red-600/10 border border-red-500/20">
            <svg class="h-5 w-5 text-red-400" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <div>
            <h3 class="text-base font-semibold text-white">Change Password</h3>
            <p class="text-[11px] text-gray-500">Enter your current and new password</p>
          </div>
        </div>

        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-300 mb-1.5">Current Password</label>
            <div class="relative">
              <input
                :type="showCurrentPassword ? 'text' : 'password'"
                v-model="currentPassword"
                class="w-full bg-[#0b0b0f] border border-white/10 rounded-lg px-4 py-2.5 pr-10 text-white placeholder-gray-500 focus:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-500/20 transition"
                placeholder="Enter current password"
              />
              <button
                @click="showCurrentPassword = !showCurrentPassword"
                class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition"
              >
                <svg v-if="showCurrentPassword" class="h-5 w-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                </svg>
                <svg v-else class="h-5 w-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path stroke-linecap="round" stroke-linejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </button>
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-300 mb-1.5">New Password</label>
            <div class="relative">
              <input
                :type="showNewPassword ? 'text' : 'password'"
                v-model="newPassword"
                class="w-full bg-[#0b0b0f] border border-white/10 rounded-lg px-4 py-2.5 pr-10 text-white placeholder-gray-500 focus:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-500/20 transition"
                placeholder="Enter new password"
              />
              <button
                @click="showNewPassword = !showNewPassword"
                class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition"
              >
                <svg v-if="showNewPassword" class="h-5 w-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                </svg>
                <svg v-else class="h-5 w-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path stroke-linecap="round" stroke-linejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </button>
            </div>
            <p v-if="newPassword" class="mt-1.5 text-xs text-gray-400">
              <span :class="[newPassword.length >= 6 ? 'text-green-400' : 'text-gray-500']">✓</span> At least 6 characters
              <span class="mx-1">|</span>
              <span :class="[/[A-Z]/.test(newPassword) ? 'text-green-400' : 'text-gray-500']">✓</span> Uppercase
              <span class="mx-1">|</span>
              <span :class="[/[a-z]/.test(newPassword) ? 'text-green-400' : 'text-gray-500']">✓</span> Lowercase
              <span class="mx-1">|</span>
              <span :class="[/[0-9]/.test(newPassword) ? 'text-green-400' : 'text-gray-500']">✓</span> Number
            </p>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-300 mb-1.5">Confirm New Password</label>
            <div class="relative">
              <input
                :type="showConfirmPassword ? 'text' : 'password'"
                v-model="confirmPassword"
                class="w-full bg-[#0b0b0f] border border-white/10 rounded-lg px-4 py-2.5 pr-10 text-white placeholder-gray-500 focus:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-500/20 transition"
                placeholder="Confirm new password"
              />
              <button
                @click="showConfirmPassword = !showConfirmPassword"
                class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition"
              >
                <svg v-if="showConfirmPassword" class="h-5 w-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                </svg>
                <svg v-else class="h-5 w-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path stroke-linecap="round" stroke-linejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </button>
            </div>
            <p v-if="confirmPassword && newPassword !== confirmPassword" class="mt-1.5 text-xs text-red-400">Passwords do not match</p>
          </div>

          <div v-if="passwordError" class="rounded-lg bg-red-600/10 border border-red-500/20 p-3 text-sm text-red-400">
            {{ passwordError }}
          </div>

          <div v-if="passwordSuccess" class="rounded-lg bg-green-600/10 border border-green-500/20 p-3 text-sm text-green-400">
            Password changed successfully!
          </div>
        </div>

        <div class="mt-6 flex justify-end gap-2">
          <button
            @click="toggleChangePassword"
            class="rounded-lg border border-white/10 bg-white/5 px-5 py-2 text-sm font-medium text-gray-300 transition hover:bg-white/10 hover:border-white/20"
            :disabled="changingPassword"
          >
            Cancel
          </button>
          <button
            @click="handleChangePassword"
            class="rounded-lg bg-gradient-to-r from-red-600 to-red-700 px-5 py-2 text-sm font-semibold text-white transition hover:from-red-700 hover:to-red-800 disabled:opacity-50 disabled:cursor-not-allowed"
            :disabled="changingPassword"
          >
            <span v-if="changingPassword" class="flex items-center gap-2">
              <svg class="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/></svg>
              Changing...
            </span>
            <span v-else>Save Changes</span>
          </button>
        </div>
      </div>
    </div>

    <UserLogin v-if="showLogin" @close="showLogin = false" />
  </div>
</template>

<style scoped>
.aspect-\[2\/3\] {
  aspect-ratio: 2 / 3;
}

.poster-aspect {
  aspect-ratio: 2 / 3;
}

/* Custom Animations */
@keyframes fade-in-up {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes fade-in {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes slide-up {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes pulse-slow {
  0%, 100% { opacity: 0.3; transform: scale(1); }
  50% { opacity: 0.5; transform: scale(1.05); }
}

.animate-fade-in-up {
  animation: fade-in-up 0.6s ease-out forwards;
}

.animate-fade-in {
  animation: fade-in 0.4s ease-out forwards;
}

.animate-slide-up {
  animation: slide-up 0.5s ease-out forwards;
  opacity: 0;
}

.animate-slide-up:nth-child(1) { animation-delay: 0ms; }
.animate-slide-up:nth-child(2) { animation-delay: 100ms; }
.animate-slide-up:nth-child(3) { animation-delay: 200ms; }
.animate-slide-up:nth-child(4) { animation-delay: 300ms; }

.animate-pulse-slow {
  animation: pulse-slow 3s ease-in-out infinite;
}

/* Staggered animation for movie cards */
.movie-grid > * {
  animation: slide-up 0.4s ease-out forwards;
  opacity: 0;
}

.movie-grid > *:nth-child(1) { animation-delay: 50ms; }
.movie-grid > *:nth-child(2) { animation-delay: 100ms; }
.movie-grid > *:nth-child(3) { animation-delay: 150ms; }
.movie-grid > *:nth-child(4) { animation-delay: 200ms; }
.movie-grid > *:nth-child(5) { animation-delay: 250ms; }
.movie-grid > *:nth-child(6) { animation-delay: 300ms; }
.movie-grid > *:nth-child(7) { animation-delay: 350ms; }
.movie-grid > *:nth-child(8) { animation-delay: 400ms; }

/* Scrollbar styling */
::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}

::-webkit-scrollbar-track {
  background: #0b0b0f;
}

::-webkit-scrollbar-thumb {
  background: #333;
  border-radius: 3px;
}

::-webkit-scrollbar-thumb:hover {
  background: #444;
}

/* Focus visible for accessibility */
*:focus-visible {
  outline: 2px solid #ef4444;
  outline-offset: 2px;
}

/* Tab button active state */
.tab-btn.active {
  color: white;
}

.tab-btn:not(.active):hover {
  background: rgba(255, 255, 255, 0.05);
}

/* Hover effects for cards */
.group:hover .group-hover\:scale-105 {
  transform: scale(1.05);
}

.group:hover .group-hover\:-translate-y-1 {
  transform: translateY(-0.25rem);
}

.group:hover .group-hover\:opacity-100 {
  opacity: 1;
}

.group:hover .group-hover\:translate-y-0 {
  transform: translateY(0);
}

.group:hover .group-hover\:text-red-400 {
  color: #f87171;
}

/* Glassmorphism */
.backdrop-blur-sm {
  backdrop-filter: blur(4px);
}

.backdrop-blur-xl {
  backdrop-filter: blur(24px);
}

/* Gradient text */
.bg-gradient-to-r.from-red-500.to-red-600 {
  background: linear-gradient(to right, #ef4444, #dc2626);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
}
</style>