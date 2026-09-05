<script setup lang="ts">
const mobileMenu = ref(false)
const showLogin = ref(false)
const { user, isLoggedIn, isLoaded, logout } = useAuth()
const route = useRoute()

const isActive = (path: string) => route.path === path

const API_BASE = 'http://localhost:8000'
const searchQuery = ref('')
const searchResults = ref<any[]>([])
const showSearchDropdown = ref(false)

const handleSearch = async () => {
  const q = searchQuery.value.trim()
  if (!q) return
  await navigateTo(`/movie?q=${encodeURIComponent(q)}`)
}

const fetchSearchResults = async () => {
  const q = searchQuery.value.trim()
  if (!q) {
    searchResults.value = []
    return
  }
  try {
    const data = await $fetch<any[]>(`${API_BASE}/movies?q=${encodeURIComponent(q)}`)
    searchResults.value = data.slice(0, 6)
  } catch {
    searchResults.value = []
  }
}

watch(
  () => searchQuery.value,
  () => {
    fetchSearchResults()
    showSearchDropdown.value = true
  }
)

const handleResultClick = (title: string) => {
  searchQuery.value = title
  showSearchDropdown.value = false
  navigateTo(`/movie?q=${encodeURIComponent(title)}`)
}

const handleSearchBlur = () => {
  setTimeout(() => {
    showSearchDropdown.value = false
  }, 200)
}

const handleLogout = () => {
  logout()
}
</script>

<template>
	<header class="fixed left-0 right-0 top-0 z-50 border-b border-white/10 bg-[#0b0b0f]/90 backdrop-blur-xl">

		<div class="mx-auto flex h-20 max-w-7xl items-center justify-between px-5 lg:px-8">
			<a href="#" class="flex items-center gap-2">
				<div class="flex h-10 w-10 items-center justify-center rounded-xl bg-red-600">
					<svg class="h-5 w-5 text-white" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z" />
					</svg>
				</div>

				<span class="text-xl font-bold text-white">
					Fli<span class="text-red-500">xora</span>
				</span>
			</a>

			<nav class="hidden items-center gap-8 md:flex">
				<NuxtLink to="/" :class="['text-sm font-medium transition', isActive('/') ? 'text-red-400' : 'text-gray-400 hover:text-white']">Home</NuxtLink>
				<NuxtLink to="/movie" :class="['text-sm font-medium transition', isActive('/movie') ? 'text-red-400' : 'text-gray-400 hover:text-white']">Movies</NuxtLink>
				<NuxtLink to="/watchlist" :class="['text-sm font-medium transition', isActive('/watchlist') ? 'text-red-400' : 'text-gray-400 hover:text-white']">Watchlist</NuxtLink>
				<NuxtLink to="/about" :class="['text-sm font-medium transition', isActive('/about') ? 'text-red-400' : 'text-gray-400 hover:text-white']">About</NuxtLink>
				<NuxtLink to="/profile" :class="['text-sm font-medium transition', isActive('/profile') ? 'text-red-400' : 'text-gray-400 hover:text-white']">Profile</NuxtLink>
			</nav>

			<div class="hidden items-center gap-4 md:flex">
				<div class="relative">
					<svg class="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
					</svg>
					<input
						v-model="searchQuery"
						@blur="handleSearchBlur"
						@keyup.enter="handleSearch"
						type="text"
						placeholder="Search movie..."
						class="w-48 rounded-full border text-white border-white/10 bg-white/5 py-2.5 pl-10 pr-4 text-sm outline-none placeholder:text-gray-500 focus:border-red-500"
					/>

					<div
						v-if="showSearchDropdown && searchQuery.trim() && searchResults.length > 0"
						class="absolute left-0 right-0 top-full z-50 mt-2 max-h-96 overflow-y-auto rounded-xl border border-white/10 bg-[#15151b] shadow-2xl"
					>
						<div class="grid grid-cols-3 gap-2 p-2">
							<div
								v-for="movie in searchResults"
								:key="movie.id"
								@mousedown="handleResultClick(movie.title)"
								class="cursor-pointer overflow-hidden rounded-lg border border-white/10 bg-[#1a1a20] transition hover:border-red-500/50"
							>
								<div class="aspect-2/3 overflow-hidden">
									<img
										:src="movie.poster"
										:alt="movie.title"
										class="h-full w-full object-cover"
									/>
								</div>
								<div class="p-2">
									<p class="truncate text-xs font-medium text-white">{{ movie.title }}</p>
									<p class="mt-1 truncate text-[10px] text-gray-400">{{ movie.rating }}</p>
								</div>
							</div>
						</div>
					</div>

					<div
						v-else-if="showSearchDropdown && searchQuery.trim() && searchResults.length === 0"
						class="absolute left-0 right-0 top-full z-50 mt-2 rounded-xl border border-white/10 bg-[#15151b] p-4 text-center"
					>
						<p class="text-sm text-gray-400">No movies found for "{{ searchQuery }}"</p>
					</div>
				</div>

			<template v-if="isLoaded && isLoggedIn">
			<button
				class="flex items-center justify-center rounded-full p-1 transition"
				@click="navigateTo('/profile')"
				aria-label="Open profile"
			>
				<img :src="user?.avatar" :alt="user?.username" class="h-9 w-9 rounded-full" />
			</button>
			</template>

			<template v-else-if="isLoaded && !isLoggedIn">
				<button
					class="rounded-full bg-red-600 px-5 py-2.5 text-sm font-semibold transition hover:bg-red-700"
					@click="showLogin = true"
				>
					Login
				</button>
			</template>
			</div>

			<button
				class="md:hidden"
				aria-label="Toggle navigation menu"
				@click="mobileMenu = !mobileMenu"
			>
				<svg class="h-6 w-6 text-white" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" d="M4 6h16M4 12h16M4 18h16" />
				</svg>
			</button>
		</div>

		<div v-if="mobileMenu" class="border-t border-white/10 bg-[#111116] px-5 py-5 md:hidden">
			<div class="flex flex-col gap-4">
				<NuxtLink to="/" :class="['text-sm font-medium', isActive('/') ? 'text-red-400' : 'text-gray-300']">Home</NuxtLink>
				<NuxtLink to="/movie" :class="['text-sm font-medium', isActive('/movie') ? 'text-red-400' : 'text-gray-300']">Movies</NuxtLink>
				<NuxtLink to="/watchlist" :class="['text-sm font-medium', isActive('/watchlist') ? 'text-red-400' : 'text-gray-300']">Watchlist</NuxtLink>
				<NuxtLink to="/coming" :class="['text-sm font-medium', isActive('/coming') ? 'text-red-400' : 'text-gray-300']">Coming Soon</NuxtLink>
				<NuxtLink to="/about" :class="['text-sm font-medium', isActive('/about') ? 'text-red-400' : 'text-gray-300']">About</NuxtLink>
				<NuxtLink to="/profile" :class="['text-sm font-medium', isActive('/profile') ? 'text-red-400' : 'text-gray-300']">Profile</NuxtLink>
			<template v-if="isLoaded && isLoggedIn">
				<NuxtLink to="/profile" class="text-gray-300">My Profile</NuxtLink>
				<button class="rounded-lg bg-red-600 py-3 font-semibold text-left text-red-400" @click="handleLogout">Logout</button>
			</template>
			<template v-else-if="isLoaded && !isLoggedIn">
				<button class="rounded-lg bg-red-600 py-3 font-semibold" @click="showLogin = true">Login</button>
			</template>
			</div>
		</div>
	</header>

	<UserLogin v-if="showLogin" @close="showLogin = false" />
</template>
